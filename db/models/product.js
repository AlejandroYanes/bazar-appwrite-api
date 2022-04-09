const { AttributeType, IndexType, IndexOrder } = require('./base/appwrite-types');

const ProductsCollection = {
  id: process.env.BAZAR_COLLECTION_PRODUCTS,
  name: 'Products',
  permissionLevel: 'document',
  permissions: {
    read: [],
    write: [],
  },
  attributes: [
    {
      name: 'name',
      type: AttributeType.STRING,
      size: 255,
      required: true,
      array: false,
    },
    {
      name: 'price',
      type: AttributeType.FLOAT,
      required: false,
      array: false,
    },
    {
      name: 'thumbnail',
      type: AttributeType.STRING,
      required: true,
      array: false,
    },
    {
      name: 'images',
      type: AttributeType.STRING,
      size: 255,
      required: true,
      array: true,
    },
    {
      name: 'team',
      type: AttributeType.STRING,
      size: 255,
      required: true,
      array: false,
    },
    {
      name: 'store',
      type: AttributeType.STRING,
      size: 255,
      required: true,
      array: false,
    },
    {
      name: 'bucket',
      type: AttributeType.STRING,
      size: 255,
      required: true,
      array: false,
    },
    {
      name: 'subCategory',
      type: AttributeType.STRING,
      required: true,
      array: false,
    },
  ],
  indexes: [
    {
      key: 'NameFullTextASC',
      type: IndexType.FULL_TEXT,
      attributes: ['name'],
      orders: [IndexOrder.ASC],
    },
    {
      key: 'NameFullTextDESC',
      type: IndexType.FULL_TEXT,
      attributes: ['name'],
      orders: [IndexOrder.DESC],
    },
    {
      key: 'PriceDESC',
      type: IndexType.KEY,
      attributes: ['price'],
      orders: [IndexOrder.DESC],
    },
    {
      key: 'PriceASC',
      type: IndexType.KEY,
      attributes: ['price'],
      orders: [IndexOrder.ASC],
    },
    {
      key: 'SubCategoryASC',
      type: IndexType.KEY,
      attributes: ['subCategory'],
      orders: [IndexOrder.ASC],
    },
    {
      key: 'SubCategoryDESC',
      type: IndexType.KEY,
      attributes: ['subCategory'],
      orders: [IndexOrder.DESC],
    },
  ],
};

module.exports = { ProductsCollection };
