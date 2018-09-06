const auth = require('./lib/authorize');
const gsc = require('./lib/gsc');

exports.handler = async (event, context, callback) => {
  let authData = await auth();

  let data = {},
      sites = process.env.SITE_LIST.split(','),
      today = new Date();

  for(let i = 0; i < sites.length; i ++) {
    let errorCounts = await gsc.urlCrawlErrorsCounts(authData.client, sites[i]),
        searchAnalytics = await gsc.searchAnalytics(authData.client, sites[i]);

    let result = {
      site: sites[i],
      errorsCount: errorCounts,
      searchAnalytics: searchAnalytics.data
    };
    data[sites[i]] = result;
  };

  console.log(JSON.stringify(data, null, 2));

};
