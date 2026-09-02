"use client"

import dynamic from "next/dynamic"
// import type { TrafficMapProps } from "./traffic-map"

const TrafficMap = dynamic(() => import("./LeafletMap"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center bg-secondary/40">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Chargement de la carte…
            </span>
        </div>
    ),
})

export default function MapCanvas() {
    return <TrafficMap />
}
