<p align="center">
    <a href="https://inkapi-nkj1.onrender.com/">

  <img src="logo.svg" alt="InkAPI logo" width="420" />
  </a>
</p>

<h3 align="center">Blog Backend with Redis Caching & Test Suite (2026)</h3>

<p align="center">
A production-oriented REST API for a blogging platform built with <b>Node.js, Express, PostgreSQL, Redis, JWT, Jest and Supertest</b>.
</p>

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="48" height="48" />
  &nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express" width="48" height="48" />
  &nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width="48" height="48" />
  &nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" alt="Redis" width="48" height="48" />
  &nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/jsonwebtokens/D63AFF" alt="JWT" width="48" height="48" />
  &nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" alt="Jest" width="48" height="48" />
  &nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" width="48" height="48" />
</p>

The project focuses on backend fundamentals that matter in real applications: authentication, authorization, relational data modeling, pagination, caching, cache invalidation, database constraints, rate limiting, and automated API testing.

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

<table align="center">
  <tr>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="52" height="52" alt="Node.js" /><br />
      <sub><b>Node.js</b></sub><br />
      <sub>Runtime</sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="52" height="52" alt="Express.js" /><br />
      <sub><b>Express.js</b></sub><br />
      <sub>REST framework</sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="52" height="52" alt="PostgreSQL" /><br />
      <sub><b>PostgreSQL</b></sub><br />
      <sub>Primary database</sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/neon/00E599" width="52" height="52" alt="Neon" /><br />
      <sub><b>Neon</b></sub><br />
      <sub>Hosted Postgres</sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" width="52" height="52" alt="Redis" /><br />
      <sub><b>Redis</b></sub><br />
      <sub>Caching</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/jsonwebtokens/D63AFF" width="52" height="52" alt="JWT" /><br />
      <sub><b>JWT</b></sub><br />
      <sub>Authentication</sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" width="52" height="52" alt="Jest" /><br />
      <sub><b>Jest</b></sub><br />
      <sub>Test runner</sub>
    </td>
    <td align="center" width="120">
      <img src="https://img.shields.io/badge/Supertest-333333?style=for-the-badge" height="26" alt="Supertest" /><br />
      <sub><b>Supertest</b></sub><br />
      <sub>HTTP testing</sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/dotenv/ECD53F" width="52" height="52" alt="dotenv" /><br />
      <sub><b>dotenv</b></sub><br />
      <sub>Env config</sub>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="52" height="52" alt="JavaScript" /><br />
      <sub><b>JavaScript</b></sub><br />
      <sub>Language</sub>
    </td>
  </tr>
</table>

**Libraries**

![ioredis](https://img.shields.io/badge/ioredis-DC382D?style=flat-square&logo=redis&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-004E89?style=flat-square&logo=letsencrypt&logoColor=white)
![Helmet](https://img.shields.io/badge/Helmet-000000?style=flat-square&logo=hackthebox&logoColor=white)
![express-rate-limit](https://img.shields.io/badge/express--rate--limit-000000?style=flat-square&logo=express&logoColor=white)

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
├── assets/
│   └── logo.svg
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

<p>
  <img src="https://cdn.simpleicons.org/github/181717" alt="GitHub" width="32" height="32" />
  &nbsp;→&nbsp;
  <img src="https://cdn.simpleicons.org/render/46E3B7" alt="Render" width="32" height="32" />
  &nbsp;→&nbsp;
  <img src="https://cdn.simpleicons.org/neon/00E599" alt="Neon" width="32" height="32" />
  &nbsp;+&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" alt="Redis" width="32" height="32" />
</p>

### 🌐 Live API

**Base URL:**  
https://inkapi-nkj1.onrender.com/

Example:

```http
GET https://inkapi-nkj1.onrender.com/api/posts?page=1&limit=10


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
