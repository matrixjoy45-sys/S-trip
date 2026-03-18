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
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex justify-between items-center mb-8 mx-4 mt-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold">
          G
        </div>
        <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
          Trip Us
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link href="/setup" className="text-gray-300 hover:text-white transition-colors py-2">
          Plan Trip
        </Link>
        <Link href="/schedule" className="text-gray-300 hover:text-white transition-colors py-2">
          Schedule
        </Link>
        <Link href="/history" className="text-gray-300 hover:text-white transition-colors py-2">
          History
        </Link>
        {mounted && user ? (
          <button onClick={handleLogout} className="btn-primary text-sm px-4 py-2">
            Logout
          </button>
        ) : (
          <Link href="/login" className="btn-primary text-sm px-4 py-2">
            Login / Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
}
