import Header from '@/components/Header';
import { tmdbApi } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import MovieDetailsClient from '@/components/MovieDetailsClient';
import MovieHeroClient from '@/components/MovieHeroClient';
import { Star, Clock, Calendar, Play } from 'lucide-react';

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  
  // Fetch movie and genres in parallel for maximum speed
  const [movie, genres] = await Promise.all([
    tmdbApi.getMovieDetails(movieId),
    tmdbApi.getGenres()
  ]);

  if (!movie) {
    notFound();
  }

  const genreNames = movie.genre_ids 
    ? movie.genre_ids.map(gid => genres.find(g => g.id === gid)?.name).filter(Boolean) as string[]
    : [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] selection:bg-rose-500/30">
      <Header />
      
      <MovieHeroClient movie={movie} genreNames={genreNames} />

      <div className="pt-24 lg:pt-36">
        <MovieDetailsClient movie={movie} />
      </div>

    </div>
  );
}
