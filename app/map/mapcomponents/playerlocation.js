"use client";

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

export default function PlayerLocation({ mapRef }) {
  const markerRef = useRef(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 1. Create a DOM element for the custom marker
    const el = document.createElement('div');
    el.className = 'player-marker';
    
    // Style the marker (You can also do this in a CSS file)
    el.style.backgroundImage = 'url("/images/playerlocation.png")'; // Path to your image in /public
    el.style.width = '50px';
    el.style.height = '50px';
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat'; 
    el.style.backgroundPosition = 'center';
    el.style.cursor = 'pointer';
    
    
// 2. Initialize marker at a dummy location (will move immediately)
    markerRef.current = new maplibregl.Marker({
      element: el,
      anchor: 'center'
    })
      .setLngLat([0, 0]) 
      .addTo(map);

    // 3. Get Current Location and Update Map
    if ("geolocation" in navigator) {
      // Get position once and fly the camera there
      navigator.geolocation.getCurrentPosition((position) => {
        const { longitude, latitude } = position.coords;
        const newCoords = [longitude, latitude];

        // Move Marker
        markerRef.current.setLngLat(newCoords);

        // Move Camera to Player
        map.flyTo({
          center: newCoords,
          zoom: 18, // Zoom in close for player view
          essential: true
        });
      });

      // 4. Watch for movement (updates marker as player walks)
      const watchId = navigator.geolocation.watchPosition((position) => {
        const { longitude, latitude } = position.coords;
        markerRef.current.setLngLat([longitude, latitude]);
      }, (err) => console.error(err), {
        enableHighAccuracy: true,
      });

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [mapRef]);

  return null;
}