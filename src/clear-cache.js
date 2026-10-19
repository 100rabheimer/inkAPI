require('dotenv').config();

const redis = require('./config/redis');

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

redis.del('post:d0a4ad41-065b-4156-a220-8f35e85b323e')
  .then(() => {
    console.log('Detail cache cleared');
    redis.quit();
  })
  .catch((err) => {
    console.error('Delete error:', err);
    redis.quit();
  });