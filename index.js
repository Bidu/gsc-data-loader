const auth = require('./lib/authorize');

exports.handler = async (event, context, callback) => {
  let authData = await auth();
  console.log(authData);
};
