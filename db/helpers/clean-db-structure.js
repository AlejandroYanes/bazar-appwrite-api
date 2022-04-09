const appWrite = require('node-appwrite');
const initClient = require('./init-appwrite-cli');

async function cleanDBStructure() {
  const client = initClient();
  const db = new appWrite.Database(client);
  const storage = new appWrite.Storage(client);
  const teamsCli = new appWrite.Teams(client);
  const usersCli = new appWrite.Users(client);

  const { collections } = await db.listCollections(undefined, 100);
  for (const { $id } of collections) {
    const { indexes } = await db.listIndexes($id);
    const { attributes } = await db.listAttributes($id);

    for (const index of indexes) {
      await db.deleteIndex($id, index.key);
    }
    for (const attribute of attributes) {
      await db.deleteAttribute($id, attribute.key);
    }

    await db.deleteCollection($id);
  }

  const { buckets } = await storage.listBuckets(undefined, 100);
  for (const bucket of buckets) {
    await storage.deleteBucket(bucket.$id);
  }

  const { teams } = await teamsCli.list(undefined, 100);
  for (const team of teams) {
    await teamsCli.delete(team.$id);
  }

  const { users } = await usersCli.list(undefined, 100);
  for (const user of users) {
    await usersCli.delete(user.$id);
  }
}

cleanDBStructure();
