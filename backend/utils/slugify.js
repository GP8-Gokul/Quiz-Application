import slugify from "slugify"

export default function slugifyText(text) {
    return slugify(text, {
            lower: true,
            strict: true, 
        })
}