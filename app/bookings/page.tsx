'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { bookingService, Receipt } from '@/lib/booking';
import { authService } from '@/lib/auth';
import { Ticket, Calendar, MapPin, ChevronRight, Printer, Eye, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookingsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // Simulate fetch
    const userReceipts = bookingService.getUserReceipts(user.id);
    setReceipts(userReceipts);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] pt-32 pb-20">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase leading-none">My Bookings</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-bold text-lg">Your cinematic history at AuraCinema.</p>
        </div>

        {receipts.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-white/10 p-20 text-center shadow-2xl">
            <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-8 border border-zinc-200 dark:border-white/5 shadow-inner">
              <Ticket className="w-12 h-12 text-zinc-400" />
            </div>
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">No Bookings Found</h2>
            <p className="text-zinc-500 mb-10 max-w-sm mx-auto font-bold text-lg leading-relaxed">It seems you haven't journeyed into the cinematic world of AuraCinema yet.</p>
            <Link
              href="/shows"
              className="inline-flex items-center gap-3 bg-rose-600 hover:bg-rose-500 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-rose-600/30"
            >
              Start Your Journey <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8">
            {receipts.map((receipt, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                key={receipt.id} 
                className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-white/10 overflow-hidden shadow-md hover:shadow-2xl hover:border-rose-500/30 transition-all"
              >
                <div className="p-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                    <div className="flex gap-8 items-start">
                       <div className="w-20 h-20 rounded-[1.5rem] bg-rose-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-rose-600/30">
                          <Ticket className="w-10 h-10 fill-current" />
                       </div>
                       <div>
                          <h3 className="text-3xl font-black group-hover:text-rose-500 transition-colors tracking-tight leading-none mb-3">{receipt.movieTitle}</h3>
                          <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-zinc-500">
                             <div className="flex items-center gap-2 uppercase tracking-widest"><Calendar className="w-4 h-4 text-rose-500" /> {new Date(receipt.date).toLocaleDateString()}</div>
                             <div className="flex items-center gap-2 uppercase tracking-widest"><MapPin className="w-4 h-4 text-rose-500" /> {receipt.theaterName}</div>
                          </div>
                       </div>
                    </div>
                    <div>
                       <span className="px-6 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-[0.2em] border border-emerald-500/20">
                          Confirmed
                       </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-8 border-y border-zinc-100 dark:border-white/5 mb-10">
                    <div>
                       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Seats</label>
                       <p className="font-black dark:text-white text-lg">{receipt.seats.join(', ')}</p>
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Price</label>
                       <p className="font-black text-rose-600 text-lg">₹{receipt.amount}</p>
                    </div>
                    <div className="col-span-2">
                       <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Transaction</label>
                       <p className="font-mono text-xs text-zinc-500 truncate mt-1">{receipt.transactionId}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href={`/booking-confirmation/${receipt.bookingId}`}
                      className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all active:scale-95"
                    >
                      <Eye className="w-4 h-4" /> View Ticket
                    </Link>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all border border-transparent hover:border-zinc-300 dark:hover:border-white/10"
                    >
                      <Printer className="w-4 h-4" /> Print Receipt
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-20 text-center py-10 border-t border-zinc-200 dark:border-white/5">
          <p className="text-sm font-bold text-zinc-500">© {new Date().getFullYear()} AuraCinema Entertainment. Keep it cinematic.</p>
        </div>
      </div>
    </div>
  );
}
