import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Pinged daily by Vercel Cron (see vercel.json) to keep the Supabase free-tier
 * project from auto-pausing after 7 days without database activity.
 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const url = process.env.VITE_SUPABASE_URL
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    res.status(500).json({ ok: false, error: 'Missing Supabase env vars' })
    return
  }

  const response = await fetch(`${url}/rest/v1/lists?select=id&limit=1`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
  })

  res.status(response.ok ? 200 : 502).json({ ok: response.ok, status: response.status })
}
