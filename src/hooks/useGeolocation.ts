"use client"
import { useEffect, useState } from "react";

interface Position {
    lat: number;
    lng: number;
    accuracy?: number;
}


export default function useGeolocation() {

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("")
    const [message, setMessage] = useState("")
    const [isBusy, setIsBusy] = useState<boolean>()
    const [tracking, setIsTracking] = useState<boolean>(false)
    const [fix, setFix] = useState<Position>({ lat: 0, lng: 0 });
    const watchId = { current: 0 }

    // Démarrer le suivi
    const startTracking = () => {
        if (!navigator.geolocation) {
            setStatus("unsupported");
            setMessage("Géolocalisation non supportée");
            return;
        }

        setLoading(true);
        // setIsTracking(true);
        setMessage("Suivi de la position en cours...");

        watchId.current = navigator.geolocation.watchPosition(
            getPosition,
            showError,
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000, // Mettre à jour toutes les 5 secondes
            },
        );
    };

    // Recuperation de la position
    function getPosition(position: GeolocationPosition) {
        const { latitude, longitude } = position.coords;
        setFix({ lat: latitude, lng: longitude });
        setStatus("success");
        setMessage("Position mise à jour");
        setIsTracking(true);
        setLoading(false);
    }

    // Gestion des erreurs
    function showError(error: GeolocationPositionError) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                setMessage("Autorisation refusée")
                break;
            case error.POSITION_UNAVAILABLE:
                setMessage("Position indisponible")
                break;
            case error.TIMEOUT:
                setMessage("Délai dépassé pour récupérer la position")
                break;
            default:
                setMessage("Une erreur inconnue s'est produite.")
                break;
        }
    }

    // Arrêter le suivi
    const stopTracking = () => {
        if (watchId.current !== null && navigator.geolocation) {
            navigator.geolocation.clearWatch(watchId.current);
        }
        setIsTracking(false);
    };

    // Démarrage automatique si activé
    // useEffect(() => {
    //     if (auto && status === "idle") {
    //         locate();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [auto]);

    // Nettoyage au démontage
    useEffect(() => {
        return () => {
            if (watchId.current !== null) {
                navigator.geolocation.clearWatch(watchId.current);
            }
        };
    }, []);

    return {
        message,
        watchId,
        fix,
        startTracking,
        loading,
        tracking
    };
}