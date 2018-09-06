const { google } = require('googleapis');
const webmasters = google.webmasters('v3');
let today = new Date(),
    dd = today.getDate(),
    mm = today.getMonth()+1,
    yyyy = today.getFullYear();
if(dd<10) {
  dd='0'+dd;
}
if(mm<10) {
  mm='0'+mm;
}
let today_format = yyyy+'-'+mm+'-'+dd;
today.setDate(today.getDate()-2);
    mm = today.getMonth()+1;
    dd = today.getDate();
    yyyy = today.getFullYear();
if(dd<10) {
  dd='0'+dd;
}

if(mm<10) {
  mm='0'+mm;
}
yesterday_format = yyyy+'-'+mm+'-'+dd;


module.exports = {
  urlCrawlErrorsCounts: (authClient, siteUrl) => {
    return new Promise((resolve, reject) => {
      let queryParams = { auth: authClient, siteUrl: siteUrl };
      webmasters.urlcrawlerrorscounts.query(queryParams, (err, response) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response.data.countPerTypes);
      });
    });
  },
  searchAnalytics: (authClient, siteUrl) => {
    return new Promise((resolve, reject) => {
      let today = new Date(),
          queryParams = { auth: authClient, siteUrl: siteUrl,
                          resource:{startDate: yesterday_format, endDate: today_format}
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
