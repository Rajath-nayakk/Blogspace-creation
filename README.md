# Blogspace-creation

# BLOGSPACE — Full-Stack MERN Blogging Platform

> **Ideas Worth Sharing. Stories Worth Reading.**  
> A production-quality, modern editorial blogging platform built with the MERN stack (MongoDB, Express, React, Node.js), Tailwind CSS, and Markdown.

---

## 🌟 Key Features

### 📖 Editorial Reading Experience
- **Modern Editorial Aesthetic:** Inspired by Medium, Hashnode, and Dev.to with clean typography, generous whitespace, warm neutrals, and charcoal text.
- **Full Markdown Engine:** Support for syntax-highlighted code blocks, blockquotes, tables, links, and embedded images via `react-markdown` and `remark-gfm`.
- **Dynamic Reading Time & Social Metrics:** Auto-computed read times, view counts, dynamic heart likes, and real-time response counters.
- **Social Sharing & Link Copy:** Built-in sharing to Twitter/X, LinkedIn, WhatsApp, and one-click clipboard copy with animated toasts.

### ✍️ Publishing Studio
- **Dual-Mode Writing Environment:** Seamless toggle between live **Write** mode and formatted **Preview** mode.
- **Formatting Toolbar:** One-click shortcuts for Bold, Italic, H2, H3, Blockquotes, Code blocks, and Lists.
- **Flexible Image Handling:** Support for direct image uploads (saved locally in `/uploads` or Cloudinary) or direct image URLs.
- **Draft & Publish Workflows:** Save unpublished drafts or instantly publish articles to the global feed.
- **Categorization & Tagging:** Organized across 8 core categories with tag pills.

### 💬 Interactive Commenting & Moderation
- **Real-Time Dynamic Comments:** Add, edit, and delete comments without full page refreshes.
- **Author Moderation:** Blog authors can delete/moderate any comment on their articles, while commenters can edit or delete their own responses.
- **Empty States & Timestamps:** Relative "time ago" formatting and empty-state graphics.

### 📊 Author Console & Dashboard
- **Analytics Overview:** Real-time statistics tracking total published articles, drafts in progress, total likes received, and total comments across all posts.
- **Story Management:** Quick actions to view live articles, edit content, delete posts with confirmation, or publish drafts with 1-click.

### 👤 User Profiles & Authentication
- **Secure Authentication:** JWT-based stateless authentication with password hashing via `bcrypt.js`.
- **Registration Protection:** Form validation with duplicate email and username checks.
- **Profile Customization:** Customizable avatars (file upload or image URL), bio, and showcase of published works.
- **Quick Demo Sign-In:** One-click demo credentials for instant evaluation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18 / 19, Vite, Tailwind CSS, React Router DOM v6, Axios, Lucide React, React Hot Toast, React Markdown, remark-gfm |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (JWT), bcrypt.js |
| **Security & Utilities** | Helmet (HTTP headers), Express Rate Limit, Multer (file uploads), Cloudinary SDK (optional cloud storage), Slugify |

---

## 📂 Project Structure

```
Blogspace/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── cloudinary.js         # Optional Cloudinary integration
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Me, Logout
│   │   ├── userController.js     # Profiles, Authors, User posts
│   │   ├── blogController.js     # CRUD, Likes, Dashboard stats, Feeds
│   │   └── commentController.js  # Add, Edit, Delete, Moderation
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & optional auth
│   │   ├── errorMiddleware.js    # 404 & Centralized error handler
│   │   └── uploadMiddleware.js   # Multer local/Cloudinary storage
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt hooks
│   │   ├── Blog.js               # Blog schema with auto-slug & readTime
│   │   └── Comment.js            # Comment schema with references
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── blogRoutes.js
│   │   └── commentRoutes.js
│   ├── seed/
│   │   ├── seedData.js           # 8 sample blogs, 4 users, comments
│   │   └── seeder.js             # Automated DB seed script
│   ├── uploads/                  # Local media storage directory
│   ├── server.js                 # Express application entrypoint
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, BlogCard, CommentSection...
│   │   ├── context/              # AuthContext (state & token management)
│   │   ├── hooks/                # useAuth
│   │   ├── layouts/              # MainLayout
│   │   ├── pages/                # Home, Explore, Detail, Create, Edit, Dashboard, Profile...
│   │   ├── services/             # Axios API services
│   │   ├── utils/                # Date formatting & read time calculations
│   │   ├── App.jsx               # Routes and toaster configuration
│   │   ├── index.css             # Tailwind & editorial prose styling
│   │   └── main.jsx
│   ├── public/                   # Static assets & favicon
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── test-e2e-journey.js           # Automated 14-step E2E verification script
├── package.json                  # Root orchestration
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) running locally on port `27017` or a MongoDB Atlas connection string.

---

### 2. Backend Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Default `.env` settings:*
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/blogspace
   JWT_SECRET=supersecretjwtkey_blogspace_prod_2025_secure_key
   JWT_EXPIRES_IN=30d
   CLIENT_URL=http://localhost:5173

   # Optional Cloudinary (Local uploads work out-of-the-box if left blank)
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```
4. Seed sample data (8 realistic articles across all 8 categories, 4 authors, and comments):
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:5000`.*

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend runs on `http://localhost:5173`.*

