import { Router } from "express"
import { addGuestUser } from "../db/queries"

const router = Router()

router.post("/add",async (req, res) => {
    const { name } = req.body
    const guest = await addGuestUser()
    res.status(201).json({
        message: "Guest user added successfully",
        id : guest.id,
    })
})

export default router
