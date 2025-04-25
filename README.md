# 📝 Blog Application

A full-featured MERN stack Blog Application with Authentication, Blog Management, Commenting, Likes, Admin Panel, and more.

Live Demo:

- **Frontend**: [https://blog-client-lyart-alpha.vercel.app/](https://blog-client-lyart-alpha.vercel.app/)
- **Backend**: [https://blog-server-bg6g.onrender.com](https://blog-server-bg6g.onrender.com)

---

## 🚀 Features Breakdown

### 1. Authentication & User Management

- **User Registration**
  - Username: Minimum 3 characters.
  - Email: Validated via Joi (e.g., `.com`, `.net`, etc.).
  - Password: Minimum 8 characters with at least one letter and one number.
  - User ID: Auto-generated format (`USER001`, `USER002`, ...).

- **Login**
  - Validates credentials.
  - Returns JWT token on successful login.

- **Forgot Password Flow**
  1. Submit registered email (Joi validated).
  2. Generate 6-digit OTP.
     - Saved in DB.
     - Expires after 1 minute.
     - Retry limit & cooldown handled.
  3. OTP verification.
  4. Reset password (new and confirm passwords must match).
  5. Redirect to login → dashboard with new token.

---

### 2. Blog Management

- **Create Blog**
  - Title and Description: Required.
  - Category: Must match Admin-provided list.
  - Images: Two mandatory uploads.
  - Blog ID: Auto-generated (`BLOG001`, `BLOG002`, ...).

- **Update/Delete**
  - Edit title, description, category, and images.
  - Delete allowed only by blog owner or admin.

- **Category Validation**
  - Blog creation fails if the selected category doesn’t exist.

---

### 3. Blog Listing

- **Pagination**: 6 blogs per page.
- **Sorting**:
  - By Created Time (Default: Latest First).
  - Alphabetical (A-Z / Z-A).
- **Search**: Case-insensitive by title.
- **Filtering**: Based on blog category.

---

### 4. Comments & Likes

- **Comments**
  - Add/edit/delete own comments.
  - Blog owners can delete comments on their blog.

- **Likes**
  - Like/unlike functionality for blogs.

- **Permissions**
  - No extra middleware needed for comment ops.

---

### 5. Admin Panel

- **Authentication**
  - Admins login separately.

- **User Management**
  - List of all users (Username, Email, User ID).
  - Pagination (10 per page).
  - Search by name.

- **Category Management**
  - Create, Read, Update, Delete categories.

- **Blog/Comment Management**
  - Admin can delete any blog or comment.

---

### ⚙️ Extra Functionalities

- Auto-generated IDs for users/blogs are incremental and unique.
- OTP management handled via a DB model with expiry.
- All APIs protected via JWT middleware.
- Comprehensive error handling (validation, unauthorized access, etc.).

---

## 🛠 Installation & Setup

### 📁 Clone Repository (Frontend)

```sh
git clone https://github.com/elvinjoy/blog_client.git

npm install

npm run dev
```

### 📦 Clone Repository (Backend)

```sh
git clone https://github.com/elvinjoy/blog_Server.git

npm install

npm run dev
```

> Make sure you have a `.env` file with all required variables such as `MONGO_URI`, `JWT_SECRET`, and `EMAIL_CONFIG`.

---

## 📬 API Base URL

```
https://blog-server-bg6g.onrender.com
```

---

## 👨‍💻 Tech Stack

- **Frontend**: React, MUI, Axios
- **Backend**: Node.js, Express.js, MongoDB, JWT, Joi
- **Deployment**: Vercel (Frontend), Render (Backend)
