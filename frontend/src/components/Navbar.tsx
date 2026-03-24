"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { playAlertSound, playNotificationSound } from '@/utils/notificationSound';

export default function Navbar() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Global Trip Reminder System
    const checkGlobalReminders = () => {
      const saved = localStorage.getItem("scheduledTrips");
      if (!saved) return;
      
      const trips = JSON.parse(saved);
      const now = new Date();
      let modified = false;

      const updatedTrips = trips.map((trip: any) => {
        if (trip.notified) return trip;
        const tripDateTime = new Date(`${trip.date}T${trip.time}`);
        const diffMs = tripDateTime.getTime() - now.getTime();
        const diffMinutes = diffMs / (1000 * 60);

        if (diffMinutes > 0 && diffMinutes <= 30) {
          triggerNotification(trip, false);
          modified = true;
          return { ...trip, notified: true };
        }
        if (diffMinutes > -5 && diffMinutes <= 0) {
          triggerNotification(trip, true);
          modified = true;
          return { ...trip, notified: true };
        }
        return trip;
      });

      if (modified) localStorage.setItem("scheduledTrips", JSON.stringify(updatedTrips));
    };

    const triggerNotification = (trip: any, isNow: boolean) => {
      const title = isNow ? "🚗 Trip Starting Now!" : "⏰ Trip Reminder - 30 min!";
      const body = `Your trip to ${trip.destination} with ${trip.vehicle} is ${isNow ? "starting now" : "coming up in 30 minutes"}!`;
      
      if (isNow) playAlertSound();
      else playNotificationSound();

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body, icon: "/favicon.ico" });
      }
    };

    const interval = setInterval(checkGlobalReminders, 30000);
    checkGlobalReminders();

    return () => { 
      listener.subscription.unsubscribe(); 
      clearInterval(interval);
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 px-4 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 mx-2 md:mx-4 mt-2 md:mt-4">
      <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold">
          G
        </div>
        <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
          Trip Us
        </Link>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto text-sm md:text-base">
        <button 
          onClick={() => {
            const lastTrip = localStorage.getItem('lastTripParams');
            if (lastTrip) {
              router.push(`/dashboard?${lastTrip}`);
            } else {
              router.push('/setup');
            }
          }} 
          className="text-gray-300 hover:text-white transition-colors py-1 flex items-center gap-1"
        >
          🏠 Home
        </button>
        <Link href="/setup" className="text-gray-300 hover:text-white transition-colors py-1">
          Plan Trip
        </Link>
        <Link href="/schedule" className="text-gray-300 hover:text-white transition-colors py-1">
          Schedule
        </Link>
        <Link href="/history" className="text-gray-300 hover:text-white transition-colors py-1">
          History
        </Link>
        {mounted && user ? (
          <button onClick={handleLogout} className="btn-primary text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2">
            Logout
          </button>
        ) : (
          <Link href="/login" className="btn-primary text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2">
            Login / Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
}
