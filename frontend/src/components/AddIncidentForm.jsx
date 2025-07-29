"use client";
import React, { useState, useEffect, useRef } from "react";
import { MapPin, Upload, AlertTriangle, Send, Loader } from "lucide-react";
import AddLocationMap from "@/components/AddLocationMap";
import axios from "axios";
import { createClient } from "@/utils/supabase/client";

export default function IncidentForm() {
  const [formData, setFormData] = useState({
    description: "",
    localityId: "",
  });
  const [localities, setLocalities] = useState([]);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [latLng, setLatLng] = useState(null);
  const [address, setAddress] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [goToMyLocation, setGoToMyLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    async function getSession() {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getSession();
      const token = data?.session?.access_token;

      if (token) {
        const res = await axios.get(
          `http://localhost:8080/api/locality/basic-features`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(res.data.localities);
        setLocalities(res.data.localities);
        console.log(localities);
      }
    }

    getSession();

    console.log(localities);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        alert("Please select an image file only.");
        e.target.value = "";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!latLng) {
      alert("Please select a location on the map.");
      return;
    }

    if (!selectedFile) {
      alert("Please upload an image.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please provide a description.");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("latitude", latLng.lat);
      submitData.append("longitude", latLng.lng);
      submitData.append("description", formData.description);
      submitData.append("localityId", formData.localityId);
      submitData.append("file", selectedFile);

      // Replace with your actual API endpoint
      console.log("Submitting incident data:", {
        latitude: latLng.lat,
        longitude: latLng.lng,
        description: formData.description,
        localityId: formData.localityId,
        file: selectedFile.name,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Incident reported successfully!");

      // Reset form
      setFormData({ description: "", localityId: "" });
      setLatLng(null);
      setAddress("");
      setSelectedFile(null);
      setFilePreview(null);
    } catch (error) {
      console.error("Error submitting incident:", error);
      alert("Failed to submit incident. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (localities.length > 0 && !selectedLocality) {
      setSelectedLocality(localities[0]);
    }
  }, [localities]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-500 p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle size={32} className="text-white" />
              <div>
                <h1 className="text-2xl font-bold">Report an Incident</h1>
                <p className="text-red-100 opacity-90">
                  Help keep your community safe
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Incident Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what happened..."
                    rows={4}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Locality ID */}
                <div>
                  <select
                    value={selectedLocality?.location || ""}
                    onChange={(e) => {
                      const loc = localities.find(
                        (l) => l.location === e.target.value
                      );
                      setSelectedLocality(loc);
                    }}
                  >
                    <option value="">Select locality</option>
                    {localities.map((loc) => (
                      <option key={loc.id} value={loc.location}>
                        {loc.location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Upload Image *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center w-full px-4 py-6 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-red-500 hover:bg-gray-650 transition-colors"
                    >
                      <div className="text-center">
                        <Upload
                          className="mx-auto mb-2 text-gray-400"
                          size={24}
                        />
                        <p className="text-sm text-gray-400">
                          {selectedFile
                            ? selectedFile.name
                            : "Click to upload image"}
                        </p>
                      </div>
                    </label>
                  </div>

                  {filePreview && (
                    <div className="mt-3">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border border-gray-600"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Map */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Incident Location *
                  </label>
                  <AddLocationMap
                    setLatLng={setLatLng}
                    setAddress={setAddress}
                    setGoToMyLocation={setGoToMyLocation}
                    selectedLocality={selectedLocality}
                  />
                </div>

                {/* Address Display */}
                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <p className="text-sm text-gray-300">
                    {address || "Click on the map to select a location"}
                  </p>
                  {latLng && (
                    <p className="text-xs text-gray-400 mt-1">
                      Coordinates: {latLng.lat.toFixed(6)},{" "}
                      {latLng.lng.toFixed(6)}
                    </p>
                  )}
                </div>

                {/* Current Location Button */}
                <button
                  type="button"
                  onClick={() => goToMyLocation && goToMyLocation()}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <MapPin size={16} className="mr-2" />
                  Use My Current Location
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-700">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin mr-2" size={16} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Report Incident
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
