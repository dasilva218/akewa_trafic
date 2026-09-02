'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TrafficIncident, TrafficRoadSegment, IncidentType, IncidentSeverity } from '@/types';
import { Locate, Layers, ZoomIn, ZoomOut, AlertTriangle, Shield, HardHat, Car, CloudRain, Wrench, Navigation2 } from 'lucide-react';

interface TrafficMapLeafletProps {
    incidents: TrafficIncident[];
    roadSegments: TrafficRoadSegment[];
    selectedIncident: TrafficIncident | null;
    onSelectIncident: (incident: TrafficIncident | null) => void;
    onMapClickToReport?: (lat: number, lng: number) => void;
    isPickingLocation?: boolean;
    activeFilter: string;
    showRoads: boolean;
    selectedZoneCenter?: [number, number] | null;
    selectedZoneZoom?: number;
    onConfirmIncident: (id: string) => void;
    onDisapproveIncident: (id: string) => void;
}

const getIncidentColor = (type: IncidentType, severity: IncidentSeverity) => {
    switch (type) {
        case 'embouteillage':
            return severity === 'bloque' ? '#ef4444' : severity === 'moyen' ? '#f59e0b' : '#eab308';
        case 'accident':
            return '#ef4444';
        case 'controle':
            return '#3b82f6';
        case 'travaux':
            return '#f97316';
        case 'inondation':
            return '#06b6d4';
        case 'panne':
            return '#a855f7';
        case 'danger':
            return '#ef4444';
        default:
            return '#ef4444';
    }
};

