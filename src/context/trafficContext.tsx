'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { TrafficSchema } from "../../schemas";
import { useSocketContext } from "@/hooks/useSocket";

const context = createContext<TrafficSchema[] | null>(null)

export const useTrafficContext = () => useContext(context)

export function TrafficProvider({ children }: { children: React.ReactNode }) {
    const [traffic, setTraffic] = useState<TrafficSchema[] | null>(null)
    const { socket } = useSocketContext()


    useEffect(() => {
        if (!socket) return

        socket.on("add", (data) => {
            setTraffic(data)
        })

        // return () => {
        //     socket.off("disconnect")
        // }
    }, [socket])

    return (
        <context.Provider value={traffic}>
            {children}
        </context.Provider>
    )
}