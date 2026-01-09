"use client";
import { useEffect, useState, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { db } from '@/lib/firebase'; 
import { ref, onValue } from 'firebase/database';

export default function RenderMarkers({ map }) {
  const [qrMarkers, setQrMarkers] = useState([]);
  const [categories, setCategories] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const markersRef = useRef({});

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Track user location
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      console.log('Geolocation not available');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        console.log('Location updated:', position.coords.latitude, position.coords.longitude);
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        // Handle different error types silently
        switch(error.code) {
          case error.PERMISSION_DENIED:
            console.log('Location permission denied');
            break;
          case error.POSITION_UNAVAILABLE:
            console.log('Location unavailable');
            break;
          case error.TIMEOUT:
            console.log('Location request timeout');
            break;
          default:
            console.log('Location error:', error.message);
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000
      }
    );

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // 1. Fetch Categories (Mapping Category Name to Color)
  useEffect(() => {
    const categoryRef = ref(db, 'QrCategory');
    const unsubscribe = onValue(categoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const colorMap = {};
        Object.values(data).forEach(cat => {
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

  // Helper function to generate popup HTML
  const generatePopupHTML = (item, isNearby, borderColor) => {
    return isNearby ? `
      <div style="color: #1e293b; font-family: sans-serif; width: 200px; padding: 5px;">
        <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 12px; border-radius: 8px; text-align: center; margin-bottom: 10px;">
          <span style="font-size: 24px;">🎉</span>
          <p style="color: white; font-weight: bold; margin: 5px 0 0 0; font-size: 14px;">You have explored this area!</p>
        </div>
        <img src="${item.picture}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px;" />
        <h3 style="margin: 10px 0 2px; color: #22c55e; font-size: 16px;">${item.name}</h3>
        <p style="margin: 0; font-size: 11px; color: #64748b; font-weight: bold;">${item.type.toUpperCase()}</p>
        <p style="margin: 8px 0; font-size: 12px; line-height: 1.4; color: #334155;">${item.description}</p>
        <div style="background: #f1f5f9; padding: 8px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
           <span style="font-size: 13px; font-weight: bold;">💎 ${item.points} Points</span>
           <span style="font-size: 11px; color: #22c55e; font-weight: bold;">✓ Nearby</span>
        </div>
        ${item.externalLink ? `
          <a href="${item.externalLink}" target="_blank" 
             style="display: block; text-align: center; background: #22c55e; color: white; 
             text-decoration: none; padding: 10px; border-radius: 8px; margin-top: 10px; font-size: 12px; font-weight: bold;">
             Open Link
          </a>` : ''}
      </div>
    ` : `
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
  };

  // 3. Create and update markers
  useEffect(() => {
    if (!map || qrMarkers.length === 0) return;

    // Add CSS animation for pulse effect
    if (!document.getElementById('marker-pulse-animation')) {
      const style = document.createElement('style');
      style.id = 'marker-pulse-animation';
      style.textContent = `
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }

    qrMarkers.forEach((item) => {
      if (item.status !== "Active") return;

      const lng = parseFloat(item.longitude);
      const lat = parseFloat(item.latitude);
      
      if (isNaN(lng) || isNaN(lat)) return;

      // Calculate proximity
      let isNearby = false;
      if (userLocation) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          lat,
          lng
        );
        isNearby = distance <= 10; // Within 10 meters
        console.log(`Distance to ${item.name}:`, distance, 'meters', isNearby ? '(NEARBY)' : '');
      }

      const originalColor = categories[item.type] || "#000000";
      const borderColor = isNearby ? "#22c55e" : originalColor;

      // Check if marker already exists
      if (markersRef.current[item.firebaseId]) {
        // Update existing marker
        const { element, popup } = markersRef.current[item.firebaseId];
        
        // Update border color and animation
        element.style.border = `3px solid ${borderColor}`;
        if (isNearby) {
          element.style.animation = 'pulse 2s infinite';
          element.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.6)';
        } else {
          element.style.animation = '';
          element.style.boxShadow = '';
        }

        // Update popup content
        popup.setHTML(generatePopupHTML(item, isNearby, originalColor));
      } else {
        // Create new marker
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

        if (isNearby) {
          el.style.animation = 'pulse 2s infinite';
          el.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.6)';
        }

        const popupHTML = generatePopupHTML(item, isNearby, originalColor);
        const popup = new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(popupHTML);

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);

        // Store marker data
        markersRef.current[item.firebaseId] = {
          marker,
          element: el,
          popup,
          item,
          originalColor
        };
      }
    });

    return () => {
      Object.values(markersRef.current).forEach(({ marker }) => marker.remove());
      markersRef.current = {};
    };
  }, [map, qrMarkers, categories, userLocation]);

  return null;
}
