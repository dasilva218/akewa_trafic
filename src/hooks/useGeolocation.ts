"use client"
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Position {
    latitude: number;
    longitude: number;
    accuracy?: number;
}


export default function useGeolocation() {

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("")
    const [message, setMessage] = useState("")
    const [isBusy, setIsBusy] = useState<boolean>()
    const [tracking, setIsTracking] = useState<boolean>(false)
    const [fix, setFix] = useState<Position>({ latitude: 0, longitude: 0 });
    const watchId = { current: 0 }

    // Démarrer le suivi
    const startTracking = async () => {
        if (!navigator.geolocation) {
            setStatus("unsupported");
            setMessage("Géolocalisation non supportée");
            return;
        }

        setLoading(true);
        // setIsTracking(true);
        setMessage("Suivi de la position en cours...");

        navigator.geolocation.getCurrentPosition(
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
    async function getPosition(position: GeolocationPosition) {
        const { latitude, longitude } = position.coords;
        await addPosition({ latitude, longitude });
        setFix({ latitude: latitude, longitude: longitude });
        setStatus("success");
        setMessage("Position mise à jour");
        setIsTracking(true);
        setLoading(false);
    }

    const addPosition = async ({ latitude, longitude }: Position) => {
        try {
            const response = await fetch("http://localhost:3001/api/v1/traffic", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ latitude, longitude }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || `Erreur HTTP ${response.status}`
                );
            }
            toast.success("Position envoyée avec succès", { position: "top-center" });
            console.log("Position envoyée avec succès :", data.status);

        } catch (error) {
            toast.error("Erreur lors de l'envoi de la position", { position: "top-center" });
        }

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