const { google } = require('googleapis');
const webmasters = google.webmasters('v3');

module.exports = {
  urlCrawlErrorsCounts: (authClient, siteUrl) => {
    return new Promise((resolve, reject) => {
      let queryParams = { auth: authClient, siteUrl };
      webmasters.urlcrawlerrorscounts.query(queryParams, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({
          siteUrl,
          createdAt: new Date(),
          errorsCount: response.data.countPerTypes.map(j => {
            return {
              platform: j.platform,
              category: j.category,
              count: j.entries[0].count
            }
          })
        });
      });
    });
  },
  searchAnalytics: (authClient, siteUrl, startDate, endDate) => {
    return new Promise((resolve, reject) => {
      let today = new Date(),
      queryParams = {
        auth: authClient, siteUrl,
        resource:{startDate, endDate}
      }
      webmasters.searchanalytics.query(queryParams, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({
          siteUrl,
          createdAt: new Date(),
          clicks: response.data.rows[0].clicks,
          impressions: response.data.rows[0].impressions,
          ctr: response.data.rows[0].ctr,
          position: response.data.rows[0].position
        });
      });
    });
  },
  sitemaps: (authClient, siteUrl) => {
    return new Promise((resolve, reject) => {
      let queryParams = { auth: authClient, siteUrl };
      webmasters.sitemaps.list(queryParams, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response.data.sitemap);
      });
    });
  },
  errorsSamples: (authClient, siteUrl, category, platform) => {
    return new Promise((resolve, reject) => {
      let queryParams = { auth: authClient, siteUrl, category, platform }
      webmasters.urlcrawlerrorssamples.list(queryParams, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response);
      });
    });
  }
}
