const appWrite = require('node-appwrite');
const { AttributeType } = require('../models/base/appwrite-types');
const initClient = require('../helpers/init-appwrite-cli');
const { ProductsCollection } = require('../models');

const collections = [
  ProductsCollection,
];

async function buildAttributes(db, collectionId, attributes) {
  for (const attribute of attributes) {
    const { name, type, size, required, array, defaultValue, min, max, elements } = attribute;
    switch (type) {
      case AttributeType.STRING: {
        await db.createStringAttribute(collectionId, name, size, required, defaultValue, array);
        break;
      }
      case AttributeType.INTEGER: {
       await db.createIntegerAttribute(collectionId, name, required, min, max, defaultValue, array);
       break;
      }
      case AttributeType.FLOAT: {
        await db.createFloatAttribute(collectionId, name, required, min, max, defaultValue, array);
        break;
      }
      case AttributeType.BOOLEAN: {
        await db.createBooleanAttribute(collectionId, name, required, defaultValue, array);
        break;
      }
      case AttributeType.EMAIL: {
        await db.createEmailAttribute(collectionId, name, required, defaultValue, array);
        break;
      }
      case AttributeType.IP: {
        await db.createIpAttribute(collectionId, name, required, defaultValue, array);
        break;
      }
      case AttributeType.URL: {
        await db.createUrlAttribute(collectionId, name, required, defaultValue, array);
        break;
      }
      case AttributeType.ENUM: {
        await db.createEnumAttribute(collectionId, name, elements, required, defaultValue, array);
        break;
      }
    }
  }
}

async function buildIndexes(db, collectionId, indexes) {
  for (const index of indexes) {
    const { key, type, attributes, orders } = index;
    await db.createIndex(collectionId, key, type, attributes, orders);
  }
}

async function buildDBStructure() {
  const client = initClient();
  const db = new appWrite.Database(client);
  for (const collection of collections) {
    const { id, name, permissionLevel, permissions, attributes, indexes } = collection;
    await db.createCollection(id, name, permissionLevel, permissions.read, permissions.write);
    await buildAttributes(db, id, attributes);
    await buildIndexes(db, id, indexes);
  }
}

module.exports = buildDBStructure;
