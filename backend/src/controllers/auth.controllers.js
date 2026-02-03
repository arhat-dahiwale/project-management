// backend/src/controllers/auth.controllers.js

import bcrypt from "bcrypt";
import pool from "../db/index.js"
import jwt from "jsonwebtoken";


export async function register(req, res) {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).json({error:"EMAIL_PASSWORD_REQUIRED"});
  } 

  const hashPass = await bcrypt.hash(password,10);

  try {
    await pool.query(
        `INSERT INTO users (id,email,password_hash)
        VALUES (gen_random_uuid(),$1,$2)`,
        [email,hashPass]
    );

    return res.status(201).json({message:"USER_REGISTERED"});
  } catch (err) {
    if (err.code === "23505") {
        return res.status(409).json({error:"EMAIL_ALREADY_EXISTS"});
    }
    return res.status(500).json({error:"INTERNAL_SERVER_ERROR"});
  }
}

export async function login(req, res) {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({error:"EMAIL_PASSWORD_REQUIRED"});
  }

  const result = await pool.query(
    `SELECT id,password_hash FROM users WHERE email=$1`,
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({error:"INVALID_CREDENTIALS"});
  }

  const user = result.rows[0];
  const isValid = await bcrypt.compare(password,user.password_hash);

  if (!isValid) {
    return res.status(401).json({error:"INVALID_CREDENTIALS"});
  }

  const token = jwt.sign({userId:user.id},process.env.JWT_SECRET,{expiresIn:"1h"});
  return res.json({token});
  
}

export async function getMe(req,res) {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT id, email
       FROM users 
       WHERE id=$1`,
       [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({error : "USER_NOT_FOUND"});
    }

    return res.json(result.rows[0]);

  } catch (err) {
    return res.status(500).json({error : "INTERNAL_SERVER_ERROR"});
  }
}
