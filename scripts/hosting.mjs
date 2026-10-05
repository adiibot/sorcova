// Adapt the generated site to a domain root or a GitHub Pages project path.
export function hostingHtml(html, basePath = '', siteUrl = '') {
  basePath = basePath.replace(/\/$/, '');
  if (basePath && !/^\/(?:[A-Za-z0-9_-]+\/?)+$/.test(basePath)) throw new Error('Invalid SITE_BASE_PATH');
  const hosted = html.replace(/((?:href|src)=\\?")\/(?!\/)/g, `$1${basePath}/`);
  let metadata = `<meta name="site-base" content="${basePath}">`;
  if (siteUrl) {
    const url = new URL(siteUrl);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) throw new Error('Invalid SITE_URL');
    if (url.pathname.replace(/\/$/, '') !== basePath) throw new Error('SITE_URL and SITE_BASE_PATH disagree');
    const locale = html.match(/<html lang="(en|fr)"/)[1];
    metadata += `<link rel="canonical" href="${url.origin}${basePath}/${locale}/">`;
  }
  return hosted.replace('<head>', `<head>\n  ${metadata}`);
}
