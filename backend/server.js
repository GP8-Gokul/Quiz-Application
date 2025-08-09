const express = require('express')
const http = require('http')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const {WebSocketServer,WebSocket} = require('ws')
require('dotenv').config()

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(helmet())
app.use(morgan('dev'));

const wss = new WebSocketServer({ server })


server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on PORT ${server.address().port}`)
})