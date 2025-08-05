"use client";

import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function LocationMap({ households = [], incidents = [], defaultLocation = {lat: 32.72968235, lng: 74.86347334}, zoom=10}) {
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

      const map = new Map(mapRef.current, {
        center: defaultLocation,
        zoom: zoom,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
      });

      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      const createDot = (color) => {
        const div = document.createElement("div");
        div.style.background = color;
        div.style.width = "16px";
        div.style.height = "16px";
        div.style.borderRadius = "50%";
        div.style.border = "2px solid white";
        div.classList.add("blink");
        return div;
      };

      households.forEach((house) => {
        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: house.latitude, lng: house.longitude },
          content: createDot(
            house.meter.powerStatus === true ? "green" : "red"
          ),
          title: `Household-power: ${
            house.meter.powerStatus === true ? "ON" : "OFF"
          }`,
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
          content: createDot(
            incident.status === "IN_PROGRESS" ? "blue" : "red",
            true,
          ),
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
        height: "100%",
        borderRadius: "8px",
      }}
    />
  );
}
