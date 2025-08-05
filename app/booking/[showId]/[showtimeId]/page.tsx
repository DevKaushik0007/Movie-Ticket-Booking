
import BookingPage from './BookingPage';

export async function generateStaticParams() {
  return [
    { showId: '1', showtimeId: '1-1' },
    { showId: '1', showtimeId: '1-2' },
    { showId: '1', showtimeId: '1-3' },
    { showId: '2', showtimeId: '2-1' },
    { showId: '2', showtimeId: '2-2' },
    { showId: '2', showtimeId: '2-3' },
    { showId: '3', showtimeId: '3-1' },
    { showId: '3', showtimeId: '3-2' },
    { showId: '3', showtimeId: '3-3' },
    { showId: '4', showtimeId: '4-1' },
    { showId: '4', showtimeId: '4-2' },
    { showId: '4', showtimeId: '4-3' },
    { showId: '5', showtimeId: '5-1' },
    { showId: '5', showtimeId: '5-2' },
    { showId: '5', showtimeId: '5-3' }
  ];
}

export default function BookingRoute({ params }: { params: { showId: string; showtimeId: string } }) {
  return <BookingPage showId={params.showId} showtimeId={params.showtimeId} />;
}
