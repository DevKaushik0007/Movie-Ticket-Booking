
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { bookingService, Show } from '@/lib/booking';

export default function Home() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShows(bookingService.getShows());
      setLoading(false);
    }, 1000);
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div 
        className="relative bg-cover bg-center h-96 flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://readdy.ai/api/search-image?query=Modern%20cinema%20theater%20interior%20with%20comfortable%20red%20seats%2C%20large%20movie%20screen%2C%20ambient%20lighting%2C%20luxurious%20movie%20theater%20atmosphere%2C%20clean%20minimalist%20design%20with%20dramatic%20lighting&width=1200&height=400&seq=hero1&orientation=landscape')`
        }}
      >
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Book Your Movie Tickets</h1>
          <p className="text-xl mb-8">Experience the magic of cinema with premium comfort</p>
          <Link href="/shows" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
            Browse Shows
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Now Showing</h2>
          <p className="text-gray-600">Book your tickets for the latest blockbusters</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {shows.map((show) => (
            <div key={show.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
              <div className="relative">
                <img
                  src={show.image}
                  alt={show.title}
                  className="w-full h-80 object-cover object-top"
                />
                <div className="absolute top-4 right-4 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-semibold">
                  ⭐ {show.rating}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-2">{show.title}</h3>
                <p className="text-gray-600 mb-2">{show.genre}</p>
                <p className="text-gray-500 mb-4">{show.duration} • {show.language}</p>
                <div className="mt-auto">
                  <Link
                    href={`/shows/${show.id}`}
                    className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-gray-600">Experience the best movie booking service</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-ticket-line text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">Book your tickets in just a few clicks with our user-friendly interface</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-shield-check-line text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Safe and secure payment gateway powered by Razorpay</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-smartphone-line text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">Book tickets on any device with our responsive design</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Pacifico, serif' }}>
                TicketBooking
              </h3>
              <p className="text-gray-400">Your trusted partner for movie ticket bookings</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link href="/shows" className="text-gray-400 hover:text-white">Shows</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <i className="ri-facebook-line text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <i className="ri-twitter-line text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <i className="ri-instagram-line text-xl"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TicketBooking. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
