"use client";

import React, { useRef, useState, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import dynamic from "next/dynamic";
import RenderMarkers from './mapcomponents/markers';
import Navbar from './mapcomponents/navbar';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);




const PlayerLocation = dynamic(() => import("./mapcomponents/playerlocation"), { ssr: false });

export default function GhumanteMap() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // States
  const [showBuildings, setShowBuildings] = useState(true);
  const [show3D, setShow3D] = useState(true);
  const [showPOIs, setShowPOIs] = useState(false);
  const [buildingOpacity, setBuildingOpacity] = useState(0.8);

  useEffect(() => {
    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [85.3240, 27.7172],
      zoom: 16,
      pitch: 45,
      antialias: true
    });

    mapInstance.current.on('load', () => setIsLoaded(true));
    return () => mapInstance.current?.remove();
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!isLoaded || !map) return;

    const layerId = 'gh-3d-buildings';
    // Logic: If opacity is 0, buildings are effectively "OFF"
    const isVisible = showBuildings && buildingOpacity > 0;

    // 1. Handle Baked-in Layers (Flat Buildings & Businesses)
    map.getStyle().layers.forEach(l => {
      const id = l.id.toLowerCase();
      if (id.includes('building') && l.id !== layerId) {
        map.setLayoutProperty(l.id, 'visibility', isVisible ? 'visible' : 'none');
      }
      if (id.includes('poi') || id.includes('place-')) {
        map.setLayoutProperty(l.id, 'visibility', showPOIs ? 'visible' : 'none');
      }
    });

    // 2. Handle 3D Extrusion
    if (isVisible && show3D) {
      if (!map.getLayer(layerId)) {
        map.addLayer({
          'id': layerId, 'source': 'openmaptiles', 'source-layer': 'building', 'type': 'fill-extrusion',
          'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': ['coalesce', ['get', 'render_height'], ['get', 'height'], 15],
            'fill-extrusion-opacity': parseFloat(buildingOpacity)
          }
        });
      } else {
        map.setPaintProperty(layerId, 'fill-extrusion-opacity', parseFloat(buildingOpacity));
      }
      map.easeTo({ pitch: 60 });
    } else {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (!show3D) map.easeTo({ pitch: 0 });
    }
  }, [isLoaded, showBuildings, show3D, showPOIs, buildingOpacity]);

  // Handle Slider specifically to toggle building state
  const handleOpacityChange = (val) => {
    const numVal = parseFloat(val);
    setBuildingOpacity(numVal);
    if (numVal === 0) setShowBuildings(false);
    else if (numVal > 0 && !showBuildings) setShowBuildings(true);
  };

  const handleRelocate = () => {
    if (!mapInstance.current) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      mapInstance.current.flyTo({
        center: [pos.coords.longitude, pos.coords.latitude],
        zoom: 18,
        essential: true
      });
    });
  };

  const handleGoToLastQR = () => {
    const lastPos = localStorage.getItem("last_qr_location");
    if (lastPos && mapInstance.current) {
      const { lng, lat } = JSON.parse(lastPos);
      mapInstance.current.flyTo({ center: [lng, lat], zoom: 18 });
    } else {
      alert("No recent QR location found!");
    }
  };

  const handleStartScanner = () => {
    console.log("Scanner Started");
    // Add your scanner navigation logic here
  };

  return (
    <main style={{ position: 'fixed', inset: 0, overflow: 'hidden', fontFamily: 'sans-serif' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      <div style={{
        position: 'absolute', top: '20px', left: '20px', zIndex: 10,
        background: 'rgba(15, 23, 42, 0.9)', color: 'white', padding: '20px', borderRadius: '24px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', width: '240px'
      }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '18px', color: '#10b981' }}>Ghumante Engine</h2>
        <p style={{ margin: '0 0 20px', fontSize: '11px', color: '#94a3b8' }}>ARCHITECTURE EDITOR</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Toggle label="Show Buildings" checked={showBuildings} onChange={e => setShowBuildings(e.target.checked)} />

          <div style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', opacity: showBuildings ? 1 : 0.4 }}>
            <Toggle label="3D Mode" checked={show3D} disabled={!showBuildings} onChange={e => setShow3D(e.target.checked)} />
            <div style={{ marginTop: '10px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>OPACITY: {Math.round(buildingOpacity * 100)}%</span>
              <input type="range" min="0" max="1" step="0.1" value={buildingOpacity}
                onChange={(e) => handleOpacityChange(e.target.value)}
                style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }} />
            </div>
          </div>

          <Toggle label="Show Businesses" checked={showPOIs} onChange={e => setShowPOIs(e.target.checked)} />
        </div>
      </div>

      {/* Show player location */}
      <PlayerLocation mapRef={mapInstance} />
      {isLoaded && <RenderMarkers map={mapInstance.current} />}

      <Navbar/>
    </main>
  );
}

function Toggle({ label, checked, onChange, disabled }) {
  return (
    <label style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', opacity: disabled ? 0.3 : 1 }}>
      <span style={{ fontSize: '13px', fontWeight: '600' }}>{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} style={{ width: '18px', height: '18px', accentColor: '#10b981' }} />
    </label>
  );
}