const getIncidentIconSvg = (type: IncidentType) => {
    switch (type) {
        case 'embouteillage':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`;
        case 'accident':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
        case 'controle':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
        case 'travaux':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h20"/><path d="M3.5 14h17"/><path d="m6 6 12 12"/><path d="m18 6-12 12"/></svg>`;
        case 'inondation':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>`;
        case 'panne':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
        default:
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    }
};

const getRoadColor = (status: 'fluide' | 'ralenti' | 'dense' | 'bloque') => {
    switch (status) {
        case 'fluide':
            return '#22c55e'; // Green neon
        case 'ralenti':
            return '#eab308'; // Yellow
        case 'dense':
            return '#f97316'; // Orange
        case 'bloque':
            return '#ef4444'; // Red
    }
};

export default function TrafficMapLeaflet({
    incidents,
    roadSegments,
    selectedIncident,
    onSelectIncident,
    onMapClickToReport,
    isPickingLocation = false,
    activeFilter,
    showRoads,
    selectedZoneCenter,
    selectedZoneZoom,
    onConfirmIncident,
    onDisapproveIncident
}: TrafficMapLeafletProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersLayerRef = useRef<L.LayerGroup | null>(null);
    const roadsLayerRef = useRef<L.LayerGroup | null>(null);
    const userMarkerRef = useRef<L.Marker | null>(null);
    const onMapClickToReportRef = useRef(onMapClickToReport);

    useEffect(() => {
        onMapClickToReportRef.current = onMapClickToReport;
    }, [onMapClickToReport]);

    const [mapType, setMapType] = useState<'dark' | 'voyager' | 'satellite'>('dark');
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [isLocating, setIsLocating] = useState(false);

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        // Default center Libreville
        const map = L.map(mapContainerRef.current, {
            center: [0.3924, 9.4536],
            zoom: 13,
            zoomControl: false,
            attributionControl: false
        });

        // Base TileLayer: Dark Matter for High Density theme
        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        L.tileLayer(tileUrl, {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        const roadsLayer = L.layerGroup().addTo(map);

        markersLayerRef.current = markersLayer;
        roadsLayerRef.current = roadsLayer;
        mapInstanceRef.current = map;

        // Handle Map Click
        map.on('click', (e: L.LeafletMouseEvent) => {
            if (onMapClickToReportRef.current) {
                onMapClickToReportRef.current(e.latlng.lat, e.latlng.lng);
            }
        });

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Update Tile Layer if Map Type changes
    useEffect(() => {
        if (!mapInstanceRef.current) return;
        const map = mapInstanceRef.current;

        map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                map.removeLayer(layer);
            }
        });

        let newUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        if (mapType === 'satellite') {
            newUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        } else if (mapType === 'voyager') {
            newUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        }

        L.tileLayer(newUrl, {
            maxZoom: 19,
            subdomains: mapType === 'satellite' ? 'abcd' : 'abcd'
        }).addTo(map);
    }, [mapType]);

    // Handle Zone Centering
    useEffect(() => {
        if (mapInstanceRef.current && selectedZoneCenter) {
            mapInstanceRef.current.flyTo(selectedZoneCenter, selectedZoneZoom || 13, {
                duration: 1.2
            });
        }
    }, [selectedZoneCenter, selectedZoneZoom]);

    // Handle Selected Incident Centering
    useEffect(() => {
        if (mapInstanceRef.current && selectedIncident) {
            mapInstanceRef.current.flyTo([selectedIncident.lat, selectedIncident.lng], 16, {
                duration: 1
            });
        }
    }, [selectedIncident]);

    // Render Road Segments
    useEffect(() => {
        if (!roadsLayerRef.current || !mapInstanceRef.current) return;
        roadsLayerRef.current.clearLayers();

        if (!showRoads) return;

        roadSegments.forEach((road) => {
            const color = getRoadColor(road.status);

            // Outer glow line for visibility on dark map
            const casing = L.polyline(road.coordinates, {
                color: '#000000',
                weight: 8,
                opacity: 0.8,
                lineCap: 'round',
                lineJoin: 'round'
            });

            const polyline = L.polyline(road.coordinates, {
                color: color,
                weight: 5,
                opacity: 0.95,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: road.status === 'bloque' ? '8, 6' : undefined
            });

            const popupContent = `
        <div style="padding: 12px; min-width: 220px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #141414; color: #e5e7eb;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af;">${road.quartier}</span>
            <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 2px; background: ${color}25; color: ${color}; border: 1px solid ${color}40;">
              ${road.status.toUpperCase()}
            </span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 0 0 4px 0;">${road.name}</h4>
          <p style="font-size: 11px; color: #9ca3af; margin: 0 0 8px 0; font-family: sans-serif;">${road.description}</p>
          <div style="display: flex; gap: 12px; font-size: 10px; color: #d1d5db; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">
            <div>⚡ VITESSE : <strong style="color: #ffffff;">${road.averageSpeedKmh} km/h</strong></div>
            <div>⏱ RETARD : <strong style="color: ${color};">+${road.delayMinutes} min</strong></div>
          </div>
        </div>
      `;

            polyline.bindPopup(popupContent);
            roadsLayerRef.current?.addLayer(casing);
            roadsLayerRef.current?.addLayer(polyline);
        });
    }, [roadSegments, showRoads]);

    // Render Incidents Markers
    useEffect(() => {
        if (!markersLayerRef.current || !mapInstanceRef.current) return;
        markersLayerRef.current.clearLayers();

        const filtered = incidents.filter((inc) => {
            if (activeFilter === 'tous') return true;
            if (activeFilter === 'bouchons') return inc.type === 'embouteillage';
            if (activeFilter === 'accidents') return inc.type === 'accident';
            if (activeFilter === 'controles') return inc.type === 'controle';
            if (activeFilter === 'travaux') return inc.type === 'travaux';
            if (activeFilter === 'inondations') return inc.type === 'inondation';
            return inc.type === activeFilter;
        });

        filtered.forEach((inc) => {
            const color = getIncidentColor(inc.type, inc.severity);
            const iconSvg = getIncidentIconSvg(inc.type);
            const isBlocked = inc.severity === 'bloque';
            const isMoyen = inc.severity === 'moyen';
            const pulseClass = isBlocked ? 'traffic-pulse-blocked' : isMoyen ? 'traffic-pulse-warning' : '';

            const markerHtml = `
        <div class="relative group cursor-pointer" style="display: flex; align-items: center; justify-content: center;">
          <div class="${pulseClass}" style="
            width: 32px;
            height: 32px;
            border-radius: 9999px;
            background: ${color};
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(0,0,0,0.6);
            border: 2px solid #000000;
            transition: transform 0.15s ease;
          ">
            ${iconSvg}
          </div>
          ${inc.estimatedDelayMinutes > 0
                    ? `<div style="
                  position: absolute;
                  bottom: -6px;
                  right: -6px;
                  background: #080808;
                  color: #ef4444;
                  font-family: ui-monospace, monospace;
                  font-size: 9px;
                  font-weight: 800;
                  padding: 1px 4px;
                  border-radius: 2px;
                  border: 1px solid rgba(255,255,255,0.2);
                  white-space: nowrap;
                ">+${inc.estimatedDelayMinutes}m</div>`
                    : ''
                }
        </div>
      `;

            const customIcon = L.divIcon({
                className: 'custom-traffic-pin',
                html: markerHtml,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                popupAnchor: [0, -18]
            });

            const marker = L.marker([inc.lat, inc.lng], { icon: customIcon });

            const popupHtml = `
        <div style="min-width: 250px; max-width: 290px; padding: 12px; font-family: ui-monospace, SFMono-Regular, monospace; background: #141414; color: #e5e7eb;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 2px 6px; border-radius: 2px; background: ${color}20; color: ${color}; border: 1px solid ${color}40;">
              ${inc.type.toUpperCase()} • ${inc.severity.toUpperCase()}
            </span>
            <span style="font-size: 10px; color: #9ca3af;">
              ${new Date(inc.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <h3 style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 0 0 4px 0; line-height: 1.3; font-family: sans-serif;">
            ${inc.title}
          </h3>

          <div style="font-size: 11px; color: #eab308; font-weight: 600; margin-bottom: 6px;">
            📍 ${inc.locationName} (${inc.quartier})
          </div>

          <p style="font-size: 11px; color: #9ca3af; margin: 0 0 10px 0; line-height: 1.4; font-family: sans-serif;">
            ${inc.description}
          </p>

          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #6b7280; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px; margin-bottom: 10px;">
            <span>Par : <strong style="color: #d1d5db;">${inc.reportedBy}</strong></span>
            ${inc.estimatedDelayMinutes > 0 ? `<span style="color: #ef4444; font-weight: 800;">⏱ Retard : +${inc.estimatedDelayMinutes}m</span>` : ''}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <button id="btn-confirm-${inc.id}" style="background: #10b981; color: #000000; border: none; border-radius: 2px; padding: 6px 8px; font-size: 10px; font-weight: 800; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
              👍 Valider (${inc.confirmations})
            </button>
            <button id="btn-clear-${inc.id}" style="background: #262626; color: #d1d5db; border: 1px solid rgba(255,255,255,0.15); border-radius: 2px; padding: 6px 8px; font-size: 10px; font-weight: 700; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
              ✅ Dégagé (${inc.disapprovals})
            </button>
          </div>
        </div>
      `;

            marker.bindPopup(popupHtml);

            marker.on('popupopen', () => {
                onSelectIncident(inc);
                setTimeout(() => {
                    const btnConfirm = document.getElementById(`btn-confirm-${inc.id}`);
                    const btnClear = document.getElementById(`btn-clear-${inc.id}`);
                    if (btnConfirm) {
                        btnConfirm.onclick = () => onConfirmIncident(inc.id);
                    }
                    if (btnClear) {
                        btnClear.onclick = () => onDisapproveIncident(inc.id);
                    }
                }, 50);
            });

            markersLayerRef.current?.addLayer(marker);
        });
    }, [incidents, activeFilter, onSelectIncident, onConfirmIncident, onDisapproveIncident]);

    // Geolocation trigger
    const handleLocateUser = () => {
        if (!navigator.geolocation) {
            alert('La géolocalisation n’est pas supportée par votre navigateur.');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setIsLocating(false);
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);

                if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([latitude, longitude], 15, { duration: 1.5 });

                    if (userMarkerRef.current) {
                        mapInstanceRef.current.removeLayer(userMarkerRef.current);
                    }

                    const userIcon = L.divIcon({
                        className: 'user-location-pin',
                        html: `
              <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; width: 22px; height: 22px; border-radius: 9999px; background: rgba(59, 130, 246, 0.4); animation: pulse-ring 1.8s infinite;"></div>
                <div style="width: 12px; height: 12px; border-radius: 9999px; background: #3b82f6; border: 2px solid #ffffff; box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);"></div>
              </div>
            `,
                        iconSize: [22, 22],
                        iconAnchor: [11, 11]
                    });

                    userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
                        .addTo(mapInstanceRef.current)
                        .bindPopup('<div style="padding: 6px; font-weight: 700; font-size: 11px; font-family: monospace; background: #141414; color: #fff;">📍 MA POSITION GPS</div>')
                        .openPopup();
                }
            },
            (error) => {
                setIsLocating(false);
                console.warn('Geolocation error:', error);
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([0.3924, 9.4536], 14);
                }
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    return (
        <div className="relative w-full h-full min-h-105 bg-[#1a1a1a] overflow-hidden select-none">
            {/* Map Container */}
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Picking Location Banner */}
            {isPickingLocation && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-yellow-500 text-black font-bold font-mono text-xs px-4 py-2 rounded-sm shadow-xl flex items-center gap-2 border border-yellow-400 animate-bounce uppercase">
                    <AlertTriangle className="w-4 h-4 text-black" />
                    <span>Cliquez sur la carte pour définir l’emplacement</span>
                </div>
            )}

            {/* Focus Zone HUD Overlay (Top-Left) */}
            <div className="absolute top-4 left-4 z-[900] bg-[#080808]/90 backdrop-blur-md p-3 border border-white/10 rounded-sm shadow-2xl max-w-xs hidden sm:block font-mono">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span className="text-[9px] uppercase tracking-widest text-gray-400">ZONE FOCUS LIBREVILLE</span>
                </div>
                <div className="text-xs font-bold text-white mb-0.5">Rond-point Démocratie / Voie Express</div>
                <div className="text-[10px] text-red-400 flex items-center gap-1 font-semibold">
                    <span>+24 MIN D&apos;ATTENTE</span>
                    <span className="text-gray-500">• Bouteille d&apos;étranglement</span>
                </div>
            </div>

            {/* Map Controls Floating Overlay (Top-Right) */}
            <div className="absolute top-4 right-4 z-[900] flex flex-col gap-2 font-mono">
                {/* Layer Switcher */}
                <div className="bg-[#080808]/90 backdrop-blur-md p-1 rounded-sm shadow-md border border-white/10 flex flex-col gap-1">
                    <button
                        id="map-view-dark"
                        onClick={() => setMapType('dark')}
                        title="Vue Sombre Commande"
                        className={`px-2 py-1 rounded-sm text-[10px] uppercase font-bold transition-all ${mapType === 'dark' ? 'bg-yellow-500 text-black shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        DARK
                    </button>
                    <button
                        id="map-view-voyager"
                        onClick={() => setMapType('voyager')}
                        title="Vue Urbaine Claire"
                        className={`px-2 py-1 rounded-sm text-[10px] uppercase font-bold transition-all ${mapType === 'voyager' ? 'bg-yellow-500 text-black shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        CLAIR
                    </button>
                    <button
                        id="map-view-satellite"
                        onClick={() => setMapType('satellite')}
                        title="Vue Satellite"
                        className={`px-2 py-1 rounded-sm text-[10px] uppercase font-bold transition-all ${mapType === 'satellite' ? 'bg-yellow-500 text-black shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        SATELLITE
                    </button>
                </div>

                {/* Geolocation Button */}
                <button
                    id="btn-geolocate"
                    onClick={handleLocateUser}
                    title="Ma position actuelle"
                    className="bg-[#080808]/90 backdrop-blur-md p-2 rounded-sm shadow-md border border-white/10 text-gray-300 hover:text-yellow-400 hover:bg-white/5 transition-all flex items-center justify-center"
                >
                    <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin text-yellow-400' : ''}`} />
                </button>

                {/* Zoom In/Out Controls */}
                <div className="bg-[#080808]/90 backdrop-blur-md rounded-sm shadow-md border border-white/10 flex flex-col divide-y divide-white/10 overflow-hidden">
                    <button
                        id="btn-zoom-in"
                        onClick={() => mapInstanceRef.current?.zoomIn()}
                        className="p-2 text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center"
                        title="Zoom +"
                    >
                        <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                        id="btn-zoom-out"
                        onClick={() => mapInstanceRef.current?.zoomOut()}
                        className="p-2 text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center"
                        title="Zoom -"
                    >
                        <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Map Legend Overlay (Bottom-Left) */}
            <div className="absolute bottom-4 left-4 z-[900] bg-[#080808]/90 backdrop-blur-md px-3 py-1.5 rounded-sm shadow-md border border-white/10 hidden sm:flex items-center gap-4 text-[10px] font-mono text-gray-400">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                    <span>FLUIDE</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>
                    <span>RALENTI</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                    <span>DENSE</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse"></span>
                    <span>BLOQUÉ</span>
                </div>
            </div>
        </div>
    );
}
