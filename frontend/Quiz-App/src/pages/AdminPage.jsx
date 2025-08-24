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
  }

  if (!quiz) {
    return <div>Loading quiz...</div>
  }

  const currentQuestion = quiz.questions[currentQuestionIdx]

  return (
    <div className="p-4 space-y-6">
      <p>{quiz.title}</p>
      <p>Participants joined: {noOfParticipants}</p>
      {roomId && 
        <div className="mt-4 p-2 bg-green-100 rounded flex items-center gap-2">
          <span>Room ID: <span className="font-mono select-all">{roomId}</span></span>
          <button onClick={handleCopy} className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">{copied ? "Copied!" : "Copy"}</button>
          <button onClick={handleShare} className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">Share</button>
          {shareError && <span className="ml-2 text-red-500 text-sm">{shareError}</span>}
        </div>}
      <div className="flex">
        {/* Current Question Section */}
        <div className="flex-1 gap-5 bg-white rounded shadow p-4 mt-6">
          <div className="mb-2 flex justify-between items-center">
            <div className="font-semibold">Current Question ({currentQuestionIdx + 1}/{quiz.questions.length})</div>
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
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="flex-1 bg-white rounded shadow p-4 mt-6">
          <div className="font-semibold mb-2">Leaderboard</div>
          {leaderboard.length === 0 ? (
            <div className="text-gray-500">No data yet.</div>
          ) : (
            <ul className="space-y-1">
              {leaderboard.map((entry, idx) => (
                <li key={entry.id || idx} className="flex justify-between">
                  <span>{entry.name}</span>
                  <span>{entry.score}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
    </div>
  )
}
