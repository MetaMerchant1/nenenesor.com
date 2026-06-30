/**
 * Add a subscriber to MailerLite. If MAILERLITE_API_KEY is unset, the call is
 * skipped in dev — the function returns ok so the UX flow still works locally.
 */
export async function subscribeToNewsletter(args: {
  email: string
  name?: string
}): Promise<{ ok: boolean; reason?: string }> {
  const apiKey = process.env.MAILERLITE_API_KEY
  const groupId = process.env.MAILERLITE_GROUP_ID
  if (!apiKey || apiKey.startsWith('mock')) {
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, reason: 'newsletter_not_configured' }
    }
    console.log('[mailerlite:dev] Subscriber skipped (mock key used):', args.email)
    return { ok: true }
  }

  try {
    const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: args.email,
        fields: args.name ? { name: args.name } : undefined,
        groups: groupId ? [groupId] : undefined,
        status: 'active',
      }),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { ok: false, reason: `mailerlite_error:${res.status}:${text.slice(0, 120)}` }
    }
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? `network:${err.message}` : 'network_error',
    }
  }
}
