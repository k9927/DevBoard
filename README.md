# DevBoard

A modern, full-stack developer productivity hub. Track your coding progress, manage goals, save resources, and visualize your growth—all in one place.

---

## 🚀 Live Demo
[DevBoard Live](https://dev-board-kappa.vercel.app/)

---

## ✨ Features
- **Authentication:** Secure signup, login, and password reset (with email integration)
- **Profile Management:** Connect your LeetCode, GitHub, and Codeforces profiles
- **Personal Dashboard:** Visualize your goals, resources, activity, and coding stats
- **Resource Library:** Save, tag, and manage coding resources
- **Goal Tracking:** Set, complete, and track daily coding goals
- **Weekly Summary:** Productivity stats and motivational messages
- **Responsive UI:** Works on desktop and mobile
- **Error Handling:** Friendly error messages and feedback for all actions

---

## 🛠️ Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Neon/Railway)
- **Auth:** JWT, bcrypt
- **Email:** Nodemailer (Gmail App Passwords)
- **Deployment:** Vercel (frontend), Railway (backend), Neon (database)

---

## 📦 Project Structure
```
devboard-frontend/
│
├── client/         # Frontend (React)
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── server/         # Backend (Express)
│   ├── index.js
│   ├── package.json
│   └── migrations/
│
└── README.md
```

---

## 📝 Setup Instructions

### 1. **Clone the Repo**
```bash
git clone https://github.com/yourusername/devboard-frontend.git
cd devboard-frontend
```

### 2. **Frontend Setup**
```bash
cd client
cp .env.example .env # create and edit VITE_API_URL
npm install
npm run dev
```

### 3. **Backend Setup**
```bash
cd ../server
cp .env.example .env # create and edit DB, JWT, EMAIL, FRONTEND_URL
npm install
npm start
```

### 4. **Environment Variables**
- **Frontend:** `VITE_API_URL=https://your-backend-url`
- **Backend:**
  - `PGUSER=...`
  - `PGPASSWORD=...`
  - `PGHOST=...`
  - `PGDATABASE=...`
  - `PGPORT=5432`
  - `JWT_SECRET=...`
  - `EMAIL_USER=...`
  - `EMAIL_PASS=...`
  - `FRONTEND_URL=https://dev-board-kappa.vercel.app`

---

## 🌟 Screenshots

> Add screenshots or GIFs here to show off your UI and features!

---

## 🏆 Why This Project Stands Out
- **End-to-end authentication and password reset**
- **Production deployment (not just localhost!)**
- **Modern React and Express best practices**
- **Secure, scalable, and ready for real users**
- **Great for resumes and portfolio demos**

