"use client"
import { LocateFixedIcon, MapPin, TriangleAlertIcon } from "lucide-react";
import useGeolocation from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";

export default function ReportForm() {

    const { getLocation, position, loading } = useGeolocation()
    const { lat, lng } = position || {}

    return (
        <form
            className="flex flex-col gap-6 border-b border-border p-4 md:p-6 lg:border-b-0 lg:border-r"
        >
            <Header />
            {/* Panneau de géolocalisation automatique */}
            <section
                aria-labelledby="geo-title"
                className={`flex flex-col gap-3 rounded-sm border p-4 transition-colors "
                    }`}
            >
                <div className="flex items-start justify-between gap-3">
                    <h2 id="geo-title" className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
                        <LocateFixedIcon className="size-3.5 text-primary" aria-hidden="true" />
                        Position automatique
                    </h2>

                    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-primary">
                        <span className="pulse-dot size-2 rounded-full bg-primary" aria-hidden="true" />
                        {/* {isTracking ? "Suivi actif" : "Détectée"} */}
                    </span>
                </div>

                <div aria-live="polite" className="flex flex-col gap-2">

                    <Button disabled={loading} type="button" variant="outline" size="sm" onClick={getLocation}>
                        <MapPin className="mr-2 h-4 w-4" />
                        Utiliser ma position actuelle
                    </Button>
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="size-3" aria-hidden="true" />
                            {lat && lng ? `${lat} / ${lng}` : "Chargement..."}
                        </span>
                    </p>


                </div>

            </section>

        </form>
    );
}

function Header() {
    return (
        <header className="flex flex-col gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Acteur 01 · Signaleur</p>
            <h1 className="text-3xl font-semibold text-balance">Déclarer un embouteillage</h1>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                Votre position est détectée automatiquement pour localiser le bouchon. Vous pouvez aussi choisir un axe.
            </p>
        </header>
    )
}