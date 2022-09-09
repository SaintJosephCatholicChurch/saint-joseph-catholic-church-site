export async function doesUrlFileExist(url: string): Promise<{ type: string; exists: boolean }> {
  const cleanUrl = url.replace(/^blob:/g, '');
  const response = await fetch(cleanUrl, { method: 'HEAD' });
  return { type: response.headers.get('Content-Type'), exists: response.ok };
}
