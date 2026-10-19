const pool = require('../config/db');
const redis = require('../config/redis');

const createPost = async (req, res) => {
    try {
        const userId = req.user.id;

        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: 'Title and content are required'
            });
        }

        // Database query to insert post
        const result = await pool.query(
            `INSERT INTO posts (user_id, title, content)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userId, title, content]
        );
const keys = await redis.keys('posts:page:*');

if (keys.length > 0) {
  await redis.del(...keys);
}
        return res.status(201).json({
            message: 'Post created successfully',
            post: result.rows[0]
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong',
            error: error.message
        });
    }
};



const getPost = async (req, res) => {
  try {
    // 1. URL query params
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    // 2. Validate pagination
    if (
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        message: 'Invalid pagination parameters'
      });
    }

    // 3. Calculate offset
    const offset = (page - 1) * limit;

    // 4. Create Redis cache key
    const cacheKey = `posts:page:${page}:limit:${limit}`;

    // 5. Check Redis
    const cachedPosts = await redis.get(cacheKey);

    // 6. Cache HIT
    if (cachedPosts) {
      const data = JSON.parse(cachedPosts);

      res.set('X-Cache', 'HIT');

      return res.status(200).json(data);
    }

    // 7. Cache MISS → PostgreSQL
    const postsResult = await pool.query(
      `SELECT * 
       FROM posts 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    // 8. Get total posts
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM posts`
    );

    const totalPosts = Number(countResult.rows[0].count);

    const totalPages = Math.ceil(totalPosts / limit);

    // 9. Data that we want to cache
    const cacheData = {
      posts: postsResult.rows,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages
      }
    };

    // 10. Save data in Redis for 60 seconds
    await redis.set(
      cacheKey,
      JSON.stringify(cacheData),
      'EX',
      60
    );

    // 11. Tell client this was a cache MISS
    res.set('X-Cache', 'MISS');

    // 12. Send response
    return res.status(200).json(cacheData);

  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong',
      error: error.message
    });
  }
};
const getPostById = async (req, res) => {
try{
   // 1. URL se post ki ID nikal rahe hain
    const postId = req.params.id;
  // 2. Redis cache key
    const cacheKey = `post:${postId}`;

    // 3. Redis mein check kar rahe hain
    const cachedPost = await redis.get(cacheKey);

    // 4. Cache HIT
    if (cachedPost) {
      const data = JSON.parse(cachedPost);

      res.set('X-Cache', 'HIT');

      return res.status(200).json(data);
    }
     // 5. Cache MISS → PostgreSQL se post find kar rahe hain
    const postResult = await pool.query(
      `SELECT *
       FROM posts
       WHERE id = $1`,
      [postId]
    );

    // 6. Agar post exist nahi karti
    if (postResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }
    // 7. Is post ke saare comments nikal rahe hain
    const commentsResult = await pool.query(
      `SELECT *
       FROM comments
       WHERE post_id = $1`,
      [postId]
    );

    // 8. Post + comments ka response object
    const data = {
      post: postResult.rows[0],
      comments: commentsResult.rows
    };


    // 9. Response ko Redis mein 5 minutes ke liye save kar rahe hain
    await redis.set(
      cacheKey,
      JSON.stringify(data),
      'EX',
      300
    );

    // 10. Batana ki response cache MISS tha
    res.set('X-Cache', 'MISS');
    // 11. Client ko response
    return res.status(200).json(data);


  
}catch(error){
return res.status(500).json({
      message: 'Something went wrong',
      error: error.message
    });

}
};

const createComment = async (req, res) => {
  try {
    // URL se post ID
    const postId = req.params.id;

    // Auth middleware se logged-in user ki ID
    const userId = req.user.id;

    // Request body se comment content
    const { content } = req.body;

    // Content required hai
    if (!content) {
      return res.status(400).json({
        message: 'Comment content is required'
      });
    }

    // Check karna ki post exist karti hai
    const postResult = await pool.query(
      `SELECT id
       FROM posts
       WHERE id = $1`,
      [postId]
    );

    // Post nahi mili
    if (postResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    // Comment create karna
    const commentResult = await pool.query(
      `INSERT INTO comments (post_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [postId, userId, content]
    );

// Comment successfully create ho gaya
// Ab old cached post delete karo
await redis.del(`post:${postId}`);

    // Created comment return karna
    return res.status(201).json({
      message: 'Comment created successfully',
      comment: commentResult.rows[0]
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong',
      error: error.message
    });
  }
};

const likePost = async (req, res) => {
  try {
    // ! kya chachiye 1.url se postid and auth se user id
      const postId = req.params.id;
    const userId = req.user.id;

    // ! check post exist krta hai ya nhi
    const postResult = await pool.query(
      `SELECT id FROM posts WHERE id=$1`,[postId]
    );
    // !4. Post nahi mili
    if (postResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }
   //! 5. Like create karna
    // Database ka UNIQUE(post_id, user_id)
    // duplicate like ko prevent karega
    const likeResult = await pool.query(
      `INSERT INTO likes (post_id, user_id)
       VALUES ($1, $2)
       RETURNING *`,
      [postId, userId]
    );
    await redis.del(`post:${postId}`);
    // 6. Successfully liked
    return res.status(201).json({
      message: 'Post liked successfully',
      like: likeResult.rows[0]
    });

  } catch (error) {
     //! 7. Duplicate like
    if (error.code === '23505') {
      return res.status(409).json({
        message: 'You have already liked this post'
      });
    }

    //! 8. Unexpected server/database error
    return res.status(500).json({
      message: 'Something went wrong',
      error: error.message
    });
  }


};

const deletePost= async(req,res)=>{
  try{
   // !1. URL se post ki ID
   const postId=req.params.id;

       // !2. Auth middleware se logged-in user ki ID
const userId=req.user.id;
      // !3. Post find karna aur uska author_id lena
      const postResult=await pool.query(
`SELECT id,user_id FROM posts WHERE id=$1`,[postId]
      );
    //! 4. Agar post exist nahi karti
    if(postResult.rows.length===0){
      return res.status(404).json({
        message:'Post not found'
      });
    }
   // !5. Check karna ki logged-in user hi post ka author hai
  if (String(postResult.rows[0].user_id) !== String(userId)) {
  return res.status(403).json({
    message: 'You are not allowed to delete this post'
  });
}
    //! 6. Author verified hai, ab post delete kar sakte hain
await pool.query(
  `DELETE FROM posts
   WHERE id = $1 AND user_id = $2`,
  [postId, userId]
);


// Individual post cache
await redis.del(`post:${postId}`);

// Pagination caches
const keys = await redis.keys('posts:page:*');

if (keys.length > 0) {
  await redis.del(...keys);
}
    //! 7. Success response
    return res.status(200).json({
      message:'post deleted successfully'
    });

   }catch(error){//! 8. Unexpected error
return res.status(500).json({
message:'Something went wrong',
error:error.message
});

  }
};

module.exports={
  createPost,getPost,getPostById,createComment,likePost,deletePost
};