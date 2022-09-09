export async function doesUrlFileExist(url: string): Promise<{ type: string; exists: boolean }> {
  const cleanUrl = url.replace(/^blob:/g, '');
  if (!cleanUrl.startsWith(window.location.hostname)) {
    return { type: 'Unknown', exists: true };
  }

  console.log('clean url', cleanUrl);
  const response = await fetch(cleanUrl, { method: 'HEAD' });
  return { type: response.headers.get('Content-Type'), exists: response.ok };
}
