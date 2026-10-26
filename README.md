# 🌸 MindBloom — Mood Tracker & Wellness Journal

> A calming, modern, full-stack MERN application for mindful emotional reflection, daily habit tracking, and personal wellness analytics.

[![Stack](https://img.shields.io/badge/Stack-MERN-10b981.svg)](https://react.dev/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47a248.svg)](https://www.mongodb.com/atlas)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20Tailwind-38bdf8.svg)](https://vitejs.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-68a063.svg)](https://expressjs.com/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel%20Serverless-000000.svg)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture & Design System](#-architecture--design-system)
- [Folder Structure](#-folder-structure)
- [Prerequisites](#-prerequisites)
- [Step-by-Step Local Setup](#-step-by-step-local-setup)
- [Configuring MongoDB Atlas](#-configuring-mongodb-atlas)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Demo Seed Data](#-demo-seed-data)
- [API Documentation](#-api-documentation)
- [Vercel Deployment Guide](#-vercel-deployment-guide)
- [Security Architecture](#-security-architecture)
- [Troubleshooting](#-troubleshooting)
- [UI Screenshots & Previews](#-ui-screenshots--previews)
- [Future Enhancements](#-future-enhancements)
- [License & Wellness Disclaimer](#-license--wellness-disclaimer)

---

## 🌿 Overview

**MindBloom** is a personal wellness sanctuary designed to help individuals build self-awareness through gentle, daily emotional check-ins, private gratitude journaling, habit monitoring, and transparent, rule-based wellness reflections.

Built with a calming pastel aesthetic (soft sage, lavender, cream, and clean white), MindBloom provides users with a distraction-free space to understand emotional rhythms over time without diagnostic labels or pressure.

---

## ✨ Key Features

### 1. 🌈 Daily Mood Check-In
- **5-Point Mood Scale**: Very Sad (1), Sad (2), Neutral (3), Happy (4), Very Happy (5) with intuitive emoji feedback.
- **Nuanced Emotion Tags**: Select from feelings like *Calm, Grateful, Excited, Stressed, Anxious, Tired, Motivated, Peaceful, Inspired*, and more.
- **Contributing Factors**: Identify life areas impacting your day: *Sleep, Work, Studies, Relationships, Exercise, Health, Family, Finances, Weather, Nutrition*.
- **Daily Uniqueness Protection**: MongoDB compound unique index prevents accidental duplicate check-ins for the same day, while allowing seamless updates to existing records.
- **Future Date Guard**: Restricts date selection to current or past days.

### 2. 📖 Private Wellness Journal
- **Full CRUD Operations**: Create, read, search, filter, edit, and delete private reflections.
- **Guided Reflection Prompts**: Choose from mindful prompt inspirations (*"What made you smile today?", "What are three things you feel grateful for?"*) with one-click insertion.
- **Gratitude Bullets & Positive Moments**: Built-in bullet points to capture small wins and cultivate positive psychology.
- **Categorization Tags**: Tag entries by *Personal, College, Work, Health, Gratitude, Mindfulness, Goals*, etc.
- **Safe Content Handling**: Sanitized text editor with live word count.

### 3. 💧 Daily Wellness Habit Tracker
- **Core Tracked Metrics**:
  - 💤 Sleep duration (hours, decimal precision)
  - 💧 Water intake (glasses counter)
  - 🏃 Physical movement (exercise minutes)
  - 🧘 Mindfulness / Meditation (minutes)
- **Configurable Goals**: Customize personal daily targets in User Settings.
- **Visual Progress Rings & Bars**: Instant visual percentage of daily goal achievement.
- **Custom Daily Intentions**: Checkbox goals (e.g., *"10-minute evening walk"*, *"Screen curfew"*).
- **Historical Table**: Review recent habit consistency over time.

### 4. 📊 Dashboard & MongoDB Analytics (Recharts)
- **Real Database Data**: All charts, averages, and statistics are computed live from user records.
- **Visualizations**:
  - 📈 **Mood Flow Trajectory**: Smooth Area chart tracking emotional scores over 7d, 30d, or 90d.
  - 📊 **Weekday Averages**: Bar chart showing average mood score grouped by day of week (Mon–Sun).
  - 🍩 **Mood Distribution**: Donut/Pie chart highlighting proportions of recorded moods.
  - 💧 **Habit Compliance**: Multi-bar chart comparing daily sleep and hydration over time.
- **Streak Calculation**: Continuous streak counter calculating consecutive days of check-ins.
- **Local Rule-Based Reflections**: Private, rule-based wellness tips (e.g. noticing sleep patterns, suggesting mindfulness during high-stress periods) without paid external AI APIs.

### 5. 🗓️ Interactive Mood Calendar
- Monthly calendar grid displaying mood emojis and category color tints for each date.
- Month-by-month navigation (previous / next / current month).
- **Date Detail Modal**: Click any date to view logged mood, emotions, notes, and direct links to read that day's journal entry.
- Legend explaining all 5 emotional categories.

### 6. 🔐 Complete Authentication & Privacy
- User registration with password confirmation and duplicate email detection.
- Login with JWT authentication (supports both **HttpOnly SameSite cookies** and **Bearer token header**).
- Password hashing with **bcryptjs** (salt rounds = 10).
- Password change functionality with current password verification.
- User profile name editing and JSON data backup export.
- Rate-limiting protection on authentication endpoints.
- Strict database isolation: users can only ever access, query, or mutate their own records.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) with [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) (Custom pastel green, lavender, cream palette)
- **Routing**: [React Router DOM 7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts 2](https://recharts.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **State Management**: React Context API (`AuthContext`, `ThemeContext`)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Server Framework**: [Express 4](https://expressjs.com/)
- **Database ODM**: [Mongoose 8](https://mongoosejs.com/)
- **Authentication**: [JSON Web Tokens (jsonwebtoken)](https://jwt.io/) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Security Middleware**: [Helmet](https://helmetjs.github.io/), [CORS](https://github.com/expressjs/cors), [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit), [cookie-parser](https://github.com/expressjs/cookie-parser)
- **Logging**: [Morgan](https://github.com/expressjs/morgan)

### Database & Deployment
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (Cloud M0 Free Tier or local MongoDB)
- **Hosting & Serverless**: [Vercel](https://vercel.com/) (Express serverless function via `api/index.js` + React static build via `/client/dist`)

---

## 🏗 Architecture & Design System

### Architectural Flow
```
[ Browser / Mobile Client ]
         │
         ▼  (HTTP / JSON / Cookies / Bearer)
┌─────────────────────────────────────────────────────────────┐
│                      Vercel / Express                       │
│  ┌───────────────────────┐       ┌───────────────────────┐  │
│  │   Vite React Client   │       │   Express REST API    │  │
│  │   (Tailwind, Recharts)│       │   (Middleware, Auth)  │  │
│  └───────────────────────┘       └───────────┬───────────┘  │
└──────────────────────────────────────────────┼──────────────┘
                                               ▼
                                  ┌─────────────────────────┐
                                  │   MongoDB Atlas Cloud   │
                                  │   (Users, Moods,        │
                                  │    Journals, Habits)    │
                                  └─────────────────────────┘
```

### Color Palette Tokens
| Token | Hex Value | Usage |
|---|---|---|
| `bloom-500` | `#22c55e` | Primary brand green, positive check-in accents |
| `bloom-600` | `#16a34a` | Primary CTA buttons, active navigation indicator |
| `lavender-500` | `#a855f7` | Reflection prompts, self-care tags, secondary highlights |
| `cream-50` / `100` | `#fefdfa` / `#fdfbf7` | Soft calming light-mode canvas background |
| `slate-950` / `900` | `#020617` / `#0f172a` | Deep serene dark-mode canvas and glass cards |

---

## 📁 Folder Structure

```
Fsd_Mood Tracker/
├── .env.example              # Sample configuration template
├── .gitignore                # Git ignore rules for node_modules, build & env
├── package.json              # Monorepo scripts (dev, build, start, seed)
├── vercel.json               # Vercel serverless routing configuration
├── README.md                 # Complete documentation
│
├── api/                      # Vercel Serverless Function entry point
│   └── index.js              # Exports Express app for Vercel Serverless runtime
│
├── server/                   # Node.js + Express Backend
│   ├── package.json          # Backend dependencies
│   ├── server.js             # Standalone local HTTP server listener
│   ├── app.js                # Express app setup, CORS, middleware, routes
│   │
│   ├── config/
│   │   └── db.js             # MongoDB connection with serverless connection pooling
│   │
│   ├── models/
│   │   ├── User.js           # User schema, bcrypt pre-save, validation
│   │   ├── Mood.js           # Mood schema with compound unique index {userId, date}
│   │   ├── Journal.js        # Journal schema with text search index
│   │   └── Habit.js          # Habit metrics schema with compound unique index
│   │
│   ├── controllers/
│   │   ├── authController.js     # Register, login, logout, me, change-password
│   │   ├── userController.js     # Profile and wellness target updates
│   │   ├── moodController.js     # CRUD, date range queries, today's status
│   │   ├── journalController.js  # CRUD, text search, tag filters, date lookup
│   │   ├── habitController.js    # Save daily habit, target comparison, history
│   │   └── analyticsController.js# Summary stats, Recharts trend feeds, reflections
│   │
│   ├── middleware/
│   │   ├── auth.js           # JWT verification for Bearer header & cookie
│   │   ├── errorHandler.js   # Centralized error handler & duplicate key parser
│   │   └── rateLimiter.js    # Rate limiting on /api/auth/* endpoints
│   │
│   ├── routes/
│   │   ├── authRoutes.js     # /api/auth endpoints
│   │   ├── userRoutes.js     # /api/users endpoints
│   │   ├── moodRoutes.js     # /api/moods endpoints
│   │   ├── journalRoutes.js  # /api/journals endpoints
│   │   ├── habitRoutes.js    # /api/habits endpoints
│   │   ├── analyticsRoutes.js# /api/analytics endpoints
│   │   └── healthRoutes.js   # /api/health diagnostic endpoint
│   │
│   └── utils/
│       ├── normalizeDate.js   # YYYY-MM-DD date tools & streak calculator
│       ├── reflectionRules.js # Local rule-based wellness insights engine
│       └── seedData.js        # Demo user & 30-day realistic historical seed script
│
└── client/                   # React + Vite Frontend
    ├── package.json          # Frontend dependencies
    ├── index.html            # HTML entry point with fonts & meta tags
    ├── vite.config.js        # Vite config with /api reverse proxy to port 5000
    ├── tailwind.config.js    # Custom pastel palette & typography
    ├── postcss.config.js     # PostCSS setup
    │
    └── src/
        ├── main.jsx          # React 18 DOM root & Context provider wrappers
        ├── App.jsx           # Client-side router configuration
        ├── index.css         # Tailwind directives & glassmorphic utility classes
        │
        ├── context/
        │   ├── AuthContext.jsx   # Shared authentication state & methods
        │   └── ThemeContext.jsx  # Light/dark mode toggle with localStorage sync
        │
        ├── services/
        │   ├── api.js            # Axios client with credentials & auth interceptor
        │   ├── authService.js    # Auth API methods
        │   ├── moodService.js    # Mood check-in API methods
        │   ├── journalService.js # Journal API methods
        │   ├── habitService.js   # Habit tracker API methods
        │   └── analyticsService.js # Recharts data fetchers
        │
        ├── components/
        │   ├── Sidebar.jsx       # Responsive desktop sidebar & mobile drawer
        │   ├── Header.jsx        # Time-of-day greeting, date, quick actions
        │   ├── ThemeToggle.jsx   # Light/dark theme toggle button
        │   └── ProtectedRoute.jsx# Auth guard with loading spinner
        │
        ├── layouts/
        │   └── AppLayout.jsx     # Master authenticated view shell
        │
        └── pages/
            ├── LandingPage.jsx       # Public landing page with hero & features
            ├── LoginPage.jsx         # Sign-in page with quick demo fill
            ├── RegisterPage.jsx      # Sign-up page with password validation
            ├── DashboardPage.jsx     # Master dashboard with stats & flow chart
            ├── MoodCheckInPage.jsx   # 5-point mood selector with emotion chips
            ├── MoodHistoryPage.jsx   # History timeline with date & mood filters
            ├── MoodCalendarPage.jsx  # Interactive calendar with day detail modal
            ├── JournalListPage.jsx   # Journal cards grid with search & tags
            ├── JournalEditorPage.jsx # Distraction-free editor with prompt drawer
            ├── JournalDetailPage.jsx # Dedicated reading view with gratitude highlights
            ├── HabitsPage.jsx        # Habit progress rings, targets & history
            ├── AnalyticsPage.jsx     # 4 Recharts charts, weekday & emotion trends
            ├── SettingsPage.jsx      # Profile, password, targets & JSON export
            └── NotFoundPage.jsx      # 404 error page
```

---

## 📋 Prerequisites

Before running the application, ensure your environment has:
- **Node.js**: version `18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: version `9.0.0` or higher (packaged with Node.js)
- **MongoDB**: A free MongoDB Atlas cluster ([MongoDB Atlas](https://www.mongodb.com/atlas)) or a local MongoDB community instance.

---

## 🚀 Step-by-Step Local Setup

### 1. Clone or Open the Repository
```powershell
# In Windows PowerShell:
cd "c:\Users\akash\OneDrive\ドキュメント\Fsd_Mood Tracker"
```

### 2. Install All Dependencies
The root `package.json` contains a convenience script to install all monorepo dependencies:
```powershell
npm run install:all
```
*Alternatively, install each workspace individually:*
```powershell
npm install
npm --prefix server install
npm --prefix client install
```

---

## 🍃 Configuring MongoDB Atlas

To connect MindBloom to a cloud database:

1. **Sign Up / Log In**: Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and log in.
2. **Create a Free Cluster**: Choose **Shared (M0 Free)** cluster in your closest region (e.g., AWS / Mumbai or US East).
3. **Database User Setup**:
   - In Atlas, navigate to **Database Access** under Security.
   - Click **Add New Database User**.
   - Choose **Password** authentication.
   - Enter a username (e.g., `mindbloom_admin`) and a secure password.
   - Assign the **Read and write to any database** role and save.
4. **Network Access Setup**:
   - Navigate to **Network Access** under Security.
   - Click **Add IP Address**.
   - For local development and serverless deployment on Vercel, select **Allow Access from Anywhere** (`0.0.0.0/0`) or add your current IP.
5. **Get Your Connection String**:
   - Click **Database** under Deployment, then click **Connect**.
   - Choose **Drivers** (Node.js).
   - Copy the SRV connection string:
     ```
     mongodb+srv://<username>:<password>@cluster0.mongodb.net/mindbloom?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your created database credentials.

---

## 🔐 Environment Variables

Create a `.env` file in the root workspace and in the `server/` directory:

```powershell
# Copy the example file:
Copy-Item .env.example .env
Copy-Item .env.example server/.env
```

Edit `.env` to include your actual values:

```ini
# ==============================================================================
# MindBloom Environment Configuration
# ==============================================================================

# MongoDB Connection String (Atlas or local instance)
MONGODB_URI=mongodb+srv://mindbloom_admin:YourSecurePassword123@cluster0.abcde.mongodb.net/mindbloom?retryWrites=true&w=majority

# JWT Secret Key (Use a long random string in production)
JWT_SECRET=mindbloom_super_secure_jwt_secret_change_me_in_production_2025!
JWT_EXPIRES_IN=7d

# Server Port (for local development)
PORT=5000
NODE_ENV=development

# Allowed Frontend URL for CORS
CLIENT_URL=http://localhost:5173

# Optional: Cookie Security
COOKIE_SECURE=false
```

---

## 💻 Running the Application

### Option A: Run Both Client & Server Concurrently (Recommended)
From the root project directory:
```powershell
npm run dev
```
This automatically starts:
- 🌸 **Express API Server** at: `http://localhost:5000`
- 💻 **Vite React Frontend** at: `http://localhost:5173`

### Option B: Run in Separate Terminals
**Terminal 1 (Backend Server):**
```powershell
npm --prefix server run dev
```
**Terminal 2 (Frontend Client):**
```powershell
npm --prefix client run dev
```

### Option C: Production Build & Local Preview
```powershell
# 1. Build the React frontend bundle
npm run build

# 2. Preview client build
npm --prefix client run preview
```

---

## 🌱 Demo Seed Data

To quickly experience the app with realistic data across past days (mood scores, Recharts trends, gratitude reflections, and habit streaks):

1. Ensure your `MONGODB_URI` is configured in `.env`.
2. Run the seed script:
```powershell
npm run seed
```
This will automatically seed a demo account:
- **Email**: `maya@mindbloom.app`
- **Password**: `Password123!`

*(You can also click the convenient **"Fill Demo Credentials"** button on the Login page!)*

---

## 📡 API Documentation

### Base URL: `/api`

### Health & Diagnostic
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Reports service status, uptime, and database connectivity. |
| `GET` | `/api` | Public | API service information. |

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Body / Params | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | `{ name, email, password, confirmPassword }` | Register a new user account. |
| `POST` | `/api/auth/login` | Public | `{ email, password }` | Authenticate user, set cookie, and return token. |
| `POST` | `/api/auth/logout` | Public | None | Clear authentication session. |
| `GET` | `/api/auth/me` | Private | None | Retrieve authenticated user profile. |
| `PATCH`| `/api/auth/change-password` | Private | `{ currentPassword, newPassword, confirmNewPassword }` | Change user password. |

### User Profile (`/api/users`)
| Method | Endpoint | Access | Body / Params | Description |
|---|---|---|---|---|
| `GET` | `/api/users/profile` | Private | None | Fetch current profile details. |
| `PATCH`| `/api/users/profile` | Private | `{ name }` | Update user display name. |
| `PATCH`| `/api/users/preferences` | Private | `{ theme, wellnessGoals: { sleepHours, waterGlasses, ... } }` | Update theme and daily wellness targets. |

### Mood Check-Ins (`/api/moods`)
| Method | Endpoint | Access | Body / Params | Description |
|---|---|---|---|---|
| `POST` | `/api/moods` | Private | `{ date, mood, score, emotions, notes, factors }` | Record daily mood check-in (prevents duplicate for same day). |
| `GET` | `/api/moods` | Private | `?startDate=&endDate=&mood=&emotion=&page=&limit=` | Filter and paginate mood records. |
| `GET` | `/api/moods/today` | Private | None | Check if user has already checked in today. |
| `GET` | `/api/moods/:id` | Private | None | Get single mood entry by ID. |
| `PATCH`| `/api/moods/:id` | Private | `{ mood, score, emotions, notes, factors }` | Update existing mood record. |
| `DELETE`| `/api/moods/:id` | Private | None | Delete mood record. |

### Wellness Journal (`/api/journals`)
| Method | Endpoint | Access | Body / Params | Description |
|---|---|---|---|---|
| `POST` | `/api/journals` | Private | `{ title, content, entryDate, tags, gratitudeNotes, positiveMoments, prompt }` | Save new private journal entry. |
| `GET` | `/api/journals` | Private | `?search=&tag=&startDate=&endDate=&sort=&page=&limit=` | Search and filter entries. |
| `GET` | `/api/journals/date/:date` | Private | None | Get entries for a specific calendar date. |
| `GET` | `/api/journals/:id` | Private | None | Fetch single entry + matching mood for that day. |
| `PATCH`| `/api/journals/:id` | Private | `{ title, content, tags, ... }` | Update journal entry. |
| `DELETE`| `/api/journals/:id` | Private | None | Delete journal entry. |

### Wellness Habits (`/api/habits`)
| Method | Endpoint | Access | Body / Params | Description |
|---|---|---|---|---|
| `POST` | `/api/habits` | Private | `{ date, sleepHours, waterGlasses, exerciseMinutes, meditationMinutes, customGoals, notes }` | Log or update habits for a day. |
| `GET` | `/api/habits` | Private | `?startDate=&endDate=&limit=&page=` | Fetch historical habit logs. |
| `GET` | `/api/habits/today` | Private | None | Get today's habit log & target goals. |
| `DELETE`| `/api/habits/:id` | Private | None | Delete habit entry. |

### Analytics & Insights (`/api/analytics`)
| Method | Endpoint | Access | Body / Params | Description |
|---|---|---|---|---|
| `GET` | `/api/analytics/summary` | Private | `?timeframe=30d` | Key metrics: streak, average mood, habit %, rule-based reflections. |
| `GET` | `/api/analytics/mood-trends` | Private | `?timeframe=30d` | Formatted series for Recharts Area flow chart. |
| `GET` | `/api/analytics/mood-distribution`| Private | `?timeframe=30d` | Data for donut chart, emotion & factor frequencies. |
| `GET` | `/api/analytics/weekday-averages` | Private | None | Average mood score grouped by day of week (Mon-Sun). |
| `GET` | `/api/analytics/habit-progress` | Private | `?timeframe=14d` | Sleep & water intake trend data. |
| `GET` | `/api/analytics/prompts` | Public | None | Curated bank of mindful reflection prompts. |

---

## ☁️ Vercel Deployment Guide

MindBloom is engineered with a **Vercel-native monorepo architecture**:
- The frontend is built into `/client/dist` and served with client-side SPA routing.
- The Express backend is exposed as a Vercel Serverless Function via `api/index.js`.
- All requests matching `/api/*` are routed to the Express function.

### Step 1: Push Code to GitHub
```powershell
git init
git add .
git commit -m "Initial commit: MindBloom full-stack MERN application"
# Create repository on GitHub, then push:
git remote add origin https://github.com/your-username/mindbloom.git
git branch -M main
git push -u origin main
```

### Step 2: Import Project in Vercel
1. Log in to [vercel.com](https://vercel.com/) with your GitHub account.
2. Click **Add New...** -> **Project**.
3. Select your `mindbloom` repository and click **Import**.

### Step 3: Configure Build & Project Settings
In the Vercel Project Configuration screen:
- **Framework Preset**: Other (or Vite)
- **Root Directory**: `./` (leave as root)
- **Build Command**: `npm run build`
- **Output Directory**: `client/dist`

### Step 4: Add Environment Variables in Vercel
Under the **Environment Variables** section in Vercel, add:
| Variable Name | Value |
|---|---|
| `MONGODB_URI` | `mongodb+srv://<username>:<password>@cluster0.mongodb.net/mindbloom?retryWrites=true&w=majority` |
| `JWT_SECRET` | A strong 32+ character random string |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://your-project-name.vercel.app` (your Vercel deployment URL) |

### Step 5: Deploy & Verify
1. Click **Deploy**.
2. Once deployed, verify:
   - Homepage loads: `https://your-app.vercel.app`
   - Health check endpoint reports database status: `https://your-app.vercel.app/api/health`
   - Test registration and daily check-in.

---

## 🛡️ Security Architecture

1. **Password Protection**: Plaintext passwords are never stored. Passwords are salted and hashed using `bcryptjs` (10 rounds). Password hashes are set to `select: false` by default in Mongoose schemas.
2. **Dual-Channel JWT Authentication**:
   - Web browsers automatically receive an `HttpOnly`, `SameSite=none/lax` cookie to guard against XSS token theft.
   - Standard `Authorization: Bearer <token>` header is also supported and automatically attached by Axios interceptors for cross-origin or native requests.
3. **Strict User Data Isolation**: Every database query (`Mood.find`, `Journal.find`, `Habit.find`) filters by `userId: req.user.id` obtained from the verified JWT. Client-supplied `userId` query parameters are never trusted.
4. **Input Sanitization**: Journal titles, reflections, and notes are sanitized to prevent script injection.
5. **Rate Limiting**: Authentication endpoints are rate-limited with `express-rate-limit` to prevent brute-force credential stuffing.
6. **Safe Production Error Responses**: Centralized error middleware ensures internal stack traces and MongoDB connection details are never exposed in production.

---

## ❓ Troubleshooting

### 1. `Cannot connect to MongoDB` / `MongooseServerSelectionError`
- Verify that your MongoDB Atlas IP Access List has `0.0.0.0/0` enabled (or your current IP address).
- Ensure your database username and password in `MONGODB_URI` are correct and that special characters in the password are URL-encoded if applicable.

### 2. `A record already exists for this date`
- MindBloom enforces one check-in per user per day via a compound unique index.
- If you have already checked in today, click **"Update Check-In"** to edit your existing record.

### 3. Client API requests failing locally with Network Error
- Make sure the server is running on `http://localhost:5000`.
- Verify that the Vite reverse proxy in `client/vite.config.js` is active (proxies `/api` -> `http://localhost:5000`).

---

## 📸 UI Screenshots & Previews

*(Place your project screenshots in an `assets/screenshots/` folder for showcase)*

- **Landing Page**: Calming hero section, feature cards, and mindfulness principles.
- **Interactive Dashboard**: Real-time streak badge, daily check-in banner, and Recharts mood flow curve.
- **Daily Check-In Modal**: Expressive mood selector (1-5), emotion chips, and contributing factors.
- **Mood Calendar View**: Monthly grid with color-coded mood indicators and click-to-view day details.
- **Wellness Journal**: Distraction-free writing editor, guided reflection prompt selector, and gratitude lists.
- **Habit Tracker**: Daily fulfillment percentage ring, water glass counters, and sleep trackers.
- **Analytics View**: 4 interactive charts (Mood Trajectory, Weekday Averages, Distribution Donut, Habit Compliance).

---

## 🚀 Future Enhancements

- [ ] Weekly PDF Wellness Summary export.
- [ ] Push notification daily mindfulness reminders (Web Push API).
- [ ] Guided audio breathing exercises (5-minute box breathing meditation).
- [ ] Spotify / ambient audio integration for journaling background soundscapes.

---

## 📄 License & Wellness Disclaimer

### License
This project is open-source and available under the [MIT License](LICENSE).

### Wellness Disclaimer
MindBloom is created as a personal mindfulness, reflection, and habit-tracking project. It does not provide medical diagnoses, clinical psychological therapy, or emergency psychiatric care. If you are experiencing emotional distress or a mental health crisis, please reach out to local healthcare professionals or a national support lifeline.
