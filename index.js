const auth = require('./lib/authorize');
const gsc = require('./lib/gsc');
const date = require('./lib/date');
const bigquery = require('./lib/bigquery');

searchAnalyticsQueries = async (req, res) => {
  const authData =  await auth(),
      AnalyticsRows = [],
      searchAnalyticsQueries = [],
      sites = process.env.SITE_LIST.split(',');

  for(site of sites) {
    AnalyticsRows.push(await gsc.searchAnalytics(authData.client, site, date.threeDaysAgo(), date.currentDay(), ["query"]));
    AnalyticsRows.forEach(row => {
      row.data.forEach(fields => {
        searchAnalyticsQueries.push({
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
  }
  await bigquery.insert('search_analytics_queries', searchAnalyticsQueries);
  res.send();
}

exports.gscDataLoader = async (req, res) => {
  let authData = await auth();

  let data = {},
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
  };
  await bigquery.insert('errors_count', errorsCountRows);
  await bigquery.insert('search_analytics', searchAnalyticsRows);
  await bigquery.insert('sitemaps', sitemapsRows);
  await bigquery.insert('errors_samples', errorSamplesRows);

  res.send();
};
