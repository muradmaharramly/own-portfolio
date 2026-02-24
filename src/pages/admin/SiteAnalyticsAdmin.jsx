// src/pages/admin/SiteAnalyticsAdmin.jsx
import { useEffect, useState } from 'react';
import {
  FiBarChart2,
  FiUsers,
  FiEye,
  FiClock,
  FiTrendingUp,
  FiGlobe,
  FiRefreshCw,
} from 'react-icons/fi';

const getAnalyticsApiUrl = () => {
  if (import.meta.env.VITE_ANALYTICS_API_URL) {
    return import.meta.env.VITE_ANALYTICS_API_URL;
  }

  if (typeof window !== 'undefined') {
    const { origin, hostname } = window.location;

    if (hostname === 'localhost') {
      return 'https://muradmaharramli.me/.netlify/functions/site-analytics';
    }

    return `${origin}/.netlify/functions/site-analytics`;
  }

  return '/.netlify/functions/site-analytics';
};

const SiteAnalyticsAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetail, setErrorDetail] = useState(null);
  const [data, setData] = useState(null);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    setErrorDetail(null);
    const url = getAnalyticsApiUrl();

    try {
      const res = await fetch(url);
      const contentType = res.headers.get('content-type') || '';

      if (!contentType.includes('application/json')) {
        setErrorDetail({ status: res.status, url });
        throw new Error('Server JSON qaytarmadı (HTML və ya başqa cavab qaytarır).');
      }

      const json = await res.json();

      if (!res.ok) {
        setErrorDetail({ status: res.status, message: json.message, url });
        throw new Error(json.message || `Server xətası: ${res.status}`);
      }

      setData(json);
    } catch (err) {
      setError(err.message || 'Analytics məlumatı yüklənə bilmədi');
      if (!errorDetail) setErrorDetail({ url });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const formatNumber = (value) =>
    typeof value === 'number' ? value.toLocaleString('az-AZ') : value || '-';

  const formatPercent = (value) =>
    typeof value === 'number' ? `${value.toFixed(1)}%` : value || '-';

  const formatDuration = (seconds) => {
    if (typeof seconds !== 'number') return '-';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins} dəq ${secs}s`;
  };

  const summary = data?.summary || {};
  const topPages = data?.topPages || [];
  const topCountries = data?.topCountries || [];
  const trafficSources = data?.trafficSources || [];
  const devices = data?.devices || [];

  if (loading && !data) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="analytics-admin">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Site Analytics</h1>
          <p className="admin-subtitle">
            Portfolio saytınızın ziyarətçi və istifadəçi statistikası
          </p>
        </div>
        <button
          type="button"
          className="btn-primary analytics-admin__refresh"
          onClick={loadAnalytics}
          disabled={loading}
        >
          <FiRefreshCw />
          {loading ? 'Yenilənir...' : 'Yenilə'}
        </button>
      </div>

      {error && (
        <div className="analytics-admin__error">
          <p>{error}</p>
          {errorDetail && (
            <ul className="analytics-admin__error-detail">
              {errorDetail.status != null && (
                <li>
                  HTTP status: <strong>{errorDetail.status}</strong>
                </li>
              )}
              {errorDetail.url && (
                <li>
                  İstək URL: <code>{errorDetail.url}</code>
                </li>
              )}
              {errorDetail.message && <li>Mesaj: {errorDetail.message}</li>}
            </ul>
          )}
        </div>
      )}

      {data && (
        <>
          <section className="analytics-admin__grid">
            <div className="analytics-card">
              <div className="analytics-card__icon primary">
                <FiEye />
              </div>
              <div className="analytics-card__content">
                <h3>Ümumi baxışlar</h3>
                <p className="analytics-card__value">
                  {formatNumber(summary.pageViews)}
                </p>
                <p className="analytics-card__label">
                  Bütün səhifələr üzrə baxış sayı
                </p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-card__icon success">
                <FiUsers />
              </div>
              <div className="analytics-card__content">
                <h3>Unikal istifadəçilər</h3>
                <p className="analytics-card__value">
                  {formatNumber(summary.users)}
                </p>
                <p className="analytics-card__label">
                  Saytı ziyarət edən fərqli istifadəçilər
                </p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-card__icon warning">
                <FiBarChart2 />
              </div>
              <div className="analytics-card__content">
                <h3>Seanslar</h3>
                <p className="analytics-card__value">
                  {formatNumber(summary.sessions)}
                </p>
                <p className="analytics-card__label">
                  İstifadəçi seanslarının ümumi sayı
                </p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-card__icon info">
                <FiClock />
              </div>
              <div className="analytics-card__content">
                <h3>Orta seans müddəti</h3>
                <p className="analytics-card__value">
                  {formatDuration(summary.avgSessionDuration)}
                </p>
                <p className="analytics-card__label">
                  Bir seansda orta vaxt
                </p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-card__icon danger">
                <FiTrendingUp />
              </div>
              <div className="analytics-card__content">
                <h3>Bounce rate</h3>
                <p className="analytics-card__value">
                  {formatPercent(summary.bounceRate)}
                </p>
                <p className="analytics-card__label">
                  Tək səhifə baxışından sonra çıxan istifadəçilər
                </p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-card__icon neutral">
                <FiGlobe />
              </div>
              <div className="analytics-card__content">
                <h3>Ölkələr</h3>
                <p className="analytics-card__value">
                  {formatNumber(summary.countries)}
                </p>
                <p className="analytics-card__label">
                  Fərqli ölkə sayı
                </p>
              </div>
            </div>
          </section>

          <section className="analytics-admin__sections">
            <div className="analytics-panel">
              <div className="analytics-panel__header">
                <h3>Ən çox ziyarət olunan səhifələr</h3>
              </div>
              {topPages.length === 0 ? (
                <p className="analytics-panel__empty">Məlumat yoxdur.</p>
              ) : (
                <ul className="analytics-list">
                  {topPages.map((page) => (
                    <li key={page.path} className="analytics-list__item">
                      <div className="analytics-list__meta">
                        <span className="analytics-list__title">{page.path}</span>
                        <span className="analytics-list__subtitle">
                          {formatNumber(page.views)} baxış
                        </span>
                      </div>
                      <div className="analytics-list__bar">
                        <div
                          className="analytics-list__bar-fill"
                          style={{ width: `${page.share || 0}%` }}
                        />
                      </div>
                      <span className="analytics-list__value">
                        {formatPercent(page.share)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="analytics-panel">
              <div className="analytics-panel__header">
                <h3>Ölkələr üzrə paylanma</h3>
              </div>
              {topCountries.length === 0 ? (
                <p className="analytics-panel__empty">Məlumat yoxdur.</p>
              ) : (
                <ul className="analytics-list">
                  {topCountries.map((country) => (
                    <li key={country.name} className="analytics-list__item">
                      <div className="analytics-list__meta">
                        <span className="analytics-list__title">
                          {country.name}
                        </span>
                        <span className="analytics-list__subtitle">
                          {formatNumber(country.users)} istifadəçi
                        </span>
                      </div>
                      <div className="analytics-list__bar">
                        <div
                          className="analytics-list__bar-fill"
                          style={{ width: `${country.share || 0}%` }}
                        />
                      </div>
                      <span className="analytics-list__value">
                        {formatPercent(country.share)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="analytics-panel">
              <div className="analytics-panel__header">
                <h3>Trafik mənbələri</h3>
              </div>
              {trafficSources.length === 0 ? (
                <p className="analytics-panel__empty">Məlumat yoxdur.</p>
              ) : (
                <ul className="analytics-pills">
                  {trafficSources.map((src) => (
                    <li key={src.source} className="analytics-pills__item">
                      <span className="analytics-pills__label">{src.source}</span>
                      <span className="analytics-pills__value">
                        {formatPercent(src.share)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="analytics-panel">
              <div className="analytics-panel__header">
                <h3>Cihaz növləri</h3>
              </div>
              {devices.length === 0 ? (
                <p className="analytics-panel__empty">Məlumat yoxdur.</p>
              ) : (
                <ul className="analytics-pills">
                  {devices.map((device) => (
                    <li key={device.type} className="analytics-pills__item">
                      <span className="analytics-pills__label">{device.type}</span>
                      <span className="analytics-pills__value">
                        {formatPercent(device.share)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default SiteAnalyticsAdmin;
