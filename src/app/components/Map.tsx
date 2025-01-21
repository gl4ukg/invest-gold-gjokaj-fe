'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  useEffect(() => {
    // Fix for default marker icons in Next.js
    const icon = L.icon({
      iconUrl: '/marker-icon.png',
      iconRetinaUrl: '/marker-icon-2x.png',
      shadowUrl: '/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Initialize map
    const map = L.map('map').setView([42.4318694, 20.4214281], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add marker
    L.marker([42.4318694, 20.4214281], { icon })
      .addTo(map)
      .bindPopup('Invest Gold Gjokaj');

    // Cleanup
    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" className="h-full w-full min-h-[400px]" />;
};

export default Map;
