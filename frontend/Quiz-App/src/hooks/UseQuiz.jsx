import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../constants/Routes"

export default function useQuiz() {
    const [questions, setQuestions] = useState([])
    const [currentQuestion, setCurrentQuestion] = useState({ text: '', options: [{ text: '', isCorrect: false }] })
    const [quizTitle, setQuizTitle] = useState('')
    const [editIndex, setEditIndex] = useState(null)

    const navigate = useNavigate()

    const handleSubmitQuiz = async () => {
        if (!questions.length) {
            alert("Please add questions before submitting the quiz.")
            return
        }
        if (!quizTitle.trim()) {
            alert("Please enter a title for the quiz.")
            return
        }
        if(!confirm("Are you sure you want to submit the quiz?")) {
            return
        }
        try {
            const response = await axios.post(
                "http://localhost:3000/quiz/create",
                { title: quizTitle, questions },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            console.log("Quiz submitted:", response.data)
            navigate(ROUTES.MY_QUIZZES_PAGE)
        } catch (error) {
            console.log(error)
        }
    }

    const addOption = () => {
        setCurrentQuestion({
            ...currentQuestion,
            options: [...currentQuestion.options, { text: '', isCorrect: false }]
        })
    }

    const addOrUpdateQuestion = () => {
    if (editIndex !== null) {
        const updated = [...questions]
        updated[editIndex] = currentQuestion
        setQuestions(updated)
        setEditIndex(null)
    } else {
        setQuestions([...questions, currentQuestion])
    }
    setCurrentQuestion({ text: '', options: [{ text: '', isCorrect: false }] })
}

    const handleEditQuestion = (idx) => {
        setCurrentQuestion(questions[idx])
        setEditIndex(idx)
    }

    const handleDeleteQuestion = (idx) => {
        setQuestions(questions.filter((_, i) => i !== idx))
        if (editIndex === idx) {
            setCurrentQuestion({ text: '', options: [{ text: '', isCorrect: false }] })
            setEditIndex(null)
        }
    }

    const handleQuestionTextChange = (e) => {
        setCurrentQuestion({ ...currentQuestion, text: e.target.value })
    }

    const handleOptionTextChange = (idx, value) => {
        const newOptions = currentQuestion.options.map((opt, i) =>
            i === idx ? { ...opt, text: value } : opt
        )
        setCurrentQuestion({ ...currentQuestion, options: newOptions })
    }

    const handleOptionCorrectChange = (idx) => {
        const newOptions = currentQuestion.options.map((opt, i) =>
            i === idx ? { ...opt, isCorrect: true } : { ...opt, isCorrect: false }
        )
        setCurrentQuestion({ ...currentQuestion, options: newOptions })
    }

    return {
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
    }

}