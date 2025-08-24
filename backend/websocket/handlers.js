import { generateUniqueId } from "../utils/uniqueId.js";

export const rooms = new Map();

const handleCreateRoom = (data, ws) => {
    const roomId = generateUniqueId()
    const title = data.title
    const questions = data.questions
    rooms.set(roomId, { id: roomId, participants: [], admin: ws, title, questions })
    ws.send(JSON.stringify({ type: "room-created", roomId }))
}

const handleJoinRoom = async (data, ws) => {
    const { roomId,name } = data
    const room = rooms.get(roomId)
    const score = 0
    if (room) {
            if (room.participants.some(participant => participant[1] === name)) {
                ws.send(JSON.stringify({ type: "error", message: "Name already taken" }))
                return
            }
            room.participants.push([ws, name, score])

        ws.send(JSON.stringify({ type: "room-joined", quizName: room.quizName }))
        room.admin.send(JSON.stringify({ 
            type: "participant-joined", 
            participant: {
                name: name,
                score: score
            }
        }))
        handleLeaderboardUpdate(room)
    } else {
        ws.send(JSON.stringify({ type: "error", message: "Room not found" }))
    }
}

const handleLeaderboardUpdate = (room) => {
    const leaderboard = room.participants.map(participant => [participant[1], participant[2]])
    leaderboard.sort((a, b) => b[1] - a[1])
    room.admin.send(JSON.stringify({ type: "leaderboard-update", leaderboard }))
    room.participants.forEach((participant) => {
        participant[0].send(JSON.stringify({ type: "leaderboard-update", leaderboard }))
    })
}

const handleStartQuiz = (data, ws) => {
    // Handle starting a quiz
}

const handleEndQuiz = (data, ws) => {
    // Handle ending a quiz
}

const handleNextQuestion = (data, ws) => {
    // Handle moving to the next question
}

const handlers = {
    handleCreateRoom,
    handleJoinRoom,
    handleStartQuiz,
    handleEndQuiz,
    handleNextQuestion
};

export default handlers;