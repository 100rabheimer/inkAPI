require('dotenv').config();

const redis = require('./config/redis');

redis.get('posts:page:1:limit:10')
  .then((value) => {
    console.log('CACHE VALUE:', value);
    redis.quit();
  })
  .catch((err) => {
    console.error('Redis error:', err);
    redis.quit();
  });