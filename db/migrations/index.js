const buildDBStructure = require('./initial-migration');

const migrations = [
  buildDBStructure,
];

async function runMigrations() {
  for (const migration in migrations) {
    await migration();
  }
}

runMigrations();
