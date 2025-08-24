import { customAlphabet } from "nanoid"
import {rooms} from "../websocket/handlers.js"

const nanoidNumbers = customAlphabet("0123456789", 8)
export const generateUniqueId = () => {
    let id;
    do {
        id = nanoidNumbers()
    } while (rooms.has(id))
    return id
}
