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
- **Deployment:** Vercel (frontend + backend together), Neon/Railway (database)

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
├── api/            # Backend (Express + Serverless)
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

### 3. **Backend Setup (Local Development)**
```bash
cd api
npm install
# Create .env file with your environment variables
npm start
```

### 4. **Environment Variables**

#### For Local Development:
- **Frontend (.env in client/):** 
  - `VITE_API_URL=http://localhost:3000` (or your backend URL)
- **Backend (.env in api/):**
  - `PGUSER=...`
  - `PGPASSWORD=...`
  - `PGHOST=...`
  - `PGDATABASE=...`
  - `PGPORT=5432`
  - `JWT_SECRET=...`
  - `EMAIL_USER=...`
  - `EMAIL_PASS=...`
  - `FRONTEND_URL=http://localhost:5173`

#### For Vercel Deployment (Hosting Together):
- Set all backend environment variables in Vercel
- **Leave `VITE_API_URL` empty** (or don't set it) for same-domain hosting
- Set `FRONTEND_URL` to your Vercel deployment URL

📖 **See `DEPLOYMENT.md` and `HOSTING_GUIDE.md` for detailed deployment instructions**

---

## 🌟 Screenshots
<img width="1918" height="881" alt="image" src="https://github.com/user-attachments/assets/0aabeb45-a7cf-4dd4-bee0-59d4bcc21b21" />
<img width="1915" height="888" alt="image" src="https://github.com/user-attachments/assets/7adaea8f-5fee-429d-a8ae-25a32714015f" />



---

## 🏆 Why This Project Stands Out

- 🧩 **Full-stack, production-grade architecture** with secure JWT auth, password reset, and email integration
- 📊 **Integrated external APIs and profiles** (LeetCode, GitHub, Codeforces) to give users a centralized productivity hub
- 🛠️ **Deployed and scalable** with PostgreSQL (Neon), Express.js API (Railway), and a React+Vite frontend (Vercel)
- 💡 **Custom dashboard UI** with persistent goal tracking, resource bookmarking, and weekly summaries
- 🧪 **Strong dev practices**: modular code, `.env` configs, mobile responsiveness, and clean error handling

