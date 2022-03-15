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
    icon: 'HOME',
    sub: [
      { name: 'Decoracion' },
      { name: 'Muebles' },
      { name: 'Cocina' },
      { name: 'Baño' },
    ],
  },
  {
    name: 'Moda',
    icon: 'FASHION',
    sub: [
      { name: 'Ropa de Hombre' },
      { name: 'Ropa de Mujer' },
      { name: 'Zapatos' },
      { name: 'Complementos' },
    ],
  },
  {
    name: 'Tecnologia',
    icon: 'DEVICES',
    sub: [
      { name: 'Telefonos' },
      { name: 'Computadoras' },
      { name: 'Externos' },
    ],
  },
  {
    name: 'Mascotas',
    icon: 'PET',
    sub: [
      { name: 'Comida' },
      { name: 'Medicamentos' },
      { name: 'Juguetes' },
      { name: 'Complementos' },
    ],
  },
];
const imagePacks = [
  ['6230e694833eba9af7fd', '6230e68c8408102676f5', '6230e6863886926773ae', '6230e680d510c4ebdcd3', '6230e679ea1db38c9a89'],
  ['6230e67302462c83920c', '6230e66d9fa17c991995', '6230e6673888c07e0662'],
  ['6230e65aa161f312621f', '6230e653e8dc7794f676', '6230e64635a01953213e'],
];

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
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price(5, 5000, 2)),
      images,
      thumbnail: faker.random.arrayElement(images),
      subCategory: subCategory.$id,
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
