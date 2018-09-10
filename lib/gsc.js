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

        resolve(response.data.countPerTypes);
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
        resolve(response);
      });
    });
  }
}
