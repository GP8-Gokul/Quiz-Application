import { addGuestName } from "../db/queries.js";
import { generateUniqueId } from "../utils/uniqueId.js";

const rooms = new Map();

const handleCreateRoom = (data, ws) => {
    const roomId = generateUniqueId()
    const quizName = data.quizName || "Untitled Quiz"
    rooms.set(roomId, { id: roomId, participants: [], admin: ws, quizName })
    ws.send(JSON.stringify({ type: "room-created", roomId }))
}

const handleJoinRoom = async (data, ws) => {
    const { roomId,playerId,name } = data
    const room = rooms.get(roomId)
    if (room) {
        if(data.userType == 'guest'){
            if (room.participants.some(participant => participant[2] === name)) {
                ws.send(JSON.stringify({ type: "error", message: "Name already taken" }))
                return
            }
            name = name + ' (guest)'
            room.participants.push([ws, playerId, name, score=0])
            await addGuestName(guest.id, name)
        }
        else{
            room.participants.push([ws, playerId, name, score=0])
        }
        ws.send(JSON.stringify({ type: "room-joined", quizName: room.quizName }))
        room.admin.send(JSON.stringify({ 
            type: "new-participant", 
            participant: {
                id: playerId,
                name: name,
                score: 0
            } }))
    } else {
        ws.send(JSON.stringify({ type: "error", message: "Room not found" }))
    }
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