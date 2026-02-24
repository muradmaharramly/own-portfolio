// Netlify Function: /.netlify/functions/site-analytics
// Uses GA4 Data API with a service account stored in GA_SERVICE_ACCOUNT_JSON
// and numeric GA4 property id in GA_PROPERTY_ID (not the G-XXXX measurement id).

import crypto from 'crypto';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];

function getServiceAccount() {
  // 1. İlk olaraq ayrı-ayrı dəyişənləri yoxlayırıq (Ən etibarlı yol)
  if (process.env.GA_CLIENT_EMAIL && process.env.GA_PRIVATE_KEY) {
    return {
      client_email: process.env.GA_CLIENT_EMAIL,
      private_key: process.env.GA_PRIVATE_KEY.replace(/\\n/g, '\n'),
      project_id: process.env.GA_PROJECT_ID_STR || 'my-portfolio-project-488112',
    };
  }

  // 2. Əgər yuxarıdakılar yoxdursa, köhnə JSON üsulunu yoxlayırıq
  let raw = process.env.GA_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error('Konfiqurasiya xətası: Lazımi GA dəyişənləri tapılmadı.');
  }
  // ... (JSON parsing məntiqi qaldı)
}

function getPropertyId() {
  const id = process.env.GA_PROPERTY_ID;
  if (!id) {
    throw new Error('GA_PROPERTY_ID env is missing (numeric GA4 property id)');
  }
  return id.startsWith('properties/') ? id : `properties/${id}`;
}

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function createJwt(sa) {
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: sa.client_email,
    sub: sa.client_email,
    scope: SCOPES.join(' '),
    aud: TOKEN_URL,
    iat: now,
    exp: now + 60 * 60,
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(data);
  signer.end();

  const signature = signer.sign(sa.private_key);
  const encodedSignature = base64url(signature);

  return `${data}.${encodedSignature}`;
}

async function getAccessToken(sa) {
  const assertion = createJwt(sa);

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token error ${res.status}: ${text}`);
  }

  const json = await res.json();
  return json.access_token;
}

async function runReport(accessToken, propertyId, body) {
  const url = `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`runReport error ${res.status}: ${text}`);
  }

  return res.json();
}

export default async (req, context) => {
  try {
    const sa = getServiceAccount();
    const propertyId = getPropertyId();

    const accessToken = await getAccessToken(sa);
    const dateRanges = [{ startDate: '30daysAgo', endDate: 'today' }];

    // 1) Summary
    const summaryReport = await runReport(accessToken, propertyId, {
      dateRanges,
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
    });

    const m = summaryReport.rows?.[0]?.metricValues || [];
    const summary = {
      pageViews: Number(m[0]?.value ?? 0),
      users: Number(m[1]?.value ?? 0),
      sessions: Number(m[2]?.value ?? 0),
      avgSessionDuration: Number(m[3]?.value ?? 0),
      bounceRate: Number(m[4]?.value ?? 0),
      countries: 0,
    };

    // 2) Top pages
    const pagesReport = await runReport(accessToken, propertyId, {
      dateRanges,
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 6,
    });

    const topPages = (pagesReport.rows || []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || '/',
      views: Number(row.metricValues?.[0]?.value ?? 0),
    }));
    const totalViews = topPages.reduce((s, p) => s + p.views, 0) || 1;
    topPages.forEach((p) => {
      p.share = (p.views / totalViews) * 100;
    });

    // 3) Top countries
    const countriesReport = await runReport(accessToken, propertyId, {
      dateRanges,
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
      limit: 6,
    });

    const topCountries = (countriesReport.rows || []).map((row) => ({
      name: row.dimensionValues?.[0]?.value || 'Unknown',
      users: Number(row.metricValues?.[0]?.value ?? 0),
    }));
    const totalUsers = topCountries.reduce((s, c) => s + c.users, 0) || 1;
    topCountries.forEach((c) => {
      c.share = (c.users / totalUsers) * 100;
    });
    summary.countries = topCountries.length;

    // 4) Traffic sources
    const sourcesReport = await runReport(accessToken, propertyId, {
      dateRanges,
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 6,
    });

    const trafficSources = (sourcesReport.rows || []).map((row) => ({
      source: row.dimensionValues?.[0]?.value || 'Other',
      share: Number(row.metricValues?.[0]?.value ?? 0),
    }));
    const totalSessions = trafficSources.reduce((s, t) => s + t.share, 0) || 1;
    trafficSources.forEach((t) => {
      t.share = (t.share / totalSessions) * 100;
    });

    // 5) Devices
    const devicesReport = await runReport(accessToken, propertyId, {
      dateRanges,
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }],
    });

    const devices = (devicesReport.rows || []).map((row) => ({
      type: row.dimensionValues?.[0]?.value || 'other',
      share: Number(row.metricValues?.[0]?.value ?? 0),
    }));
    const totalDeviceSessions = devices.reduce((s, d) => s + d.share, 0) || 1;
    devices.forEach((d) => {
      d.share = (d.share / totalDeviceSessions) * 100;
    });

    return new Response(
      JSON.stringify({
        summary,
        topPages,
        topCountries,
        trafficSources,
        devices,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
        },
      },
    );
  } catch (err) {
    console.error('Analytics error:', err);
    return new Response(
      JSON.stringify({
        message: err.message || 'Analytics API error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};

