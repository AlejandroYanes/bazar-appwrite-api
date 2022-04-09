const appWrite = require('node-appwrite');
const definitions = require('../../appwrite.json');
const initClient = require('./init-appwrite-cli');

async function buildAttributes(db, collectionId, attributes) {
  for (const attribute of attributes) {
    const { key, type, size, required, array, min, max, elements } = attribute;
    switch (type) {
      case 'string': {
        await db.createStringAttribute(collectionId, key, size, required, attribute['default'], array);
        break;
      }
      case 'integer': {
        await db.createIntegerAttribute(collectionId, key, required, min, max, attribute['default'], array);
        break;
      }
      case 'double': {
        await db.createFloatAttribute(collectionId, key, required, min, max, attribute['default'], array);
        break;
      }
      case 'boolean': {
        await db.createBooleanAttribute(collectionId, key, required, attribute['default'], array);
        break;
      }
      case 'email': {
        await db.createEmailAttribute(collectionId, key, required, attribute['default'], array);
        break;
      }
      case 'ip': {
        await db.createIpAttribute(collectionId, key, required, attribute['default'], array);
        break;
      }
      case 'url': {
        await db.createUrlAttribute(collectionId, key, required, attribute['default'], array);
        break;
      }
      case 'enum': {
        await db.createEnumAttribute(collectionId, key, elements, required, attribute['default'], array);
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

async function buildDbStructure() {
  const client = initClient();
  const db = new appWrite.Database(client);
  const { collections } = definitions;

  for (const collection of collections) {
    const { $id, $read, $write, name, permission, attributes, indexes } = collection;
    await db.createCollection($id, name, permission, $read, $write);
    await buildAttributes(db, $id, attributes);
    await buildIndexes(db, $id, indexes);
  }
}

buildDbStructure();
