"use client";

import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function LocationMap({ households = [], incidents = [] }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    const initializeMap = async () => {
      const { Map } = await loader.importLibrary("maps");
      const { AdvancedMarkerElement } = await loader.importLibrary("marker");

      const defaultLocation = { lat: 32.88, lng: 74.78 };

      const map = new Map(mapRef.current, {
        center: defaultLocation,
        zoom: 10,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
      });

      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      const createDot = (color) => {
        const div = document.createElement("div");
        div.style.background = color;
        div.style.width = "12px";
        div.style.height = "12px";
        div.style.borderRadius = "50%";
        div.style.border = "2px solid white";
        return div;
      };

      households.forEach((house) => {
        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: house.latitude, lng: house.longitude },
          content: createDot(house.meter.powerStatus === true ? "green" : "red"),
          title: `Household-power: ${house.meter.powerStatus ===true ? "ON" : "OFF"}`,
        });

        markersRef.current.push(marker);
      });

      incidents.forEach((incident) => {
        const marker = new AdvancedMarkerElement({
          map,
          position: {
            lat: incident.latitude,
            lng: incident.longitude,
          },
          content: createDot(incident.status === "IN_PROGRESS" ? "yellow" : "orange"),
          title: `Incident: ${incident.description},\nstatus: ${incident.status}`,
        });
        markersRef.current.push(marker);
      });
    };

    initializeMap().catch((error) => {
      console.error("Map load error", error);
    });
  }, [households, incidents]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "8px",
      }}
    />
  );
}
