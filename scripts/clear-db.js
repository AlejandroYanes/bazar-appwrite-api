require('dotenv').config()
const appWrite = require("node-appwrite");
const { faker } = require('@faker-js/faker');
faker.locale = 'es';

// const collections = [
//   process.env.SEED_COLLECTION_CATEGORIES,
//   process.env.SEED_COLLECTION_SUB_CATEGORIES,
//   process.env.SEED_COLLECTION_PRODUCTS,
// ];

function initClient() {
  return new appWrite.Client()
    .setEndpoint(process.env.SEED_ENDPOINT)
    .setProject(process.env.SEED_PROJECT)
    .setKey(process.env.SEED_API_KEY);
}

async function clearDB() {
  const client = initClient();
  const db = new appWrite.Database(client);
  const categories = await db.listDocuments(process.env.SEED_COLLECTION_CATEGORIES);
  const subCategories = await db.listDocuments(process.env.SEED_COLLECTION_SUB_CATEGORIES);
  const products = await db.listDocuments(process.env.SEED_COLLECTION_PRODUCTS);
  const promises = [].concat(
    categories.documents.map((item) => {
      return db.deleteDocument(process.env.SEED_COLLECTION_CATEGORIES, item.$id);
    }),
    subCategories.documents.map((item) => {
      return db.deleteDocument(process.env.SEED_COLLECTION_SUB_CATEGORIES, item.$id);
    }),
    products.documents.map((item) => {
      return db.deleteDocument(process.env.SEED_COLLECTION_PRODUCTS, item.$id);
    }),
  );

  await Promise.all(promises);
}

clearDB();
