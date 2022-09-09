export async function doesUrlFileExist(url: string): Promise<boolean> {
  const cleanUrl = url.replace(/^blob:/g, '');
  const response = await fetch(cleanUrl, { method: 'HEAD' });
  return response.ok;
}