import { createContext, useContext, useRef } from "react"
import { BASE_WS_URL } from "../constants/Urls"

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
	const socketRef = useRef(null)
	if (!socketRef.current) {
		socketRef.current = new WebSocket(BASE_WS_URL)
	}

	return (
		<SocketContext.Provider value={socketRef.current}>
			{children}
		</SocketContext.Provider>
	)
}

export function useSocket() {
	return useContext(SocketContext)
}
