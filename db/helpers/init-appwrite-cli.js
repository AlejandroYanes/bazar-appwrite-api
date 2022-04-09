const appWrite = require('node-appwrite');

function initClient() {
  return new appWrite.Client()
    .setEndpoint(process.env.BAZAR_ENDPOINT)
    .setProject(process.env.BAZAR_PROJECT_ID)
    .setKey(process.env.BAZAR_MANAGEMENT_API_KEY);
}

module.exports = initClient;
