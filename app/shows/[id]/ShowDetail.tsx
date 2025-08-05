
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Button from '@/components/ui/Button';
import { bookingService, Show, Showtime } from '@/lib/booking';
import { authService } from '@/lib/auth';

interface ShowDetailProps {
  showId: string;
}

export default function ShowDetail({ showId }: ShowDetailProps) {
  const [show, setShow] = useState<Show | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchShow = async () => {
      setTimeout(() => {
        const foundShow = bookingService.getShow(showId);
        setShow(foundShow || null);
        setLoading(false);
      }, 500);
    };

    fetchShow();
  }, [showId]);

  const handleBooking = () => {
    if (!selectedShowtime) return;
    
    const isAuthenticated = authService.isAuthenticated();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    router.push(`/booking/${showId}/${selectedShowtime.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Show Not Found</h1>
            <p className="text-gray-600 mb-8">The show you're looking for doesn't exist.</p>
            <Link href="/shows" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
              Browse All Shows
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={show.image}
                alt={show.title}
                className="w-full h-96 md:h-full object-cover object-top"
              />
            </div>
            
            <div className="md:w-2/3 p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{show.title}</h1>
                  <div className="bg-yellow-400 text-black px-3 py-1 rounded-lg font-semibold">
                    ⭐ {show.rating}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <i className="ri-time-line mr-1"></i>
                    {show.duration}
                  </span>
                  <span className="flex items-center">
                    <i className="ri-movie-line mr-1"></i>
                    {show.genre}
                  </span>
                  <span className="flex items-center">
                    <i className="ri-global-line mr-1"></i>
                    {show.language}
                  </span>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{show.description}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Select Showtime</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {show.showtimes.map((showtime) => (
                    <div
                      key={showtime.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedShowtime?.id === showtime.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedShowtime(showtime)}
                    >
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">{showtime.time}</div>
                        <div className="text-sm text-gray-600">{showtime.date}</div>
                        <div className="text-sm font-medium text-blue-600 mt-1">₹{showtime.price}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {showtime.availableSeats} seats available
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleBooking}
                  disabled={!selectedShowtime}
                  className="flex-1"
                >
                  <i className="ri-ticket-line mr-2"></i>
                  Book Tickets
                </Button>
                <Link
                  href="/shows"
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-center whitespace-nowrap"
                >
                  <i className="ri-arrow-left-line mr-2"></i>
                  Back to Shows
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
