# AI-Based Employee Performance Analytics & Recommendation System
**Course:** AI Driven Full Stack Development (AI308B)
**Semester:** B.Tech, 4th SEMESTER 
**Type:** ESE EXAMINATION AI (BLENDED), EVEN SEM. - 2025-26

---

## 1. Introduction
This document details the development of a full-stack MERN application named **PerformAI**, which analyzes employee performance data and provides AI-powered recommendations using OpenRouter (OpenAI-compatible) API. The system allows HR/Admin users to add employee details, track skills and performance metrics, view analytics, and generate AI-based recommendations for promotions and training.

---

## 2. Frontend Implementation (React)
The frontend is built using React, Vite, and Tailwind CSS. It features:
- **Employee Registration Form**: A dynamic form capturing Name, Email, Department, Skills, Experience, and Performance Score. State is managed via `useState`.
- **Employee List Page**: Displays all employees in a structured table. Data is fetched from the Express API using `useEffect` and Axios.
- **Search & Filter Section**: Allows users to filter employees dynamically by Department or Name.
- **AI Recommendation Display Page**: Submits employee profiles to the AI endpoint and displays promotion suggestions, training plans, and specific feedback.

*(Insert Screenshots of the Frontend UI here)*

---

## 3. Backend Implementation (Node.js & Express)
The backend is an Express application structured with Controllers, Routes, and Middleware.

### API Endpoints
- **POST `/api/employees`**: Adds a new employee.
- **GET `/api/employees`**: Fetches all employees.
- **GET `/api/employees/search?department=Development`**: Filters employees by department.
- **POST `/api/ai/recommend`**: Sends candidate data to OpenRouter to fetch AI analysis.

*(Insert Postman/Thunder Client Screenshots testing these endpoints here)*

---

## 4. Database Implementation (MongoDB)
MongoDB Atlas is used for data persistence. Mongoose schemas are heavily validated.

### Employee Schema
- `name` (String, required)
- `email` (String, required, validated)
- `department` (String, required)
- `skills` (Array of Strings, required)
- `performanceScore` (Number, 0-100)
- `experience` (Number)

### Test Cases Validation
- **Insert valid employee**: Employee stored successfully.
- **Duplicate email**: Returns HTTP 400 with "Email already exists".
- **Missing performance score**: Handled gracefully using Mongoose schema validation.

*(Insert Screenshots of MongoDB Compass / Atlas Data Storage here)*

---

## 5. MERN Integration
The frontend seamlessly integrates with the backend APIs via a central `api.js` Axios utility, intercepting and attaching JWT tokens. Actions on the frontend (like adding a user or clicking "Generate AI Review") immediately reflect backend database updates.

---

## 6. AI Integration
The application integrates with the **OpenRouter API** (`openai/gpt-4.1-nano` model). 

**AI Features Implemented:**
- **Promotion Recommendation**: Evaluates the `performanceScore` and `experience` to suggest readiness for the next level.
- **Employee Ranking**: AI ranks multiple employees against performance goals.
- **Training Suggestions**: Identifies skill gaps and provides targeted training goals.
- **AI Feedback Generation**: Writes detailed, holistic reviews.

*(Insert Screenshots of the AI Review UI and Postman output of `/api/ai/recommend` here)*

---

## 7. Authentication & Security
- **JWT Authentication**: Tokens are generated on successful login.
- **Password Hashing**: Implemented using `bcryptjs` (12 salt rounds).
- **Protected Routes**: Express middleware validates Bearer tokens before granting access to `/api/employees`.

---

## 8. Deployment Details
The application has been configured for deployment on Render.

- **Live Frontend URL**: *(Add your Render frontend link here)*
- **Backend API URL**: *(Add your Render backend link here)*
- **GitHub Repository**: *(Add your GitHub repo link here)*

*(Insert Screenshot of successful Render Deployment here)*

---

## 9. Code Quality & Folder Structure
```text
project/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI elements
│   │   ├── pages/          # Full page views
│   │   └── context/        # Context API (Auth, Theme)
├── server/                 # Node.js Backend
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   └── services/           # AI and Matching logic
```
Code utilizes modern ES6 syntax, clear naming conventions, and is extensively documented with inline comments.
