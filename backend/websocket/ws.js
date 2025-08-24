import { WebSocketServer } from "ws"
import handlers from "./handlers.js"

const initWebSocket = (server) => {
    const wss = new WebSocketServer({ server })
    wss.on("connection", (ws,req) => {
        console.log("New Client connected : ", req.socket.remoteAddress)

        ws.on("message", (message) => {
            let data
            try{
                data = JSON.parse(message)
                console.log(`Received message of type: ${data.type} from ${req.socket.remoteAddress}`)
            } catch (error) {
                console.error("Invalid JSON:", error)
                return
            }
            switch(data.type){
                case "create-room": handlers.handleCreateRoom(data, ws); break;
                case "join-room": handlers.handleJoinRoom(data, ws); break;
                case "start-quiz": handlers.handleStartQuiz(data, ws); break;
                case "end-quiz": handlers.handleEndQuiz(data, ws); break;
                case "next-question": handlers.handleNextQuestion(data, ws); break;
                default: console.error("Unknown message type:", data.type);
            }
        })

        ws.on("close", () => {
            console.log("Client disconnected: ", req.socket.remoteAddress)
        })

    })
}

export default initWebSocket
