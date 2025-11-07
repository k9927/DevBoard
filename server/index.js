import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import fetch from 'node-fetch';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { createServerlessExpress } from "@vercel/node";
dotenv.config();

const app=express();
app.use(
  cors({
    origin: [
      "https://dev-board-kappa.vercel.app",  // your frontend
      "https://dev-board-96n2.vercel.app"    // your backend (optional but safe)
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port=3000;
const db = new pg.Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    require: true,
    rejectUnauthorized: false
  },
});

// Global error handlers
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email }; // Consistent with token structure
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// FORGOT PASSWORD ENDPOINTS
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  
  try {
    // Check if user exists
    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database
    await db.query(
      "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3",
      [resetToken, resetTokenExpiry, email]
    );

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'DevBoard - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">DevBoard Password Reset</h2>
          <p>Hello!</p>
          <p>You requested a password reset for your DevBoard account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block;
                      font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
          <p>Best regards,<br>The DevBoard Team</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset email sent successfully" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to send reset email" });
  }
});

app.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Find user with valid reset token
    const user = await db.query(
      "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()",
      [token]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    await db.query(
      "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2",
      [hashedPassword, user.rows[0].id]
    );

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

app.get("/verify-reset-token/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const user = await db.query(
      "SELECT id FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()",
      [token]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    res.json({ valid: true });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(500).json({ error: "Failed to verify token" });
  }
});

