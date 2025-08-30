import { useEffect, useState } from "react"
import {quotes} from "../constants/Quotes"

export default function LoadingBar({ text = "loading" }){

    const [quote,setQuote] = useState("")

    const fetchQuote = async () => {
        setQuote(quotes[Math.floor(Math.random()*quotes.length)])
    }

    useEffect(()=>{
        fetchQuote()
    },[])

    return (
        <div onClick={fetchQuote} className="flex flex-col items-center justify-evenly min-h-[calc(100vh-4rem)]">
            <p className="mb-4 text-gray-600 font-medium">{text}</p>
            <div className="flex gap-5">
                <div className="w-3 h-3 bg-blue-500 rounded animate-spin" />
                <div className="w-4 h-4 bg-blue-500 rounded animate-spin delay-500" />
                <div className="w-3 h-3 bg-blue-500 rounded animate-spin delay-1000" />
            </div>
            <p className="mt-4 text-gray-600 font-medium">{quote}</p>
        </div>
    )
}
