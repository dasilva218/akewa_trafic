'use client';
import { useTrafficContext } from "@/context/trafficContext";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { createCustomIcon } from "@/lib";
import { useSocketContext } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { TrafficSchema } from "../../schemas";


export const LIBREVILLE_CENTER: [number, number] = [0.4162, 9.4673]

export default function LeafletMap() {
    const [positions, setPositions] = useState<TrafficSchema[]>([])
    const { socket } = useSocketContext()
    const traffic = useTrafficContext()

    useEffect(() => {
        if (!socket) return

        socket?.on("positions", (data: TrafficSchema[]) => {

            setPositions(data)
        })

    }, [socket])

    return (
        <div className="relative w-full h-full min-h-128 bg-[#1a1a1a] overflow-hidden select-none" >
            <MapContainer
                zoomControl={false}
                center={LIBREVILLE_CENTER}
                zoom={12}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {positions?.map((item, key) => (
                    <Marker key={key} position={[item.latitude, item.longitude]}
                        icon={createCustomIcon()}
                    ></Marker>
                ))}

                {/* <Marker position={LIBREVILLE_CENTER}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker> */}

            </MapContainer>
        </div>
    );
}