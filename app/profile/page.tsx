'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { authService, User } from '@/lib/auth';
import { User as UserIcon, Mail, Phone, ShieldCheck, Ticket, LogOut, Settings, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] pt-24 pb-20">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-white/10 overflow-hidden shadow-2xl"
        >
          {/* Cover / Header */}
          <div className="h-48 bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 relative">
             <div className="absolute inset-0 bg-black/20" />
             <div className="absolute -bottom-16 left-10">
                <div className="w-32 h-32 rounded-3xl bg-white dark:bg-zinc-800 p-1.5 shadow-2xl border-4 border-zinc-50 dark:border-[#050505]">
                   <div className="w-full h-full rounded-2xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                      <UserIcon className="w-16 h-16" />
                   </div>
                </div>
             </div>
          </div>

          <div className="pt-20 px-10 pb-10">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                   <h1 className="text-3xl font-black tracking-tight mb-1">{user.name}</h1>
                   <p className="text-zinc-500 font-medium flex items-center gap-2">
                     <Mail className="w-4 h-4 text-rose-500" /> {user.email}
                   </p>
                </div>
                <div className="flex gap-3">
                   {user.isVerified ? (
                     <span className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-widest border border-green-500/20">
                        <ShieldCheck className="w-4 h-4" /> Verified Pro
                     </span>
                   ) : (
                     <span className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 text-amber-600 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-500/20">
                        Verification Pending
                     </span>
                   )}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Info Section */}
                <div>
                   <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-rose-500" /> Account Settings
                   </h2>
                   <div className="space-y-6">
                      <div className="p-4 rounded-2xl border border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-zinc-800/30">
                         <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Phone Number</label>
                         <p className="font-bold flex items-center gap-2">
                            <Phone className="w-4 h-4 text-rose-500" /> {user.phone || 'Not linked'}
                         </p>
                      </div>
                      <div className="p-4 rounded-2xl border border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-zinc-800/30">
                         <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Membership</label>
                         <p className="font-bold flex items-center gap-2">
                            <span className="text-rose-500">★</span> Gold Member since 2024
                         </p>
                      </div>
                   </div>
                </div>

                {/* Actions Section */}
                <div>
                   <h2 className="text-lg font-bold mb-6">Quick Discover</h2>
                   <div className="grid gap-3">
                      <button 
                        onClick={() => router.push('/bookings')}
                        className="w-full flex items-center justify-between p-4 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group"
                      >
                         <div className="flex items-center gap-3">
                            <Ticket className="w-5 h-5 text-rose-500" />
                            <span className="font-bold">My Movie Passes</span>
                         </div>
                         <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-rose-500 transition-colors" />
                      </button>
                      <button 
                        onClick={() => router.push('/shows')}
                        className="w-full flex items-center justify-between p-4 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group"
                      >
                         <div className="flex items-center gap-3">
                            <i className="ri-movie-line text-xl text-rose-500"></i>
                            <span className="font-bold">Explore Now Showing</span>
                         </div>
                         <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-rose-500 transition-colors" />
                      </button>
                      <button 
                        onClick={() => {
                           authService.logout();
                           router.push('/');
                        }}
                        className="w-full flex items-center justify-between p-4 rounded-2xl border border-red-500/10 text-red-600 hover:bg-red-500/5 transition-all group"
                      >
                         <div className="flex items-center gap-3">
                            <LogOut className="w-5 h-5 text-red-500" />
                            <span className="font-bold">Sign Out</span>
                         </div>
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
