// "use client"

// import { useEffect, useMemo, useState } from "react"
// import Link from "next/link"
// import { Check, Crosshair, LocateFixed, MapPin, Radio, RotateCw, Send, TriangleAlert } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { LevelBadge } from "@/components/level-badge"
// import { MapCanvas } from "@/components/map-canvas"
// import { useTraffic } from "@/components/traffic-store"
// import { useGeolocation } from "@/hooks/use-geolocation"
// import {
//     CAUSE_META,
//     SEVERITY_META,
//     ZONES,
//     formatDistance,
//     isNearLibreville,
//     nearestZone,
//     timeAgo,
//     type Cause,
//     type Severity,
// } from "@/lib/traffic"

// const SEVERITIES: Severity[] = ["fluide", "dense", "bloque"]
// const CAUSES = Object.keys(CAUSE_META) as Cause[]

// type Mode = "gps" | "manuel"

// export function ReportForm() {
//     const { reports, addReport } = useTraffic()
//     const { fix, status, message, locate, startTracking, stopTracking, isTracking, isBusy } = useGeolocation({
//         auto: true,
//     })

//     const [mode, setMode] = useState<Mode>("gps")
//     const [zoneName, setZoneName] = useState(ZONES[0].name)
//     const [severity, setSeverity] = useState<Severity>("dense")
//     const [cause, setCause] = useState<Cause>("affluence")
//     const [comment, setComment] = useState("")
//     const [author, setAuthor] = useState("")
//     const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null)
//     const [sent, setSent] = useState<string | null>(null)

//     const gpsUsable = fix ? isNearLibreville(fix) : false
//     const detected = useMemo(() => (fix && gpsUsable ? nearestZone(fix) : null), [fix, gpsUsable])

//     // En mode GPS, la position détectée devient le point du signalement et sélectionne l'axe le plus proche
//     useEffect(() => {
//         if (mode !== "gps" || !fix || !gpsUsable) return
//         setPin({ lat: fix.lat, lng: fix.lng })
//         const { zone } = nearestZone(fix)
//         setZoneName(zone.name)
//     }, [mode, fix, gpsUsable])

//     const zone = useMemo(() => ZONES.find((z) => z.name === zoneName) ?? ZONES[0], [zoneName])
//     const point = pin ?? { lat: zone.lat, lng: zone.lng }
//     const myReports = reports.filter((r) => r.id.startsWith("r-"))

//     function handleZoneChange(name: string) {
//         setMode("manuel")
//         stopTracking()
//         setZoneName(name)
//         setPin(null)
//     }

//     function handleMapPick(lat: number, lng: number) {
//         setMode("manuel")
//         stopTracking()
//         setPin({ lat, lng })
//         setZoneName(nearestZone({ lat, lng }).zone.name)
//     }

//     function useGpsMode() {
//         setMode("gps")
//         if (fix && gpsUsable) {
//             setPin({ lat: fix.lat, lng: fix.lng })
//             setZoneName(nearestZone(fix).zone.name)
//         } else {
//             locate()
//         }
//     }

//     function handleSubmit(e: React.FormEvent) {
//         e.preventDefault()
//         const report = addReport({
//             zone: zoneName,
//             lat: point.lat,
//             lng: point.lng,
//             severity,
//             cause,
//             comment: comment.trim() || undefined,
//             author: author.trim() || "Anonyme",
//         })
//         setSent(report.id)
//         setComment("")
//         window.setTimeout(() => setSent(null), 4000)
//     }

//     const fieldClass =
//         "w-full rounded-sm border border-input bg-secondary/40 px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring"
//     const labelClass = "font-mono text-[10px] uppercase tracking-widest text-muted-foreground"

//     const gpsFailed = status === "denied" || status === "error" || status === "unsupported"
//     const outOfArea = Boolean(fix && !gpsUsable)

//     return (
//         <div className="grid gap-0 lg:grid-cols-[minmax(0,440px)_1fr] lg:items-stretch">
//             <form
//                 onSubmit={handleSubmit}
//                 className="flex flex-col gap-6 border-b border-border p-4 md:p-6 lg:border-b-0 lg:border-r"
//             >
//                 <header className="flex flex-col gap-2">
//                     <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Acteur 01 · Signaleur</p>
//                     <h1 className="text-3xl font-semibold text-balance">Déclarer un embouteillage</h1>
//                     <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
//                         Votre position est détectée automatiquement pour localiser le bouchon. Vous pouvez aussi choisir un axe
//                         ou cliquer sur la carte.
//                     </p>
//                 </header>

