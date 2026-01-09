"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { db, auth } from "@/lib/firebase";
import { ref, set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

export default function PlayerLocation({ mapRef, username = "GuestUser" }) {
  const markerRef = useRef(null);
  const currentPosRef = useRef({ lat: 0, lng: 0 });
  const emailRef = useRef("guest@unknown.com"); // ✅ persistent email

  useEffect(() => {
    // 🔑 Listen for auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        emailRef.current = user.email;
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const el = document.createElement("div");
    el.style.backgroundImage = 'url("/images/playerlocation.png")';
    el.style.width = "60px";
    el.style.height = "60px";
    el.style.backgroundSize = "contain";
    el.style.backgroundRepeat = "no-repeat";
    el.style.backgroundPosition = "center";

    markerRef.current = new maplibregl.Marker({ element: el })
      .setLngLat([0, 0])
      .addTo(map);

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      currentPosRef.current = { lat: latitude, lng: longitude };
      markerRef.current.setLngLat([longitude, latitude]);
      map.flyTo({ center: [longitude, latitude], zoom: 18 });
    });

    const watchId = navigator.geolocation.watchPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      currentPosRef.current = { lat: latitude, lng: longitude };
      markerRef.current.setLngLat([longitude, latitude]);
    });

    const interval = setInterval(() => {
      const { lat, lng } = currentPosRef.current;
      if (!lat || !lng) return;

      const playerNavRef = ref(db, `playernav/${username}`);

      set(playerNavRef, {
        username,
        email: emailRef.current, // ✅ ALWAYS correct email
        latitude: lat,
        longitude: lng,
        dateTime: new Date().toLocaleString(),
      });
    }, 1000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(interval);
    };
  }, [mapRef, username]);

  return null;
}
