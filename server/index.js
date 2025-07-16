import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
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
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})