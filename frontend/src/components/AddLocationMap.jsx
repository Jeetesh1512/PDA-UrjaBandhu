"use client";
import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import * as turf from "@turf/turf";
import axios from "axios";
import { createClient } from "@/utils/supabase/client";

export default function AddLocationMap({
  setLatLng,
  setAddress,
  setGoToMyLocation,
  setClearMapMarker,
  selectedLocality,
}) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const boundaryRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geojsonRef = useRef(null);

  const isPointInPolygon = (latLng, geojson) => {
    const point = turf.point([latLng.lng(), latLng.lat()]);

    const feature = geojson?.features?.[0];
    if (!feature || feature.geometry.type !== "MultiPolygon") return false;

    const polygon = turf.multiPolygon(feature.geometry.coordinates);
    return turf.booleanPointInPolygon(point, polygon);
  };

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
    geojsonRef.current = geojson;
  };

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    const initializeMap = async () => {
      const { Map } = await loader.importLibrary("maps");
      const { AdvancedMarkerElement } = await loader.importLibrary("marker");
      const { SearchBox } = await loader.importLibrary("places");

      const geocoder = new google.maps.Geocoder();

      const defaultLocation = { lat: 32.73935, lng: 74.874487 }; // Jammu

      const map = new Map(mapRef.current, {
        center: defaultLocation,
        zoom: 10,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
      });
      mapInstanceRef.current = map;

      const setLocation = (latLng, title = "Selected Location") => {
        setLatLng(latLng);
        map.setCenter(latLng);

        if (markerRef.current) markerRef.current.setMap(null);

        markerRef.current = new AdvancedMarkerElement({
          map,
          position: latLng,
          title,
        });

        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === "OK" && results[0]) {
            setAddress(results[0].formatted_address);
          } else {
            console.error("Geocoder failed due to:", status);
          }
        });
      };

      map.addListener("click", (e) => {
        const clickedLatLng = e.latLng;
        if (isPointInPolygon(clickedLatLng, geojsonRef.current)) {
          setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
          console.log(clickedLatLng);
        } else {
          alert("Please select a location within the selected locality.");
        }
      });

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Search location...";
      input.className = "map-search-input";
      input.style.cssText = `
        box-sizing: border-box;
        border: 1px solid #999;
        padding: 8px 12px;
        border-radius: 20px;
        margin: 10px;
        width: 220px;
        font-size: 14px;
        color: black;
        background: white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.5);
        outline: none;
      `;

      if (!document.getElementById("map-search-placeholder-style")) {
        const style = document.createElement("style");
        style.id = "map-search-placeholder-style";
        style.textContent = `
          .map-search-input::placeholder {
            color: gray !important; 
            opacity: 1;
          }
        `;
        document.head.appendChild(style);
      }

      map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(input);
      const searchBox = new SearchBox(input);

      map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
      });

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        if (!place.geometry || !place.geometry.location) return;

        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        if (
          geojsonRef.current &&
          isPointInPolygon(place.geometry.location, geojsonRef.current)
        ) {
          setLocation(location, place.name || "Searched Location");
        } else {
          alert("Selected location is outside the locality boundary.");
        }
      });

      setGoToMyLocation(() => () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };

              const latLng = new google.maps.LatLng(
                userLocation.lat,
                userLocation.lng
              );

              if (
                geojsonRef.current &&
                isPointInPolygon(latLng, geojsonRef.current)
              ) {
                setLocation(userLocation, "Your Location");
              } else {
                alert("Your location is outside the selected locality.");
              }
            },
            (error) => {
              console.warn("Geolocation failed:", error);
            }
          );
        } else {
          console.warn("Geolocation not supported.");
        }
      });
    };

    setClearMapMarker(() => () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      setLatLng(null);
      setAddress("");
    });

    initializeMap().catch((err) => console.error("Map load error:", err));
  }, [setLatLng, setAddress, setGoToMyLocation]);

  useEffect(() => {
    if (!selectedLocality || !mapInstanceRef.current) return;

    async function getBoundary() {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getSession();

      const token = data?.session?.access_token;

      if (token) {
        try {
          const res = await axios.get(
            `http://localhost:8080/api/locality/boundary/${selectedLocality.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          drawBoundary(mapInstanceRef.current, res?.data?.geojson);

          if (markerRef.current) {
            markerRef.current.setMap(null);
            markerRef.current = null;
          }

          setLatLng(null);
          setAddress("");
        } catch (error) {
          console.error("Failed to fetch boundary for locality:", error);
        }
      }
    }

    getBoundary();
  }, [selectedLocality]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "300px",
        borderRadius: "8px",
      }}
    />
  );
}
