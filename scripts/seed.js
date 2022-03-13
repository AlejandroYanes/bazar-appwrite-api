require('dotenv').config()
const appWrite = require("node-appwrite");
const { faker } = require('@faker-js/faker');
faker.locale = 'es';

function initClient() {
  return new appWrite.Client()
    .setEndpoint(process.env.SEED_ENDPOINT)
    .setProject(process.env.SEED_PROJECT)
    .setKey(process.env.SEED_API_KEY);
}

const dataStructure = [
  {
    name: 'Hogar',
    sub: [
      { name: 'Decoracion' },
      { name: 'Muebles' },
      { name: 'Cocina' },
      { name: 'Baño' },
    ],
  },
  {
    name: 'Moda',
    sub: [
      { name: 'Ropa de Hombre' },
      { name: 'Ropa de Mujer' },
      { name: 'Zapatos' },
      { name: 'Complementos' },
    ],
  },
  {
    name: 'Tecnologia',
    sub: [
      { name: 'Telefonos' },
      { name: 'Computadoras' },
      { name: 'Externos' },
    ],
  },
  {
    name: 'Mascotas',
    sub: [
      { name: 'Comida' },
      { name: 'Medicamentos' },
      { name: 'Juguetes' },
      { name: 'Complementos' },
    ],
  },
];
const imagePacks = [
  ['622e25532a50bf7676e6', '622e255a688dd0b2c582', '622e25602c5bd26e4377', '622e25666303d73285dd', '622e256c0c6858ac349e'],
  ['622e253e6599d7c5a2ef', '622e2544667bb5abde51', '622e2549eabde8eed7aa'],
  ['622e2524332054eeba98', '622e252e6e73d21686e2', '622e2538354ba51a64fb'],
];

function seedCategories(db) {
  const promises = dataStructure.map((cat) => {
    return db.createDocument(process.env.SEED_COLLECTION_CATEGORIES, 'unique()', { name: cat.name });
  });
  return Promise.all(promises);
}

function seedSubCategories(db, categories) {
  const promises = categories.map((cat, index) => {
    const category = dataStructure[index];
    const subCategories = category.sub;
    return subCategories.map((sub) => {
      return db.createDocument(process.env.SEED_COLLECTION_SUB_CATEGORIES, 'unique()', { name: sub.name, categoryId: cat.$id });
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
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price(5, 5000, 2)),
      images,
      thumbnail: faker.random.arrayElement(images),
      subCategoryId: subCategory.$id,
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
