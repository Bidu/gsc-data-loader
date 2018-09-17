const auth = require('./lib/authorize');
const gsc = require('./lib/gsc');
const date = require('./lib/date');
const bigquery = require('./lib/bigquery')

exports.handler = async (event, context, callback) => {
  let authData = await auth();

  let data = {},
      errorsCountRows = [],
      searchAnalyticsRows = [],
      sitemapsRows = [],
      errorSamplesRows = [],
      sites = process.env.SITE_LIST.split(','),
      categories = process.env.CATEGORIES.split(','),
      platforms = process.env.PLATFORMS.split(',');

  for(site of sites) {
    errorsCountRows.push(await gsc.urlCrawlErrorsCounts(authData.client, site)),
    searchAnalyticsRows.push(await gsc.searchAnalytics(authData.client, site, date.threeDaysAgo(), date.currentDay())),
    sitemapsRows.push(await gsc.sitemaps(authData.client, site));
    let errorsSamples = [];
    for (category of categories) {
      for (platform of platforms) {
        errorsSamples.push(await gsc.errorsSamples(authData.client, site, category, platform));
      }
    }
    let result = {
      siteUrl: site,
      createdAt: new Date(),
      data: errorsSamples
    }
    errorSamplesRows.push(result);
  };
  await bigquery.insert('errors_count', errorsCountRows);
  await bigquery.insert('search_analytics', searchAnalyticsRows);
  await bigquery.insert('sitemaps', sitemapsRows);
  await bigquery.insert('errors_samples', errorSamplesRows);
};
