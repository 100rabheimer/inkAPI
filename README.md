# InkAPI

### Blog Backend with Redis Caching & Test Suite (2026)

A production-oriented REST API for a blogging platform built with **Node.js, Express, PostgreSQL, Redis, JWT, Jest and Supertest**.

The project focuses on backend fundamentals that matter in real applications: authentication, authorization, relational data modeling, pagination, caching, cache invalidation, database constraints, rate limiting, and automated API testing.

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-333333?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

</p>

---

## ✨ Highlights

- JWT access and refresh-token authentication
- Secure password hashing with bcrypt
- Protected routes and author-based authorization
- Blog posts, comments and likes
- Database-enforced unique likes
- Offset pagination with `page` and `limit`
- Redis cache-aside strategy
- Cache invalidation on data changes
- `X-Cache: HIT/MISS` response header
- Request validation and rate limiting
- PostgreSQL with foreign keys and cascading deletes
- Separate test database
- **15 automated API tests** with Jest + Supertest
- Ready for deployment with environment variables

---

## 🧰 Tech Stack

| Technology | Role |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| PostgreSQL | Primary relational database |
| Neon | Hosted PostgreSQL |
| Redis | Caching |
| ioredis | Redis client |
| JWT | Authentication |
| bcrypt | Password hashing |
| Jest | Test runner |
| Supertest | HTTP/API testing |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |
| dotenv | Environment configuration |

---

## 🏛️ Architecture

```text
                         Client
                           │
                           ▼
                    ┌─────────────┐
                    │   Express   │
                    │     API     │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
         Middleware      Routes     Controllers
              │                         │
      ┌───────┼────────┐                │
      │       │        │                │
     JWT   Validation  Rate             ▼
     Auth              Limit       Business Logic
                                      │
                              ┌───────┴───────┐
                              │               │
                              ▼               ▼
                           Redis         PostgreSQL
                           Cache           Database
```

---

## 📁 Project Structure

```text
inkAPI/
│
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── index.js
│   │   └── redis.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── post.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validate.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── post.routes.js
│   │
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── post.test.js
│   │
│   ├── utils/
│   │   ├── password.js
│   │   └── tokens.js
│   │
│   ├── app.js
│   ├── server.js
│   ├── check-cache.js
│   └── clear-cache.js
│
├── tests/
│   └── setup.js
│
├── .env.example
├── .gitignore
├── jest.config.js
├── package.json
├── package-lock.json
└── README.md
```

### Directory responsibilities

- `config/` — PostgreSQL and Redis configuration
- `controllers/` — request handling and application logic
- `middleware/` — authentication, validation, rate limiting and errors
- `routes/` — API route definitions
- `utils/` — reusable password and token helpers
- `src/tests/` — automated API tests
- `tests/` — Jest environment setup
- `app.js` — Express application configuration
- `server.js` — application entry point

---

# 🔐 Authentication

InkAPI uses JWT-based authentication.

Protected requests use:

```http
Authorization: Bearer <access_token>
```

Authentication includes:

- User signup
- Login
- Access tokens
- Refresh tokens
- Refresh-token rotation
- Logout / token revocation
- Protected endpoints
- Author-based authorization
- bcrypt password hashing

---

# 📝 Blog API

## Posts

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/posts` | Create a post | Required |
| `GET` | `/api/posts?page=1&limit=10` | Get paginated posts | Public |
| `GET` | `/api/posts/:id` | Get post with comments | Public |
| `DELETE` | `/api/posts/:id` | Delete a post | Author only |

## Comments

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/posts/:id/comments` | Add a comment | Required |

## Likes

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/posts/:id/like` | Like a post | Required |

A user can like a post only once. PostgreSQL enforces this with a composite primary key:

```sql
PRIMARY KEY (user_id, post_id)
```

A duplicate like returns:

```http
409 Conflict
```

---

# 📄 Pagination

The post listing endpoint uses **offset pagination**:

```http
GET /api/posts?page=1&limit=10
```

Example:

```text
page=1  → first page
limit=10 → 10 posts
```

Posts are returned newest first using `created_at`.

---

# ⚡ Redis Caching

InkAPI implements the **cache-aside pattern** for frequently requested post data.

### Read flow

```text
GET /api/posts
       │
       ▼
   Check Redis
       │
   ┌───┴────┐
   │        │
  HIT      MISS
   │        │
   ▼        ▼
Return   PostgreSQL
cache       │
            ▼
       Store in Redis
            │
            ▼
         Response
