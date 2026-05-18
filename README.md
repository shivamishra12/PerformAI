<p align="center">
  <img src="https://img.shields.io/badge/PerformAI-Employee%20Analytics-6366f1?style=for-the-badge&logo=sparkles&logoColor=white" alt="PerformAI" />
  <img src="https://img.shields.io/badge/MERN-Stack-22c55e?style=for-the-badge&logo=mongodb&logoColor=white" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/OpenRouter-GPT%20Powered-8b5cf6?style=for-the-badge&logo=openai&logoColor=white" alt="OpenRouter AI" />
</p>

<h1 align="center">🚀 PerformAI</h1>
<h3 align="center">AI-Based Employee Performance Analytics & Recommendation System</h3>

<p align="center">
  A production-ready, full-stack <b>MERN application</b> that analyzes employee performance data and provides AI-powered recommendations for promotions, training, and skill development using OpenRouter (OpenAI-compatible) API.
</p>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [AI Integration](#-ai-integration)
- [UI Pages & Components](#-ui-pages--components)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Author](#-author)

---

## 🎯 Overview

**PerformAI** is an AI-powered employee performance analytics platform that allows HR/Admin users to:

- **Add and manage employee details** with department, skills, and performance scores
- **Track employee skills and performance metrics** through interactive dashboards
- **Generate AI-based recommendations** for promotions, training, and skill enhancement
- **View employee analytics and rankings** with interactive charts
- **Secure the application** using JWT authentication and bcrypt password hashing

---

## ✨ Key Features

### 📊 Dashboard
- Real-time statistics: total employees, reviewed, average performance score, pending reviews
- Performance Score Distribution bar chart and Skill Distribution pie chart
- Top Employees ranked by score and Recent Employees with status badges

### 👥 Employee Management
- Employee Registration Form with name, email, department, skills, experience, and performance score
- Searchable, filterable, sortable employee table with pagination
- Search by department: `GET /api/employees/search?department=Development`
- Status toggling: Pending / Reviewed / Interviewed / Rejected
- Full CRUD: Add, View, Update, Delete employees

### 🤖 AI-Powered Recommendations
- **Promotion Recommendation** — AI evaluates if employee is ready for next level
- **Employee Ranking** — AI ranks all employees by suitability with scores
- **Training Suggestions** — Identifies skill gaps and provides targeted training plans
- **AI Feedback Generation** — Writes detailed performance feedback per employee

### 📈 Analytics
- Skill Distribution horizontal bar chart
- Status Distribution donut chart
- Experience Distribution area chart
- Per-employee performance score comparison bar chart

### 🔐 Authentication & Security
- JWT-based auth with 7-day token expiry
- Admin registration and login with bcrypt password hashing (12 salt rounds)
- Protected routes — all API endpoints require valid token
- Auto-logout on token expiry

### 🎨 UI/UX Design
- Dark/Light Mode with persistent theme toggle
- Glassmorphism cards with backdrop blur
- Gradient accents and Framer Motion animations
- Mobile responsive with collapsible sidebar
- Toast notifications, loading skeletons, and empty states

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI library with hooks and functional components |
| **Vite 8** | Dev server and build tool |
| **Tailwind CSS v4** | Utility-first CSS framework |
| **Framer Motion** | Animations and page transitions |
| **Recharts** | Chart library (Bar, Pie, Area charts) |
| **React Router v7** | Client-side routing with protected routes |
| **Axios** | HTTP client with JWT interceptors |
| **React Hot Toast** | Toast notification system |
| **React Icons** | Icon set |
| **jsPDF + AutoTable** | Client-side PDF generation |

### Backend

| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework with middleware |
| **Mongoose 8** | MongoDB ODM with schema validation |
| **JWT (jsonwebtoken)** | Stateless authentication |
| **bcryptjs** | Password hashing (12 salt rounds) |
| **Axios** | HTTP client for OpenRouter API |
| **dotenv** | Environment variable management |
| **CORS** | Cross-origin resource sharing |
| **Nodemon** | Auto-restart dev server |

### Database & AI

| Technology | Purpose |
|-----------|---------|
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **OpenRouter API** | Unified gateway to GPT models |
| **GPT-4.1-nano** | AI model for employee analysis |

---

## 📁 Folder Structure

```text
performai/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable UI Components
│   │   │   ├── Sidebar.jsx          # Navigation sidebar with mobile drawer
│   │   │   ├── Navbar.jsx           # Top navbar with theme toggle
│   │   │   ├── StatCard.jsx         # Animated statistics card
│   │   │   ├── TagInput.jsx         # Tag-based skill input component
│   │   │   └── LoadingSkeleton.jsx  # Shimmer loading placeholders
│   │   ├── context/                 # React Context Providers
│   │   │   ├── AuthContext.jsx      # Authentication state & methods
│   │   │   └── ThemeContext.jsx     # Dark/light mode state
│   │   ├── pages/                   # Page Components (Routes)
│   │   │   ├── LoginPage.jsx        # Login/Register page
│   │   │   ├── DashboardPage.jsx    # Main dashboard with charts
│   │   │   ├── EmployeeListPage.jsx # Employee table with CRUD
│   │   │   ├── AddEmployeePage.jsx  # Add employee form
│   │   │   ├── AIReviewPage.jsx     # AI recommendation page
│   │   │   └── AnalyticsPage.jsx    # Analytics charts dashboard
│   │   ├── utils/
│   │   │   └── api.js               # Axios instance with JWT interceptor
│   │   ├── App.jsx                  # Root component with routing
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles & design system
│   ├── index.html                   # HTML entry with SEO meta tags
│   ├── vite.config.js               # Vite config with proxy
│   └── package.json                 # Client dependencies
│
├── server/                          # Express Backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection setup
│   ├── controllers/                 # Route Controllers
│   │   ├── authController.js        # Register, Login, GetProfile
│   │   ├── employeeController.js    # CRUD + Dashboard Stats
│   │   └── performanceController.js # AI Recommendation
│   ├── middleware/
│   │   └── auth.js                  # JWT verification & token generation
│   ├── models/                      # Mongoose Schemas
│   │   ├── User.js                  # Admin/HR model with bcrypt
│   │   └── Employee.js              # Employee profile model
│   ├── routes/                      # Express Routes
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── employeeRoutes.js        # Employee endpoints
│   │   └── performanceRoutes.js     # AI recommendation endpoints
│   ├── services/                    # Business Logic
│   │   └── aiService.js             # OpenRouter GPT integration
│   ├── index.js                     # Express app entry point
│   ├── seed.js                      # Database seeder
│   ├── package.json                 # Server dependencies
│   └── .env                         # Environment variables
│
└── README.md                        # Documentation
```

---

## 🗄 Database Schema

### User (Admin/HR)

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name (required, max 50) |
| `email` | String | Login email (required, unique) |
| `password` | String | Bcrypt hashed (required, min 6, hidden) |
| `company` | String | Company name (optional) |
| `role` | String | `admin` or `recruiter` |
| `createdAt` | Date | Auto-generated timestamp |

### Employee

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name (required) |
| `email` | String | Contact email (required) |
| `department` | String | Department name (required) |
| `skills` | [String] | Technical skills array (required, min 1) |
| `performanceScore` | Number | Performance score (0–100) |
| `experience` | Number | Years of experience (0–50) |
| `bio` | String | Background info (optional) |
| `aiRecommendation` | String | AI-generated recommendation |
| `status` | String | `pending` / `reviewed` / `rejected` / `interviewed` |
| `manager` | ObjectId | Reference to User who added this employee |
| `createdAt` | Date | Auto-generated timestamp |

---

## 📡 API Documentation

*All endpoints except authentication require an `Authorization: Bearer <token>` header.*

### Authentication

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | `{ name, email, password, company? }` | Register new admin |
| `POST` | `/api/auth/login` | `{ email, password }` | Login & receive JWT |
| `GET` | `/api/auth/me` | — | Get current user profile |

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/employees` | Add employee |
| `GET` | `/api/employees` | Get all employees |
| `GET` | `/api/employees/search?department=Development` | Search by department |
| `GET` | `/api/employees/:id` | Get single employee |
| `PUT` | `/api/employees/:id` | Update employee |
| `DELETE` | `/api/employees/:id` | Delete employee |
| `GET` | `/api/employees/stats/dashboard` | Dashboard analytics |

**Sample POST Body:**
```json
{
  "name": "Aman Verma",
  "email": "aman@gmail.com",
  "department": "Development",
  "skills": ["React", "Node.js", "MongoDB"],
  "performanceScore": 85,
  "experience": 3
}
```

### AI Recommendation

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/ai/recommend` | `{ requiredSkills[], preferredSkills[], minimumExperience, title?, description? }` | AI-powered recommendation |

---

## 🤖 AI Integration

### OpenRouter API

- **Endpoint:** `https://openrouter.ai/api/v1/chat/completions`
- **Model:** `openai/gpt-4.1-nano`

### AI Features

| Feature | Description |
|---------|-------------|
| Promotion Recommendation | AI evaluates if each employee is ready for promotion |
| Employee Ranking | AI ranks all employees by performance with scores |
| Training Suggestions | Identifies skill gaps and provides training plans |
| AI Feedback Generation | Writes detailed feedback on strengths and weaknesses |
| Overall Summary | Holistic assessment of the entire team |
| Top Performer | AI's recommended best employee with reasoning |

---

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works) or local MongoDB
- OpenRouter API Key (for AI features)

### 1. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Configure Environment

Edit `server/.env`:

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/performai
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=sk-or-v1-your_key_here
PORT=5000
```

### 3. Seed Database

```bash
cd server
npm run seed
```

Creates 1 admin user and 12 sample employees across departments.

### Demo Login Credentials

| Field | Value |
|-------|-------|
| **Email** | `admin@performai.com` |
| **Password** | `Admin@123` |

### 4. Start Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔐 Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing |
| `OPENROUTER_API_KEY` | ❌ | OpenRouter API key for AI features |
| `PORT` | ❌ | Server port (default: 5000) |

---

## 🧑‍💻 Author

**Shivam** — Full-Stack Developer

---

<p align="center">
  Built with ❤️ using React, Node.js, MongoDB, and AI
</p>
