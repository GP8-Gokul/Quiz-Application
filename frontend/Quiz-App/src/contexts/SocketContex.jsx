import { createContext, useContext, useRef } from "react"

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
	const socketRef = useRef(null)
	if (!socketRef.current) {
		socketRef.current = new WebSocket("ws://localhost:3000")
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
