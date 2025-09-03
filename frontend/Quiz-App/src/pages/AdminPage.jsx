import axios from "axios"
import { useEffect, useState } from "react"
import { useParams,useLocation } from "react-router-dom"
import { useSocket } from "../contexts/SocketContex"
import LeaderboardCard from "../components/LeaderboardCard"
import { BASE_HTTP_URL } from "../constants/Urls"
import LoadingBar from "../components/LoadingBar"
import FinalscoreCard from "../components/FinalscoreCard"

export default function AdminPage() {
  const { slug } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [roomId, setRoomId] = useState(null)
  const [copied, setCopied] = useState(false)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [peopleAnswered, setPeopleAnswered] = useState(0)
  const [timer, setTimer] = useState(60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const [noOfParticipants, setNoOfParticipants] = useState(0)
  const [sentQuestions, setSentQuestions] = useState([])
  const [quizEnded, setQuizEnded] = useState(false)
  const [time, setTime] = useState(30)
  const socket = useSocket()

  const handleQuestionEnded = () => {
    setPeopleAnswered(0)
    setIsTimerRunning(false)
    setCurrentQuestionIdx(prev => {
        let nextIdx = prev + 1
        if (nextIdx == quiz.questions.length) {
          if (quiz.questions.length === sentQuestions.length) {
            handleEndQuiz()
            return prev
          }
          nextIdx = quiz.questions.findIndex((q, idx) => !sentQuestions.includes(idx))
        }
        return nextIdx
      })
  }

  const handleQuizEnded = () => {
    setQuizEnded(true)
    setIsTimerRunning(false)
  }

  const handleCopy = async () => {
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
    try {
      const location = useLocation()
      const shareUrl = `${window.location.origin}${location.pathname}`
      await navigator.share({
        title: "Quiz Room",
        text: `Join my quiz room!\nRoom ID: ${roomId}\n${shareUrl}`
      })
    } catch (err) {
      console.error("Share failed:", err)
    }
  }

  const handleNextQuestion = () => {
    setCurrentQuestionIdx(idx => Math.min(idx + 1, quiz.questions.length - 1))
  }

  const handlePrevQuestion = () => {
    setCurrentQuestionIdx(idx => Math.max(idx - 1, 0))
  }

  useEffect(() => {
    axios.get(`${BASE_HTTP_URL}/quiz/${slug}`,{
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

  useEffect(() => {
    if (!socket) return

    if (quiz && !roomId) {
      socket.send(JSON.stringify({
        type: "create-room",
        title: quiz.title,
        questions: quiz.questions
      }))
    }

    const handleMessage = (event) => {
      let data
      try {
        data = JSON.parse(event.data)
      } catch (e) {
        console.error(e)
        return
      }

      switch (data.type) {
        case "room-created": setRoomId(data.roomId); break;
        case "participant-joined": setNoOfParticipants((prev) => prev + 1); break;
        case "participant-left": setNoOfParticipants((prev) => prev - 1); break;
        case "leaderboard-update": setLeaderboard(data.leaderboard); break;
        case "question-ended": handleQuestionEnded(); break;
        case "quiz-ended": handleQuizEnded(); break;
        case "participant-answered": setPeopleAnswered(data.answeredCount); break;
        default: break;
      }
    }

    socket.addEventListener("message", handleMessage)
    return () => { socket.removeEventListener("message", handleMessage)}
  }, [socket,quiz])

  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      const countdown = setTimeout(() => setTimer(prev => prev - 1), 1000)
      return () => clearTimeout(countdown)
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false)
      handleEndQuestion()
    }
  }, [timer, isTimerRunning])

  const handleSendQuestion = (time) => {
    setTimer(time)
    setIsTimerRunning(true)
    setPeopleAnswered(0)
    if (!sentQuestions.includes(currentQuestionIdx)) {
      setSentQuestions(prev => [...prev, currentQuestionIdx])
    }
    else{
      alert("Question already sent.")
      return
    }
    socket.send(JSON.stringify({
      type: "next-question",
      questionId: currentQuestionIdx,
      time
    }))
  }

  const handleEndQuestion = () => {
    setIsTimerRunning(false)
    setTimer(0)
    socket.send(JSON.stringify({
      type: "end-question",
      roomId
    }))
  }

  const handleEndQuiz = () => {
    setQuizEnded(true)
    setIsTimerRunning(false)
    socket.send(JSON.stringify({
      type: "end-quiz",
      roomId
    }))
  }

  if (!quiz) return <LoadingBar />

  if (quizEnded) return <FinalscoreCard leaderboard={leaderboard} quiz={quiz.title} />

  const currentQuestion = quiz.questions[currentQuestionIdx]

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">

        {/* Room id block */}
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
              </div>
            </div>
          }
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">

          {/* Main Dashboard */}
          <div className="bg-white p-4 rounded">
            
            {/* Question number and timer */}
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

            {/* Current Question and Options */}
            <div className="mb-3">
              <p className="font-medium mb-2">{currentQuestion.text}</p>
              <ul className="list-disc ml-4 space-y-1">
                {currentQuestion.options.map(opt => (
                  <li key={opt.id}>{opt.text}</li>
                ))}
              </ul>
            </div>
            
            {/* No of people Answered */}
            <div className={`inline-block mb-3 px-2 py-1 rounded text-sm ${
              peopleAnswered === noOfParticipants && noOfParticipants > 0 ? 'bg-green-100' : 'bg-gray-100'
              }`}>
              Answered: {peopleAnswered}/{noOfParticipants}
            </div>
            
            {/* Time Limit Setup */}
            <label>Time: </label>
            <input
              type="text"
              className="w-full/2 max-w-xs mb-2 border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
              value={time}
              onChange={e => {
                if (!isNaN(Number(e.target.value))) {
                  setTime(Number(e.target.value))
                }
              }}
            />

            {/* Buttons */}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleSendQuestion(time)} 
                disabled={isTimerRunning} 
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isTimerRunning ? 'Active' : `Send (${time}s)`}
              </button>

              {isTimerRunning && (
                <button onClick={handleEndQuestion} 
                className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  End Now
                </button>
              )}

              <button 
                onClick={handleEndQuiz} 
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={isTimerRunning}
              >
                End Quiz
              </button>

              <button 
                onClick={handlePrevQuestion} 
                disabled={currentQuestionIdx === 0 || isTimerRunning} 
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Prev
              </button>

              <button 
                onClick={handleNextQuestion} 
                disabled={currentQuestionIdx === quiz.questions.length - 1 || isTimerRunning} 
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            
          </div>

          <LeaderboardCard leaderboard={leaderboard} setLeaderboard={setLeaderboard} />
        </div>
      </div>
    </div>
  )
}
