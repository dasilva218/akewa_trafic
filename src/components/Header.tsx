"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TriangleAlert, Map as MapIcon } from "lucide-react"

const LINKS = [
    { href: "/signaler", label: "Signaler", icon: TriangleAlert },
    { href: "/carte", label: "Consulter", icon: MapIcon },
]

export default function Header() {

    const pathname = usePathname()

    return (
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card/60 px-4 py-3 backdrop-blur md:px-6">
            <Link href="/" className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-sm bg-primary font-mono text-sm font-bold text-primary-foreground">
                    A
                </span>
                <span className="flex flex-col leading-tight">
                    <span className="font-mono text-sm font-semibold uppercase tracking-[0.2em]">Akéwa</span>
                    <span className="text-[11px] text-muted-foreground">Trafic Libreville</span>
                </span>
            </Link>

            <nav aria-label="Navigation principale" className="flex items-center gap-1">
                {LINKS.map((link) => {
                    const active = pathname === link.href
                    const Icon = link.icon
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            aria-current={active ? "page" : undefined}
                            className={`flex items-center gap-2 rounded-sm px-3 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${active
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                }`}
                        >
                            <Icon className="size-4" aria-hidden="true" />
                            {link.label}
                        </Link>
                    )
                })}
            </nav>
        </header>
    )
}
