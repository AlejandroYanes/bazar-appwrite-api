import { env } from 'process';
import appWrite, { Database, Teams, Storage, Users } from 'node-appwrite';
import { faker } from '@faker-js/faker';
import { CategoryModel, StoreModel, SubCategoryModel } from '../models';
import initClient from '../helpers/init-appwrite-cli';
import { categoriesTree, imagePacks } from './mock-data';

async function seedCategories(db: Database): Promise<CategoryModel[]> {
  console.log('--- Seeding Categories');
  const stored: CategoryModel[] = [];
  for (const cat of categoriesTree) {
    console.log(`------ creating: ${cat.name}`);
    const doc = await db.createDocument(env.BAZAR_COLLECTION_CATEGORIES!, 'unique()', { name: cat.name });
    stored.push(doc as CategoryModel);
  }
  console.log('--- Finished Categories');
  return stored;
}

function seedSubCategories(db: Database, categories: CategoryModel[]): Promise<SubCategoryModel[]> {
  console.log('--- Seeding Sub-categories');
  const promises = categories.map((cat, index) => {
    const category = categoriesTree[index];
    const subCategories = category.sub;
    return subCategories.map((sub) => {
      console.log(`------ creating: ${sub.name}`);
      return db.createDocument(env.BAZAR_COLLECTION_SUB_CATEGORIES!, 'unique()', { name: sub.name, category: cat.$id }, ['role:all'], []);
    });
  });
  const flattenPromises = promises.flat();
  console.log('--- Finished Sub-categories');
  return Promise.all(flattenPromises) as Promise<SubCategoryModel[]>;
}

async function seedStores(db: Database, users: Users, teams: Teams, storage: Storage): Promise<StoreModel[]> {
  console.log('--- Seeding Stores');
  const fileSize = 8000000;
  const fileExtensions = ['jpeg', 'jpg', 'png'];
  const stores = (
    new Array(faker.datatype.number({ min: 4, max: 10 }))
      .fill(1)
      .map(() => ({
        name: faker.company.companyName(),
        logo: 'logo-id',
        phone: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        facebook: faker.datatype.boolean() ? faker.internet.userName() : undefined,
        instagram: faker.datatype.boolean() ? faker.internet.userName() : undefined,
        whatsup: faker.datatype.boolean() ? faker.phone.phoneNumber() : undefined,
        telegram: faker.datatype.boolean() ? faker.phone.phoneNumber() : undefined,
      }))
  );

  const documents = [];
  for (const store of stores) {
    console.log(`------ creating ${store.name}`);
    // const firstName = faker.name.firstName();
    // const lastName = faker.name.lastName();
    // const owner = await users.create('unique()', faker.internet.email(firstName, lastName, 'gmail.com'), faker.internet.password(10), `${firstName} ${lastName}`);
    const team = await teams.create('unique()', store.name);
    // await teams.createMembership(team.$id, owner.email, ['owner'], 'http://localhost/own-team', owner.name);
    const bucket = await storage.createBucket('unique()', store.name, 'bucket', ['role:all'], [`team:${team.$id}`], true, fileSize, fileExtensions, false, false);
    const doc = await db.createDocument(env.BAZAR_COLLECTION_STORES!, 'unique()', { ...store, team: team.$id, bucket: bucket.$id }, ['role:all'], [`team:${team.$id}`]);
    documents.push(doc);
  }
  console.log('--- Finished Stores');
  return documents as StoreModel[];
}

async function seedProducts(db: Database, storage: Storage, subCategories: SubCategoryModel[], stores: StoreModel[]) {
  console.log('--- Seeding Products');
  for (const subCategory of subCategories) {
    const products = generateFakeProducts(subCategory);
    for (const product of products) {
      console.log(`------ creating ${product.name} (CUP ${product.price})`);
      const store = faker.random.arrayElement(stores);
      const images = faker.random.arrayElement(imagePacks);
      const storedImages = [];
      for (const image of images) {
        const stored = await storage.createFile(store.bucket, 'unique()',`assets/product-images/${image}`, ['role:all'], [`team:${store.team}`]);
        storedImages.push(stored);
      }

      await db.createDocument(
         env.BAZAR_COLLECTION_PRODUCTS!,
        'unique()',
        {
          ...product,
          store: store.$id,
          bucket: store.bucket,
          images: storedImages.map((file) => file.$id),
          thumbnail: faker.random.arrayElement(storedImages).$id,
        },
        ['role:all'],
        [`team:${store.team}`],
      );
    }
  }
  console.log('--- Finished Products');
}

function generateFakeProducts(subCategory: SubCategoryModel) {
  return new Array(8).fill(1).map(() => {
    const description = new Array(faker.datatype.number({ min: 1, max: 10}))
      .fill(0)
      .map(() => faker.commerce.productDescription()).join('. ');
    return {
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price(5, 5000, 2)),
      subCategory: subCategory.$id,
      description,
    };
  });
}

async function seedDB() {
  console.log('-----------------------');
  console.log('Stared DB seed');
  const client = initClient();
  const db = new appWrite.Database(client);
  const users = new appWrite.Users(client);
  const teams = new appWrite.Teams(client);
  const storage = new appWrite.Storage(client);
  const categories = await seedCategories(db);
  const subCategories = await seedSubCategories(db, categories);
  const stores = await seedStores(db, users, teams, storage);
  await seedProducts(db, storage, subCategories, stores);
  console.log('-----------------------');
}

seedDB();
