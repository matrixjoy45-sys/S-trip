"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getFlagUrlFromDisplayName } from "@/utils/countryFlags";

interface Vehicle {
  name: string;
  brand: string;
  type: string;
  fuel_efficiency_km_l: number;
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address?: { country?: string; country_code?: string };
}

function FlagImg({ displayName }: { displayName: string }) {
  const url = getFlagUrlFromDisplayName(displayName);
  if (!url) return <span>📍</span>;
  return <img src={url} alt="" className="inline-block w-6 h-4 mr-2 rounded-sm shadow-sm" />;
}

export default function TripSetup() {
  const router = useRouter();

  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [fromCoords, setFromCoords] = useState({ lat: "", lon: "" });
  const [toCoords, setToCoords] = useState({ lat: "", lon: "" });

  const [fromSuggestions, setFromSuggestions] = useState<LocationSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = useState<LocationSuggestion[]>([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${API_URL}/api/analysis/vehicles`)
      .then((res) => res.json())
      .then((data) => setVehicles(data.vehicles || []))
      .catch(() => {
        setVehicles([
          { name: "Corolla", brand: "Toyota", type: "Car", fuel_efficiency_km_l: 18.0 },
          { name: "RAV4", brand: "Toyota", type: "SUV", fuel_efficiency_km_l: 14.5 },
        ]);
      });
  }, []);

  const searchLocations = useCallback(
    async (query: string, setter: (s: LocationSuggestion[]) => void) => {
      if (query.length < 2) { setter([]); return; }
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1`,
          { headers: { "Accept-Language": "en" } }
        );
        setter(await res.json());
      } catch { setter([]); }
    }, []
  );

  useEffect(() => {
    const t = setTimeout(() => searchLocations(fromLocation, setFromSuggestions), 400);
    return () => clearTimeout(t);
  }, [fromLocation, searchLocations]);

  useEffect(() => {
    const t = setTimeout(() => searchLocations(toLocation, setToSuggestions), 400);
    return () => clearTimeout(t);
  }, [toLocation, searchLocations]);

  useEffect(() => {
    if (vehicle.length === 0) { setFilteredVehicles([]); setShowVehicleDropdown(false); return; }
    const q = vehicle.toLowerCase();
    const matched = vehicles.filter((v) =>
      v.name.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q) || v.type.toLowerCase().includes(q)
    );
    setFilteredVehicles(matched.slice(0, 8));
    setShowVehicleDropdown(matched.length > 0);
  }, [vehicle, vehicles]);

  const selectVehicle = (v: Vehicle) => { setVehicle(`${v.brand} ${v.name}`); setShowVehicleDropdown(false); };

  const selectFromLocation = (loc: LocationSuggestion) => {
    setFromLocation(loc.display_name);
    setFromCoords({ lat: loc.lat, lon: loc.lon });
    setShowFromDropdown(false); setFromSuggestions([]);
  };

  const selectToLocation = (loc: LocationSuggestion) => {
    setToLocation(loc.display_name);
    setToCoords({ lat: loc.lat, lon: loc.lon });
    setShowToDropdown(false); setToSuggestions([]);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromLocation || !toLocation || !vehicle) return;
    const searchParams = new URLSearchParams({
      from: fromLocation, to: toLocation, vehicle,
      fromLat: fromCoords.lat, fromLon: fromCoords.lon,
      toLat: toCoords.lat, toLon: toCoords.lon,
    });
    router.push(`/dashboard?${searchParams.toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center pt-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        Setup Your Trip
      </h1>

      <form onSubmit={handleAnalyze} className="glass-panel w-full p-8 flex flex-col gap-6">
        {/* FROM */}
        <div className="relative">
          <label className="label-text">Departure Location (From)</label>
          <input type="text" className="input-field"
            placeholder="Search any city (e.g. London, Tokyo, Mumbai)"
            value={fromLocation}
            onChange={(e) => { setFromLocation(e.target.value); setShowFromDropdown(true); }}
            onFocus={() => fromSuggestions.length > 0 && setShowFromDropdown(true)}
            required
          />
          {showFromDropdown && fromSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 z-50 mt-1 rounded-lg overflow-hidden border border-gray-600 bg-gray-800 shadow-2xl max-h-48 overflow-y-auto">
              {fromSuggestions.map((loc, idx) => (
                <button key={idx} type="button" onClick={() => selectFromLocation(loc)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors text-sm border-b border-gray-700 last:border-b-0 flex items-center">
                  <FlagImg displayName={loc.display_name} />
                  <span className="text-white">{loc.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TO */}
        <div className="relative">
          <label className="label-text">Destination Location (To)</label>
          <input type="text" className="input-field"
            placeholder="Search any city (e.g. Paris, Dubai, New York)"
            value={toLocation}
            onChange={(e) => { setToLocation(e.target.value); setShowToDropdown(true); }}
            onFocus={() => toSuggestions.length > 0 && setShowToDropdown(true)}
            required
          />
          {showToDropdown && toSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 z-50 mt-1 rounded-lg overflow-hidden border border-gray-600 bg-gray-800 shadow-2xl max-h-48 overflow-y-auto">
              {toSuggestions.map((loc, idx) => (
                <button key={idx} type="button" onClick={() => selectToLocation(loc)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors text-sm border-b border-gray-700 last:border-b-0 flex items-center">
                  <FlagImg displayName={loc.display_name} />
                  <span className="text-white">{loc.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Vehicle */}
        <div className="border-t border-gray-700 my-2 pt-4 relative">
          <label className="label-text">Select Vehicle</label>
          <input type="text" className="input-field mb-1"
            placeholder="Search vehicle (e.g. Toyota, BMW, Ninja, Splendor)"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            onFocus={() => vehicle.length > 0 && filteredVehicles.length > 0 && setShowVehicleDropdown(true)}
            required
          />
          {showVehicleDropdown && (
            <div className="absolute left-0 right-0 z-50 mt-1 rounded-lg overflow-hidden border border-gray-600 bg-gray-800 shadow-2xl max-h-60 overflow-y-auto">
              {filteredVehicles.map((v, idx) => (
                <button key={idx} type="button" onClick={() => selectVehicle(v)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex justify-between items-center border-b border-gray-700 last:border-b-0">
                  <span className="font-semibold text-white">
                    {v.type === "Bike" ? "🏍️" : v.type === "Truck" ? "🚛" : v.type === "Bus" ? "🚌" : v.type === "EV" ? "⚡" : v.type === "SUV" ? "🚙" : "🚗"} {v.brand} {v.name}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded-full">{v.type} · {v.fuel_efficiency_km_l} km/L</span>
                </button>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {vehicles.length > 0
              ? `${vehicles.length} vehicles loaded · 🏍️ Bikes · 🚗 Cars · 🚙 SUVs · 🚛 Trucks · 🚌 Buses · ⚡ EVs`
              : "Loading vehicles..."}
          </p>
        </div>

        <button type="submit" className="btn-primary mt-4 py-3 text-lg">
          Analyze Trip & Calculate
        </button>
      </form>
    </div>
  );
}
