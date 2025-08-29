export const rooms = new Map()

export const createParticipant = (ws, name) => ({
    ws,
    name,
    score: 0
})

export const createRoom = (id, admin, title, questions) => ({
    id,
    admin,
    title,
    questions,
    participants: [],
    currentQuestion: null,
    answers: []
})

export const findRoomByAdmin = (ws) => {
    for (const room of rooms.values()) {
        if (room.admin === ws) return room
    }
    return null
}