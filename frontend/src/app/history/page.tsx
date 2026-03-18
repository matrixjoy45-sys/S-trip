"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getFlagUrlFromDisplayName } from "@/utils/countryFlags";

interface TripRecord {
  id: string;
  departure_location: string;
  destination_location: string;
  vehicle_name: string;
  distance_km: number;
  total_fuel_cost: number;
  currency: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  created_at: string;
}

export default function TripHistory() {
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const supabase = createClient();

  useEffect(() => {
    fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    setError("");
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Please log in to view your trip history.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTrips(data || []);
      
    } catch (err: any) {
      console.error("Error fetching trips:", err);
      setError(err.message || "Failed to load trip history.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 animate-fade-in">
        <div className="text-xl text-gray-400">Loading trip history...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">🗺️ Trip History</h1>
        <button 
          onClick={fetchTrips}
          className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-gray-300 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {error ? (
        <div className="glass-panel p-6 text-center text-red-400 mb-6">{error}</div>
      ) : trips.length === 0 ? (
        <div className="glass-panel p-12 text-center text-gray-400">
          <p className="text-xl mb-2">No trips found in your history.</p>
          <p className="text-sm">Go to the Dashboard after planning a trip and click "Save Trip To History"!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {trips.map((trip) => (
            <div key={trip.id} className="glass-panel p-5 relative overflow-hidden group">
              {/* Card accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 group-hover:w-2 transition-all"></div>
              
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pl-2">
                {/* Locations */}
                <div className="flex-1">
                  <div className="flex items-center text-lg font-bold text-white mb-1">
                    <span className="truncate max-w-[40%] flex items-center">
                      <img src={getFlagUrlFromDisplayName(trip.departure_location) || ""} className="w-5 h-3 mr-2 rounded-sm opacity-80" alt="" onError={(e) => e.currentTarget.style.display='none'} />
                      {trip.departure_location}
                    </span>
                    <span className="mx-3 text-gray-500 text-sm">➔</span>
                    <span className="truncate max-w-[40%] flex items-center">
                       <img src={getFlagUrlFromDisplayName(trip.destination_location) || ""} className="w-5 h-3 mr-2 rounded-sm opacity-80" alt="" onError={(e) => e.currentTarget.style.display='none'} />
                      {trip.destination_location}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    {new Date(trip.created_at).toLocaleString()}
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex flex-wrap gap-4 md:gap-8 bg-gray-900/40 p-3 rounded-lg border border-gray-700/50">
                  <div className="flex flex-col text-center">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Vehicle</span>
                    <span className="text-sm font-semibold text-gray-300">🚗 {trip.vehicle_name}</span>
                  </div>
                  
                  <div className="flex flex-col text-center">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Distance</span>
                    <span className="text-sm font-bold text-blue-400">{trip.distance_km} km</span>
                  </div>

                  <div className="flex flex-col text-center">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Fuel Cost</span>
                    <span className="text-sm font-bold text-green-400">
                      {trip.total_fuel_cost > 0 ? `${trip.total_fuel_cost} ${trip.currency}` : "N/A"}
                    </span>
                  </div>
                  
                  {(trip.scheduled_date || trip.scheduled_time) && (
                    <div className="flex flex-col text-center border-l border-gray-700/50 pl-4 hidden sm:flex">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Scheduled for</span>
                      <span className="text-sm font-semibold text-yellow-400">
                        {trip.scheduled_date} {trip.scheduled_time}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
