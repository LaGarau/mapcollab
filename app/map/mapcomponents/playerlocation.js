"use client";

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { db } from '@/lib/firebase';
import { ref, set } from 'firebase/database';

export default function PlayerLocation({ mapRef, username = "GuestUser" }) {
  const markerRef = useRef(null);
  const currentPosRef = useRef({ lat: 0, lng: 0 });

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 1. Create Marker Element
    const el = document.createElement('div');
    el.className = 'player-marker';
    el.style.backgroundImage = 'url("/images/playerlocation.png")';
    el.style.width = '60px';
    el.style.height = '60px';
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundPosition = 'center';
    el.style.cursor = 'pointer';
    el.style.filter = 'drop-shadow(0 0 5px rgba(0,0,0,0.5))';

    markerRef.current = new maplibregl.Marker({
      element: el,
      anchor: 'center'
    })
      .setLngLat([0, 0])
      .addTo(map);

    // 2. Geolocation Logic
    if ("geolocation" in navigator) {
      // Initial Position & Camera Fly
      navigator.geolocation.getCurrentPosition((position) => {
        const { longitude, latitude } = position.coords;
        currentPosRef.current = { lat: latitude, lng: longitude };
        markerRef.current.setLngLat([longitude, latitude]);
        map.flyTo({ center: [longitude, latitude], zoom: 18, essential: true });
      });

      // Watch Position (Real-time marker movement on map)
      const watchId = navigator.geolocation.watchPosition((position) => {
        const { longitude, latitude } = position.coords;
        currentPosRef.current = { lat: latitude, lng: longitude };
        markerRef.current.setLngLat([longitude, latitude]);
      }, (err) => console.error(err), { enableHighAccuracy: true });

      // // 3. Firebase Update Interval (Every 1 seconds)
      // const firebaseInterval = setInterval(() => {
      //   const { lat, lng } = currentPosRef.current;
      //   if (lat === 0 && lng === 0) return; // Don't upload dummy data

      //   const playerNavRef = ref(db, `playernav/${username}`);
        
      //   const now = new Date();
      //   const readableTime = now.toLocaleString(); 

      //   set(playerNavRef, {
      //     username: username,
      //     latitude: lat,
      //     longitude: lng,
      //     dateTime: readableTime,
          
      //   })
      //   .then(() => console.log("Location synced to Firebase"))
      //   .catch((error) => console.error("Firebase sync error:", error));
        
      // }, 1000);

      // return () => {
      //   navigator.geolocation.clearWatch(watchId);
      //   clearInterval(firebaseInterval);
      // };
    }
  }, [mapRef, username]);

  return null;
}