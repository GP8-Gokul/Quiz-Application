import { useEffect } from "react"
import QuestionList from "../components/QuestionList"
import QuizForm from "../components/QuizForm"
import useCreateQuiz from "../hooks/UseCreateQuiz"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../constants/Routes"

export default function CreateQuizPage() {

  const navigate = useNavigate()

  useEffect(() => {
    if(localStorage.getItem('token') === null){
      navigate(ROUTES.AUTH_PAGE)
    }
  }, [])

  const {
    questions,
    currentQuestion,
    quizTitle,
    editIndex,
    setCurrentQuestion,
    setQuizTitle,
    setEditIndex,
    addOption,
    addOrUpdateQuestion,
    handleEditQuestion,
    handleDeleteQuestion,
    handleQuestionTextChange,
    handleOptionTextChange,
    handleOptionCorrectChange,
    handleSubmitQuiz
  } = useCreateQuiz()

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <QuizForm
        quizTitle={quizTitle}
        setQuizTitle={setQuizTitle}
        currentQuestion={currentQuestion}
        handleOptionCorrectChange={handleOptionCorrectChange}
        handleOptionTextChange={handleOptionTextChange}
        handleQuestionTextChange={handleQuestionTextChange}
        addOption={addOption}
        addOrUpdateQuestion={addOrUpdateQuestion}
        editIndex={editIndex}
        setEditIndex={setEditIndex}
        setCurrentQuestion={setCurrentQuestion}
      />
      <QuestionList
        quizTitle={quizTitle}
        questions={questions}
        handleSubmitQuiz={handleSubmitQuiz}
        onEdit={handleEditQuestion}
        onDelete={handleDeleteQuestion}
      />
    </div>
  )
}
