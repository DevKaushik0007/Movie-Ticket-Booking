import Header from '@/components/Header';
import SeatSelectionClient from '@/components/SeatSelectionClient';
import { tmdbApi } from '@/lib/tmdb';
import { notFound } from 'next/navigation';

export default async function BookingPage({ params }: { params: Promise<{ movieId: string, showtimeId: string }> }) {
  const { movieId, showtimeId } = await params;
  const movie = await tmdbApi.getMovieDetails(parseInt(movieId, 10));

  if (!movie) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] pt-20">
      <Header />
      <SeatSelectionClient movie={movie} showtimeId={showtimeId} />
    </div>
  );
}
