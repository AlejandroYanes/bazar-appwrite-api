import {Database} from "node-appwrite";

const POOL_DEBOUNCE = 2000; // in milliseconds
const POOL_MAX_DEBOUNCE = 30;

export function delay (ms: number = POOL_DEBOUNCE) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), ms);
  });
}

export async function expectAttributes (db: Database, collectionId: string, attributeKeys: string[], iteration = 1): Promise<boolean> {
  if (iteration > POOL_MAX_DEBOUNCE) {
    return false;
  }

  // TODO: Pagination?
  const { attributes: remoteAttributes } = await db.listAttributes(collectionId);

  const readyAttributeKeys = remoteAttributes.filter((attribute: any) => {
    if (attributeKeys.includes(attribute.key)) {
      if (['stuck', 'failed'].includes(attribute.status)) {
        throw new Error(`Attribute '${attribute.key}' failed!`);
      }

      return attribute.status === 'available';
    }

    return false;
  }).map((attribute: any) => attribute.key);

  if (readyAttributeKeys.length >= attributeKeys.length) {
    return true;
  }

  await new Promise(resolve => setTimeout(resolve, POOL_DEBOUNCE));
  return expectAttributes(db, collectionId, attributeKeys, iteration + 1);
}
