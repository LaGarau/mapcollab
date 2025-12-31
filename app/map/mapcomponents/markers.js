"use client";
import { useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { db } from '@/lib/firebase'; 
import { ref, onValue } from 'firebase/database';

export default function RenderMarkers({ map }) {
  const [qrMarkers, setQrMarkers] = useState([]);
  const [categories, setCategories] = useState({});

  // 1. Fetch Categories (Mapping Category Name to Color)
  useEffect(() => {
    const categoryRef = ref(db, 'QrCategory');
    const unsubscribe = onValue(categoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const colorMap = {};
        Object.values(data).forEach(cat => {
          // Mapping 'name' (Historical) to 'color' (#fecb3e)
          if (cat.name && cat.color) {
            colorMap[cat.name] = cat.color;
          }
        });
        setCategories(colorMap);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch QR Data
  useEffect(() => {
    const qrDataRef = ref(db, 'QR-Data');
    const unsubscribe = onValue(qrDataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map(key => ({
          ...data[key],
          firebaseId: key
        }));
        setQrMarkers(formattedData);
      }
    });
    return () => unsubscribe();
  }, []);

  // 3. Sync Markers to Map
  useEffect(() => {
    if (!map || qrMarkers.length === 0) return;

    const currentMarkers = [];

    qrMarkers.forEach((item) => {
      if (item.status !== "Active") return;

      // Match item.type (from QR-Data) with categories[name] (from QrCategory)
      const borderColor = categories[item.type] || "#000000";

      const el = document.createElement('div');
      el.style.width = '45px';
      el.style.height = '45px';
      el.style.borderRadius = '50%';
      el.style.border = `3px solid ${borderColor}`;
      el.style.backgroundImage = `url("${item.picture}")`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.style.backgroundColor = 'white';
      
      el.style.cursor = 'pointer';

      const popupHTML = `
        <div style="color: #1e293b; font-family: sans-serif; width: 200px; padding: 5px;">
          <img src="${item.picture}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px;" />
          <h3 style="margin: 10px 0 2px; color: ${borderColor}; font-size: 16px;">${item.name}</h3>
          <p style="margin: 0; font-size: 11px; color: #64748b; font-weight: bold;">${item.type.toUpperCase()}</p>
          <p style="margin: 8px 0; font-size: 12px; line-height: 1.4; color: #334155;">${item.description}</p>
          <div style="background: #f1f5f9; padding: 8px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
             <span style="font-size: 13px; font-weight: bold;">💎 ${item.points} Points</span>
          </div>
          ${item.externalLink ? `
            <a href="${item.externalLink}" target="_blank" 
               style="display: block; text-align: center; background: ${borderColor}; color: white; 
               text-decoration: none; padding: 10px; border-radius: 8px; margin-top: 10px; font-size: 12px; font-weight: bold;">
               Open Link
            </a>` : ''}
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(popupHTML);

      const lng = parseFloat(item.longitude);
      const lat = parseFloat(item.latitude);

      if (!isNaN(lng) && !isNaN(lat)) {
        const m = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);

        currentMarkers.push(m);
      }
    });

    return () => currentMarkers.forEach(m => m.remove());
  }, [map, qrMarkers, categories]);

  return null;
}