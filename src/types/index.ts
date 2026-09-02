import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";


export type roles = {
    href: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    role: string;
    title: string;
    text: string;
    cta: string;
    primary: boolean;
}


export type IncidentType =
    | 'embouteillage'
    | 'accident'
    | 'travaux'
    | 'controle'
    | 'inondation'
    | 'panne'
    | 'danger';

export type IncidentSeverity = 'faible' | 'moyen' | 'bloque';

export type DirectionType =
    | 'vers_centre'
    | 'vers_pk'
    | 'vers_akanda'
    | 'vers_owendo'
    | 'deux_sens'
    | 'direction_unique';

export interface TrafficIncident {
    id: string;
    type: IncidentType;
    severity: IncidentSeverity;
    title: string;
    locationName: string;
    quartier: string;
    lat: number;
    lng: number;
    direction: DirectionType;
    description: string;
    reportedAt: string; // ISO string
    reportedBy: string;
    userRole?: string;
    confirmations: number;
    disapprovals: number;
    isVerified: boolean;
    estimatedDelayMinutes: number;
    averageSpeedKmh?: number;
    photoUrl?: string;
    status: 'actif' | 'en_cours_de_dissipation' | 'resolu';
}

export type RoadTrafficStatus = 'fluide' | 'ralenti' | 'dense' | 'bloque';

export interface TrafficRoadSegment {
    id: string;
    name: string;
    quartier: string;
    coordinates: [number, number][]; // [lat, lng] array
    status: RoadTrafficStatus;
    averageSpeedKmh: number;
    speedLimitKmh: number;
    delayMinutes: number;
    description: string;
    updatedAt: string;
}

export interface LibrevilleZone {
    id: string;
    name: string;
    center: [number, number];
    zoom: number;
    description: string;
}

export interface RouteCalculation {
    id: string;
    departure: string;
    destination: string;
    distanceKm: number;
    normalDurationMinutes: number;
    currentDurationMinutes: number;
    delayMinutes: number;
    status: 'fluide' | 'ralenti' | 'dense' | 'bloque';
    routeSummary: string;
    waypoints: [number, number][];
    incidentsOnRoute: TrafficIncident[];
    steps: {
        instruction: string;
        distance: string;
        trafficCondition: 'fluide' | 'ralenti' | 'dense' | 'bloque';
    }[];
    alternateRoute?: {
        name: string;
        currentDurationMinutes: number;
        distanceKm: number;
        description: string;
    };
}
