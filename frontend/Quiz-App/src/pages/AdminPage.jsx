import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSocket } from "../contexts/SocketContex"
import LeaderboardCard from "../components/LeaderboardCard"

export default function AdminPage() {
  const { slug } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [roomId, setRoomId] = useState(localStorage.getItem(`roomId-${slug}`) || null)
  const [copied, setCopied] = useState(false)
  const [shareError, setShareError] = useState("")
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [peopleAnswered, setPeopleAnswered] = useState(0)
  const [timer, setTimer] = useState(60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const [noOfParticipants, setNoOfParticipants] = useState(0)
  const [sentQuestions, setSentQuestions] = useState([])
  const [quizEnded, setQuizEnded] = useState(false)
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState(0)
  const socket = useSocket()

  useEffect(() => {
    if (autoAdvanceCountdown > 0) {
      const countdown = setTimeout(() => setAutoAdvanceCountdown(autoAdvanceCountdown - 1), 1000)
      return () => clearTimeout(countdown)
    }
  }, [autoAdvanceCountdown])

  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000)
      return () => clearTimeout(countdown)
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false)
      handleEndQuestion()
    }
  }, [timer, isTimerRunning])

  useEffect(() => {
    axios.get(`http://localhost:3000/quiz/${slug}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(response => {
        setQuiz(response.data)
      })
      .catch(error => {
        console.error("Error fetching quiz details:", error)
      })
  }, [])


  // Combine all WebSocket message handling into a single useEffect
  useEffect(() => {
    if (!socket) return;

    // If quiz is loaded and no roomId, create the room
    if (quiz && !roomId) {
      socket.send(JSON.stringify({
        type: "create-room",
        title: quiz.title,
        questions: quiz.questions
      }))
    }

    const handleMessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data)
      } catch (e) {
        console.error(e)
        return
      }
      switch (data.type) {
        case "room-created":
          setRoomId(data.roomId)
          localStorage.setItem(`roomId-${slug}`, data.roomId)
          break;
        case "participant-joined":
          setNoOfParticipants((prev) => prev + 1)
          break;
        case "participant-left":
          setNoOfParticipants((prev) => prev - 1)
          break;
        case "leaderboard-update":
          setLeaderboard(data.leaderboard)
          console.log("Leaderboard updated:", data.leaderboard)
          break;
        case "question-ended":
          setPeopleAnswered(0)
          setIsTimerRunning(false)
          setAutoAdvanceCountdown(3)
          setTimeout(() => {
            setCurrentQuestionIdx(prev => {
              const nextIdx = prev + 1
              if (quiz && nextIdx >= quiz.questions.length) {
                handleEndQuiz()
                return prev
              }
              setAutoAdvanceCountdown(0)
              return nextIdx
            })
          }, 3000)
          break;
        case "quiz-ended":
          setQuizEnded(true)
          setIsTimerRunning(false)
          setAutoAdvanceCountdown(0)
          break;
        case "participant-answered":
          setPeopleAnswered(data.answeredCount)
          break;
        default:
          break;
      }
    }

    socket.addEventListener("message", handleMessage)
    return () => {
      socket.removeEventListener("message", handleMessage)
    }
  }, [socket, quiz, roomId])

  const handleCopy = async () => {
    if (!roomId) return

    if (!navigator.clipboard) {
      setCopied(false)
      console.warn("Clipboard API not supported")
      return
    }

    try {
      await navigator.clipboard.writeText(roomId)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error("Failed to copy text: ", err)
      setCopied(false)
    }
  }

  const handleShare = async () => {
    setShareError("")

    if (!navigator.share) {
      setShareError("Sharing not supported on this device.")
      return
    }

    try {
      await navigator.share({
        title: "Quiz Room\n",
        text: `Join my quiz room! Room ID: ${roomId}`,
      })
    } catch (err) {
      console.error("Share failed:", err)
      setShareError("Share cancelled or failed.")
    }
  }

  const handleSendQuestion = (time) => {
    setTimer(time)
    setIsTimerRunning(true)
    setPeopleAnswered(0)
    if (!sentQuestions.includes(currentQuestionIdx)) {
      setSentQuestions(prev => [...prev, currentQuestionIdx])
    }
    socket.send(JSON.stringify({
      type: "next-question",
      questionId: currentQuestionIdx,
      time
    }))
  }

  const handleEndQuestion = () => {
    setIsTimerRunning(false)
    socket.send(JSON.stringify({
      type: "end-question",
      roomId
    }))
  }

  const handleEndQuiz = () => {
    setQuizEnded(true)
    setIsTimerRunning(false)
    setAutoAdvanceCountdown(0)
    socket.send(JSON.stringify({
      type: "end-quiz",
      roomId
    }))
  }

  const handleNextQuestion = () => {
    if (quiz) {
      setCurrentQuestionIdx(idx => Math.min(idx + 1, quiz.questions.length - 1))
    }
  }

  const handlePrevQuestion = () => {
    setCurrentQuestionIdx(idx => Math.max(idx - 1, 0))
  }

  if (!quiz) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading quiz...</div>
  }

  if (quizEnded) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded">
            <h1 className="text-2xl font-bold text-green-600 mb-4">Quiz Completed!</h1>
            <p className="mb-4">Thank you for hosting "{quiz.title}"</p>
            <div className="bg-green-100 p-3 rounded mb-4">
              <p>All participants have been notified that the quiz has ended.</p>
            </div>

            <LeaderboardCard leaderboard={leaderboard} />

            <div className="flex gap-3">
              <button 
                onClick={() => window.location.href = '/my-quizzes'} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Back to My Quizzes
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Host Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIdx]

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="bg-white p-4 rounded">
          <h1 className="text-xl font-bold">{quiz.title}</h1>
          <p>Participants: {noOfParticipants}</p>
          {roomId && 
            <div className="mt-2 p-2 bg-green-100 rounded">
              <div className="flex items-center gap-2">
                <div>Room ID: {roomId}</div>
                <button onClick={handleCopy} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={handleShare} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">
                  Share
                </button>
                {shareError && <div className="text-red-500 text-sm">{shareError}</div>}
              </div>
            </div>}
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded">
            {autoAdvanceCountdown > 0 && (
              <div className="mb-3 p-2 bg-blue-100 rounded">
                <p className="text-center">Auto-advancing in {autoAdvanceCountdown} seconds...</p>
              </div>
            )}
            
            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold">
                  Question {currentQuestionIdx + 1}/{quiz.questions.length}
                  <div className="flex gap-1 mt-1">
                    {quiz.questions.map((q, idx) => (
                      <div key={q.id} className={
                        "w-2 h-2 rounded " +
                        (sentQuestions.includes(idx) ? "bg-green-500" : "bg-gray-300")
                      }></div>
                    ))}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-sm ${timer <= 10 ? 'bg-red-100' : 'bg-gray-100'}`}>
                  {timer}s
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <p className="font-medium mb-2">{currentQuestion.text}</p>
              <ul className="list-disc ml-4 space-y-1">
                {currentQuestion.options.map(opt => (
                  <li key={opt.id}>{opt.text}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-3">
              <div className={`inline-block px-2 py-1 rounded text-sm ${
                peopleAnswered === noOfParticipants && noOfParticipants > 0 ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                Answered: {peopleAnswered}/{noOfParticipants}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleSendQuestion(60)} 
                disabled={isTimerRunning || autoAdvanceCountdown > 0} 
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isTimerRunning ? 'Active' : 'Send (60s)'}
              </button>
              <button 
                onClick={() => handleSendQuestion(30)} 
                disabled={isTimerRunning || autoAdvanceCountdown > 0} 
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                Send (30s)
              </button>
              {isTimerRunning && (
                <button onClick={handleEndQuestion} className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700">
                  End Now
                </button>
              )}
              <button 
                onClick={handleEndQuiz} 
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={autoAdvanceCountdown > 0}
              >
                End Quiz
              </button>
              <button onClick={handlePrevQuestion} disabled={currentQuestionIdx === 0 || isTimerRunning} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50">
                Prev
              </button>
              <button onClick={handleNextQuestion} disabled={currentQuestionIdx === quiz.questions.length - 1 || isTimerRunning} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
          <LeaderboardCard leaderboard={leaderboard} />
        </div>
      </div>
    </div>
  )
}
