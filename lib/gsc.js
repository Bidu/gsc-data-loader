const { google } = require('googleapis');
const webmasters = google.webmasters('v3');

module.exports = {
  urlCrawlErrorsCounts: (authClient, siteUrl) => {
    return new Promise((resolve, reject) => {
      let queryParams = { auth: authClient, siteUrl };
      console.log(`Start getting crawl errors from ${siteUrl}`);
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
              count: j.entries[0].count //here the response return an entries array with one position, so we need to get this first position
            }
          })
        });
      });
    });
  },
  searchAnalytics: (authClient, siteUrl, startDate, endDate, dimensions) => {
    dimensions = dimensions || null;
    return new Promise((resolve, reject) => {
      let today = new Date(),
          queryParams = {
            auth: authClient, siteUrl,
            resource:{startDate, endDate, dimensions}
          };
      console.log(`Start getting searchanalytics from ${siteUrl}`);
      webmasters.searchanalytics.query(queryParams, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({
          siteUrl,
          createdAt: new Date(),
          data: response.data.rows
        });
      });
    });
  },
  searchAnalyticsQueries: (searchAnalyticsResult, site) => {
    let analyticsRows = [],
        queries = []
    analyticsRows.push(searchAnalyticsResult);
    analyticsRows.forEach(row => {
      row.data.forEach(fields => {
        queries.push({
          siteUrl: site,
          createdAt: new Date(),
          key: fields.keys[0],
          clicks: fields.clicks,
          impressions: fields.impressions,
          ctr: fields.ctr,
          position: fields.position
        });
      });
    });
    return queries;
  },
  sitemaps: (authClient, siteUrl) => {
    return new Promise((resolve, reject) => {
      let queryParams = { auth: authClient, siteUrl };
      console.log(`Start getting sitemap from ${siteUrl}`);
      webmasters.sitemaps.list(queryParams, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({
          siteUrl,
          createdAt: new Date(),
          sitemap: response.data.sitemap || []
        });
      });
    });
  },
  errorsSamples: async function(authClient, siteUrl) {
    let categories = process.env.CATEGORIES.split(','),
        platforms = process.env.PLATFORMS.split(','),
        errorsSamples = [];
    console.log(`Start getting errors samples from ${siteUrl}`);
    for (category of categories) {
      for (platform of platforms) {
        errorsSamples.push(await this.errorsSamplesFromCategory(authClient, siteUrl, category, platform));
      }
    }
    return {
      siteUrl: site,
      createdAt: new Date(),
      data: errorsSamples
    };
  },
  errorsSamplesFromCategory: function(authClient, siteUrl, category, platform) {
    return new Promise((resolve, reject) => {
      let queryParams = { auth: authClient, siteUrl, category, platform }
      webmasters.urlcrawlerrorssamples.list(queryParams, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({
          category,
          platform,
          urlCrawlErrorSample: response.data.urlCrawlErrorSample || []
        });
      });
    });
  }
}
