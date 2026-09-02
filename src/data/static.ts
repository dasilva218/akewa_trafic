import { roles } from "@/types";
import { Eye, LucideProps, TriangleAlert } from "lucide-react";


export const ROLES: roles[] = [
    {
        href: "/signaler",
        icon: TriangleAlert,
        role: "Acteur 01",
        title: "Je signale",
        text: "Vous êtes dans la circulation : indiquez le point exact, le niveau de blocage et la cause. Votre signalement apparaît immédiatement sur la carte de la ville.",
        cta: "Ouvrir l'interface de signalement",
        primary: true,
    },
    {
        href: "/carte",
        icon: Eye,
        role: "Acteur 02",
        title: "Je consulte",
        text: "Vous préparez votre trajet : visualisez tous les axes signalés, filtrez par niveau et confirmez les bouchons encore actifs avant de partir.",
        cta: "Ouvrir la carte du trafic",
        primary: false,
    },
]
