'use client';

import { useState } from 'react';
import { TmdbMovie, tmdbApi } from '@/lib/tmdb';
import { Star, Clock, Calendar, Play } from 'lucide-react';
import { getMovieVideosAction } from '@/lib/actions';
import TrailerModal from './TrailerModal';

interface MovieHeroClientProps {
  movie: TmdbMovie;
  genreNames: string[];
}

export default function MovieHeroClient({ movie, genreNames }: MovieHeroClientProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [videoKey, setVideoKey] = useState<string | null>(null);

  const openTrailer = async () => {
    // Calling server action instead of direct API
    const videos = await getMovieVideosAction(movie.id);
    const trailer = videos.find(v => v.type === 'Trailer') || videos[0];
    setVideoKey(trailer?.key || null);
    setIsTrailerOpen(true);
  };

  return (
    <>
      <div className="relative w-full h-[60vh] lg:h-[70vh]">
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-50 dark:from-[#050505] to-transparent z-10" />
        <div className="absolute inset-0 bg-black/40 z-0" />

        <img
          src={movie.backdrop_path}
          alt={movie.title}
          className="w-full h-full object-cover object-top"
        />

        <div className="absolute bottom-0 left-0 right-0 z-20 pb-8 translate-y-20 lg:translate-y-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 items-end">
            <div className="flex-shrink-0 w-48 md:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 dark:border-white/20 bg-zinc-900 group">
              <img src={movie.poster_path} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>

            <div className="flex-1 pb-4 md:pb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {genreNames.map(genre => (
                  <span key={genre} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                    {genre}
                  </span>
                ))}
                <span className="px-3 py-1 bg-rose-600 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg shadow-rose-600/30">
                  {movie.status}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight drop-shadow-lg leading-tight">
                {movie.title}
              </h1>

              <p className="text-lg text-zinc-700 dark:text-zinc-300 max-w-3xl mb-6 font-medium leading-relaxed drop-shadow-md">
                {movie.overview}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-lg">{movie.vote_average.toFixed(1)} <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">/ 10</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-rose-500" />
                  {movie.runtime} mins
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  {new Date(movie.release_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>

                <button
                  onClick={openTrailer}
                  className="flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:text-rose-500 transition-colors bg-rose-50 dark:bg-rose-500/10 px-4 py-2 rounded-lg ml-auto md:ml-0 border border-rose-200 dark:border-rose-500/20 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" /> Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        videoKey={videoKey}
        title={movie.title}
      />
    </>
  );
}
