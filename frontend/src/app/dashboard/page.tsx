"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getFlagUrlFromDisplayName, getFlagUrlFromCountryName } from "@/utils/countryFlags";
import { createClient } from "@/utils/supabase/client";

function FlagImg({ url, size = "w-6 h-4" }: { url: string | null; size?: string }) {
  if (!url) return null;
  return <img src={url} alt="" className={`inline-block ${size} mr-1 rounded-sm shadow-sm`} />;
}

interface TripAnalysis {
  distance_km: number;
  travel_time_hours: number;
  travel_time_display: string;
  fuel_needed_l: number;
  fuel_price_per_liter: number;
  total_fuel_cost: number;
  fuel_cost_display: string;
  speed_kmh: number;
  optimal_speed_kmh: number;
  speed_fuel_loss_percent: number;
  extra_fuel_l: number;
  extra_fuel_cost: number;
  speed_status: string;
  engine_heat_percent: number;
  engine_heat_status: string;
  engine_heat_color: string;
  engine_heat_advice: string;
  oil_stress_percent: number;
  oil_liters_needed: number;
  oil_status: string;
  oil_color: string;
  oil_advice: string;
  coolant_liters_needed: number;
  coolant_status: string;
  coolant_color: string;
  coolant_temp_estimate_c: number;
  coolant_advice: string;
  vehicle_used: string;
  vehicle_type: string;
  vehicle_mileage: number;
  currency: string;
  country_name: string;
}