//                 {/* Panneau de géolocalisation automatique */}
//                 <section
//                     aria-labelledby="geo-title"
//                     className={`flex flex-col gap-3 rounded-sm border p-4 transition-colors ${mode === "gps" && fix && gpsUsable ? "border-primary/60 bg-secondary/50" : "border-border bg-card"
//                         }`}
//                 >
//                     <div className="flex items-start justify-between gap-3">
//                         <h2 id="geo-title" className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
//                             <LocateFixed className="size-3.5 text-primary" aria-hidden="true" />
//                             Position automatique
//                         </h2>
//                         {mode === "gps" && fix && gpsUsable ? (
//                             <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-primary">
//                                 <span className="pulse-dot size-2 rounded-full bg-primary" aria-hidden="true" />
//                                 {isTracking ? "Suivi actif" : "Détectée"}
//                             </span>
//                         ) : null}
//                     </div>

//                     <div aria-live="polite" className="flex flex-col gap-2">
//                         {isBusy && !fix ? (
//                             <p className="text-sm text-muted-foreground">Détection de votre position en cours…</p>
//                         ) : null}

//                         {fix && gpsUsable ? (
//                             <>
//                                 <p className="text-sm leading-relaxed">
//                                     Vous êtes proche de <span className="font-semibold text-primary">{detected?.zone.name}</span>
//                                     {detected ? (
//                                         <span className="text-muted-foreground"> · à {formatDistance(detected.distanceKm)}</span>
//                                     ) : null}
//                                 </p>
//                                 <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
//                                     <span className="flex items-center gap-1.5">
//                                         <MapPin className="size-3" aria-hidden="true" />
//                                         {fix.lat.toFixed(5)} / {fix.lng.toFixed(5)}
//                                     </span>
//                                     <span>précision ±{Math.round(fix.accuracy)} m</span>
//                                 </p>
//                             </>
//                         ) : null}

//                         {outOfArea ? (
//                             <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
//                                 <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-[color:var(--level-mid)]" aria-hidden="true" />
//                                 Vous semblez être en dehors du Grand Libreville. Sélectionnez l&apos;axe concerné ci-dessous.
//                             </p>
//                         ) : null}

//                         {gpsFailed && message ? (
//                             <p role="alert" className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
//                                 <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-destructive" aria-hidden="true" />
//                                 {message}
//                             </p>
//                         ) : null}
//                     </div>

//                     <div className="flex flex-wrap gap-2">
//                         <Button
//                             type="button"
//                             variant={mode === "gps" && fix && gpsUsable ? "secondary" : "default"}
//                             size="sm"
//                             onClick={useGpsMode}
//                             disabled={isBusy}
//                             className="font-mono text-[10px] uppercase tracking-widest"
//                         >
//                             {fix ? <RotateCw className="size-3.5" aria-hidden="true" /> : <Crosshair className="size-3.5" aria-hidden="true" />}
//                             {isBusy ? "Localisation…" : fix ? "Actualiser ma position" : "Me localiser"}
//                         </Button>
//                         <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             onClick={isTracking ? stopTracking : startTracking}
//                             aria-pressed={isTracking}
//                             className="font-mono text-[10px] uppercase tracking-widest"
//                         >
//                             <Radio className="size-3.5" aria-hidden="true" />
//                             {isTracking ? "Arrêter le suivi" : "Suivre en continu"}
//                         </Button>
//                     </div>
//                 </section>

//                 <div className="flex flex-col gap-2">
//                     <label htmlFor="zone" className={labelClass}>
//                         Axe ou carrefour {mode === "gps" && detected ? "· détecté automatiquement" : ""}
//                     </label>
//                     <select id="zone" value={zoneName} onChange={(e) => handleZoneChange(e.target.value)} className={fieldClass}>
//                         {ZONES.map((z) => (
//                             <option key={z.name} value={z.name}>
//                                 {z.name}
//                             </option>
//                         ))}
//                     </select>
//                     <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
//                         <MapPin className="size-3" aria-hidden="true" />
//                         Point retenu {point.lat.toFixed(4)} / {point.lng.toFixed(4)}
//                         {mode === "gps" && pin ? " · GPS" : pin ? " · carte" : " · centre de l'axe"}
//                     </p>
//                 </div>

