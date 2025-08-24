import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ROUTES } from "../routes/routes"

export default function QuizDetailsPage() {
  const { slug } = useParams()
  const [quiz, setQuiz] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`http://localhost:3000/quiz/${slug}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(response => {
        console.log("Quiz details:", response.data)
        setQuiz(response.data)
      })
      .catch(error => {
        console.error("Error fetching quiz details:", error)
      })
  }, [])

  const handleGotoRoom = () => {
    navigate(ROUTES.ADMIN_PAGE.replace(':slug', quiz.slug))
  }


  if (!quiz) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading quiz...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-2xl bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl mb-4">Quiz Details</h1>
          <button onClick={handleGotoRoom} className="bg-blue-500 text-white px-4 py-2 rounded">Create Room</button>
        </div>
        <div className="mb-2">Title: <span className="bg-gray-100 px-2 py-1 rounded">{quiz.title}</span></div>
        <div className="mb-2">Created At: <span className="bg-gray-100 px-2 py-1 rounded">{new Date(quiz.createdAt).toLocaleDateString("en-GB")}</span></div>
        <div className="mb-4">Number of Questions: <span className="bg-gray-100 px-2 py-1 rounded">{quiz.questions.length}</span></div>
        <div>
          <div className="mb-2">Questions:</div>
          <ul className="space-y-4">
            {quiz.questions.map(question => (
              <li key={question.id} className="border rounded p-4 bg-gray-50">
                <div className="mb-2">{question.text}</div>
                <ul className="list-disc ml-6 space-y-1">
                  {question.options.map(option => (
                    <li key={option.id} className={option.isCorrect ? "text-green-700" : ""}>
                      {option.text} {option.isCorrect && <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded">Correct</span>}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
