'use client';

import { useState, useEffect } from 'react';
import { TmdbMovie } from '@/lib/tmdb';
import { bookingService, Theater, Showtime } from '@/lib/booking';
import { useLocation } from '@/components/LocationContext';
import { Calendar, MapPin, Clock, Play, AlertCircle, ChevronRight } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MovieDetailsClient({ movie }: { movie: TmdbMovie }) {
  const { location } = useLocation();
  const [dates, setDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [theaterShows, setTheaterShows] = useState<{ theater: Theater, showtimes: Showtime[] }[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate next 7 days
  useEffect(() => {
    const today = new Date();
    const nextDays = Array.from({ length: 7 }).map((_, i) => addDays(today, i));
    setDates(nextDays);
    setSelectedDate(today);
  }, []);

  // Fetch showtimes when location or date changes
  useEffect(() => {
    const fetchShowtimes = async () => {
      setLoading(true);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        // bookingService is synchronous for generation but simulated async
        const shows = await bookingService.getShowtimes(movie.id, location, dateStr);
        setTheaterShows(shows);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    if (selectedDate) {
      fetchShowtimes();
    }
  }, [movie.id, location, selectedDate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20">
      
      {/* Date Selector */}
      <div className="mb-10">
         <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
           <Calendar className="w-5 h-5 text-rose-500" />
           Select Date
         </h2>
         <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
           {dates.map((date) => {
             const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
             return (
               <button
                 key={date.toISOString()}
                 onClick={() => setSelectedDate(date)}
                 className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-2xl border transition-all ${
                   isSelected 
                     ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-600/30 font-bold scale-105'
                     : 'bg-white/5 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-rose-500/50 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                 }`}
               >
                 <span className="text-xs uppercase tracking-wider opacity-80 mb-1">{format(date, 'MMM')}</span>
                 <span className="text-2xl">{format(date, 'dd')}</span>
                 <span className="text-xs font-semibold mt-1">{format(date, 'EEE')}</span>
               </button>
             );
           })}
         </div>
      </div>

      {/* Theaters List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            Theaters in {location}
          </h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl animate-pulse border border-zinc-200 dark:border-white/5" />
            ))}
          </div>
        ) : theaterShows.length === 0 ? (
           <div className="bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
             <AlertCircle className="w-12 h-12 text-zinc-400 mb-4" />
             <h3 className="text-xl text-zinc-900 dark:text-white font-bold mb-2">No shows available</h3>
             <p className="text-zinc-500 max-w-md">There are no shows scheduled for {movie.title} in {location} on {format(selectedDate, 'MMM dd, yyyy')}. Please select another date or location.</p>
           </div>
        ) : (
          <div className="space-y-4">
            {theaterShows.map(({ theater, showtimes }) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={theater.id} 
                className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:border-rose-500/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                      {theater.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {theater.facilities.map((fac, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-xs font-semibold rounded text-zinc-600 bg-zinc-100 border-zinc-200 dark:text-zinc-300 dark:bg-zinc-800 border dark:border-zinc-700 uppercase tracking-wider">
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 text-sm text-zinc-500 items-center bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-white/5">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>0.5 km away</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {showtimes.map(st => (
                     <Link
                       href={`/booking/${movie.id}/${st.id}`}
                       key={st.id}
                       className="group flex flex-col items-center p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer min-w-[100px]"
                     >
                       <span className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-1">{st.format}</span>
                       <span className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">{st.time}</span>
                       <span className="text-xs text-zinc-500 mt-1 font-medium group-hover:text-zinc-800 dark:group-hover:text-zinc-300">₹{st.price}</span>
                     </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
