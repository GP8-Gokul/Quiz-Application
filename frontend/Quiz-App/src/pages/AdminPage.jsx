import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSocket } from "../contexts/SocketContex"

export default function AdminPage() {
  const { slug } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [roomId, setRoomId] = useState(localStorage.getItem(`roomId-${slug}`) || null)
  const [copied, setCopied] = useState(false)
  const [shareError, setShareError] = useState("")
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [peopleAnswered, setPeopleAnswered] = useState(0)
  const [timer, setTimer] = useState(60)
  const [leaderboard, setLeaderboard] = useState([])
  const [noOfParticipants, setNoOfParticipants] = useState(0)
  const [sentQuestions, setSentQuestions] = useState([])
  const socket = useSocket()

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

  useEffect(() => {
    if (quiz && socket && !roomId) {
      socket.send(
        JSON.stringify({
          type: "create-room",
          title: quiz.title,
          questions: quiz.questions
        })
      )
      const handleMessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === "room-created") {
            setRoomId(data.roomId)
            localStorage.setItem(`roomId-${slug}`, data.roomId)
          }
        } catch (e) {
          console.error(e)
        }
      }
      socket.addEventListener("message", handleMessage)
      return () => {
        socket.removeEventListener("message", handleMessage)
      }
    }
  }, [quiz,socket])

  useEffect(() => {
    if (socket) {
      const handleMessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === "participant-joined") {
          setNoOfParticipants((prev) => prev + 1)
        } else if (data.type === "participant-left") {
          setNoOfParticipants((prev) => prev - 1)
        } 
        if (data.type === "leaderboard-update") {
          setLeaderboard(data.leaderboard)
          console.log("Leaderboard updated:", data.leaderboard)
        }
      }
      socket.addEventListener("message", handleMessage)
      return () => {
        socket.removeEventListener("message", handleMessage)
      }
    }
  }, [socket])

  const handleCopy = async () => {
    if (!roomId) return;

    if (!navigator.clipboard) {
      setCopied(false);
      console.warn("Clipboard API not supported");
      return;
    }

    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setCopied(false);
    }
  };


  const handleShare = async () => {
    setShareError("");

    if (!navigator.share) {
      setShareError("Sharing not supported on this device.");
      return;
    }

    try {
      await navigator.share({
        title: "Quiz Room\n",
        text: `Join my quiz room! Room ID: ${roomId}`,
      });
    } catch (err) {
      console.error("Share failed:", err);
      setShareError("Share cancelled or failed.");
    }
    
  };


  const handleSendQuestion = (time) => {
    setTimer(time)
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

  const handleNextQuestion = () => {
    setCurrentQuestionIdx(idx => Math.min(idx + 1, quiz.questions.length - 1))
  }

  const handlePrevQuestion = () => {
    setCurrentQuestionIdx(idx => Math.max(idx - 1, 0))
  }

  if (!quiz) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading quiz...</div>
  }

  const currentQuestion = quiz.questions[currentQuestionIdx]

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded shadow p-4 flex flex-col gap-2">
          <p className="text-lg font-semibold">{quiz.title}</p>
          <p className="text-gray-700">Participants joined: <span className="bg-gray-100 px-2 py-1 rounded">{noOfParticipants}</span></p>
          {roomId && 
            <div className="p-2 bg-green-100 rounded flex items-center gap-2">
              <span>Room ID: <span className="font-mono select-all">{roomId}</span></span>
              <button onClick={handleCopy} className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">{copied ? "Copied!" : "Copy"}</button>
              <button onClick={handleShare} className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">Share</button>
              {shareError && <span className="ml-2 text-red-500 text-sm">{shareError}</span>}
            </div>}
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Current Question Section */}
          <div className="flex-1 bg-white rounded shadow p-4">
            <div className="mb-2 flex justify-between items-center">
              <div className="font-semibold flex items-center gap-2">
                Current Question ({currentQuestionIdx + 1}/{quiz.questions.length})
                {/* Indicator for sent questions */}
                <div className="flex gap-1 ml-4">
                  {quiz.questions.map((q, idx) => (
                    <span key={q.id}  title={q.text}></span>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-500">Time Left: <span className="bg-gray-100 px-2 py-1 rounded">{timer}s</span></div>
            </div>
            <div className="mb-2">{currentQuestion.text}</div>
            <ul className="list-disc ml-6 mb-2">
              {currentQuestion.options.map(opt => (
                <li key={opt.id}>{opt.text}</li>
              ))}
            </ul>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-600">People Answered: <span className="bg-gray-100 px-2 py-1 rounded">{peopleAnswered}</span></span>
              <button onClick={() => handleSendQuestion(60)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Send Question</button>
              <button onClick={handlePrevQuestion} disabled={currentQuestionIdx === 0} className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50">Previous</button>
              <button onClick={handleNextQuestion} disabled={currentQuestionIdx === quiz.questions.length - 1} className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50">Next</button>
            </div>
          </div>
          {/* Leaderboard Section */}
          <div className="flex-1 bg-white rounded shadow p-4">
            <div className="font-semibold mb-2">Leaderboard</div>
            {leaderboard.length === 0 ? (
              <div className="text-gray-500">No data yet.</div>
            ) : (
              <ul className="space-y-1 ">
                {leaderboard.map((entry, idx) => (
                  <li key={entry.id || idx} className="flex justify-between">
                    <span>{entry[0]}</span>
                    <span>{entry[1]}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
