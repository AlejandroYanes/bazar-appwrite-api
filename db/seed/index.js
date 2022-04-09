const appWrite = require("node-appwrite");
const { faker } = require('@faker-js/faker');
const initClient = require('../helpers/init-appwrite-cli');
const { imagePacks, dataStructure } = require('./mock-data');

faker.locale = 'es';

function seedCategories(db) {
  const promises = dataStructure.map((cat) => {
    return db.createDocument(process.env.SEED_COLLECTION_CATEGORIES, 'unique()', { name: cat.name, icon: cat.icon });
  });
  return Promise.all(promises);
}

function seedSubCategories(db, categories) {
  const promises = categories.map((cat, index) => {
    const category = dataStructure[index];
    const subCategories = category.sub;
    return subCategories.map((sub) => {
      return db.createDocument(process.env.SEED_COLLECTION_SUB_CATEGORIES, 'unique()', { name: sub.name, category: cat.$id });
    });
  });
  const flattenPromises = promises.flat();
  return Promise.all(flattenPromises);
}

function seedProducts(db, subCategories) {
  const promises = subCategories.map((sub) => {
    const products = generateFakeProducts(sub);
    return products.map((prod) => {
      return db.createDocument(
        process.env.SEED_COLLECTION_PRODUCTS,
        'unique()',
        prod,
        ['role:all'],
        ['role:all'],
      );
    });
  });
  const flattenPromises = promises.flat();
  return Promise.all(flattenPromises);
}

function generateFakeProducts(subCategory) {
  return new Array(8).fill(1).map(() => {
    const images = faker.random.arrayElement(imagePacks);
    const description = new Array(faker.datatype.number({ min: 1, max: 10}))
      .fill(0)
      .map(() => faker.commerce.productDescription()).join('. ');
    return {
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price(5, 5000, 2)),
      thumbnail: faker.random.arrayElement(images),
      subCategory: subCategory.$id,
      description,
      images,
    };
  });
}

async function seedDB() {
  const client = initClient();
  const db = new appWrite.Database(client);
  const categories = await seedCategories(db);
  const subCategories = await seedSubCategories(db, categories);
  await seedProducts(db, subCategories);
}

seedDB();
