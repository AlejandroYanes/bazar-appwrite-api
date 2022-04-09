const AttributeType = {
  STRING: 'STRING',
  INTEGER: 'INTEGER',
  FLOAT: 'FLOAT',
  BOOLEAN: 'BOOLEAN',
  IP: 'IP',
  URL: 'URL',
  EMAIL: 'EMAIL',
  ENUM: 'ENUM',
};

const IndexType = {
  KEY: 'key',
  UNIQUE: 'unique',
  FULL_TEXT: 'fulltext',
};

const IndexOrder = {
  ASC: 'ASC',
  DESC: 'DESC',
};

module.exports = { AttributeType, IndexType, IndexOrder };
