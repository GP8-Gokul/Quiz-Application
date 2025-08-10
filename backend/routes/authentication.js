import { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { createUser, findUserByEmail } from "../db/queries.js";

dotenv.config({ quiet: true });

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET

router.post("/signup",async(req,res)=>{
    try{
        const {email,password,name} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        if(await findUserByEmail(email)){
            return res.status(400).json({ message: "User already exists" })
        }
        await createUser(email, hashedPassword, name)
        res.status(201).json({ message: "User created successfully" })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
    }
})

router.post("/signin",async(req,res)=>{
    try{
        const {email,password} = req.body
        const user = await findUserByEmail(email)
        if(!user){
            return res.status(400).json({ message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const token = jwt.sign({ email: user.email }, JWT_SECRET)
        res.status(200).json({ 
            token,
            name: user.name
         })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
    }
})

export default router
