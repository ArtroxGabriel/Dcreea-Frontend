export function buildURL(baseUrl: string, params: Object): string {
  let url = baseUrl;
  url = url.concat('?');
  for (const [key, value] of Object.entries(params)) {
    if (value != null) {
      url = url.concat(`${key}=${value}&`);
    }
  }
  return url;
}