```

### Cache keys

```text
posts:page:{page}:limit:{limit}
post:{postId}
```

### TTL

```text
Post list:    60 seconds
Post detail:  300 seconds
```

### Cache invalidation

Relevant cached data is invalidated after mutations such as:

- Creating a post
- Adding a comment
- Adding a like
- Deleting a post

The API exposes:

```http
X-Cache: HIT
```

or:

```http
X-Cache: MISS
```

so cache behavior can be observed directly.

---

# 📊 Performance

Local development measurements using Postman:

| Endpoint | Cache MISS | Cache HIT |
|---|---:|---:|
| Post list | 671 ms | 36 ms |
| Post detail | 3.71 s | 40 ms |

Approximate reduction:

- Post list: **~95%**
- Post detail: **~99%**

> These are local development measurements and can vary depending on database, Redis, network and machine conditions.

---

# 🗄️ Database Design

The application uses PostgreSQL with relational constraints.

```text
users
  │
  ├────────────── posts
  │                 │
  │                 └──────── comments
  │
  └────────────── likes
```

### Important constraints

- UUID primary keys
- Foreign keys
- `NOT NULL` constraints
- Unique user emails
- Composite primary key for likes
- `ON DELETE CASCADE` for comments and likes
- Author ownership checks at the application layer

This combination keeps data integrity enforced by both the application and the database.

---

# 🧪 Testing

InkAPI includes **15 automated tests** using Jest and Supertest.

### Test areas

**Authentication**

- Signup
- Duplicate email
- Input validation
- Login
- Invalid password
- Protected `/me`
- Invalid access token
- Refresh token
- Logout

**Blog API**

- Create post with valid token
- Reject post creation without token
- Pagination page size and ordering
- Duplicate like prevention
- Author-only deletion
- Cache invalidation after post creation

### Run tests

```bash
npm test
```

Run only post tests:

```bash
npm test -- src/tests/post.test.js
```

Tests use a **separate test database** so automated tests do not operate on development data.

---

# 🔒 Security

The API includes several security practices:

- bcrypt password hashing
- JWT authentication
- Refresh-token management
- Protected routes
- Author-only resource deletion
- Helmet security headers
- CORS configuration
- Rate limiting
- Environment-based secrets
- Database constraints
- Separate test database

---

# ⚙️ Environment Variables

Create a local `.env` file:

```env
PORT=5000

DATABASE_URL=your_postgresql_connection_string

REDIS_URL=your_redis_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret

REFRESH_TOKEN_SECRET=your_refresh_token_secret

CLIENT_URL=http://localhost:3000
```

Testing uses a separate `.env.test`.

> Never commit `.env` or `.env.test` to Git.

---

# 🚀 Getting Started

## 1. Clone

```bash
git clone https://github.com/100rabheimer/inkAPI.git
cd inkAPI
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment

Create `.env` using `.env.example` as a reference.

Configure:

- PostgreSQL / Neon
- Redis
- JWT secrets
- Client URL

## 4. Start the server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

The API runs on the configured `PORT`.

---

# ☁️ Deployment

The API can be deployed on Render.

Required production environment variables:

```text
DATABASE_URL
REDIS_URL
ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET
CLIENT_URL
```

Production architecture:

```text
                    GitHub
                       │
                       ▼
                    Render
                   /      \
                  /        \
                 ▼          ▼
             PostgreSQL    Redis
               Neon
```

After deployment, cache behavior can be verified by calling the same GET endpoint twice and checking:

```http
X-Cache: MISS
```

followed by:

```http
X-Cache: HIT
```

---

# 🧠 Engineering Decisions

### Why Redis?

Frequently requested blog data can be served from memory instead of querying PostgreSQL on every request.

### Why cache-aside?

It keeps PostgreSQL as the source of truth while allowing frequently accessed data to be cached independently.

### Why database constraints?

Application checks alone are not enough for data integrity. PostgreSQL constraints provide a final layer of protection.

### Why automated tests?

Tests provide regression protection when authentication, caching, authorization or database logic changes.

---

# 🔮 Future Improvements

- Cursor-based pagination for large datasets
- Post editing
- Comment editing/deletion
- Full-text search
- Swagger/OpenAPI documentation
- Docker
- GitHub Actions CI/CD
- Production monitoring
- Structured logging
- More granular Redis invalidation

---

# 📌 Highlights

> **Engineered a blog platform API with Redis cache-aside caching, reducing list-endpoint latency from 671ms to 36ms (~95%) and detail-endpoint latency from 3.71s to 40ms (~99%); implemented offset pagination, DB-enforced constraints, and a 15-test Jest/Supertest suite.**

---

## 👨‍💻 Project

**InkAPI — Blog Backend with Redis Caching & Test Suite (2026)**

Built to demonstrate practical backend engineering across API design, authentication, PostgreSQL, Redis caching, security, testing and deployment.
