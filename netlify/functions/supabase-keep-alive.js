/**
 * Netlify Scheduled Function to keep Supabase project active.
 * This function runs every 6 hours to prevent the Supabase Free plan from pausing due to inactivity.
 */

export default async (req, context) => {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Supabase environment variables are missing.");
    return new Response("Configuration Error", { status: 500 });
  }

  try {
    // Perform a lightweight query to Supabase using the REST API (PostgREST)
    // We're just fetching 1 row from the 'profiles' table to create activity.
    const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (response.ok) {
      console.log(`[${new Date().toISOString()}] Supabase keep-alive: Success. Status: ${response.status}`);
      return new Response("Supabase keep-alive successful", { status: 200 });
    } else {
      const errorText = await response.text();
      console.error(`[${new Date().toISOString()}] Supabase keep-alive: Failed. Status: ${response.status}, Error: ${errorText}`);
      return new Response("Supabase keep-alive failed", { status: response.status });
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Supabase keep-alive: Exception occurred:`, error.message);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const config = {
  // Every day at 00:00
  schedule: "0 0 * * *"
};
