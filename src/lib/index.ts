import { divIcon } from "leaflet"

export const createCustomIcon = () => {
    const color = status === "SIGNALER" ? "#ef4444" : status === "EN_COURS" ? "#f97316" : "#22c55e"

    return divIcon({
        html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
       
      </div>
    `,
        className: "custom-marker",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
    })
}