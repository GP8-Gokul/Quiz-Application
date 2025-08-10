import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { WebSocketServer, WebSocket } from 'ws'
import dotenv from "dotenv";

import authRoutes from './routes/authentication.js'
import quizRoutes from './routes/quiz.js'

dotenv.config({ quiet: true });

const PORT = process.env.PORT || 3000

const app = express()
const server = createServer(app)

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/quiz", quizRoutes)

const wss = new WebSocketServer({ server })


server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`)
})