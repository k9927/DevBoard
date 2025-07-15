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
app.use(cors({
  origin: "http://localhost:5173", // React/Vite port
  credentials: true,               // if you ever use cookies
}));
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


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})