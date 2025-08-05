
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { bookingService, Show } from '@/lib/booking';

export default function ShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  useEffect(() => {
    setTimeout(() => {
      setShows(bookingService.getShows());
      setLoading(false);
    }, 1000);
  }, []);

  const filteredShows = shows.filter(show => {
    const matchesSearch = show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         show.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || show.genre.toLowerCase().includes(selectedGenre.toLowerCase());
    return matchesSearch && matchesGenre;
  });

  const genres = ['all', 'action', 'adventure', 'drama', 'sci-fi', 'thriller', 'crime', 'fantasy'];

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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Shows</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-search-line text-gray-400 text-sm"></i>
                </div>
              </div>
            </div>
            
            <div className="sm:w-48">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm pr-8"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredShows.length === 0 ? (
          <div className="text-center py-16">
            <i className="ri-search-line text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shows found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredShows.map((show) => (
              <div key={show.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
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
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{show.title}</h3>
                  <p className="text-gray-600 mb-2">{show.genre}</p>
                  <p className="text-gray-500 mb-4">{show.duration} • {show.language}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{show.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-gray-900">Showtimes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {show.showtimes.slice(0, 3).map((showtime) => (
                        <span key={showtime.id} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {showtime.time}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Link
                    href={`/shows/${show.id}`}
                    className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
