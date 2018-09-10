const auth = require('./lib/authorize');
const gsc = require('./lib/gsc');
const date = require('./lib/date');

exports.handler = async (event, context, callback) => {
  let authData = await auth();

  let data = {},
      sites = process.env.SITE_LIST.split(',');

  for(let i = 0; i < sites.length; i ++) {
    let errorCounts = await gsc.urlCrawlErrorsCounts(authData.client, sites[i]),
        searchAnalytics = await gsc.searchAnalytics(authData.client, sites[i], date.start(), date.end() ),
        sitemaps = await gsc.sitemaps(authData.client, sites[i]);

    let result = {
      site: sites[i],
      errorsCount: errorCounts,
      searchAnalytics: searchAnalytics,
      sitemaps: sitemaps
    };
    data[sites[i]] = result;
  };

  console.log(JSON.stringify(data, null, 2));

};
