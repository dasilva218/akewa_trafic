import Link from 'next/link'
import { buttonVariants } from "@/components/ui/button"
import { TrafficCone, ArrowLeft, Map as MapIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NotFound() {
    return (
        <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-20 text-center overflow-hidden">
            {/* Grid background effect */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(1_0_0/3%)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/3%)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            {/* Glowing cone graphic */}
            <div className="relative mb-6 flex items-center justify-center">
                <div className="absolute size-24 rounded-full bg-primary/10 blur-2xl animate-pulse" />
                <TrafficCone className="size-20 text-primary relative animate-bounce animation-duration-[3s]" />
            </div>

            {/* Styled 404 error display */}
            <div className="flex flex-col items-center gap-2 mb-6">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-sm">
                    Erreur 404
                </span>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-foreground to-foreground/50 select-none">
                    Route Barrée
                </h1>
            </div>

            {/* Subtitle */}
            <p className="max-w-md text-muted-foreground text-sm md:text-base leading-relaxed text-pretty mb-8">
                Il semblerait que vous ayez pris un mauvais embranchement. Le carrefour ou la rue que vous cherchez n&apos;existe pas ou a été temporairement fermé.
            </p>

            {/* Warning stripe divider */}
            <div className="w-full max-w-xs h-2 mb-10 rounded-full overflow-hidden bg-secondary relative border border-border">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,var(--primary),var(--primary)_8px,transparent_8px,transparent_16px)] opacity-50" />
            </div>

            {/* Navigation options */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
                <Link
                    href="/"
                    className={cn(
                        buttonVariants({ variant: "default", size: "lg" }),
                        "w-full sm:w-auto font-mono text-[11px] uppercase tracking-wider"
                    )}
                >
                    <ArrowLeft className="mr-2 size-4" />
                    Retour à l&apos;accueil
                </Link>
                <Link
                    href="/carte"
                    className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "w-full sm:w-auto font-mono text-[11px] uppercase tracking-wider"
                    )}
                >
                    <MapIcon className="mr-2 size-4" />
                    Consulter la carte
                </Link>
            </div>
        </main>
    )
}