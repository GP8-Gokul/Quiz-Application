import axios from "axios"
import { useEffect, useState } from "react"
import { ROUTES } from "../constants/routes"
import { useNavigate } from "react-router-dom"

export default function MyQuizzesPage() {
  const [quiz, setQuiz] = useState()

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate(ROUTES.AUTH_PAGE)
    }
    axios.get("http://localhost:3000/quiz/my-quizzes", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      setQuiz(response.data)
    }).catch(error => {
      console.error("Error fetching quizzes:", error)
    })
  }, [])

  const handleGotoQuiz = (slug) => {
    navigate(ROUTES.QUIZ_DETAILS_PAGE.replace(':slug', slug))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-2xl bg-white rounded shadow p-6">
        <h1 className="text-2xl mb-6">My Quizzes</h1>
        {quiz && quiz.length > 0 ? (
          <ul className="space-y-4">
            {quiz.map((q) => (
              <li key={q.id} onClick={() => handleGotoQuiz(q.slug)} className="border rounded p-4 bg-gray-50 flex items-center">
                <h2 className="text-lg mb-1">{q.title}</h2>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-4">No quizzes found.</p>
        )}
      </div>
    </div>
  )
}

