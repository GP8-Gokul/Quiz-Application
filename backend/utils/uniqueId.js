import { customAlphabet } from "nanoid"

const nanoidNumbers = customAlphabet("0123456789", 8)
export const generateUniqueId = () => {
    return nanoidNumbers()
}
