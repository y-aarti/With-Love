function createToken() {
  return globalThis.crypto?.randomUUID?.()
    ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function createUniqueCardLink(currentUrl = window.location.href) {
  const url = new URL(currentUrl);
  url.search = '';
  url.hash = '';
  url.searchParams.set('share', createToken());
  return url.toString();
}

export function isSharedCardLink(search = window.location.search) {
  return Boolean(new URLSearchParams(search).get('share'));
}

export async function copyCardLink(link) {
  if (!navigator.clipboard?.writeText) throw new Error('Clipboard is unavailable');
  await navigator.clipboard.writeText(link);
}
