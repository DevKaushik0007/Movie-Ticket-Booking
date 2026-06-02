'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, ChevronRight, ChevronLeft, Ticket } from 'lucide-react';
import Link from 'next/link';
import { TmdbMovie, tmdbApi } from '@/lib/tmdb';
import { getMovieVideosAction } from '@/lib/actions';
import TrailerModal from './TrailerModal';

export default function MovieCarousel({ movies }: { movies: TmdbMovie[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [videoKey, setVideoKey] = useState<string | null>(null);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (!movies || movies.length === 0) return null;

  const movie = movies[currentIndex];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % movies.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);

  const openTrailer = async () => {
    const videos = await getMovieVideosAction(movie.id);
    const trailer = videos.find(v => v.type === 'Trailer') || videos[0];
    setVideoKey(trailer?.key || null);
    setIsTrailerOpen(true);
  };

  return (
    <div className="relative w-full h-[85vh] lg:h-[90vh] overflow-hidden flex items-center justify-center bg-black">
      
      {/* Background with AnimatePresence for smooth crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-50/20 to-transparent dark:from-[#0a0a0a] dark:via-[#0a0a0a]/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-50 via-transparent to-transparent dark:from-[#0a0a0a] z-10" />
          
          <img 
            src={movie.backdrop_path} 
            alt={movie.title}
            className="w-full h-full object-cover opacity-80"
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${movie.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mt-20"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs font-bold tracking-wider text-rose-500 border border-rose-500/30 rounded-full bg-rose-500/10 backdrop-blur-md">
                NOW PLAYING
              </span>
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 flex items-center gap-1">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight leading-tight text-zinc-900 dark:text-white drop-shadow-2xl">
              {movie.title}
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 mb-8 line-clamp-3 leading-relaxed max-w-xl font-medium drop-shadow-md">
              {movie.overview}
            </p>

            <div className="flex items-center gap-4">
              <Link
                href={`/shows/${movie.id}`}
                className="flex items-center gap-2 bg-rose-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-rose-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-rose-600/30"
              >
                <Ticket className="w-5 h-5 fill-current" />
                Book Tickets
              </Link>
              
              <button 
                onClick={openTrailer}
                className="flex items-center gap-2 bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 text-zinc-900 dark:text-white backdrop-blur-md border border-white/20 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-current text-rose-500" />
                Play Trailer
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <TrailerModal 
        isOpen={isTrailerOpen} 
        onClose={() => setIsTrailerOpen(false)} 
        videoKey={videoKey} 
        title={movie.title} 
      />

      {/* Navigation Controls */}
      <div className="absolute z-30 right-4 sm:right-12 bottom-12 flex items-center gap-4">
        <button 
          onClick={handlePrev}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all hover:scale-110 active:scale-90"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={handleNext}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all hover:scale-110 active:scale-90"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute z-30 left-1/2 -translate-x-1/2 bottom-8 flex items-center gap-2">
        {movies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex 
                ? 'w-8 h-2 bg-rose-500' 
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
