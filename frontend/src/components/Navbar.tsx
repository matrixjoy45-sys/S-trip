"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

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

    return () => { listener.subscription.unsubscribe(); };
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
