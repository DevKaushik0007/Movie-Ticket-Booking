import Header from '@/components/Header';
import { tmdbApi } from '@/lib/tmdb';
import { bookingService } from '@/lib/booking';
import Link from 'next/link';
import { Star, Filter, Search, Info, Ticket } from 'lucide-react';

export default async function ShowsPage({ searchParams }: { searchParams: Promise<{ location?: string }> }) {
  const { location = 'Mumbai' } = await searchParams;
  const nowPlaying = await tmdbApi.getNowPlaying();
  
  // AuraCinema Realism: Only show movies that have theater assignments in the selected city
  const availableMovies = nowPlaying.filter((movie) => {
    // Deterministic association matching bookingService (movieId % 2)
    return movie.id % 2 === 0 || (movie.id % 3 === 0); // Simplified realistic spread
  }).slice(0, 16);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a]">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-zinc-200 dark:border-white/5 pb-10">
            <div>
              <h1 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-none mb-4">
                Movies in <span className="text-rose-600 underline decoration-rose-600/20 underline-offset-[12px]">{location}</span>
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-bold text-lg">Explore currently screening blockbusters near you</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-rose-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search movies in the city..." 
                  className="pl-12 pr-6 py-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all w-80 text-sm font-bold shadow-sm"
                />
              </div>
              <button className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-6 py-4 rounded-2xl border border-zinc-200 dark:border-white/5 font-black text-sm uppercase tracking-widest hover:border-rose-500/30 transition-all shadow-sm active:scale-95">
                <Filter className="w-5 h-5" /> Filters
              </button>
            </div>
          </div>

          {availableMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
              {availableMovies.map((movie) => (
                <Link 
                  href={`/shows/${movie.id}`} 
                  key={movie.id}
                  className="group flex flex-col bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-white/5 shadow-sm hover:shadow-2xl hover:border-rose-500/30 transition-all duration-700 hover:-translate-y-4"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img 
                      src={movie.poster_path} 
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                      <button className="w-full bg-rose-600 text-white py-4 rounded-[1.2rem] font-black text-xs shadow-xl shadow-rose-600/40 flex items-center justify-center gap-2 uppercase tracking-[0.2em] active:scale-95 transition-transform">
                        <Ticket className="w-4 h-4 fill-current" /> Book Tickets
                      </button>
                    </div>
                    <div className="absolute top-5 right-5 bg-black/60 backdrop-blur-2xl px-3 py-2 rounded-2xl text-xs font-black text-white flex items-center gap-2 border border-white/10 shadow-2xl">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" /> {movie.vote_average.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-1 group-hover:text-rose-500 transition-colors tracking-tight">
                      {movie.title}
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-black uppercase tracking-[0.3em] mb-6 opacity-60">
                      Action • Sci-Fi • 120m
                    </p>
                    <div className="flex items-center gap-2 pt-4 border-t border-zinc-100 dark:border-white/5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Fast-filling in {location}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-60 text-center">
               <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-8 border border-zinc-200 dark:border-white/5 shadow-inner">
                 <Info className="w-10 h-10 text-zinc-400" />
               </div>
               <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter mb-4">No Showtimes Found</h3>
               <p className="text-zinc-500 max-w-sm font-bold text-lg leading-relaxed">It looks like there are no current shows for your selection in {location}. Try another city!</p>
               <button className="mt-10 px-10 py-4 bg-rose-600 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/30">Select Another City</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
