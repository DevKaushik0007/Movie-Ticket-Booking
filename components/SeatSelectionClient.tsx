'use client';

import { useState, useEffect } from 'react';
import { bookingService, Seat } from '@/lib/booking';
import { TmdbMovie, tmdbApi } from '@/lib/tmdb';
import { motion } from 'framer-motion';
import { Armchair, ChevronLeft, CreditCard, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SeatSelectionClient({ movie, showtimeId }: { movie: TmdbMovie, showtimeId: string }) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const generatedSeats = bookingService.generateSeats(showtimeId);
      setSeats(generatedSeats);
      setLoading(false);
    };
    init();
  }, [showtimeId]);

  const toggleSeat = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.isBooked) return;

    if (selectedSeats.find(s => s.id === seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seatId));
    } else {
      if (selectedSeats.length >= 10) return; // Limit 10 seats
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleProceed = async () => {
    if (selectedSeats.length === 0) return;
    
    // Create actual booking (simulated)
    const booking = bookingService.createBooking({
      userId: 'user-1', // Mock user
      movieId: movie.id,
      showtimeId,
      theaterId: showtimeId.split('-').slice(0, 3).join('-'), // Extract theaterId from showtimeId
      seats: selectedSeats,
      totalAmount: totalPrice * 1.1
    });

    // Simulate payment loading
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to confirmation
    router.push(`/booking-confirmation/${booking.id}`);
  };


  if (loading || !movie) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Left: Theater Map */}
        <div className="flex-1">
          <div className="mb-8 flex items-center justify-between">
             <Link href={`/shows/${movie.id}`} className="flex items-center gap-2 text-zinc-500 hover:text-rose-500 transition-colors">
               <ChevronLeft className="w-5 h-5" /> Back to Movie
             </Link>
             <div className="flex items-center gap-6 text-sm font-medium">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-zinc-200 dark:bg-zinc-800" /> Available</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-rose-600" /> Selected</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-zinc-400 dark:bg-zinc-600" /> Booked</div>
             </div>
          </div>

          {/* Curved Cinematic Screen */}
          <div className="cinema-screen-glow">
            <div className="text-center mt-12 text-[10px] font-bold tracking-[0.8em] text-zinc-500/50 uppercase">SCREEN THIS WAY</div>
          </div>

          {/* Seats Layout with Tiered Labels & Aisles */}
          <div className="space-y-12 mb-16 overflow-x-auto hide-scrollbar pb-4">
             {['vip', 'premium', 'regular'].map((tierType) => {
               const tierSeats = seats.filter(s => s.type === tierType);
               if (tierSeats.length === 0) return null;
               
               const tierLabel = tierType === 'vip' ? 'Royal Recliner' : tierType === 'premium' ? 'Exclusive Prime' : 'Classic';
               const tierPrice = tierSeats[0]?.price || 250;
               
               return (
                 <div key={tierType} className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{tierLabel} — ₹{tierPrice}</span>
                       <div className="h-[1px] flex-1 mx-4 bg-zinc-200 dark:bg-white/5" />
                    </div>
                    
                    <div className="grid gap-x-2 gap-y-3" style={{ gridTemplateColumns: `repeat(16, minmax(0, 1fr))` }}>
                      {tierSeats.map((seat, idx) => {
                        const isSelected = selectedSeats.some(s => s.id === seat.id);
                        // Add Aisle Spacing (after col 4 and 12)
                        const colNum = (idx % 16) + 1;
                        const hasRightAisle = colNum === 4 || colNum === 12;
                        
                        return (
                          <button
                            key={seat.id}
                            disabled={seat.isBooked}
                            onClick={() => toggleSeat(seat.id)}
                            className={`group relative aspect-square flex items-center justify-center rounded-[4px] transition-all duration-300 ${
                              hasRightAisle ? 'mr-4' : ''
                            } ${
                              seat.isBooked 
                                ? 'bg-zinc-200 dark:bg-zinc-800/50 cursor-not-allowed text-zinc-400 dark:text-zinc-600' 
                                : isSelected 
                                  ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] border-rose-500' 
                                  : 'bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/10 hover:border-rose-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                            }`}
                          >
                            <span className={`text-[9px] font-bold ${isSelected ? 'text-white' : 'text-zinc-400 dark:text-zinc-600 group-hover:text-rose-500'}`}>
                              {seat.id}
                            </span>
                            
                            {isSelected && (
                              <motion.div 
                                layoutId={`glow-${seat.id}`}
                                className="absolute inset-0 rounded-[4px] border-2 border-rose-400/50"
                                initial={false}
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                 </div>
               );
             })}
          </div>

          {/* Legend Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-white/5">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-white/10">
                   <Armchair className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Standard</p>
                  <p className="text-xs text-zinc-500">₹250.00</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                   <Armchair className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-bold">Premium</p>
                  <p className="text-xs text-zinc-500">₹320.00</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                   <Armchair className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm font-bold">Diamond (VIP)</p>
                  <p className="text-xs text-zinc-500">₹450.00</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Booking Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/10 p-8 shadow-xl sticky top-28">
            <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>
            
            <div className="flex gap-4 mb-8">
               <img src={movie.poster_path} alt="" className="w-20 aspect-[2/3] object-cover rounded-xl" />
               <div>
                  <h3 className="font-bold text-lg leading-tight mb-1">{movie.title}</h3>
                  <p className="text-sm text-zinc-500">Showtime: 07:00 PM</p>
                  <p className="text-sm text-rose-500 font-semibold">{showtimeId.split('-')[1]?.toUpperCase() || 'Cinema'}</p>
               </div>
            </div>

            <div className="space-y-4 mb-8">
               <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-medium">
                  <span>Selected Seats:</span>
                  <span className="text-zinc-900 dark:text-white font-bold">
                    {selectedSeats.length > 0 ? selectedSeats.map(s => s.id).join(', ') : 'None'}
                  </span>
               </div>
               <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-medium">
                  <span>Subtotal:</span>
                  <span className="text-zinc-900 dark:text-white font-bold">₹{totalPrice.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-zinc-600 dark:text-zinc-400 font-medium">
                  <span>Conv. Fees (10%):</span>
                  <span className="text-zinc-900 dark:text-white font-bold">₹{(totalPrice * 0.1).toFixed(2)}</span>
               </div>
               <div className="border-t border-zinc-100 dark:border-white/5 pt-4 flex justify-between">
                  <span className="text-lg font-bold">Total Amount:</span>
                  <span className="text-2xl font-bold text-rose-600">₹{(totalPrice * 1.1).toFixed(2)}</span>
               </div>
            </div>

            <button 
              disabled={selectedSeats.length === 0 || loading}
              onClick={handleProceed}
              className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-rose-600/20"
            >
              <CreditCard className="w-5 h-5" /> {loading ? 'Processing...' : 'Proceed to Pay'}
            </button>
            
            <p className="text-center mt-6 text-xs text-zinc-500 font-medium flex items-center justify-center gap-1">
              <Info className="w-3 h-3" /> Tickets once booked cannot be cancelled.
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
