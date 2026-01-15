// auth.controllers.js

import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import pool from "../db/index.js"
import jwt from "jsonwebtoken";


export async function register(req, res) {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).json({error:"Email and Password are required"});
  } 

  const hashPass = await bcrypt.hash(password,10);

  try {
    await pool.query(
        `INSERT INTO users (id,email,password_hash)
        VALUES ($1,$2,$3)`,
        [uuidv4(),email,hashPass]
    );

    return res.status(201).json({message:"User registered"});
  } catch (err) {
    if (err.code === "23505") {
        return res.status(409).json({error:"Email already exists"});
    }
    return res.status(500).json({error:"Internal server error"});
  }
}

export async function login(req, res) {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({error:"Email and Password are required"});
  }

  const result = await pool.query(
    `SELECT id,password_hash FROM users WHERE email=$1`,
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({error:"Invalid Credentials"});
  }

  const user = result.rows[0];
  const isValid = await bcrypt.compare(password,user.password_hash);

  if (!isValid) {
    return res.status(401).json({error:"Invalid Credentials"});
  }

  const token = jwt.sign({userId:user.id},process.env.JWT_SECRET,{expiresIn:"1h"});
  return res.json({token});
  
}
