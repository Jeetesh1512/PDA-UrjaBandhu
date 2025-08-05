"use client";

import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import axios from "axios";
import { createClient } from "@/utils/supabase/client";

export default function IncidentMap({
  selectedLocality,
  households = [],
  incidents = [],
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const boundaryRef = useRef(null);
  const markersRef = useRef([]);

  // Draw the boundary
  const drawBoundary = (map, geojson) => {
    if (boundaryRef.current) {
      boundaryRef.current.setMap(null);
    }

    const boundaryLayer = new google.maps.Data();
    boundaryLayer.addGeoJson(geojson);
    boundaryLayer.setStyle({
      strokeColor: "#0097A7",
      strokeWeight: 2,
      fillOpacity: 0.2,
      clickable: false,
    });
    boundaryLayer.setMap(map);

    const bounds = new google.maps.LatLngBounds();
    boundaryLayer.forEach((feature) => {
      feature.getGeometry().forEachLatLng((latlng) => {
        bounds.extend(latlng);
      });
    });
    map.fitBounds(bounds);

    boundaryRef.current = boundaryLayer;
  };

  // Add markers
  const drawMarkers = async (map) => {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // Clear old markers
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
        content: createDot(house.meter?.powerStatus ? "green" : "red"),
        title: `Household-power: ${house.meter?.powerStatus ? "ON" : "OFF"}`,
      });
      markersRef.current.push(marker);
    });

    incidents.forEach((incident) => {
      const marker = new AdvancedMarkerElement({
        map,
        position: { lat: incident.latitude, lng: incident.longitude },
        content: createDot(incident.status === "IN_PROGRESS" ? "blue" : "red"),
        title: `Incident: ${incident.description},\nstatus: ${incident.status}`,
      });
      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    const initializeMap = async () => {
      const { Map } = await loader.importLibrary("maps");

      const map = new Map(mapRef.current, {
        center: { lat: 32.73935, lng: 74.874487 },
        zoom: 10,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
      });

      mapInstanceRef.current = map;
    };

    initializeMap().catch((err) => console.error("Map init error:", err));
  }, []);

  useEffect(() => {
    if (!selectedLocality || !mapInstanceRef.current) return;

    const fetchAndRender = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        const token = data?.session?.access_token;

        if (!token) return;

        const res = await axios.get(
          `http://localhost:8080/api/locality/boundary/${selectedLocality.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const geojson = res?.data?.geojson;
        if (geojson) {
          drawBoundary(mapInstanceRef.current, geojson);
        }

        drawMarkers(mapInstanceRef.current);
      } catch (error) {
        console.error("Failed to load locality data:", error);
      }
    };

    fetchAndRender();
  }, [selectedLocality, households, incidents]);

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
