const appWrite = require("node-appwrite");
const initClient = require('./init-appwrite-cli');

async function cleanDbData() {
  const client = initClient();
  const db = new appWrite.Database(client);
  let categories = await db.listDocuments(process.env.BAZAR_COLLECTION_CATEGORIES, [], 100);
  let subCategories = await db.listDocuments(process.env.BAZAR_COLLECTION_SUB_CATEGORIES, [], 100);
  let products = await db.listDocuments(process.env.BAZAR_COLLECTION_PRODUCTS, [], 100);

  console.log('--------------------------------');
  console.log('Clear DB script: Items to remove');
  console.log('Categories: ', categories.total);
  console.log('Sub-Categories: ', subCategories.total);
  console.log('Products: ', products.total);
  console.log('--------------');

  const promises = [].concat(
    categories.documents.map((item) => {
      return db.deleteDocument(process.env.BAZAR_COLLECTION_CATEGORIES, item.$id);
    }),
    subCategories.documents.map((item) => {
      return db.deleteDocument(process.env.BAZAR_COLLECTION_SUB_CATEGORIES, item.$id);
    }),
    products.documents.map((item) => {
      return db.deleteDocument(process.env.BAZAR_COLLECTION_PRODUCTS, item.$id);
    }),
  );

  await Promise.all(promises);

  categories = await db.listDocuments(process.env.BAZAR_COLLECTION_CATEGORIES, [], 100);
  subCategories = await db.listDocuments(process.env.BAZAR_COLLECTION_SUB_CATEGORIES, [], 100);
  products = await db.listDocuments(process.env.BAZAR_COLLECTION_PRODUCTS, [], 100);

  console.log('Clear DB script: Remaining Items');
  console.log('Categories: ', categories.total);
  console.log('Sub-Categories: ', subCategories.total);
  console.log('Products: ', products.total);
  console.log('--------------------------------');
}

cleanDbData();
