# 🐝 FeedHive - Full Stack Feedback Collection & Analysis System

FeedHive is a full-stack web application for collecting, analyzing, and managing user feedback. It enables both **authenticated** and **anonymous** feedback submission, provides an **admin dashboard**, and includes **sentiment analysis** to help organizations understand user sentiment and engagement.

---

## 🧰 Tech Stack

- **Backend:** FastAPI (Python)
- **Frontend:** React (Vite, JavaScript)
- **Database:** Supabase PostgreSQL *(previously MySQL, migrated for free cloud hosting)*
- **Authentication:** JWT with OAuth2PasswordBearer
- **ORM:** SQLAlchemy
- **Password Hashing:** passlib (bcrypt)
- **Sentiment Analysis:** TextBlob

---

## 🚀 Deployment Stack

- **Backend:** [Render.com](https://render.com) *(free tier)*
- **Frontend:** [Vercel](https://vercel.com) *(free tier)*
- **Database:** [Supabase PostgreSQL](https://supabase.com)

---

## 💡 Why These Technologies?

| Tech | Reason |
|------|--------|
| **FastAPI** | Modern, fast, async framework with automatic OpenAPI docs and JWT integration |
| **React + Vite** | Modern frontend stack with blazing fast development experience |
| **Supabase** | Free, scalable PostgreSQL hosting with great dev tools |
| **Render & Vercel** | Free cloud deployment with automatic CI/CD |
| **TextBlob** | Lightweight and simple sentiment analysis for English |

---

## ✨ Features Implemented

### 🔐 Authentication

- **User Registration & Login**
  - Register with email & password
  - Passwords hashed with `bcrypt`
  - JWT tokens for secure authentication
- **Admin Login**
  - Fixed credentials:  
    - **Email:** `feedhive@analysis.com`  
    - **Password:** `rahulfeedhive@1234`
  - Admin has separate login flow and no registration option

---

### 📝 Feedback System

- Submit feedback (title + content)
- Support for **authenticated** and **anonymous** submissions
- **Sentiment Analysis** via TextBlob (positive/negative/neutral)

---

### 📊 Admin Dashboard

- View all users and feedback entries
- Filtered sentiment info
- Stats overview:
  - Total users
  - Total feedback
  - Authenticated vs Anonymous feedback
- Tabs for users and feedback
- Logout functionality

---

### 💅 Frontend UX

- Dark theme using **pure CSS**
- Responsive & mobile-friendly
- Conditional navigation links for users/admin
- Error handling and success redirects

---

## 🔒 Security

- JWT Authentication for protected endpoints
- Passwords hashed with bcrypt
- Admin credentials fixed and separated from user accounts
- CORS & HTTPS enforced

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/register` | POST | Register a new user |
| `/api/login` | POST | Login user |
| `/api/admin/login` | POST | Login admin |
| `/api/feedback` | POST | Submit feedback *(authenticated)* |
| `/api/feedback/anonymous` | POST | Submit feedback *(anonymous)* |
| `/api/feedback` | GET | Get all feedback *(admin only)* |
| `/api/users` | GET | Get all users *(admin only)* |
| `/api/me` | GET | Get current user details |
| `/api/health`, `/api/test`, `/api/cors-test` | GET | Health check and CORS test |

---

## 🧱 Frontend Structure

### 🔧 Components

- `Navbar`, `Footer`
- `Home`, `LoginForm`, `RegisterForm`
- `FeedbackForm`, `AdminLoginForm`, `AdminDashboard`
- `Loading` component for better UX

### 🔌 Services

- `auth.js` → token handling, login/logout
- `api.js` → fetch wrapper for backend

### 🚦 Routing

- React Router v6
- Protected routes for feedback form and admin dashboard

### 🎨 Styling

- Pure CSS
- Fully responsive
- Dark theme

---

## 🧪 Local Setup

### 1️⃣ Clone the Repo
```bash
git clone https://github.com/yourname/feedhive.git
cd feedhive
```

### 2️⃣ Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

Create `.env` with:
```
DATABASE_URL=your_supabase_db_url
SECRET_KEY=your_secret_key
```

Start server:
```bash
uvicorn app.main:app --reload
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` with:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

Start client:
```bash
npm run dev
```

### 4️⃣ Database Setup
- Use Supabase dashboard or local PostgreSQL
- Create tables based on `models.py` and `schemas.py`

---

## 🌍 Deployment Guide

- Push both frontend & backend to GitHub
- **Backend:** Deploy via [Render.com](https://render.com)
- **Frontend:** Deploy via [Vercel](https://vercel.com)
- Set environment variables in respective dashboards

---

## 🔮 Future Enhancements

- **Analytics Dashboard**
  - Sentiment summary (count & %)
  - Feedback trend charts (by date)
  - Top contributors
  - CSV export

- **Advanced Features**
  - Charts with `Chart.js` or `Recharts`
  - Feedback search/filter
  - User profile & feedback history
  - Email notifications to admin
  - Multi-admin support
  - Internationalization (multi-language)

---

## 🙋 Contact & Credits

Developed with 💙 by **Rahul Kumar Parida**

**Try My WebApp feed hive** :   https://feed-hive-2025.vercel.app/


---

> Thank you for using **FeedHive**! Your feedback makes us better.