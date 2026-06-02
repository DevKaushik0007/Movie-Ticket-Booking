import Header from '@/components/Header';
import MovieCarousel from '@/components/MovieCarousel';
import { tmdbApi } from '@/lib/tmdb';
import { ChevronRight, Play, Star, Calendar, Ticket, Clapperboard } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const trendingMovies = await tmdbApi.getTrending();
  const nowPlaying = await tmdbApi.getNowPlaying();
  
  // AuraCinema Realism: Some are Now Playing, others are Coming Soon
  const playingNow = nowPlaying.slice(0, 12);
  const comingSoon = nowPlaying.slice(12, 18);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] selection:bg-rose-500/30">
      <Header />
      
      <main className="pb-20">
        <MovieCarousel movies={trendingMovies.slice(0, 5)} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30">
          
          {/* Now Playing Section */}
          <section className="mb-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-4xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-3 tracking-tighter">
                  <span className="w-2 h-10 bg-rose-600 rounded-full" />
                  Now Playing
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium text-lg">Catch the latest blockbusters in AuraCinema near you</p>
              </div>
              <Link href="/shows" className="group flex items-center gap-2 text-rose-600 font-bold hover:text-rose-500 transition-colors bg-white dark:bg-zinc-900 px-4 py-2 rounded-full border border-zinc-200 dark:border-white/5 shadow-sm">
                View All <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
              {playingNow.map((movie) => (
                <Link 
                  href={`/shows/${movie.id}`} 
                  key={movie.id}
                  className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-white/5 shadow-sm hover:shadow-2xl hover:border-rose-500/30 transition-all duration-500 hover:-translate-y-3"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img 
                      src={movie.poster_path} 
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                       <button className="w-full bg-rose-600 text-white py-3 rounded-2xl font-black text-xs shadow-lg shadow-rose-600/40 flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95">
                         <Ticket className="w-4 h-4 fill-current" /> Book Now
                       </button>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xl px-2.5 py-1.5 rounded-xl text-xs font-black text-white flex items-center gap-1.5 border border-white/10 shadow-lg">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" /> {movie.vote_average.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-1.5 line-clamp-1 group-hover:text-rose-500 transition-colors">
                        {movie.title}
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] opacity-70">
                        U/A • 2D, 3D, IMAX
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Banner Promo */}
          <div className="relative w-full h-56 md:h-72 rounded-[3rem] overflow-hidden group mb-24 shadow-2xl border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt="Banner" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent flex flex-col justify-center px-8 md:px-16">
                 <div className="max-w-md">
                   <h3 className="text-white text-4xl md:text-6xl font-black mb-4 tracking-tighter leading-none">
                     YOUR FRONT ROW <br/> <span className="text-rose-600">SEAT AWAITS.</span>
                   </h3>
                   <p className="text-zinc-400 text-lg font-bold mb-8 leading-relaxed">Experience cinema as it was meant to be seen. Exclusive IMAX and Premium formats available.</p>
                   <button className="bg-rose-600 text-white px-10 py-4 rounded-full font-black text-lg hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/30 uppercase tracking-tighter active:scale-95 flex items-center gap-2 w-fit">
                     Join AuraPass <ChevronRight className="w-6 h-6" />
                   </button>
                 </div>
              </div>
          </div>

          {/* Coming Soon Section */}
          <section className="mb-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-4xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-3 tracking-tighter">
                  <span className="w-2 h-10 bg-indigo-600 rounded-full" />
                  Coming Soon
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium text-lg">Mark your calendars for these epic releases</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
              {comingSoon.map((movie) => (
                <div 
                  key={movie.id}
                  className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-white/5 grayscale hover:grayscale-0 transition-all duration-700"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img 
                      src={movie.poster_path} 
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6 text-center backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
                       <Clapperboard className="w-12 h-12 text-white/50 mb-3" />
                       <span className="text-[10px] font-black text-white tracking-[0.3em] uppercase mb-1 opacity-70">RELEASING ON</span>
                       <span className="text-xl font-black text-rose-500 uppercase tracking-tighter">{new Date(movie.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-base text-zinc-400 dark:text-zinc-500 mb-1.5 line-clamp-1 group-hover:text-zinc-100 transition-colors">
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.1em] italic">Pre-book soon</span>
                       <button className="text-[10px] font-black text-indigo-500 hover:text-indigo-400 transition-colors flex items-center gap-1 uppercase tracking-wider">
                         Notify Me <Star className="w-3 h-3" />
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <footer className="py-20 border-t border-zinc-200 dark:border-white/5 bg-white dark:bg-[#050505] relative z-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
               <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold">A</div>
                    <span className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">AuraCinema</span>
                  </div>
                  <p className="text-zinc-500 max-w-sm leading-relaxed font-medium">Elevating your movie-going experience with state-of-the-art booking and premium cinematic services. AuraCinema is where magic happens.</p>
               </div>
               <div>
                  <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6">Quick Links</h4>
                  <ul className="space-y-4 text-zinc-500 font-bold text-sm">
                    <li><Link href="/" className="hover:text-rose-500 transition-colors">Home</Link></li>
                    <li><Link href="/shows" className="hover:text-rose-500 transition-colors">Movies</Link></li>
                    <li><Link href="/theaters" className="hover:text-rose-500 transition-colors">Cinemas</Link></li>
                    <li><Link href="/profile" className="hover:text-rose-500 transition-colors">Account</Link></li>
                  </ul>
               </div>
               <div>
                  <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6">Contact</h4>
                  <div className="space-y-4 text-zinc-500 font-bold text-sm">
                    <p>contact@auracinema.com</p>
                    <p>1-800-CINEMA-AURA</p>
                    <div className="flex gap-4 pt-2">
                       {/* Social icons would go here */}
                    </div>
                  </div>
               </div>
            </div>
            <div className="pt-8 border-t border-zinc-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
               <p className="text-xs text-zinc-500 font-medium">© {new Date().getFullYear()} AuraCinema Entertainment. All rights reserved.</p>
               <div className="flex gap-6 text-xs text-zinc-400 font-medium">
                  <Link href="/terms" className="hover:text-zinc-100">Terms</Link>
                  <Link href="/privacy" className="hover:text-zinc-100">Privacy</Link>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
