const { google } = require('googleapis');

const authClient = new google.auth.JWT(
       process.env.CLIENT_EMAIL,
       null,
       process.env.PRIVATE_KEY,
       ['https://www.googleapis.com/auth/webmasters.readonly']);


module.exports = () => {
  return new Promise((resolve, reject) => {
    authClient.authorize((err, tokens) => {
     if (err) {
       reject(err);
       return;
     }

     resolve({
      client: authClient,
      tokens: tokens
     });
    });
  });
}
