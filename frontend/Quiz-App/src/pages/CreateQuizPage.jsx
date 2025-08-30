import QuestionList from "../components/QuestionList"
import QuizForm from "../components/QuizForm"
import useCreateQuiz from "../hooks/UseCreateQuiz"

export default function CreateQuizPage() {
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
