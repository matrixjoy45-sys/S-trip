"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getFlagUrlFromDisplayName } from "@/utils/countryFlags";
import { playNotificationSound, playAlertSound } from "@/utils/notificationSound";
import { createClient } from "@/utils/supabase/client";

interface ScheduledTrip {
  id: string;
  destination: string;
  vehicle: string;
  date: string;
  time: string;
  notified: boolean;
}

export default function Schedule() {
  const router = useRouter();

  const [destination, setDestination] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [scheduled, setScheduled] = useState(false);
  const [trips, setTrips] = useState<ScheduledTrip[]>([]);
  const [notifPermission, setNotifPermission] = useState<string>("default");
  
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  
  // Custom in-app toast notification state
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; isUrgent: boolean } | null>(null);

  // Load user session and saved trips
  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id);
    });

    const saved = localStorage.getItem("scheduledTrips");
    if (saved) setTrips(JSON.parse(saved));

    // Request notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  // Check for upcoming reminders every 30 seconds
  const checkReminders = useCallback(() => {
    const now = new Date();
    const updatedTrips = trips.map((trip) => {
      if (trip.notified) return trip;

      const tripDateTime = new Date(`${trip.date}T${trip.time}`);
      const diffMs = tripDateTime.getTime() - now.getTime();
      const diffMinutes = diffMs / (1000 * 60);

      // Notify 30 minutes before trip
      if (diffMinutes > 0 && diffMinutes <= 30) {
        sendNotification(trip);
        return { ...trip, notified: true };
      }
      // Notify if trip is right now
      if (diffMinutes > -5 && diffMinutes <= 0) {
        sendNotification(trip, true);
        return { ...trip, notified: true };
      }
      return trip;
    });

    if (JSON.stringify(updatedTrips) !== JSON.stringify(trips)) {
      setTrips(updatedTrips);
      localStorage.setItem("scheduledTrips", JSON.stringify(updatedTrips));
    }
  }, [trips]);

  useEffect(() => {
    const interval = setInterval(checkReminders, 30000);
    checkReminders(); // Check immediately
    return () => clearInterval(interval);
  }, [checkReminders]);

  const sendNotification = (trip: ScheduledTrip, isNow = false) => {
    const title = isNow ? "🚗 Trip Starting Now!" : "⏰ Trip Reminder - 30 min!";
    const body = `Your trip to ${trip.destination} with ${trip.vehicle} is ${isNow ? "starting now" : "coming up in 30 minutes"}!`;
    
    // 1. Play Sound
    if (isNow) playAlertSound();
    else playNotificationSound();

    // 2. Show In-App Toast
    setActiveToast({ title, message: body, isUrgent: isNow });
    setTimeout(() => setActiveToast(null), 8000); // Hide after 8s

    // 3. Send Browser Push Notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico" });
    }
  };

  const requestPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
    }
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !vehicle || !date || !time) return;

    const newTrip: ScheduledTrip = {
      id: Date.now().toString(),
      destination,
      vehicle,
      date,
      time,
      notified: false,
    };

    // Save to local state
    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    localStorage.setItem("scheduledTrips", JSON.stringify(updatedTrips));
    setScheduled(true);

    // Save to Database via Backend API
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      await fetch(`${API_URL}/api/trips/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId, // Will be null if guest, UUID if logged in
          departure_location: "Current Location", // Simplified for schedule page
          destination_location: destination,
          vehicle_name: vehicle,
          distance_km: 0, // Simplified for isolated schedule page
          travel_time_hours: 0,
          total_fuel_cost: 0,
          currency: "USD",
          scheduled_date: date,
          scheduled_time: time
        })
      });
    } catch (err) {
      console.error("Failed to save trip to database", err);
    }

    setTimeout(() => {
      setScheduled(false);
      setDestination("");
      setVehicle("");
      setDate("");
      setTime("");
    }, 3000);
  };

  const deleteTrip = (id: string) => {
    const updated = trips.filter((t) => t.id !== id);
    setTrips(updated);
    localStorage.setItem("scheduledTrips", JSON.stringify(updated));
  };

  const getTripStatus = (trip: ScheduledTrip) => {
    const now = new Date();
    const tripDateTime = new Date(`${trip.date}T${trip.time}`);
    const diffMs = tripDateTime.getTime() - now.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffMinutes < 0) return { label: "Completed", color: "text-gray-500" };
    if (diffMinutes <= 30) return { label: "Starting soon!", color: "text-red-400 animate-pulse" };
    if (diffHours <= 2) return { label: `In ${Math.round(diffMinutes)} min`, color: "text-yellow-400" };
    if (diffHours <= 24) return { label: `In ${Math.round(diffHours)} hrs`, color: "text-blue-400" };
    return { label: `${trip.date}`, color: "text-gray-400" };
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center pt-8 animate-fade-in relative">
      
      {/* Visual In-App Toast Notification */}
      {activeToast && (
        <div className={`fixed top-24 right-8 z-50 p-4 rounded-lg shadow-2xl border flex flex-col gap-1 w-80 animate-fade-in ${
          activeToast.isUrgent 
            ? "bg-red-900/90 border-red-500" 
            : "bg-blue-900/90 border-blue-500"
        }`}>
          <div className="flex justify-between items-start">
            <h3 className={`font-bold ${activeToast.isUrgent ? 'text-red-300' : 'text-blue-300'}`}>
              {activeToast.title}
            </h3>
            <button onClick={() => setActiveToast(null)} className="text-gray-400 hover:text-white">✕</button>
          </div>
          <p className="text-white text-sm">{activeToast.message}</p>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-4 text-center text-white">
        📅 Schedule Trip
      </h1>

      {/* Notification Permission Banner */}
      {notifPermission !== "granted" && (
        <div className="w-full mb-6 p-4 rounded-lg bg-yellow-900/30 border border-yellow-500/30 flex items-center justify-between">
          <p className="text-yellow-400 text-sm">🔔 Enable notifications to get trip reminders!</p>
          <button onClick={requestPermission} className="btn-primary text-xs px-3 py-1">
            Enable
          </button>
        </div>
      )}

      {scheduled && (
        <div className="w-full mb-6 glass-panel p-6 text-center border-green-500/50 bg-green-900/20 animate-fade-in">
          <h2 className="text-2xl font-bold text-green-400 mb-2">✅ Trip Scheduled!</h2>
          <p className="text-gray-300">
            You will be reminded 30 minutes before your trip.
          </p>
        </div>
      )}

      <form onSubmit={handleSchedule} className="glass-panel w-full p-8 flex flex-col gap-6">
        <div>
          <label className="label-text">Destination</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Dubai, UAE"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label-text">Vehicle</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Ford Explorer"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-text">Date</label>
            <input
              type="date"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-text">Time</label>
            <input
              type="time"
              className="input-field"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary mt-4 py-3 text-lg">
          🔔 Save & Set Reminder
        </button>
      </form>

      {/* Scheduled Trips List */}
      {trips.length > 0 && (
        <div className="w-full mt-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Your Scheduled Trips</h2>
          <div className="flex flex-col gap-3">
            {trips
              .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
              .map((trip) => {
                const status = getTripStatus(trip);
                return (
                  <div
                    key={trip.id}
                    className="glass-panel p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white flex items-center">
                        {getFlagUrlFromDisplayName(trip.destination) && (
                          <img src={getFlagUrlFromDisplayName(trip.destination)!} alt="" className="inline-block w-6 h-4 mr-2 rounded-sm shadow-sm" />
                        )}
                        {trip.destination}
                      </p>
                      <p className="text-sm text-gray-400">
                        🚗 {trip.vehicle} · 📅 {trip.date} · ⏰ {trip.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${status.color}`}>
                        {status.label}
                      </span>
                      <button
                        onClick={() => deleteTrip(trip.id)}
                        className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-900/30 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
