
const request = require('supertest');
const app = require('../app');
const pool = require('../config/db');
const { generateAccessToken } = require('../utils/tokens');

describe('Post APIs', () => {

  test('should create a post with valid token', async () => {
    const email = `posttest-${Date.now()}@example.com`;

    // 1. Test user create karo
    const user = await pool.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email`,
      [
        email,
        'dummy-password-hash',
        'Post Test User'
      ]
    );

    // 2. Access token generate karo
    const token = generateAccessToken(user.rows[0]);

    // 3. POST request bhejo
    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'Test content'
      });

    console.log('STATUS:', response.statusCode);
    console.log('BODY:', response.body);

    // 4. Response check karo
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('post');
    expect(response.body.post.title).toBe('Test Post');
    expect(response.body.post.content).toBe('Test content');
  });


  test('should not create a post without token', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send({
        title: 'Unauthorized Post',
        content: 'Should not be created'
      });

    expect(response.statusCode).toBe(401);
  });


  test('should return posts with correct page size and newest first', async () => {

    // 1. Test user create karo
    const email = `pagination-${Date.now()}@example.com`;

    const user = await pool.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [
        email,
        'dummy-password-hash',
        'Pagination User'
      ]
    );

    // 2. 3 posts create karo
    const post1 = await pool.query(
      `INSERT INTO posts (user_id, title, content)
       VALUES ($1, $2, $3)
       RETURNING id, title, created_at`,
      [
        user.rows[0].id,
        'Post 1',
        'Content 1'
      ]
    );

    const post2 = await pool.query(
      `INSERT INTO posts (user_id, title, content)
       VALUES ($1, $2, $3)
       RETURNING id, title, created_at`,
      [
        user.rows[0].id,
        'Post 2',
        'Content 2'
      ]
    );

    const post3 = await pool.query(
      `INSERT INTO posts (user_id, title, content)
       VALUES ($1, $2, $3)
       RETURNING id, title, created_at`,
      [
        user.rows[0].id,
        'Post 3',
        'Content 3'
      ]
    );

    // 3. Pagination API call
    const response = await request(app)
      .get('/api/posts?page=1&limit=2');

    // 4. Response check karo
    expect(response.statusCode).toBe(200);
    expect(response.body.posts).toHaveLength(2);
    expect(response.body.posts[0].title).toBe('Post 3');
expect(response.body.posts[1].title).toBe('Post 2');
  });
test('should not allow the same user to like a post twice', async () => {

  // 1. Test user create karo
  const email = `like-${Date.now()}@example.com`;

  const user = await pool.query(
    `INSERT INTO users (email, password_hash, name)
     VALUES ($1, $2, $3)
     RETURNING id, email`,
    [
      email,
      'dummy-password-hash',
      'Like Test User'
    ]
  );

  // 2. Access token generate karo
  const token = generateAccessToken(user.rows[0]);

  // 3. Test ke liye post create karo
  const post = await pool.query(
    `INSERT INTO posts (user_id, title, content)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [
      user.rows[0].id,
      'Like Test Post',
      'Testing duplicate likes'
    ]
  );

  // 4. First like
  const firstLike = await request(app)
    .post(`/api/posts/${post.rows[0].id}/like`)
    .set('Authorization', `Bearer ${token}`);
expect(firstLike.statusCode).toBe(201);

const secondLike = await request(app)
  .post(`/api/posts/${post.rows[0].id}/like`)
  .set('Authorization', `Bearer ${token}`);

expect(secondLike.statusCode).toBe(409);

expect(secondLike.body.message).toBe(
  'You have already liked this post'
);

});
test('should allow only the author to delete a post', async () => {

  // 1. Author create karo
  const authorEmail = `author-${Date.now()}@example.com`;

  const author = await pool.query(
    `INSERT INTO users (email, password_hash, name)
     VALUES ($1, $2, $3)
     RETURNING id, email`,
    [
      authorEmail,
      'dummy-password-hash',
      'Author User'
    ]
  );

  // 2. Other user create karo
  const otherUserEmail = `other-${Date.now()}@example.com`;

  const otherUser = await pool.query(
    `INSERT INTO users (email, password_hash, name)
     VALUES ($1, $2, $3)
     RETURNING id, email`,
    [
      otherUserEmail,
      'dummy-password-hash',
      'Other User'
    ]
  );

  // 3. Dono ke tokens
  const authorToken = generateAccessToken(author.rows[0]);
  const otherUserToken = generateAccessToken(otherUser.rows[0]);

  // 4. Author ki post create karo
  const post = await pool.query(
    `INSERT INTO posts (user_id, title, content)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [
      author.rows[0].id,
      'Delete Test Post',
      'Testing author-only delete'
    ]
  );

  const postId = post.rows[0].id;

  // 5. Other user delete karne ki koshish kare
  const unauthorizedDelete = await request(app)
    .delete(`/api/posts/${postId}`)
    .set('Authorization', `Bearer ${otherUserToken}`);

  expect(unauthorizedDelete.statusCode).toBe(403);

  // 6. Author delete kare
  const authorizedDelete = await request(app)
    .delete(`/api/posts/${postId}`)
    .set('Authorization', `Bearer ${authorToken}`);

  expect(authorizedDelete.statusCode).toBe(200);
});
test('should invalidate posts cache after creating a post', async () => {

  // 1. Test user create karo
  const email = `cache-${Date.now()}@example.com`;

  const user = await pool.query(
    `INSERT INTO users (email, password_hash, name)
     VALUES ($1, $2, $3)
     RETURNING id, email`,
    [
      email,
      'dummy-password-hash',
      'Cache Test User'
    ]
  );

  // 2. Token generate karo
  const token = generateAccessToken(user.rows[0]);

  // 3. Pehle GET karo -> cache populate hoga
  const firstResponse = await request(app)
    .get('/api/posts?page=1&limit=10');

  expect(firstResponse.statusCode).toBe(200);

  // 4. Naya post create karo
  const createResponse = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Cache Test Post',
      content: 'Testing cache invalidation'
    });

  expect(createResponse.statusCode).toBe(201);

  // 5. Dobara GET karo
  const secondResponse = await request(app)
    .get('/api/posts?page=1&limit=10');

  expect(secondResponse.statusCode).toBe(200);

  // 6. New post stale cache mein missing nahi hona chahiye
  const newPost = secondResponse.body.posts.find(
    post => post.title === 'Cache Test Post'
  );

  expect(newPost).toBeDefined();
});
});