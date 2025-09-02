import { useLocation } from "react-router-dom"
import { useSocket } from "../contexts/SocketContex"
import { useEffect, useState } from "react"
import LoadingBar from "../components/LoadingBar"
import FinalscoreCard from "../components/FinalscoreCard"

export default function QuizPage() {
  const location = useLocation()
  const { name, roomId, quizName } = location.state || {}
  const socket = useSocket()

  const [quizState, setQuizState] = useState('waiting-to-start')
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [leaderboard, setLeaderboard] = useState([])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [timeTaken, setTimeTaken] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(null)

  useEffect(() => {
    if (timeLeft > 0 && quizState === 'question-active' && !hasSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && quizState === 'question-active' && !hasSubmitted) {
      handleSubmitAnswer()
    }
  }, [timeLeft, quizState, hasSubmitted])

  useEffect(() => {
    if (socket) {
      const handleMessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log("Received message:", data)

          switch (data.type) {
            case "quiz-started":
              setQuizState('waiting-for-next')
              break
            
            case "question-received":
              setCurrentQuestion(data.question)
              setTimeLeft(data.timeLimit || 60)
              setQuizState('question-active')
              setSelectedOption(null)
              setHasSubmitted(false)
              setQuestionStartTime(Date.now())
              setTimeTaken(0)
              break
            
            case "question-ended":
              setQuizState('waiting-for-next')
              break
            
            case "leaderboard-update":
              setLeaderboard(data.leaderboard)
              break
            
            case "quiz-ended":
              setQuizState('quiz-ended')
              break
            
            case "room-closed":
              alert(data.message)
              window.location.href = '/'
              break
            
            case "error":
              alert(data.message)
              break
          }
        } catch (e) {
          console.error("Error parsing message:", e)
        }
      }

      socket.addEventListener("message", handleMessage)
      return () => socket.removeEventListener("message", handleMessage)
    }
  }, [socket])

  const handleSubmitAnswer = () => {
    if (hasSubmitted) return
    
    // Calculate time taken
    if (questionStartTime) {
      const timeElapsed = Math.round((Date.now() - questionStartTime) / 1000)
      setTimeTaken(timeElapsed)
    }
    
    setHasSubmitted(true)
    if (socket && currentQuestion) {
      socket.send(JSON.stringify({
        type: "submit-answer",
        roomId,
        questionId: currentQuestion.id,
        selectedOptionId: selectedOption,
        playerName: name
      }))
    }
  }

  const renderWaitingToStart = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded shadow p-8 text-center max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Welcome to {quizName}!</h1>
        <p className="text-gray-700 mb-4">Hello, {name}</p>
        <p className="text-gray-600">Waiting for the quiz to start...</p>
        <div className="mt-4">
          <div className="animate-pulse">
            <div className="w-4 h-4 bg-blue-400 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderActiveQuestion = () => (
    <div className="min-h-screen bg-gray-50 py-8 px-2">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Question</h2>
            <div className="text-lg font-bold text-red-600">
              Time: {timeLeft}s
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-lg mb-4">{currentQuestion?.text}</p>
          </div>

          <div className="space-y-3 mb-6">
            {currentQuestion?.options?.map((option) => (
              <label
                key={option.id}
                className={`block p-3 border rounded cursor-pointer transition ${
                  selectedOption === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                } ${hasSubmitted ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  disabled={hasSubmitted}
                  className="mr-3"
                />
                {option.text}
              </label>
            ))}
          </div>

          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedOption || hasSubmitted}
            className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {hasSubmitted ? 'Answer Submitted' : 'Submit Answer'}
          </button>

          {hasSubmitted && (
            <div className="mt-4 text-center text-gray-600">
              {`You answered the question in ${timeTaken} seconds`}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderWaitingForNext = () => (
    <LoadingBar text="keep Going" />
  )

  const renderQuizEnded = () => (
          <FinalscoreCard leaderboard={leaderboard} quiz={quizName} name={name} />
  )

  switch (quizState) {
    case 'waiting-to-start':
      return renderWaitingToStart()
    case 'question-active':
      return renderActiveQuestion()
    case 'waiting-for-next':
      return renderWaitingForNext()
    case 'quiz-ended':
      return renderQuizEnded()
    default:
      return renderWaitingToStart()
  }
}
