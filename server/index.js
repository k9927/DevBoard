import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import fetch from 'node-fetch';
dotenv.config();

const app=express();
const port=3000;
const db=new pg.Client({
user:process.env.DB_USER,
host:process.env.DB_HOST,
database:process.env.DB_NAME,
password:process.env.DB_PASSWORD,
port:process.env.DB_PORT,
});
db.connect();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(cors({
  origin: "http://localhost:5173", // React/Vite port
  credentials: true,               // if you ever use cookies
}));

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
//LOGIN AND SIGNUP
app.post("/signup",async(req,res)=>{
    const {email,password}=req.body;
   //checking for already existing email 
   try{
   const existingUser= await db.query("Select * from users where email= $1",[email]);
   if(existingUser.rows.length>0){
    res.status(400).send({error:"Email already exists"});
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
      INSERT INTO connected_profiles (user_id, leetcode_username, codeforces_handle, github_username)
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
    // Log new solves (only 2 most recent, and only if solved after latest logged)
    for (const sub of recentSolved.slice(0, 2)) {
      if (!alreadyLogged.has(sub.title) && sub.timestamp > latestLoggedTs) {
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
      ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
    };

    // Fetch user profile
    const userResponse = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!userResponse.ok) {
      return res.status(404).json({ error: 'GitHub username not found or unavailable.' });
    }
    const user = await userResponse.json();

    // Fetch user repos (up to 100)
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&type=owner`, { headers });
    let repos = [];
    if (reposResponse.ok) {
      repos = await reposResponse.json();
    }

    // Most starred repo (used as Top Repo)
    let topRepo = null;
    if (repos.length > 0) {
      const top = repos.reduce((max, repo) => repo.stargazers_count > max.stargazers_count ? repo : max, repos[0]);
      topRepo = {
        name: top.name,
        url: top.html_url
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

    // Real total commits (sum across all repos for this user, using Link header trick)
    let totalCommits = 0;
    for (const repo of repos) {
      try {
        const commitsRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/commits?sha=${repo.default_branch}&per_page=1&page=1`, { headers });
        if (commitsRes.ok) {
          const link = commitsRes.headers.get('link');
          if (link && link.includes('rel="last"')) {
            // Extract the last page number
            const match = link.match(/&page=(\d+)>; rel="last"/);
            if (match) {
              totalCommits += parseInt(match[1], 10);
            }
          } else {
            // If no Link header, only one commit exists
            const commits = await commitsRes.json();
            if (Array.isArray(commits) && commits.length > 0) {
              totalCommits += commits.length;
            }
          }
        }
      } catch (err) {
        // Ignore errors for individual repos
      }
    }

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

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})