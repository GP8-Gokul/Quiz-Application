import { Link, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../constants/Routes";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../contexts/SocketContex";

export default function LandingPage() {

  const navigate = useNavigate()

  const codeRef = useRef(null)
  const nameRef = useRef(null)

  const [showCodeError, setShowCodeError] = useState(false)
  const [codeError,setCodeError] = useState('')

  const socket = useSocket()
  const paramCode = useParams().code

  useEffect(() => {
    if(paramCode) {
      codeRef.current.value = paramCode
    }
  }, [])

  const handleJoinQuiz = () => {
    const quizCode = codeRef.current.value
    const userName = nameRef.current.value

    if (quizCode.length === 8 && userName.length <= 10) {
      socket.send(JSON.stringify({
        type: "join-room",
        roomId: quizCode,
        name: userName
      }))

      socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data)
        if (data.type === "room-joined") {
          navigate(ROUTES.QUIZ_PAGE, { state: { name: userName, roomId: quizCode, quizName: data.quizName } })
        }
        if (data.type === "error") {
          setCodeError(data.message)
          setShowCodeError(true)
          setTimeout(() => {
            setShowCodeError(false)
          }, 5000)
        }
      })
    } else {
      if (quizCode.length !== 8) {
        setCodeError('Please enter a valid quiz code')
      }
      if (!userName) {
        setCodeError('Please enter your name')
      }
      if (userName.length > 10){
        setCodeError("Name should be less than 10 characters")
      }
      setShowCodeError(true)
      setTimeout(() => {
        setShowCodeError(false)
      }, 5000)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-[#bbabab63]">
      {showCodeError && (
        <div className=" text-red-600 p-2 rounded , mb-10">
          {codeError}
        </div>
      )}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-[95vw] md:max-w-[40vw] text-center flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold text-[#162fd5] mb-8">
          Welcome to Quiz App
        </h1>
        <h1 className="text-2xl font-bold text-[#010101] mb-4">
          Enter code to join the quiz
        </h1>
        <input 
          type="text"
          ref={codeRef}
          placeholder="xxxxxxxx"
          className="p-2 border border-gray-300 rounded w-[60vw] md:w-[20vw]"
          onKeyDown={e => {
            if (e.key === "Enter") {
              nameRef.current.focus();
            }
          }}
        />
        <input 
          type="text"
          ref={nameRef} 
          placeholder="Enter your name" 
          onKeyDown={e => {
            if (e.key === "Enter") {
              handleJoinQuiz();
            }
          }}
          className="p-2 border border-gray-300 rounded w-[60vw] md:w-[20vw] " 
        />
        <button 
          className="mt-4 p-2 bg-[#162fd5d8] text-white rounded w-[60vw] md:w-[20vw]"
          onClick={handleJoinQuiz}
        >
            Join Quiz
        </button>

        <p className="text-black mt-6">
          Want to create a room? 
          <Link to={ROUTES.CREATE_QUIZ_PAGE}
            className="text-blue-500 hover:underline"
          >
            Create
          </Link>
        </p>
      </div>
    </div>
  )
}
