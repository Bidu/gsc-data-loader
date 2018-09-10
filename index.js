const auth = require('./lib/authorize');
const gsc = require('./lib/gsc');
const date = require('./lib/date');

exports.handler = async (event, context, callback) => {
  let authData = await auth();

  let data = {},
      sites = process.env.SITE_LIST.split(','),
      categories = process.env.CATEGORIES.split(','),
      platforms = process.env.PLATFORMS.split(',');

  for(site of sites) {
    let errorCounts = await gsc.urlCrawlErrorsCounts(authData.client, site),
        searchAnalytics = await gsc.searchAnalytics(authData.client, site, date.start(), date.end() ),
        sitemaps = await gsc.sitemaps(authData.client, site),
        errorsSamples = [];

    for (let n = 0; n < categories.length; n ++) {
      errorsSamples[n] = [];
      for (platform of platforms) {
        errorSample = await gsc.errorsSamples(authData.client, site, categories[n],
          platform);
        errorsSamples[n].push(errorSample.data);
      }
    }

    let result = {
      site,
      errorsCount: errorCounts,
      searchAnalytics,
      sitemaps,
      errorsSamples,

    };
    data[site] = result;
  };

  console.log(JSON.stringify(data, null, 2));

};
