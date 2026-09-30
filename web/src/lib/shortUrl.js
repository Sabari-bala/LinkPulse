/**
 * Build the public short URL for a given short code.
 * In development this points to Django directly, in production to the deployed backend.
 */
export function getShortUrl(shortCode) {
  const origin =
    import.meta.env.VITE_SHORT_LINK_ORIGIN ||
    window.location.origin;
  return `${origin.replace(/\/$/, '')}/${shortCode}`;
}
