const auth = require('./lib/authorize');
const gsc = require('./lib/gsc');
const date = require('./lib/date');
const bigquery = require('./lib/bigquery');

exports.gscDataLoader = async (req, res) => {
  let authData = await auth(),
      searchAnalyticsQueries = [],
      searchAnalyticsResult = [];

  const data = {},
        errorsCountRows = [],
        searchAnalyticsRows = [],
        sitemapsRows = [],
        errorSamplesRows = [],
        sites = process.env.SITE_LIST.split(',');

  for(site of sites) {
    errorsCountRows.push(await gsc.urlCrawlErrorsCounts(authData.client, site));
    searchAnalyticsRows.push(await gsc.searchAnalytics(authData.client, site, date.threeDaysAgo(), date.currentDay()));
    sitemapsRows.push(await gsc.sitemaps(authData.client, site));
    errorSamplesRows.push(await gsc.errorsSamples(authData.client, site));

    searchAnalyticsResult = await gsc.searchAnalytics(authData.client, site, date.threeDaysAgo(), date.currentDay(), ["query"]);
    searchAnalyticsQueries.push(await gsc.searchAnalyticsQueries(searchAnalyticsResult, site));
  };
  await bigquery.insert('errors_count', errorsCountRows);
  await bigquery.insert('search_analytics', searchAnalyticsRows);
  await bigquery.insert('sitemaps', sitemapsRows);
  await bigquery.insert('errors_samples', errorSamplesRows);
  await bigquery.insert('search_analytics_queries', searchAnalyticsQueries.reduce((result, current) => result.concat(current)));
  res.send();
};
