"use client";

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { db } from '@/lib/firebase';
import { ref, set } from 'firebase/database';

export default function PlayerLocation({ mapRef, username = "GuestUser" }) {
  const markerRef = useRef(null);
  const lastSavedPosRef = useRef({ lat: 0, lng: 0 });

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // --- 1. Create the Dot with Pulse Animation ---
    const el = document.createElement('div');
    el.className = 'player-dot-container';
    
    // Inline CSS for the dot and pulse effect
    el.innerHTML = `
      <div style="
        width: 15px; 
        height: 15px; 
        background-color: #007cff; 
        border-radius: 50%; 
        border: 2px solid white;
        position: relative;
        z-index: 2;
      "></div>
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 15px;
        height: 15px;
        background-color: #007cff;
        border-radius: 50%;
        z-index: 1;
        animation: pulse 2s infinite;
      "></div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(3); opacity: 0; }
        }
      </style>
    `;

    // Initialize Marker (hidden at 0,0 initially)
    markerRef.current = new maplibregl.Marker({ element: el })
      .setLngLat([0, 0])
      .addTo(map);

    // --- 2. Firebase Sync Function ---
    const updateFirebase = (lat, lng) => {
      if (lat === lastSavedPosRef.current.lat && lng === lastSavedPosRef.current.lng) return;

      console.log("Saving to Firebase path:", `playernavhistory/${username}`);
      const playerNavRef = ref(db, `playernavhistory/${username}`);
      
      set(playerNavRef, {
        username,
        latitude: lat,
        longitude: lng,
        dateTime: new Date().toLocaleString(),
      })
      .then(() => {
        lastSavedPosRef.current = { lat, lng };
      })
      .catch((error) => console.error("Firebase Error:", error.message));
    };

    // --- 3. Geolocation Logic ---
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          
          // Move Marker
          markerRef.current.setLngLat([longitude, latitude]);

          // Fly to user only once at start
          if (lastSavedPosRef.current.lat === 0) {
            map.flyTo({ center: [longitude, latitude], zoom: 16 });
          }

          // Sync with Firebase
          updateFirebase(latitude, longitude);
        },
        (err) => console.error("Geolocation Error:", err),
        { enableHighAccuracy: true }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
        if (markerRef.current) markerRef.current.remove();
      };
    }
  }, [mapRef, username]);

  return null;
}