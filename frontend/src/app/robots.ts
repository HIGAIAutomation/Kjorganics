export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/admin/',
          '/api/',
          '/account/',
          '/checkout/',
          '/*?*',
          '/*/private/',
        ],
      },
    ],
    sitemap: 'https://kjorganics.com/sitemap.xml',
  };
}
