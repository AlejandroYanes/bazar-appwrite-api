import appWrite from "node-appwrite";
import initClient from './init-appwrite-cli';

const entities = [
  { name: 'Categories', id: process.env.BAZAR_COLLECTION_CATEGORIES! },
  { name: 'Sub-categories', id: process.env.BAZAR_COLLECTION_SUB_CATEGORIES! },
  { name: 'Stores', id: process.env.BAZAR_COLLECTION_STORES! },
  { name: 'Products', id: process.env.BAZAR_COLLECTION_PRODUCTS! },
];

async function cleanDbData() {
  console.log('--------------------------------');
  console.log('Clear DB script');
  const client = initClient();
  const db = new appWrite.Database(client);
  const storage = new appWrite.Storage(client);
  const teamsCli = new appWrite.Teams(client);

  console.log('--- Deleting elements');
  for (const entity of entities) {
    let elements = await db.listDocuments(entity.id, [], 100);
    while (elements.total > 0) {
      console.log(`------ Deleting ${entity.name}: ${elements.total} items`);
      for (const element of elements.documents) {
        await db.deleteDocument(entity.id, element.$id);
      }
      elements = await db.listDocuments(entity.id, [], 100);
    }
  }

  console.log('--- Deleting buckets');
  let bucketList = await storage.listBuckets(undefined, 100);
  while (bucketList.total > 0) {
    for (const bucket of bucketList.buckets) {
      await storage.deleteBucket(bucket.$id);
    }
    bucketList = await storage.listBuckets(undefined, 100);
  }

  console.log('--- Deleting teams');
  let teamList = await teamsCli.list(undefined, 100);
  while (teamList.total > 0) {
    for (const team of teamList.teams) {
      await teamsCli.delete(team.$id);
    }
    teamList = await teamsCli.list(undefined, 100);
  }
}

cleanDbData();
