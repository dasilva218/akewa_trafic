'use client';
import { useTrafficContext } from "@/context/trafficContext";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";


export const LIBREVILLE_CENTER: [number, number] = [0.4162, 9.4673]

export default function LeafletMap() {

    const traffic = useTrafficContext()

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

                {traffic?.map((item, key) => (
                    <Marker key={key} position={[item.latitude, item.longitude]}></Marker>
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