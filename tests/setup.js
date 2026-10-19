const dotenv = require('dotenv');
const path = require('path');

console.log('SETUP FILE LOADED');

const result = dotenv.config({
  path: path.resolve(__dirname, '../.env.test'),
  override: true
});

console.log('DOTENV ERROR:', result.error || 'none');

console.log(
  'DATABASE LOADED:',
  process.env.DATABASE_URL ? 'YES' : 'NO'
);