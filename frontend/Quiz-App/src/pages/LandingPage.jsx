import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/routes";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../contexts/SocketContex";

export default function LandingPage() {

  const navigate = useNavigate()

  const [code,setCode] = useState(['','','','','','','',''])
  const codeRefs = useRef([])
  const nameRef = useRef(null)

  const [showCodeError, setShowCodeError] = useState(false)
  const [codeError,setCodeError] = useState('')

  const socket = useSocket()

  useEffect(() => {
    codeRefs.current[0].focus()
  }, [])

  const handleCodeChange = (e, idx) => {
    if(isNaN(e.target.value) || e.target.value.length > 1) {
      setCodeError('Please enter a valid digit')
      setShowCodeError(true)
      setTimeout(() => {
        setShowCodeError(false)
      }, 5000)
      e.target.value = ''
      return;
    }
    else{
      setShowCodeError(false)
    }
    const newCode = [...code]
    newCode[idx] = e.target.value
    setCode(newCode)
    if (e.target.value){
      if (idx < code.length - 1) {
        codeRefs.current[idx+1].focus()
      }
      else{
        codeRefs.current[code.length - 1].blur()
        nameRef.current.focus()
      }
    }
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !code[idx]) {
      codeRefs.current[idx - 1].focus()
    }
  }

  const handleJoinQuiz = () => {
    const quizCode = code.join("")
    console.log(quizCode)
    const userName = nameRef.current.value

    if (quizCode.length === 8 && userName) {
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
        <div className="flex flex-wrap gap-1 mb-4">
          {code.map((digit, idx) => (
            <span key={idx}>
              <input
                ref={e => codeRefs.current[idx] = e}
                type="text"
                inputMode="numeric"
                value={digit}
                onKeyDown={e => handleKeyDown(e, idx)}
                onChange={(e) => handleCodeChange(e, idx)}
                className="p-2 border border-gray-300 rounded w-7 h-8  md:w-12 md:h-10 text-center hover:border-blue-500"
              />
              {idx == 3 ? <span className="mx-2"> -</span> : null}
            </span>
          ))}
        </div>
        <input 
          type="text"
          ref = {nameRef} 
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
          <Link to={ROUTES.AUTH_PAGE}
            className="text-blue-500 hover:underline"
          >
            Create
          </Link>
        </p>
      </div>
    </div>
  )
}
