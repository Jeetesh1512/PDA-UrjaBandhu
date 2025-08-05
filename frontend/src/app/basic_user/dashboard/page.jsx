"use client";
import React, { useState, useEffect } from "react";
import {
  Zap,
  MapPin,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  Bell,
  Power,
  TrendingDown,
  Moon,
  Sun,
} from "lucide-react";
import axios from "axios";
import { createClient } from "@/utils/supabase/client";
const IncidentMap = React.lazy(() => import("./IncidentMap"));
import { useSelector } from "react-redux";

export default function PowerDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState(null);
  const [selectedLocalityId, setSelectedLocalityId] = useState(null);
  const households = useSelector(
    (state) => state.auth.user?.basicUser?.households || []
  );

  const handleHouseholdChange = (e) => {
    const householdId = e.target.value;
    setSelectedHouseholdId(householdId);

    const selectedHousehold = households.find((h) => h.id === householdId);
    setSelectedLocalityId(selectedHousehold?.localityId || null);
  };

  useEffect(() => {
    if (households.length > 0 && !selectedHouseholdId) {
      const defaultHousehold = households[0];
      setSelectedHouseholdId(defaultHousehold.id);
      setSelectedLocalityId(defaultHousehold.localityId || null);
    }
  }, [households, selectedHouseholdId]);

  useEffect(() => {
    if (!selectedLocalityId) return;

    async function getIncidents() {
      const supabase = await createClient();
      const { data: userData, error: userError } =
        await supabase.auth.getSession();
      const token = userData?.session?.access_token;

      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/incident/activeLocation/${selectedLocalityId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIncidents(data?.incidents || []);
      } catch (error) {
        console.error("Couldn't fetch incident locations", error);
      }
    }

    getIncidents();
  }, [selectedLocalityId]);

  const outageReports = [
    {
      id: 1,
      location: "Sector 15, Block A",
      time: "2 hours ago",
      status: "Under Investigation",
      severity: "medium",
    },
    {
      id: 2,
      location: "Industrial Area Zone 3",
      time: "45 minutes ago",
      status: "Repair In Progress",
      severity: "high",
    },
    {
      id: 3,
      location: "Residential Complex B",
      time: "30 minutes ago",
      status: "Resolved",
      severity: "low",
    },
  ];

  const energyTips = [
    "Use LED bulbs to reduce energy consumption by up to 80%",
    "Unplug electronics when not in use to avoid phantom loads",
    "Set your thermostat 2-3 degrees lower in winter",
    "Use natural light during the day instead of artificial lighting",
    "Run dishwashers and washing machines with full loads only",
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 bg-gray-900`}>
      {/* Flashing Outage Notifications Bar */}
      <div className="bg-yellow-600 dark:bg-yellow-800 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          <AlertTriangle className="w-5 h-5 text-white animate-bounce" />
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="text-sm font-medium mx-8">
                ⚠️ OUTAGE ALERT: Power outage reported in Sector 15 - Crews
                dispatched
              </span>
              <span className="text-sm font-medium mx-8">
                🔧 MAINTENANCE: Scheduled maintenance in Zone 7 from 2:00 AM -
                4:00 AM tomorrow
              </span>
              <span className="text-sm font-medium mx-8">
                ⚡ HIGH USAGE: Peak demand detected - Consider reducing
                non-essential loads
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Section: Map (Left) and Bill/Usage (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Live Incidents Map - Left */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                <label
                  htmlFor="householdSelect"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Select Linked Household
                </label>
                <select
                  id="householdSelect"
                  value={selectedHouseholdId || ""}
                  onChange={handleHouseholdChange}
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="" disabled>
                    Select your household
                  </option>
                  {households.map((household) => (
                    <option key={household.id} value={household.id}>
                      {household.id} - {household.consumerName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Live Incidents Map
                </h2>
                <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full text-xs font-medium">
                  {incidents.length} Active
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-80 flex items-center justify-center relative">
                <div className="w-full h-full">
                  <React.Suspense
                    fallback={
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        Loading map...
                      </div>
                    }
                  >
                    <IncidentMap
                      selectedLocality={{ id: selectedLocalityId }}
                      incidents={incidents}
                    />
                  </React.Suspense>
                </div>
              </div>
            </div>
          </div>

          {/* Bill and Usage Info - Right */}
          <div className="space-y-4">
            {/* Current Usage Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <Power className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Power Status
                  </p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    Online
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Current Usage
                  </p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    2.4 kW
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Active Issues
                  </p>
                  <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    3
                  </p>
                </div>
              </div>
            </div>

            {/* Electricity Bill */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Current Electricity Bill
                    </h2>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    Jan 1 - Jan 31, 2025
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      $142.67
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Units Used
                    </p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      1,245 kWh
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Due Date
                    </p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                      Feb 15
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    8% decrease from last month
                  </span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Outage Reports */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Outage Reports
                </h2>
              </div>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                View All Reports
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {outageReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {report.location}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Reported {report.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                        report.severity
                      )}`}
                    >
                      {report.status}
                    </span>
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Energy Saving Tips */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Energy-Saving Tips
                </h2>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                Save up to 30% on your bill
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {energyTips.map((tip, index) => (
                <div
                  key={index}
                  className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-400 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
              <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg text-sm font-medium transition-colors">
                Get Personalized Energy Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translate3d(100%, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
