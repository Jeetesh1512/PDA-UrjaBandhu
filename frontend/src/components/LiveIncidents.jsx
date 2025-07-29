"use client";

import { useState, useEffect, Suspense } from "react";

// Dummy data for incidents
const generateDummyIncidents = () => {
  const incidents = [
    {
      id: 1,
      title: "Water Main Break on Elm Street",
      description:
        "Major water main burst causing flooding on Elm Street between 3rd and 4th Avenue. Multiple vehicles stranded, road closure in effect.",
      urgency: "High",
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      location: "Elm Street & 3rd Ave",
    },
    {
      id: 2,
      title: "Power Outage in Downtown District",
      description:
        "Electrical outage affecting approximately 500 businesses and residents in the downtown core. Estimated repair time: 2-3 hours.",
      urgency: "Medium",
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      location: "Downtown District",
    },
    {
      id: 3,
      title: "Minor Traffic Accident",
      description:
        "Two-vehicle fender bender on Highway 101 southbound. No injuries reported. One lane blocked, expect delays.",
      urgency: "Low",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      location: "Highway 101 SB, Mile 45",
    },
    {
      id: 4,
      title: "Gas Leak Reported",
      description:
        "Suspicious gas odor reported near the shopping center. Fire department and gas company dispatched. Area being evacuated as precaution.",
      urgency: "High",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      location: "Westfield Shopping Center",
    },
    {
      id: 5,
      title: "Fallen Tree Blocking Road",
      description:
        "Large oak tree fallen across Pine Road due to recent storm. Public works crew en route. Use alternate routes.",
      urgency: "Medium",
      timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
      location: "Pine Road near Forest Ave",
    },
    {
      id: 6,
      title: "Construction Zone Complaint",
      description:
        "Noise complaint regarding early morning construction work. Crew advised to observe quiet hours. No further action needed.",
      urgency: "Low",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      location: "Maple Street Construction Zone",
    },
  ];

  return incidents.sort((a, b) => b.timestamp - a.timestamp);
};

// Loading skeleton component
const IncidentSkeleton = () => (
  <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="h-6 bg-gray-700 rounded w-3/4"></div>
      <div className="h-6 bg-gray-700 rounded w-16"></div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      <div className="h-4 bg-gray-700 rounded w-4/6"></div>
    </div>
    <div className="h-4 bg-gray-700 rounded w-32"></div>
  </div>
);

// Loading fallback component
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

// Main incidents component
const IncidentsContent = () => {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Simulate API call delay
    const loadIncidents = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIncidents(generateDummyIncidents());
      setLastUpdated(new Date());
      setIsLoading(false);
    };

    loadIncidents();

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setIncidents(generateDummyIncidents());
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
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
      case "High":
        return {
          bg: "bg-red-900/50",
          border: "border-red-700",
          text: "text-red-400",
          dot: "bg-red-500",
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

  const getUrgencyCount = (urgency) => {
    return incidents.filter((incident) => incident.urgency === urgency).length;
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {incidents.length}
              </div>
              <div className="text-gray-400 text-sm">Total Incidents</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-red-700/50">
              <div className="text-2xl font-bold text-red-400">
                {getUrgencyCount("High")}
              </div>
              <div className="text-gray-400 text-sm">High Priority</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-yellow-700/50">
              <div className="text-2xl font-bold text-yellow-400">
                {getUrgencyCount("Medium")}
              </div>
              <div className="text-gray-400 text-sm">Medium Priority</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-green-700/50">
              <div className="text-2xl font-bold text-green-400">
                {getUrgencyCount("Low")}
              </div>
              <div className="text-gray-400 text-sm">Low Priority</div>
            </div>
          </div>
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
            {incidents.map((incident) => {
              const urgencyConfig = getUrgencyConfig(incident.urgency);

              return (
                <div
                  key={incident.id}
                  className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors duration-200"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white leading-tight pr-2">
                      {incident.title}
                    </h3>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 whitespace-nowrap ${urgencyConfig.bg} ${urgencyConfig.border} ${urgencyConfig.text}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${urgencyConfig.dot}`}
                      ></div>
                      {incident.urgency}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                    {incident.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="truncate">{incident.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{formatTimestamp(incident.timestamp)}</span>
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

// Main component with Suspense wrapper
const LiveIncidents = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <IncidentsContent />
    </Suspense>
  );
};

export default LiveIncidents;
