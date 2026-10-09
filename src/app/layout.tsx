import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { SocketProvider } from "@/hooks/useSocket";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TrafficProvider } from "@/context/trafficContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carte de trafic en temps réel",
  description: "Carte de trafic en temps réel pour les embouteillages et les accidents de la route.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <SocketProvider>
        <TrafficProvider>
          <body className="flex min-h-svh flex-col">
            <Toaster />
            <div className="h-screen hidden lg:flex justify-center items-center border text-4xl ">
              Seulement pour les téléphone portable !
            </div>
            <div className="lg:hidden">
              <Header />
              {children}
              <Footer />
            </div>
          </body>
        </TrafficProvider>
      </SocketProvider>
    </html>
  );
}