//LOGIN AND SIGNUP
app.post("/signup",async(req,res)=>{
    const {email,password}=req.body;
   //checking for already existing email 
   try{
   const existingUser= await db.query("Select * from users where email= $1",[email]);
   if(existingUser.rows.length>0){
    return res.status(400).send({error:"Email already exists"});
   } 
   //salt rounds
   const saltRounds=10;
   const hashedPassword=await bcrypt.hash(password,saltRounds);
   const newUser=await db.query(
    "INSERT into users (email,password) VALUES ($1,$2)RETURNING id,email",
    [email,hashedPassword]
   );
   //jwt token
   const token=jwt.sign(
    {id:newUser.rows[0].id,},
    process.env.JWT_SECRET,
    {expiresIn:"3d"}
   );
    res.status(201).json({ token, user: newUser.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
   
});
app.post("/login",async(req,res)=>{
  const {email,password}=req.body;
  try{
    const user=await db.query("SELECT * FROM users WHERE email=$1",[email]);
    if(user.rows.length==0){
      return res.status(400).json({ error: "User not found" });
    }
    const isValidPassword=await bcrypt.compare(password,user.rows[0].password);
    if(!isValidPassword){
      return res.status(400).json({ error: "Invalid password" });
    }
     const token = jwt.sign({ id: user.rows[0].id, email: user.rows[0].email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

     res.json({ token, user: { id: user.rows[0].id, email: user.rows[0].email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }

});

// Add activity logging helper
async function logActivity(userId, type, action, detail) {
  try {
    await db.query(
      'INSERT INTO activity (user_id, type, action, detail) VALUES ($1, $2, $3, $4)',
      [userId, type, action, detail]
    );
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}

//RESOURCES
app.get("/api/resources",authenticate,async(req,res)=>{
  try{
  const result=await db.query("Select * from resources where user_id=$1 ORDER BY created_at DESC",[req.user.id]);
  res.json(result.rows);
  }
  catch(error){
        console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})


app.post("/api/resources",authenticate,async(req,res)=>{
          const {title,url,tags,type}=req.body; 
          if (!title || !url || !type) {
    return res.status(400).json({ error: "Title, URL, and type are required." });
  }
  try{

       const result=await db.query("INSERT INTO resources (user_id,title,url,tags,type) VALUES ($1,$2,$3,$4,$5) RETURNING *",[req.user.id,title,url,tags||[],type]);
       // Log activity
       await logActivity(req.user.id, 'resource', 'added', title);
       res.status(201).json(result.rows[0]);
  }
  catch(err){
      console.log("Error Inserting Resource:",err);
       res.status(500).json({ error: "Internal server error" });
  }
})
app.delete("/api/resources/:id",authenticate,async(req,res)=>{
     const resourceID=req.params.id;
     try{
     await db.query("Delete from resources where id=$1",[resourceID]);
        res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}); 


//GOALS
app.get("/api/goals",authenticate,async(req,res)=>{
  try{
    const result=await db.query("Select * from goals where user_id=$1 ORDER BY created_at DESC",[req.user.id]);
    res.json(result.rows);
  }
catch (err) {
    console.error("Error fetching goals:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/api/goals",authenticate,async(req,res)=>{
   try {
    const userId = req.user.id;
    const { title, type } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: "Title and type are required" });
    }

    const result = await db.query(
      "INSERT INTO goals (user_id, title, type) VALUES ($1, $2, $3) RETURNING *",
      [userId, title, type]
    );

    // Log activity
    await logActivity(userId, 'goal', 'added', title);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding goal:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete("/api/goals/:id",authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const goalId = req.params.id;

    // Make sure the goal belongs to the user
    const check = await db.query(
      "SELECT * FROM goals WHERE id = $1 AND user_id = $2",
      [goalId, userId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Goal not found" });
    }

    await db.query("DELETE FROM goals WHERE id = $1", [goalId]);

    res.json({ message: "Goal deleted successfully" });
  } catch (err) {
    console.error("Error deleting goal:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.patch("/api/goals/:id",authenticate,async (req, res) => {
  try {
    const userId = req.user.id;
    const goalId = req.params.id;
    const { completed } = req.body;

    const result = await db.query(
      "UPDATE goals SET completed = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [completed, goalId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Goal not found or unauthorized" });
    }

    const goal = result.rows[0];
    if (completed) {
      // Log activity for completed goal
      await logActivity(userId, 'goal', 'completed', goal.title);
    } else {
      // Remove activity for uncompleted goal
      await db.query(
        'DELETE FROM activity WHERE user_id = $1 AND type = $2 AND action = $3 AND detail = $4',
        [userId, 'goal', 'completed', goal.title]
      );
    }

    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});


//PROFILES
// GET /api/profiles
app.get("/api/profiles", authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      "SELECT leetcode_username, codeforces_handle, github_username FROM connected_profiles WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ leetcode_username: "", codeforces_handle: "", github_username: "" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching profiles:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/profiles
app.post("/api/profiles", authenticate, async (req, res) => {
  const userId = req.user.id;
  const { leetcode_username, codeforces_handle, github_username } = req.body;

  try {
    await db.query(`
      INSERT INTO public.connected_profiles (user_id, leetcode_username, codeforces_handle, github_username)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id) DO UPDATE
      SET leetcode_username = EXCLUDED.leetcode_username,
          codeforces_handle = EXCLUDED.codeforces_handle,
          github_username = EXCLUDED.github_username,
          updated_at = CURRENT_TIMESTAMP
    `, [userId, leetcode_username, codeforces_handle, github_username]);

    res.json({ message: "Profiles saved successfully" });
  } catch (err) {
    console.error("Error saving profiles:", err);
    res.status(500).json({ error: "Server error" });
  }
});


//LeetCode





//LeetCode stats proxy endpoint using official GraphQL API
app.get('/api/leetcode/:username', authenticate, async (req, res) => {
  const { username } = req.params;
  const userId = req.user.id;
  try {
    // Fetch recent accepted submissions
    const recentQuery = {
      query: `query recentAc($username: String!) { recentAcSubmissionList(username: $username) { id title titleSlug timestamp } }`,
      variables: { username }
    };
    const recentRes = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recentQuery)
    });
    let recentSolved = [];
    if (recentRes.ok) {
      const data = await recentRes.json();
      if (data.data && data.data.recentAcSubmissionList) {
        recentSolved = data.data.recentAcSubmissionList;
      }
    }
    // Get already-logged LeetCode solves for this user (with timestamp)
    const actRows = await db.query(
      'SELECT detail, timestamp FROM activity WHERE user_id = $1 AND type = $2 ORDER BY timestamp DESC',
      [userId, 'leetcode']
    );
    const alreadyLogged = new Set(actRows.rows.map(r => r.detail));
    const latestLoggedTs = actRows.rows.length > 0 ? new Date(actRows.rows[0].timestamp).getTime() / 1000 : 0;
    // Log new solves (check more recent problems and ensure weekly problems are captured)
    const oneWeekAgo = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
    for (const sub of recentSolved.slice(0, 10)) { // Check more recent problems
      if (!alreadyLogged.has(sub.title) && sub.timestamp > latestLoggedTs) {
        await logActivity(userId, 'leetcode', 'solved', sub.title);
      }
      // Also log problems solved this week that might have been missed
      if (!alreadyLogged.has(sub.title) && sub.timestamp >= oneWeekAgo) {
        await logActivity(userId, 'leetcode', 'solved', sub.title);
      }
    }
    const graphqlQuery = {
      query: `
        query getUserProfile($username: String!) {
          allQuestionsCount { difficulty count }
          matchedUser(username: $username) {
            username
            profile { ranking reputation }
            submitStats { acSubmissionNum { difficulty count } }
            submissionCalendar
          }
        }
      `,
      variables: { username }
    };
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphqlQuery)
    });
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch from LeetCode.' });
    }
    const data = await response.json();
    if (!data.data || !data.data.matchedUser) {
      return res.status(404).json({ error: 'LeetCode username not found or unavailable.' });
    }
    // Extract stats
    const stats = data.data;
    const ac = stats.matchedUser.submitStats.acSubmissionNum;
    const totalSolved = ac.find(x => x.difficulty === 'All')?.count || 0;
    const easySolved = ac.find(x => x.difficulty === 'Easy')?.count || 0;
    const mediumSolved = ac.find(x => x.difficulty === 'Medium')?.count || 0;
    const hardSolved = ac.find(x => x.difficulty === 'Hard')?.count || 0;
    const ranking = stats.matchedUser.profile.ranking;
    const reputation = stats.matchedUser.profile.reputation;
    // Calculate streaks from submissionCalendar
    let maxStreak = 0, currentStreak = 0;
    if (stats.matchedUser.submissionCalendar) {
      const calendar = JSON.parse(stats.matchedUser.submissionCalendar);
      const days = Object.keys(calendar).map(ts => parseInt(ts, 10)).sort((a, b) => a - b);
      let prevDay = null;
      let streak = 0;
      for (const day of days) {
        if (prevDay !== null && day === prevDay + 86400) {
          streak++;
        } else {
          streak = 1;
        }
        if (streak > maxStreak) maxStreak = streak;
        prevDay = day;
      }
      // Calculate current streak: walk backwards from the last day
      currentStreak = 1;
      for (let i = days.length - 1; i > 0; i--) {
        if (days[i] - days[i - 1] === 86400) {
          currentStreak++;
        } else {
          break;
        }
      }
      if (days.length === 0) currentStreak = 0;
    }
    // Return in frontend-friendly format
    return res.json({
      username,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      ranking,
      reputation,
      maxStreak,
      currentStreak
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Codeforces stats proxy endpoint
app.get('/api/codeforces/:handle', authenticate, async (req, res) => {
  const { handle } = req.params;
  try {
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    if (!response.ok) {
      return res.status(404).json({ error: 'Codeforces handle not found or unavailable.' });
    }
    const data = await response.json();
    if (data.status !== 'OK' || !data.result || !data.result[0]) {
      return res.status(404).json({ error: 'Codeforces handle not found or unavailable.' });
    }
    const user = data.result[0];
    return res.json({
      handle: user.handle,
      rating: user.rating,
      rank: user.rank,
      maxRating: user.maxRating,
      maxRank: user.maxRank,
      contribution: user.contribution,
      friendOfCount: user.friendOfCount,
      registrationTimeSeconds: user.registrationTimeSeconds,
      avatar: user.titlePhoto
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// GitHub stats proxy endpoint
app.get('/api/github/:username', authenticate, async (req, res) => {
  const { username } = req.params;
  try {
    // GitHub API headers with token if available
    const headers = {
      'User-Agent': 'DevBoard-App',
      'Accept': 'application/vnd.github.v3+json',
      ...(process.env.GITHUB_TOKEN ? { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` } : {})
    };

    // Fetch user profile with timeout
    const userResponse = await Promise.race([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
    ]);
    
    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        return res.status(404).json({ error: 'GitHub username not found.' });
      } else if (userResponse.status === 403) {
        return res.status(403).json({ error: 'GitHub API rate limit exceeded. Please try again later.' });
      } else {
        return res.status(userResponse.status).json({ error: 'GitHub API error.' });
      }
    }
    
    const user = await userResponse.json();

    // Fetch user repos with timeout (limit to 30 for performance)
    let repos = [];
    try {
      const reposResponse = await Promise.race([
        fetch(`https://api.github.com/users/${username}/repos?per_page=30&type=owner&sort=updated`, { headers }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 8000))
      ]);
      
      if (reposResponse.ok) {
        repos = await reposResponse.json();
      }
    } catch (err) {
      console.log('GitHub repos fetch failed:', err.message);
      // Continue without repos data
    }

    // Most starred repo
    let topRepo = null;
    if (repos.length > 0) {
      const top = repos.reduce((max, repo) => repo.stargazers_count > max.stargazers_count ? repo : max, repos[0]);
      topRepo = {
        name: top.name,
        url: top.html_url,
        stars: top.stargazers_count
      };
    }

    // Top languages
    const languageCount = {};
    repos.forEach(repo => {
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }
    });
    const topLanguages = Object.entries(languageCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({ name, count }));

    // Simplified commit count (just use public repos count as approximation)
    // This avoids the complex commit counting that can hit rate limits
    const totalCommits = user.public_repos * 10; // Rough approximation

    return res.json({
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      created_at: user.created_at,
      updated_at: user.updated_at,
      html_url: user.html_url,
      bio: user.bio,
      topRepo,
      topLanguages,
      totalCommits
    });
  } catch (err) {
    console.log('GitHub API Exception:', err.message);
    if (err.message === 'Timeout') {
      return res.status(408).json({ error: 'GitHub API request timed out. Please try again.' });
    }
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ACTIVITY FEED ENDPOINT
app.get('/api/activity', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      'SELECT * FROM activity WHERE user_id = $1 ORDER BY timestamp DESC',
      [userId]
    );
    // Always show 5 most recent, but never more than 2 LeetCode solves
    let leetcodeCount = 0;
    const filtered = [];
    for (const row of result.rows) {
      if (row.type === 'leetcode') {
        if (leetcodeCount < 2) {
          filtered.push(row);
          leetcodeCount++;
        }
      } else {
        filtered.push(row);
      }
      if (filtered.length === 5) break;
    }
    res.json(filtered);
  } catch (err) {
    console.error('Error fetching activity:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// WEEKLY SUMMARY ENDPOINT
app.get('/api/weekly-summary', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get current week's start and end dates
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    endOfWeek.setHours(23, 59, 59, 999);
    
    let completedGoals = 0;
    let addedResources = 0;
    let solvedProblems = 0;
    let totalActivity = 0;
    let activeDays = 0;
    
    try {
      // Get weekly goals completed (using created_at since updated_at might not exist)
      const goalsResult = await db.query(
        'SELECT COUNT(*) as completed FROM goals WHERE user_id = $1 AND completed = true AND created_at >= $2 AND created_at <= $3',
        [userId, startOfWeek, endOfWeek]
      );
      completedGoals = parseInt(goalsResult.rows[0]?.completed || 0);
    } catch (err) {
      console.log('Goals query failed, using fallback:', err.message);
      // Fallback: just count all completed goals
      try {
        const goalsResult = await db.query(
          'SELECT COUNT(*) as completed FROM goals WHERE user_id = $1 AND completed = true',
          [userId]
        );
        completedGoals = parseInt(goalsResult.rows[0]?.completed || 0);
      } catch (fallbackErr) {
        console.log('Goals fallback also failed:', fallbackErr.message);
        completedGoals = 0;
      }
    }
    
    try {
      // Get weekly resources added
      const resourcesResult = await db.query(
        'SELECT COUNT(*) as added FROM resources WHERE user_id = $1 AND created_at >= $2 AND created_at <= $3',
        [userId, startOfWeek, endOfWeek]
      );
      addedResources = parseInt(resourcesResult.rows[0]?.added || 0);
    } catch (err) {
      console.log('Resources query failed, using fallback:', err.message);
      // Fallback: just count all resources
      try {
        const resourcesResult = await db.query(
          'SELECT COUNT(*) as added FROM resources WHERE user_id = $1',
          [userId]
        );
        addedResources = parseInt(resourcesResult.rows[0]?.added || 0);
      } catch (fallbackErr) {
        console.log('Resources fallback also failed:', fallbackErr.message);
        addedResources = 0;
      }
    }
    
    try {
      // Get weekly LeetCode problems solved
      const leetcodeResult = await db.query(
        'SELECT COUNT(*) as solved FROM activity WHERE user_id = $1 AND type = $2 AND timestamp >= $3 AND timestamp <= $4',
        [userId, 'leetcode', startOfWeek, endOfWeek]
      );
      solvedProblems = parseInt(leetcodeResult.rows[0]?.solved || 0);
    } catch (err) {
      console.log('LeetCode query failed, using fallback:', err.message);
      // Fallback: just count all leetcode activities
      try {
        const leetcodeResult = await db.query(
          'SELECT COUNT(*) as solved FROM activity WHERE user_id = $1 AND type = $2',
          [userId, 'leetcode']
        );
        solvedProblems = parseInt(leetcodeResult.rows[0]?.solved || 0);
      } catch (fallbackErr) {
        console.log('LeetCode fallback also failed:', fallbackErr.message);
        solvedProblems = 0;
      }
    }
    
    try {
      // Get weekly activity count
      const activityResult = await db.query(
        'SELECT COUNT(*) as total FROM activity WHERE user_id = $1 AND timestamp >= $2 AND timestamp <= $3',
        [userId, startOfWeek, endOfWeek]
      );
      totalActivity = parseInt(activityResult.rows[0]?.total || 0);
    } catch (err) {
      console.log('Activity query failed, using fallback:', err.message);
      // Fallback: just count all activities
      try {
        const activityResult = await db.query(
          'SELECT COUNT(*) as total FROM activity WHERE user_id = $1',
          [userId]
        );
        totalActivity = parseInt(activityResult.rows[0]?.total || 0);
      } catch (fallbackErr) {
        console.log('Activity fallback also failed:', fallbackErr.message);
        totalActivity = 0;
      }
    }
    
    try {
      // Get streak information
      const streakResult = await db.query(
        'SELECT COUNT(DISTINCT DATE(timestamp)) as active_days FROM activity WHERE user_id = $1 AND timestamp >= $2 AND timestamp <= $3',
        [userId, startOfWeek, endOfWeek]
      );
      activeDays = parseInt(streakResult.rows[0]?.active_days || 0);
    } catch (err) {
      console.log('Streak query failed, using fallback:', err.message);
      // Fallback: just count all unique days
      try {
        const streakResult = await db.query(
          'SELECT COUNT(DISTINCT DATE(timestamp)) as active_days FROM activity WHERE user_id = $1',
          [userId]
        );
        activeDays = parseInt(streakResult.rows[0]?.active_days || 0);
      } catch (fallbackErr) {
        console.log('Streak fallback also failed:', fallbackErr.message);
        activeDays = 0;
      }
    }
    
    // Productivity score calculation
    let productivityScore = 0;
    if (completedGoals > 0) productivityScore += 25;
    if (addedResources > 0) productivityScore += 20;
    if (solvedProblems > 0) productivityScore += 30;
    if (activeDays >= 5) productivityScore += 25;
    else if (activeDays >= 3) productivityScore += 15;
    else if (activeDays >= 1) productivityScore += 10;
    
    // Get motivational message based on performance
    let motivationalMessage = '';
    let messageType = 'neutral';
    
    if (productivityScore >= 80) {
      motivationalMessage = '🎉 Outstanding week! You\'re on fire with your coding practice!';
      messageType = 'excellent';
    } else if (productivityScore >= 60) {
      motivationalMessage = '🚀 Great progress! Keep up the consistent effort!';
      messageType = 'good';
    } else if (productivityScore >= 40) {
      motivationalMessage = '💪 Good start! Try to be more consistent this week.';
      messageType = 'decent';
    } else if (productivityScore >= 20) {
      motivationalMessage = '📈 You\'re getting there! Every small step counts.';
      messageType = 'improving';
    } else {
      motivationalMessage = '🌟 New week, new opportunities! Start with one small goal today.';
      messageType = 'motivational';
    }
    
    res.json({
      weekStart: startOfWeek.toISOString(),
      weekEnd: endOfWeek.toISOString(),
      stats: {
        goalsCompleted: completedGoals,
        resourcesAdded: addedResources,
        problemsSolved: solvedProblems,
        totalActivity: totalActivity,
        activeDays: activeDays
      },
      productivityScore,
      motivationalMessage,
      messageType
    });
  } catch (err) {
    console.error('Error fetching weekly summary:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default createServerlessExpress(app);