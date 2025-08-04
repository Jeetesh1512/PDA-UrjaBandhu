"use client";

import { useState, useEffect, Suspense } from "react";
import IncidentSkeleton from "./IncidentSkeleton";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";

const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-900 p-6">
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="h-8 bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-96 animate-pulse"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <IncidentSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

const IncidentsContent = () => {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [counts, setCounts] = useState({
    byPriority: {},
    byStatus: {},
    total: 0,
  });
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setIsLoading(true);
        const supabase = await createClient();
        const { data: userData } = await supabase.auth.getSession();
        const token = userData?.session?.access_token;

        if (token) {
          const res = await axios.get(
            "http://localhost:8080/api/incident/active",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setIncidents(res?.data?.liveIncidents || []);
          setCounts(res?.data?.counts || {});
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error("Error fetching incidents:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getUrgencyConfig = (urgency) => {
    switch (urgency) {
      case "Critical":
        return {
          bg: "bg-red-900/50",
          border: "border-red-700",
          text: "text-red-400",
          dot: "bg-red-500",
        };
      case "High":
        return {
          bg: "bg-orange-900/50",
          border: "border-orange-700",
          text: "text-orange-400",
          dot: "bg-orange-500",
        };
      case "Medium":
        return {
          bg: "bg-yellow-900/50",
          border: "border-yellow-700",
          text: "text-yellow-400",
          dot: "bg-yellow-500",
        };
      case "Low":
        return {
          bg: "bg-blue-900/50",
          border: "border-blue-700",
          text: "text-blue-400",
          dot: "bg-blue-500",
        };
      case "Trivial":
        return {
          bg: "bg-green-900/50",
          border: "border-green-700",
          text: "text-green-400",
          dot: "bg-green-500",
        };
      default:
        return {
          bg: "bg-gray-900/50",
          border: "border-gray-700",
          text: "text-gray-400",
          dot: "bg-gray-500",
        };
    }
  };

  const getUrgencyCount = (priority) => {
    return incidents.filter((incident) => incident.priority === priority)
      .length;
  };

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Live Incidents
              </h1>
              <p className="text-gray-400">
                Real-time incident monitoring and updates
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Last updated</div>
              <div className="text-white font-medium">
                {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {counts.total || 0}
              </div>
              <div className="text-gray-400 text-sm">Total Incidents</div>
            </div>
            {["Critical", "High", "Medium", "Low", "Trivial"].map((level) => (
              <div
                key={level}
                className={`bg-gray-800 rounded-lg p-4 border ${
                  getUrgencyConfig(level).border
                }`}
              >
                <div
                  className={`text-2xl font-bold ${
                    getUrgencyConfig(level).text
                  }`}
                >
                  {counts.byPriority?.[level] || 0}
                </div>
                <div className="text-gray-400 text-sm">{level}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <select
            className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            {[...new Set(incidents.map((i) => i.priority))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {[...new Set(incidents.map((i) => i.status))].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Incidents Grid */}
        {incidents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Active Incidents
            </h3>
            <p className="text-gray-400">
              All clear! No incidents to report at this time.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {incidents
              .filter((incident) =>
                selectedPriority ? incident.priority === selectedPriority : true
              )
              .filter((incident) =>
                selectedStatus ? incident.status === selectedStatus : true
              )
              .map((incident) => {
                const urgencyConfig = getUrgencyConfig(incident.priority);

                return (
                  <div
                    key={incident.id}
                    className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors duration-200"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-white leading-tight pr-2">
                        {incident.category}
                      </h3>
                      <div className="flex flex-col items-end gap-1">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 whitespace-nowrap ${urgencyConfig.bg} ${urgencyConfig.border} ${urgencyConfig.text}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${urgencyConfig.dot}`}
                          ></div>
                          {incident.priority}
                        </div>
                        <div className="px-2 py-0.5 rounded text-xs text-gray-300 bg-gray-700/40 border border-gray-600">
                          {incident.status}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                      {incident.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-400 gap-2">
                      <div className="flex items-center gap-1 max-w-[60%] truncate">
                        <svg
                          className="w-3 h-3 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="truncate">
                          {incident.location ||
                            "Lat: " +
                              incident.latitude.toFixed(2) +
                              ", Lon: " +
                              incident.longitude.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <svg
                          className="w-3 h-3 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>
                          {formatTimestamp(new Date(incident.updatedAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

const LiveIncidents = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <IncidentsContent />
    </Suspense>
  );
};

export default LiveIncidents;