---

## 🧪 Automated Testing & Verification

Run the end-to-end verification script from the root directory:
```bash
npm run test:e2e
```

This verifies the complete 14-step user journey against the live database:
1. Health check & public blog retrieval
2. User registration (Alice)
3. User login & JWT issuance
4. Article creation with Markdown content
5. Image assignment
6. Article publishing
7. Search & category feed indexing
8. Second user registration (Bob)
9. Bob opening Alice's post & liking it
10. Bob submitting a comment
11. Alice viewing the response
12. Bob editing his comment
13. Alice updating article metadata
14. Logout and persistent re-login

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Create a new account
- `POST /api/auth/login` — Login with email/username and password
- `GET /api/auth/me` — Get current authenticated user profile (`Bearer <token>`)
- `POST /api/auth/logout` — Logout user

### Articles (Blogs)
- `GET /api/blogs` — Query published blogs with pagination, search, category filter, and sorting (`latest`, `popular`, `oldest`)
- `GET /api/blogs/trending` — Top 6 trending articles based on views and likes
- `GET /api/blogs/featured` — Curated featured articles for hero showcase
- `GET /api/blogs/my-posts` — Authenticated user's articles (`status=published` or `status=draft`)
- `GET /api/blogs/stats/dashboard` — Authenticated user's statistics
- `GET /api/blogs/:slug` — Retrieve single article by slug or ID with view counter & related articles
- `POST /api/blogs` — Create and publish article or save as draft (supports multipart file or JSON)
- `PUT /api/blogs/:id` — Update article (owner only)
- `DELETE /api/blogs/:id` — Delete article and all attached comments (owner only)
- `POST /api/blogs/:id/like` — Toggle like/unlike on an article

### Comments
- `GET /api/comments/:blogId` — Get all responses for an article
- `POST /api/comments/:blogId` — Post a response (`Bearer <token>`)
- `PUT /api/comments/:id` — Edit comment (comment author only)
- `DELETE /api/comments/:id` — Delete comment (comment author OR blog owner)

### Users
- `GET /api/users/popular-authors` — Authors with top published stories
- `GET /api/users/:id` — Public author profile and stats
- `PUT /api/users/profile` — Update name, bio, and avatar (`Bearer <token>`)
- `GET /api/users/:id/posts` — Get all published articles by author

---

## 🚢 Deployment Instructions

### Frontend (Vercel)
1. Push this repository to GitHub.
2. In Vercel, click **Add New Project** and select the repository.
3. Set **Root Directory** to `frontend`.
4. Framework Preset: **Vite**.
5. Add the environment variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://blogspace-api.onrender.com/api`).
6. Click **Deploy**.

### Backend (Render / Railway)
1. In Render or Railway, create a new **Web Service**.
2. Connect your GitHub repository and set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `node server.js`.
5. Configure Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB Atlas connection URI (`mongodb+srv://...`).
   - `JWT_SECRET`: A strong random string.
   - `CLIENT_URL`: Your Vercel frontend URL (e.g. `https://blogspace.vercel.app`).
   - *(Optional)* Cloudinary credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
6. Deploy the service.

### Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere).
3. Under **Database Access**, create a user and password.
4. Copy the connection string into the backend `MONGO_URI`.
5. Run `npm run seed` once to populate initial articles.

---

## 📄 License
This project is licensed under the MIT License.

