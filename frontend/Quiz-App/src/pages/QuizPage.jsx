import { useLocation, useNavigate } from "react-router-dom"
import { useSocket } from "../contexts/SocketContex"
import { useEffect, useState } from "react"
import LoadingBar from "../components/LoadingBar"
import FinalscoreCard from "../components/FinalscoreCard"
import { ROUTES } from "../constants/routes"
import { set } from "lodash"

export default function QuizPage() {
  const location = useLocation()
  const { name, roomId, quizName } = location.state
  const socket = useSocket()

  const navigate = useNavigate()

  const [quizState, setQuizState] = useState('waiting-to-start')
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [leaderboard, setLeaderboard] = useState([])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [timeTaken, setTimeTaken] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(null)

  const handleQuestionReceived = (data) => {
    setCurrentQuestion(data.question)
    setTimeLeft(data.timeLimit)
    setQuizState('question-active')
    setSelectedOption(null)
    setHasSubmitted(false)
    setQuestionStartTime(Date.now())
    setTimeTaken(0)
  }

  const handleRoomClosed = (data) => {
    alert(data.message)
    navigate(ROUTES.LANDING_PAGE)
  }

  const handleSubmitAnswer = () => {
    if (hasSubmitted) return
    
    if (questionStartTime) {
      const timeElapsed = Math.round((Date.now() - questionStartTime) / 1000)
      setTimeTaken(timeElapsed)
    }
    
    setHasSubmitted(true)
    socket.send(JSON.stringify({
      type: "submit-answer",
      roomId,
      questionId: currentQuestion.id,
      selectedOptionId: selectedOption,
      playerName: name
    }))
  }

  useEffect(() => {
    if (timeLeft > 0 && !hasSubmitted) {
      setTimeLeft(timeLeft - 1)
    } else if (timeLeft === 0 && !hasSubmitted) {
      handleSubmitAnswer()
    }
  }, [timeLeft])

  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        switch (data.type) {
          case "question-received": handleQuestionReceived(data); break;
          case "question-ended": setQuizState('waiting-for-next'); break;
          case "leaderboard-update": setLeaderboard(data.leaderboard); break;
          case "quiz-ended": setQuizState('quiz-ended'); break;
          case "room-closed": handleRoomClosed(data); break;
        }
      } catch (e) {
        console.error("Error parsing message:", e)
      }
    }
    socket.addEventListener("message", handleMessage)
    return () => socket.removeEventListener("message", handleMessage)
  }, [socket])

  

  const renderActiveQuestion = () => (
    <div className="min-h-screen bg-gray-50 py-8 px-2">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded shadow p-6">
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Question</h2>
            <div className="text-lg font-bold text-red-600">Time: {timeLeft}s</div>
          </div>
          
          <p className="text-lg mb-10">{currentQuestion?.text}</p>
          
          <div className="space-y-3 mb-6">
            {currentQuestion?.options?.map((option) => (
              <label
                key={option.id}
                className={`block p-3 border rounded cursor-pointer transition ${
                  selectedOption === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                } ${hasSubmitted ? 'cursor-not-allowed' : ''}`}
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
  switch (quizState) {
    case 'waiting-to-start': return <LoadingBar text="Waiting for host to start the quiz" />
    case 'question-active': return renderActiveQuestion()
    case 'waiting-for-next': return <LoadingBar text="keep Going" />
    case 'quiz-ended': return <FinalscoreCard leaderboard={leaderboard} quiz={quizName} name={name} />
    default: return <LoadingBar text="Loading..." />
  }
}