//                 <fieldset className="flex flex-col gap-2">
//                     <legend className={labelClass}>Niveau de circulation</legend>
//                     <div className="grid grid-cols-3 gap-2 pt-1">
//                         {SEVERITIES.map((s) => {
//                             const meta = SEVERITY_META[s]
//                             const active = severity === s
//                             return (
//                                 <button
//                                     key={s}
//                                     type="button"
//                                     onClick={() => setSeverity(s)}
//                                     aria-pressed={active}
//                                     className={`flex flex-col items-start gap-2 rounded-sm border p-3 text-left transition-colors ${active ? "border-primary bg-secondary" : "border-border bg-card hover:border-muted-foreground/40"
//                                         }`}
//                                 >
//                                     <span
//                                         className={`size-3 rounded-full ${active ? "pulse-dot" : ""}`}
//                                         style={{ backgroundColor: meta.color }}
//                                         aria-hidden="true"
//                                     />
//                                     <span className="font-mono text-[10px] uppercase tracking-widest">{meta.label}</span>
//                                     <span className="text-[11px] leading-snug text-muted-foreground">{meta.description}</span>
//                                 </button>
//                             )
//                         })}
//                     </div>
//                 </fieldset>

//                 <fieldset className="flex flex-col gap-2">
//                     <legend className={labelClass}>Cause probable</legend>
//                     <div className="flex flex-wrap gap-2 pt-1">
//                         {CAUSES.map((c) => {
//                             const active = cause === c
//                             return (
//                                 <button
//                                     key={c}
//                                     type="button"
//                                     onClick={() => setCause(c)}
//                                     aria-pressed={active}
//                                     className={`rounded-sm border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${active
//                                         ? "border-primary bg-primary text-primary-foreground"
//                                         : "border-border bg-card text-muted-foreground hover:text-foreground"
//                                         }`}
//                                 >
//                                     {CAUSE_META[c]}
//                                 </button>
//                             )
//                         })}
//                     </div>
//                 </fieldset>

//                 <div className="grid gap-4 sm:grid-cols-2">
//                     <div className="flex flex-col gap-2">
//                         <label htmlFor="author" className={labelClass}>
//                             Votre nom (optionnel)
//                         </label>
//                         <input
//                             id="author"
//                             value={author}
//                             onChange={(e) => setAuthor(e.target.value)}
//                             placeholder="Ex. Taxi 1204"
//                             className={fieldClass}
//                         />
//                     </div>
//                     <div className="flex flex-col gap-2">
//                         <label htmlFor="comment" className={labelClass}>
//                             Précision (optionnel)
//                         </label>
//                         <input
//                             id="comment"
//                             value={comment}
//                             onChange={(e) => setComment(e.target.value)}
//                             placeholder="Ex. une seule voie ouverte"
//                             className={fieldClass}
//                         />
//                     </div>
//                 </div>

//                 <div className="flex flex-col gap-3">
//                     <Button type="submit" size="lg" className="font-mono uppercase tracking-widest">
//                         <Send className="size-4" aria-hidden="true" />
//                         Envoyer le signalement
//                     </Button>
//                     <div aria-live="polite" className="min-h-5">
//                         {sent ? (
//                             <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary">
//                                 <Check className="size-3.5" aria-hidden="true" />
//                                 Signalement publié sur la carte
//                             </p>
//                         ) : null}
//                     </div>
//                 </div>

//                 {myReports.length > 0 ? (
//                     <section className="flex flex-col gap-3 border-t border-border pt-5">
//                         <h2 className={labelClass}>Vos signalements ({myReports.length})</h2>
//                         <ul className="flex flex-col gap-2">
//                             {myReports.slice(0, 4).map((r) => (
//                                 <li key={r.id} className="flex items-center justify-between gap-3 rounded-sm bg-card px-3 py-2">
//                                     <span className="truncate text-xs">{r.zone}</span>
//                                     <span className="flex shrink-0 items-center gap-2">
//                                         <span className="font-mono text-[10px] text-muted-foreground">{timeAgo(r.createdAt)}</span>
//                                         <LevelBadge severity={r.severity} />
//                                     </span>
//                                 </li>
//                             ))}
//                         </ul>
//                         <Link
//                             href="/carte"
//                             className="font-mono text-[10px] uppercase tracking-widest text-primary underline-offset-4 hover:underline"
//                         >
//                             Voir la carte complète
//                         </Link>
//                     </section>
//                 ) : null}
//             </form>

//             <div className="relative min-h-[420px] lg:min-h-[calc(100svh-57px)]">
//                 <MapCanvas
//                     reports={reports}
//                     pin={point}
//                     userFix={fix && gpsUsable ? fix : null}
//                     onPick={handleMapPick}
//                     focus={[point.lat, point.lng]}
//                     zoom={14}
//                 />
//                 <p className="pointer-events-none absolute bottom-4 left-1/2 z-[500] -translate-x-1/2 rounded-sm border border-border bg-card/90 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur">
//                     {mode === "gps" && fix && gpsUsable ? "Position GPS utilisée" : "Cliquez sur la carte pour préciser le point"}
//                 </p>
//             </div>
//         </div>
//     )
// }
