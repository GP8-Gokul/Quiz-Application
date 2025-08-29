export const sendToClient = (ws, data) => {
    ws.send(JSON.stringify(data))
}

export const broadcastToParticipants = (room, data) => {
    room.participants.forEach(p => sendToClient(p.ws, data))
}

export const evaluateAnswers = (room, questionId) => {
    const currentQuestion = room.questions[questionId]
    const correctOption = currentQuestion.options.find(opt => opt.isCorrect)
    room.answers.forEach(answer => {
        const participant = room.participants.find(p => p.name === answer.playerName)
        if (participant && answer.selectedOptionId === correctOption?.id) {
            const timeTaken = answer.timeTaken
            const timeLimit = room.questionTimeLimit
            const timeBonus = parseInt((timeLimit - timeTaken) * 500 / timeLimit)
            participant.score += 500 + timeBonus
        }
    })
}