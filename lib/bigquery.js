const BigQuery = require('@google-cloud/bigquery');
const client = new BigQuery({
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY
  }
});

module.exports = {
  insert: async (tableName, rows) => {
    try {
      await client
          .dataset('google_search_console')
          .table(tableName)
          .insert(rows);
    }
    catch(err) {
      console.log(`Error while insert data on ${tableName}: ${err}`);
    }
  }
}
