// Shared submit path for the contact form and the booking modal.
//
// Both post to Web3Forms, which emails the address the access key is
// registered to. The key is a public, per-form identifier — it is designed to
// sit in client-side code and grants nothing except the ability to submit that
// form, so it lives in Site Settings rather than in a secret store.

const ENDPOINT = 'https://api.web3forms.com/submit';

export type InquiryResult = { ok: true } | { ok: false; error: string };

export async function submitInquiry(
  accessKey: string,
  fields: Record<string, string>,
): Promise<InquiryResult> {
  if (!accessKey) {
    return { ok: false, error: 'not-configured' };
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: accessKey, ...fields }),
    });
    const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
    if (res.ok && data?.success) return { ok: true };
    return { ok: false, error: data?.message || `Request failed (${res.status})` };
  } catch {
    // offline, DNS failure, blocked by an extension…
    return { ok: false, error: 'network' };
  }
}

/** Fallback for when no access key is configured, so a submission is never lost. */
export function mailtoFallback(to: string, subject: string, fields: Record<string, string>): string {
  const body = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
