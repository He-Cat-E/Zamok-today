"use client";

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { divIcon, LatLngBounds, type Map as LeafletMapType } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/theme/ThemeProvider";

export type MapPoint = {
  name: string;
  price: number;
  lat: number;
  lng: number;
};

function FitBounds({ points, refreshKey }: { points: MapPoint[]; refreshKey?: string | number }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    const bounds = new LatLngBounds(points.map((p) => [p.lat, p.lng]));

    // Recalculate several times through panel width animation to avoid blank tiles.
    const runFit = () => {
      map.invalidateSize({ animate: false });
      map.fitBounds(bounds.pad(0.2), { animate: true, duration: 0.6, maxZoom: 5 });
    };

    runFit();
    const t1 = window.setTimeout(runFit, 180);
    const t2 = window.setTimeout(runFit, 420);
    const t3 = window.setTimeout(runFit, 700);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [map, points, refreshKey]);

  return null;
}

function getMaxLabelsForZoom(zoom: number) {
  if (zoom <= 2) return 18;
  if (zoom <= 3) return 28;
  if (zoom <= 4) return 45;
  if (zoom <= 5) return 70;
  if (zoom <= 6) return 110;
  if (zoom <= 7) return 160;
  return 260;
}

function getGridSizeForZoom(zoom: number) {
  if (zoom <= 2) return 130;
  if (zoom <= 3) return 110;
  if (zoom <= 4) return 95;
  if (zoom <= 5) return 80;
  if (zoom <= 6) return 65;
  if (zoom <= 7) return 52;
  return 42;
}

function selectVisiblePoints(map: LeafletMapType, points: MapPoint[]) {
  const zoom = map.getZoom();
  const bounds = map.getBounds().pad(0.08);
  const maxLabels = getMaxLabelsForZoom(zoom);
  const gridSize = getGridSizeForZoom(zoom);

  const inView = points.filter((p) => bounds.contains([p.lat, p.lng]));
  const prioritized = [...inView].sort((a, b) => a.price - b.price);

  const usedCells = new Set<string>();
  const selected: MapPoint[] = [];

  for (const p of prioritized) {
    const px = map.project([p.lat, p.lng], zoom);
    const cellX = Math.floor(px.x / gridSize);
    const cellY = Math.floor(px.y / gridSize);
    const key = `${cellX}:${cellY}`;
    if (usedCells.has(key)) continue;

    usedCells.add(key);
    selected.push(p);
    if (selected.length >= maxLabels) break;
  }

  return selected;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function flightLabelIcon(name: string, price: number, dark: boolean, active: boolean, fromLabel: string) {
  return divIcon({
    className: [
      "map-flight-label-icon",
      dark ? "map-flight-label-icon-dark" : "",
      active ? "map-flight-label-icon-active" : ""
    ]
      .join(" ")
      .trim(),
    html: `<div class="map-flight-label"><div class="map-flight-label-title">${escapeHtml(name)}</div><div class="map-flight-label-price">${escapeHtml(fromLabel)} $${price}</div></div>`,
    iconSize: [114, 52],
    iconAnchor: [57, 62]
  });
}

function SmartMarkers({ points, dark, fromLabel }: { points: MapPoint[]; dark: boolean; fromLabel: string }) {
  const map = useMap();
  const [visiblePoints, setVisiblePoints] = useState<MapPoint[]>([]);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  useEffect(() => {
    setVisiblePoints(selectVisiblePoints(map, points));
  }, [map, points]);

  useMapEvents({
    zoomend() {
      setVisiblePoints(selectVisiblePoints(map, points));
    },
    moveend() {
      setVisiblePoints(selectVisiblePoints(map, points));
    }
  });

  return (
    <>
      {visiblePoints.map((p) => (
        <Marker
          key={`${p.name}-${p.lat}-${p.lng}`}
          position={[p.lat, p.lng]}
          icon={flightLabelIcon(p.name, p.price, dark, hoveredKey === `${p.name}-${p.lat}-${p.lng}`, fromLabel)}
          zIndexOffset={hoveredKey === `${p.name}-${p.lat}-${p.lng}` ? 10000 : 0}
          eventHandlers={{
            mouseover: () => setHoveredKey(`${p.name}-${p.lat}-${p.lng}`),
            mouseout: () => setHoveredKey((prev) => (prev === `${p.name}-${p.lat}-${p.lng}` ? null : prev)),
            click: () => setHoveredKey(`${p.name}-${p.lat}-${p.lng}`)
          }}
        />
      ))}
    </>
  );
}

export function LeafletMap({
  points,
  refreshKey,
  fromLabel = "from"
}: {
  points: MapPoint[];
  refreshKey?: string | number;
  fromLabel?: string;
}) {
  const { resolved } = useTheme();
  const isDark = resolved === "dark";
  const stablePoints = useMemo(() => points, [points]);
  const themeKey = isDark ? "dark" : "light";

  return (
    <MapContainer
      key={`leaflet-${themeKey}`}
      center={[41.0, 28.0]}
      zoom={4}
      className={["h-full w-full map-leaflet", isDark ? "map-leaflet-dark" : ""].join(" ")}
      zoomControl
      scrollWheelZoom
      attributionControl
      minZoom={2}
      maxBounds={[
        [-85, -180],
        [85, 180]
      ]}
      maxBoundsViscosity={1}
      worldCopyJump
    >
      <TileLayer
        key={`tiles-${themeKey}`}
        url={
          isDark
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        }
      />
      <FitBounds points={points} refreshKey={refreshKey} />
      <SmartMarkers points={stablePoints} dark={isDark} fromLabel={fromLabel} />
    </MapContainer>
  );
}

