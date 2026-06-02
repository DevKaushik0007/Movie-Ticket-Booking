'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocationContextType {
  location: string;
  setLocation: (loc: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState('Mumbai'); // Default to Mumbai

  useEffect(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('user_location');
    if (saved) {
      setLocationState(saved);
    }
  }, []);

  const setLocation = (loc: string) => {
    setLocationState(loc);
    localStorage.setItem('user_location', loc);
  };

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
