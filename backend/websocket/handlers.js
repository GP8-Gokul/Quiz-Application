import { generateUniqueId } from "../utils/uniqueId.js"
import { rooms, createRoom, createParticipant, findRoomByAdmin } from "./room.js"
import { sendToClient, broadcastToParticipants, evaluateAnswers } from "./helpers.js"


const handleLeaderboardUpdate = (room) => {
    const leaderboard = room.participants
        .map(p => ({ name: p.name, score: p.score }))
        .sort((a, b) => b.score - a.score)

    sendToClient(room.admin, { type: "leaderboard-update", leaderboard })
    broadcastToParticipants(room, { type: "leaderboard-update", leaderboard })
}

const handleCreateRoom = (data, ws) => {
    const roomId = generateUniqueId()
    const { title, questions } = data
    const newRoom = createRoom(roomId, ws, title, questions)
    rooms.set(roomId, newRoom)
    sendToClient(ws, { type: "room-created", roomId })
}

const handleJoinRoom = async (data, ws) => {
    const { roomId, name } = data
    const room = rooms.get(roomId)

    if (!room) {
        sendToClient(ws, { type: "error", message: "Room not found" })
        return
    }

    if (room.participants.some(p => p.name === name)) {
        sendToClient(ws, { type: "error", message: "Name already taken" })
        return
    }

    const participant = createParticipant(ws, name)
    room.participants.push(participant)

    sendToClient(ws, { type: "room-joined", quizName: room.title })
    sendToClient(room.admin, { 
        type: "participant-joined", 
        participant: { name: participant.name, score: participant.score }
    })

    handleLeaderboardUpdate(room)
}

const handleEndQuiz = (data, ws) => {
    const targetRoom = findRoomByAdmin(ws)
    if (!targetRoom) return

    broadcastToParticipants(targetRoom, { type: "quiz-ended" })
    sendToClient(targetRoom.admin, { type: "quiz-ended" })
}

const handleNextQuestion = (data, ws) => {
    const { questionId, time } = data
    const targetRoom = findRoomByAdmin(ws)

    if (targetRoom && targetRoom.questions[questionId]) {
        const question = targetRoom.questions[questionId]
        targetRoom.questionStartTime = Date.now()
        targetRoom.questionTimeLimit = (time || 60) * 1000
        broadcastToParticipants(targetRoom, {
            type: "question-received",
            question: {
                id: questionId,
                text: question.text,
                options: question.options.map(opt => ({ id: opt.id, text: opt.text }))
            },
            timeLimit: time || 60
        })
        
        targetRoom.currentQuestion = questionId
        targetRoom.answers = []
    }
}

const handleSubmitAnswer = (data, ws) => {
    const { roomId, questionId, selectedOptionId, playerName } = data
    const room = rooms.get(roomId)

    const now = Date.now()
    if ((now - room.questionStartTime) > room.questionTimeLimit) {
        sendToClient(ws, { type: "error", message: "time-out" })
        return
    }

    if (room.answers.find(a => a.playerName === playerName)) return

    const timeTaken = now - room.questionStartTime
    room.answers.push({ playerName, questionId, selectedOptionId, timeTaken })

    sendToClient(room.admin, {
        type: "participant-answered",
        answeredCount: room.answers.length,
        totalCount: room.participants.length
    })

    if (room.answers.length === room.participants.length) {
        evaluateAnswers(room, questionId)
        handleLeaderboardUpdate(room)

        broadcastToParticipants(room, { type: "question-ended" })
        sendToClient(room.admin, { type: "question-ended" })
    }
}

const handleEndQuestion = (data, ws) => {
    const targetRoom = findRoomByAdmin(ws)

    if (targetRoom.answers && targetRoom.answers.length > 0) {
        evaluateAnswers(targetRoom, targetRoom.currentQuestion)
        handleLeaderboardUpdate(targetRoom)
    }

    broadcastToParticipants(targetRoom, { type: "question-ended" })
    sendToClient(targetRoom.admin, { type: "question-ended" })
}

const handlers = {
    handleCreateRoom,
    handleJoinRoom,
    handleEndQuiz,
    handleNextQuestion,
    handleEndQuestion,
    handleSubmitAnswer,
}

export default handlers
