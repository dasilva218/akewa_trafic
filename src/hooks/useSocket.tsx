'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const context = createContext<{ socket: Socket | null }>({ socket: null, });

export const useSocketContext = () => useContext(context);

export function SocketProvider({ children }: { children: React.ReactNode }) {

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const URL_WEB_SOCKET = "ws://localhost:3002"

  useEffect(() => {
    const initializeSocket = io(URL_WEB_SOCKET)
    setSocket(initializeSocket)

    initializeSocket.emit('connection')

    const handleConnect = () => {
      setIsConnected(true)
    }

    const handleDisconnect = () => {
      setIsConnected(false)
    }

    initializeSocket.on('connect', handleConnect)
    initializeSocket.on('disconnect', handleDisconnect)

    return () => {
      initializeSocket.off('connect', handleConnect)
      initializeSocket.off('disconnect', handleDisconnect)
      initializeSocket.disconnect()
    }

  }, [])

  return (
    <context.Provider value={{ socket }}>
      {/* <span className="fixed z-50 top-0 right-0" >
        {isConnected ? <span className="text-green-500">Connected</span> : <span className="text-red-500">Disconnected</span>}
      </span> */}
      {children}
    </context.Provider>)
}