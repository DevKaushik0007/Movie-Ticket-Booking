'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLocation } from './LocationContext';
import { bookingService } from '@/lib/booking';
import { authService, User } from '@/lib/auth';
import { MapPin, Search, Menu, X, User as UserIcon, Ticket, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { location, setLocation } = useLocation();
  const locations = bookingService.getLocations();

  useEffect(() => {
    setUser(authService.getCurrentUser());

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-rose-500/30 group-hover:shadow-rose-500/50 transition-all">
              A
            </div>
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-rose-500 transition-colors">
              AuraCinema
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
              Movies
            </Link>
            <Link href="/shows" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
              Cinemas
            </Link>
            
            {/* Location Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors bg-zinc-100 dark:bg-white/5 px-3 py-1.5 rounded-full"
              >
                <MapPin className="w-4 h-4 text-rose-500" />
                {location}
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {isLocationOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full mt-4 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden"
                  >
                    <div className="py-2">
                      <div className="px-4 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Select City
                      </div>
                      {locations.map(loc => (
                        <button
                          key={loc}
                          onClick={() => {
                            setLocation(loc);
                            setIsLocationOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            location === loc 
                              ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium' 
                              : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex p-2 text-zinc-600 dark:text-zinc-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {user ? (
              <div className="relative group hidden md:block">
                <button className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 font-medium border border-zinc-300 dark:border-zinc-700">
                    {user.name.charAt(0)}
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2">
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-2 flex flex-col gap-1">
                    <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 mb-1">
                      <p className="text-sm font-medium dark:text-white text-zinc-900">{user.name}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
                    </div>
                    <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                      <UserIcon className="w-4 h-4" /> Profile
                    </Link>
                    <Link href="/bookings" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                      <Ticket className="w-4 h-4" /> My Tickets
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors text-left w-full mt-1">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-zinc-600 dark:text-zinc-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Simplified for brevity) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800"
          >
            <div className="p-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2">
                 {locations.map(loc => (
                    <button
                      key={loc}
                      onClick={() => { setLocation(loc); setIsMenuOpen(false); }}
                      className={`px-3 py-2 rounded-lg text-sm ${location === loc ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30' : 'bg-zinc-100 dark:bg-zinc-800'}`}
                    >
                      {loc}
                    </button>
                 ))}
              </div>
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Movies</Link>
              <Link href="/shows" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Cinemas</Link>
              {user ? (
                 <>
                   <Link href="/bookings" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-rose-500">My Tickets</Link>
                   <button onClick={handleLogout} className="text-left text-lg font-medium text-red-500">Sign Out</button>
                 </>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link href="/login" className="py-3 text-center rounded-xl bg-zinc-100 dark:bg-zinc-800 font-medium">Log In</Link>
                  <Link href="/register" className="py-3 text-center rounded-xl bg-rose-600 text-white font-medium">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
