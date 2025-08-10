import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { findUserByEmail } from "../db/queries.js"

dotenv.config({quiet: true})

const JWT_SECRET = process.env.JWT_SECRET

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    if (!token) return res.status(401).json({ message: "Unauthorized" })

    const decoded = jwt.verify(token, JWT_SECRET)
    if (!decoded) return res.status(401).json({ message: "Invalid token" })

    const user = await findUserByEmail(decoded.email)

    if (!user) return res.status(401).json({ message: "Invalid token" })

    req.user = user
    next()
  } catch (error) {
    console.error("Authentication error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export default auth
