/**
 * Normalize a user-supplied website URL so that browsers treat it as an
 * absolute external URL. Without this, an input like "example.com" would be
 * rendered as a relative path and open inside the app instead of the real site.
 */
export function normalizeWebsiteUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Get a displayable domain for a website URL, stripping protocol and "www.".
 * Falls back to the raw input if the URL can't be parsed.
 */
export function displayDomain(input: string | null | undefined): string {
  if (!input) return "";
  const normalized = normalizeWebsiteUrl(input) ?? input;
  try {
    return new URL(normalized).hostname.replace(/^www\./, "");
  } catch {
    return input;
  }
}
