import { ROLES } from "@/data/static";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1">
      <section className="relative isolate overflow-hidden border-b border-border">
        <Image
          src="/libreville-trafic.png"
          alt="Vue aérienne d'un boulevard embouteillé de Libreville au crépuscule"
          fill
          priority
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-background/60" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16 md:px-6 md:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            Observatoire citoyen du trafic
          </p>
          <h1 className="max-w-3xl text-4xl leading-tight font-semibold text-balance md:text-6xl">
            Les embouteillages de Libreville, signalés par ceux qui les vivent.
          </h1>
          <p className="max-w-2xl leading-relaxed text-muted-foreground text-pretty">
            De Mont-Bouët au carrefour SNI d&apos;Owendo, chaque conducteur peut déclarer un blocage en quelques
            secondes. Les autres consultent la carte avant de prendre la route.
          </p>
          <div className="max-w-2xl pt-2">
            {/* <NetworkStrip /> */}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <h2 className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Choisissez votre rôle
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ROLES.map((r) => {
            const Icon = r.icon
            return (
              <Link
                key={r.href}
                href={r.href}
                className="group flex flex-col gap-4 rounded-sm border border-border bg-card p-6 transition-colors hover:border-primary"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex size-10 items-center justify-center rounded-sm ${r.primary ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                      }`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {r.role}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold">{r.title}</h3>
                <p className="leading-relaxed text-muted-foreground text-pretty">{r.text}</p>
                <span className="mt-auto flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-primary">
                  {r.cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            )
          })}
        </div>
      </section>


    </main>
  );
}
