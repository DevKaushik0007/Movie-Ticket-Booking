import Header from '@/components/Header';
import { Ticket, Share2, Download, CheckCircle2, QrCode, MapPin, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function BookingConfirmationPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] pt-24 pb-20">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Message */}
        <div className="text-center mb-12">
           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6 group">
              <CheckCircle2 className="w-10 h-10 text-green-500 group-hover:scale-110 transition-transform" />
           </div>
           <h1 className="text-4xl font-extrabold tracking-tight mb-2">Booking Confirmed!</h1>
           <p className="text-zinc-500 font-medium">Enjoy your movie experience. Your digital ticket is ready.</p>
        </div>

        {/* Digital Ticket Card */}
        <div className="relative group perspective-1000">
           <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-orange-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
           
           <div className="relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/10">
              {/* Header */}
              <div className="bg-zinc-900 border-b border-white/5 p-8 flex justify-between items-center">
                 <div>
                    <h2 className="text-white text-2xl font-black uppercase tracking-widest italic">Movie<span className="text-rose-600">Hub</span> Pass</h2>
                    <p className="text-zinc-400 text-xs font-bold tracking-tighter uppercase mt-1">Booking ID: {bookingId}</p>
                 </div>
                 <QrCode className="w-10 h-10 text-white" />
              </div>

              {/* Main Content */}
              <div className="p-8 flex flex-col md:flex-row gap-8">
                 <div className="flex-1 space-y-8">
                    <div>
                       <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Movie</label>
                       <h3 className="text-2xl font-bold dark:text-white uppercase leading-tight">Dune: Part Two</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                       <div>
                          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Date</label>
                          <div className="flex items-center gap-2 font-bold dark:text-gray-100 uppercase">
                             <Calendar className="w-4 h-4 text-rose-500" />
                             March 28, 2024
                          </div>
                       </div>
                       <div>
                          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Time</label>
                          <div className="flex items-center gap-2 font-bold dark:text-gray-100 uppercase">
                             <Clock className="w-4 h-4 text-rose-500" />
                             07:30 PM
                          </div>
                       </div>
                    </div>

                    <div>
                       <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Cinema & Hall</label>
                       <div className="flex items-center gap-2 font-bold dark:text-gray-100 uppercase">
                          <MapPin className="w-4 h-4 text-rose-500" />
                          PVR Mumbai Mall - Screen 4
                       </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                       <div>
                          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Seats</label>
                          <p className="text-xl font-black text-rose-600 tracking-tighter uppercase">E12, E13, E14</p>
                       </div>
                       <div className="text-right">
                           <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Total Paid</label>
                           <p className="text-xl font-black dark:text-white uppercase">₹1,120.00</p>
                       </div>
                    </div>
                 </div>

                 {/* Simulated QR & Ticket info */}
                 <div className="md:w-48 flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-white/5 text-center">
                    <div className="w-24 h-24 bg-white p-2 rounded-xl mb-4 group-hover:scale-110 transition-transform shadow-xl">
                       <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example-ticket" alt="QR Code" className="w-full h-full" />
                    </div>
                    <p className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Scan at Entrance</p>
                 </div>
              </div>

              {/* Footer / Perforation */}
              <div className="relative h-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-dashed border-zinc-200 dark:border-white/10" />
           </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <button className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-rose-600/20 transition-all hover:-translate-y-1 active:scale-95">
               <Download className="w-5 h-5" /> Download Ticket
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl transition-all hover:-translate-y-1 active:scale-95 border border-white/5">
               <Share2 className="w-5 h-5" /> Share Pass
            </button>
        </div>

        <div className="text-center mt-8">
           <Link href="/bookings" className="text-sm font-bold text-rose-500 hover:text-rose-400 uppercase tracking-widest">
              View All Bookings →
           </Link>
        </div>

      </div>
    </div>
  );
}