function GaugeBar({ percent, color, label }: { percent: number; color: string; label: string }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span style={{ color }} className="font-bold">{percent}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(100, percent)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status, color }: { status: string; color: string }) {
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}55` }}
    >
      {status}
    </span>
  );
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const vehicle = searchParams.get("vehicle");
  const fromLat = searchParams.get("fromLat");
  const fromLon = searchParams.get("fromLon");
  const toLat = searchParams.get("toLat");
  const toLon = searchParams.get("toLon");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<TripAnalysis | null>(null);
  const [speed, setSpeed] = useState(80);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id);
    });
  }, []);

  const extractCountry = (location: string): string => {
    const parts = location.split(",");
    if (parts.length > 1) return parts[parts.length - 1].trim();
    return location.trim();
  };

  useEffect(() => {
    if (!from || !to || !vehicle) {
      setError("Missing trip parameters. Go back and setup the trip.");
      setLoading(false);
      return;
    }
    fetchAnalysis(speed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, vehicle]);

  useEffect(() => {
    if (from && to && vehicle) fetchAnalysis(speed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  const fetchAnalysis = async (currentSpeed: number) => {
    setLoading(true);
    try {
      const countryName = extractCountry(to || "");
      const body: any = {
        speed_kmh: currentSpeed,
        vehicle_name: vehicle,
        country_name: countryName,
      };
      if (fromLat && fromLon && toLat && toLon) {
        body.from_lat = parseFloat(fromLat);
        body.from_lon = parseFloat(fromLon);
        body.to_lat = parseFloat(toLat);
        body.to_lon = parseFloat(toLon);
      } else {
        body.distance_km = 300;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/analysis/trip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to calculate trip data");
      setAnalysis(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!analysis) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/trips/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          departure_location: from,
          destination_location: to,
          vehicle_name: vehicle || analysis.vehicle_used || "Unknown",
          distance_km: analysis.distance_km,
          travel_time_hours: analysis.travel_time_hours,
          total_fuel_cost: analysis.fuel_cost_display.replace(/[^0-9.]/g, ''), // Strip currency symbol
          currency: analysis.currency,
          scheduled_date: new Date().toISOString().split('T')[0],
          scheduled_time: new Date().toTimeString().substring(0, 5)
        })
      });
      if (!res.ok) throw new Error("Failed to save trip");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert("Error saving trip: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center p-8">
        <div className="glass-panel text-red-400 font-bold p-6">{error}</div>
      </div>
    );
  }

  const a = analysis;

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="px-6 py-6 bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-xl border border-blue-500/20 shadow-lg relative">
        {userId && (
          <button 
            onClick={handleSaveTrip} 
            disabled={saving || loading}
            className={`absolute top-6 right-6 px-4 py-2 rounded font-bold text-sm transition-all ${
              saveSuccess 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "bg-blue-600 hover:bg-blue-500 text-white shadow hover:shadow-lg"
            }`}
          >
            {saving ? "Saving..." : saveSuccess ? "✅ Saved!" : "💾 Save Trip To History"}
          </button>
        )}
        <h1 className="text-3xl font-extrabold mb-2">🗺️ Trip Dashboard</h1>
        <p className="text-lg">
          <span className="font-semibold text-white"><FlagImg url={getFlagUrlFromDisplayName(from || "")} /> {from}</span>
          <span className="mx-3 text-gray-400">➔</span>
          <span className="font-semibold text-white"><FlagImg url={getFlagUrlFromDisplayName(to || "")} /> {to}</span>
        </p>
        <div className="flex gap-4 mt-2 text-sm text-gray-400">
          <span>🚗 {a?.vehicle_used || vehicle}</span>
          <span>·</span>
          <span>{a?.vehicle_mileage || "..."} km/L mileage</span>
          <span>·</span>
          <span>{a?.vehicle_type || "..."}</span>
        </div>
      </div>

      {/* Row 1: Distance / Time / Fuel Cost Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 text-center">
          <p className="text-gray-400 text-sm mb-1">Total Distance</p>
          <p className="text-3xl font-extrabold text-white">{a ? `${a.distance_km} km` : "..."}</p>
          <p className="text-xs text-gray-500 mt-1">via road estimate</p>
        </div>
        <div className="glass-panel p-5 text-center">
          <p className="text-gray-400 text-sm mb-1">Travel Time</p>
          <p className="text-3xl font-extrabold text-white">{a?.travel_time_display || "..."}</p>
          <p className="text-xs text-gray-500 mt-1">at {speed} km/h</p>
        </div>
        <div className="glass-panel p-5 text-center border-2" style={{ borderColor: "#22c55e33" }}>
          <p className="text-gray-400 text-sm mb-1">Total Fuel Cost</p>
          <p className="text-3xl font-extrabold text-green-400">{a?.fuel_cost_display || "..."}</p>
          <p className="text-xs text-gray-500 mt-1">
            {a ? <><FlagImg url={getFlagUrlFromCountryName(a.country_name)} /> {a.country_name} · {a.currency}</> : "..."}
          </p>
        </div>
      </div>

      {/* Row 2: Detailed Fuel Breakdown */}
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold mb-4 text-green-400">⛽ Fuel Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/60 p-4 rounded-lg text-center">
            <p className="text-xs text-gray-400 mb-1">Fuel Per Liter</p>
            <p className="text-xl font-bold text-white">
              {a ? `${a.fuel_price_per_liter} ${a.currency}` : "..."}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {a ? <><FlagImg url={getFlagUrlFromCountryName(a.country_name)} /> {a.country_name}</> : ""}
            </p>
          </div>
          <div className="bg-gray-800/60 p-4 rounded-lg text-center">
            <p className="text-xs text-gray-400 mb-1">Fuel Needed</p>
            <p className="text-xl font-bold text-white">{a ? `${a.fuel_needed_l} L` : "..."}</p>
            <p className="text-xs text-gray-500 mt-1">for {a?.distance_km || "..."} km</p>
          </div>
          <div className="bg-gray-800/60 p-4 rounded-lg text-center">
            <p className="text-xs text-gray-400 mb-1">Vehicle Mileage</p>
            <p className="text-xl font-bold text-white">{a ? `${a.vehicle_mileage} km/L` : "..."}</p>
            <p className="text-xs text-gray-500 mt-1">{a?.vehicle_used || ""}</p>
          </div>
          <div className="bg-gray-800/60 p-4 rounded-lg text-center">
            <p className="text-xs text-gray-400 mb-1">Total Trip Cost</p>
            <p className="text-xl font-bold text-green-400">{a?.fuel_cost_display || "..."}</p>
            <p className="text-xs text-gray-500 mt-1">{a ? `${a.fuel_needed_l}L × ${a.fuel_price_per_liter}` : ""}</p>
          </div>
        </div>
      </div>

      {/* Row 3: Speed Dynamics */}
      <div className="glass-panel p-6" style={{ borderTop: `3px solid ${a?.speed_status === "danger" ? "#ef4444" : a?.speed_status === "warning" ? "#eab308" : "#22c55e"}` }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-yellow-400">🏎️ Speed Dynamics</h2>
          {a && <StatusBadge status={a.speed_status} color={a.speed_status === "danger" ? "#ef4444" : a.speed_status === "warning" ? "#eab308" : "#22c55e"} />}
        </div>
        <div className="mb-4">
          <label className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Driving Speed</span>
            <span className="text-white font-bold text-lg">{speed} km/h</span>
          </label>
          <input
            type="range" min="40" max="180" step="5"
            value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-yellow-500 h-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>40 km/h</span>
            <span className="text-green-400">Optimal: {a?.optimal_speed_kmh || 80} km/h</span>
            <span>180 km/h</span>
          </div>
        </div>
        {a && a.speed_fuel_loss_percent > 0 ? (
          <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-red-400 font-bold text-lg">⚠️ -{a.speed_fuel_loss_percent}% Fuel Efficiency</p>
              <p className="text-red-300">+{a.extra_fuel_l}L extra fuel</p>
            </div>
            <p className="text-red-300 text-sm mt-1">Extra cost: {a.fuel_cost_display.charAt(0)}{a.extra_fuel_cost}</p>
          </div>
        ) : (
          <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg text-green-400">
            ✅ Driving at optimal efficiency — no extra fuel burned!
          </div>
        )}
      </div>

      {/* Row 4: Engine Systems - Heat / Oil / Coolant */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Engine Heat */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold" style={{ color: a?.engine_heat_color || "#fff" }}>🌡️ Engine Heat</h2>
            {a && <StatusBadge status={a.engine_heat_status} color={a.engine_heat_color} />}
          </div>
          {a && <GaugeBar percent={a.engine_heat_percent} color={a.engine_heat_color} label="Heat Level" />}
          <p className="text-sm mt-3 leading-relaxed" style={{ color: a?.engine_heat_color || "#9ca3af" }}>
            {loading ? "Simulating..." : a?.engine_heat_advice || ""}
          </p>
        </div>

        {/* Oil System */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold" style={{ color: a?.oil_color || "#fff" }}>🛢️ Oil System</h2>
            {a && <StatusBadge status={a.oil_status} color={a.oil_color} />}
          </div>
          {a && <GaugeBar percent={a.oil_stress_percent} color={a.oil_color} label="Oil Stress" />}
          <div className="flex justify-between text-sm mt-2 text-gray-400">
            <span>Oil needed:</span>
            <span className="font-bold text-white">{a?.oil_liters_needed || "..."} L</span>
          </div>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: a?.oil_color || "#9ca3af" }}>
            {loading ? "Analyzing..." : a?.oil_advice || ""}
          </p>
        </div>

        {/* Coolant System */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold" style={{ color: a?.coolant_color || "#fff" }}>❄️ Coolant System</h2>
            {a && <StatusBadge status={a.coolant_status} color={a.coolant_color} />}
          </div>
          <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded mb-2">
            <span className="text-gray-400 text-sm">Est. Temperature</span>
            <span className="text-xl font-bold" style={{ color: a?.coolant_color }}>
              {a ? `${a.coolant_temp_estimate_c}°C` : "..."}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Coolant needed:</span>
            <span className="font-bold text-white">{a?.coolant_liters_needed || "..."} L</span>
          </div>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: a?.coolant_color || "#9ca3af" }}>
            {loading ? "Checking..." : a?.coolant_advice || ""}
          </p>
        </div>
      </div>
    </div>
  );
}
