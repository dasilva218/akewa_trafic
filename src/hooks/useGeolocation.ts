"use client"
import { useState, useEffect, useRef } from "react";

interface Position {
    lat: number;
    lng: number;
    accuracy: number;
}


export default function useGeolocation() {

    const [position, setPosition] = useState<Position | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Autoriser et récupérer la position
    const getLocation = () => {

        if (!navigator.geolocation) {
            setError("La géolocalisation n'est pas supportée par ce navigateur.");
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    accuracy: pos.coords.accuracy,
                });
                setLoading(false);
            },
            (err) => {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError("Vous avez refusé l'accès à la position.");
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError("Position indisponible.");
                        break;
                    case err.TIMEOUT:
                        setError("Délai dépassé pour récupérer la position.");
                        break;
                    default:
                        setError("Erreur inconnue.");
                }
                setLoading(false);
            },
            {
                enableHighAccuracy: true, // Utilise GPS si disponible (mobile)
                timeout: 10000,
                maximumAge: 0, // Ne pas utiliser une position en cache
            }
        )


    }


    // Démarrer le suivi
    // const startTracking = () => {
    //     if (!navigator.geolocation) {
    //         setStatus("unsupported");
    //         setMessage("Géolocalisation non supportée");
    //         return;
    //     }

    //     setIsBusy(true);
    //     setIsTracking(true);
    //     setMessage("Suivi de la position en cours...");

    //     watchId.current = navigator.geolocation.watchPosition(
    //         (position) => {
    //             const { latitude, longitude } = position.coords;
    //             setFix({ lat: latitude, lng: longitude });
    //             setStatus("success");
    //             setMessage("Position mise à jour");
    //             setIsBusy(false);
    //         },
    //         (err) => {
    //             setIsBusy(false);
    //             setStatus("error");
    //             setMessage(err.message);
    //             if (err.code === err.PERMISSION_DENIED) {
    //                 setStatus("denied");
    //                 setMessage("Autorisation refusée");
    //                 setIsTracking(false);
    //             } else {
    //                 setMessage(`Erreur: ${err.message}`);
    //             }
    //         },
    //         {
    //             enableHighAccuracy: true,
    //             timeout: 10000,
    //             maximumAge: 5000, // Mettre à jour toutes les 5 secondes
    //         },
    //     );
    // };

    // Arrêter le suivi
    // const stopTracking = () => {
    //     if (watchId.current !== null && navigator.geolocation) {
    //         navigator.geolocation.clearWatch(watchId.current);
    //         watchId.current = null;
    //     }
    //     setIsTracking(false);
    // };

    // Démarrage automatique si activé
    // useEffect(() => {
    //     if (auto && status === "idle") {
    //         locate();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [auto]);

    // Nettoyage au démontage
    // useEffect(() => {
    //     return () => {
    //         if (watchId.current !== null) {
    //             navigator.geolocation.clearWatch(watchId.current);
    //         }
    //     };
    // }, []);

    return {
        getLocation,
        position,
        loading
    };
}