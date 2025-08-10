import { Router } from "express"
import auth from "../middleware/auth.js"
import { createQuiz, findQuizBySlug, findQuizzesByUserId } from "../db/queries.js"
import slugifyText from "../utils/slugify.js"

const router = Router()


router.post("/create", auth, async (req, res) => {
    const { title, questions } = req.body
    const createdById = req.user.id
    const slug = slugifyText(title)

    try {
        const quiz = await createQuiz(title,slug, questions, createdById)
        res.status(201).json(quiz)
    } catch (error) {
        console.error("Error creating quiz:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

router.get("/my-quizzes", auth, async (req, res) => {
    const userId  = req.user.id
    try {
        const quizzes = await findQuizzesByUserId(userId)
        res.status(200).json(quizzes)
    } catch (error) {
        console.error("Error fetching quizzes:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

router.get("/:slug", auth, async (req, res) => {
    const { slug } = req.params
    try {
        const quiz = await findQuizBySlug(slug)
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" })
        }
        res.status(200).json(quiz)
    } catch (error) {
        console.error("Error fetching quiz:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

export default router