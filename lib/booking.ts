import { TmdbMovie, tmdbApi } from './tmdb';

export interface Theater {
  id: string;
  name: string;
  location: string;
  facilities: string[];
}

export interface Showtime {
  id: string;
  theaterId: string;
  time: string;
  date: string;
  price: number;
  availableSeats: number;
  format: 'Standard' | 'IMAX 3D' | '4DX';
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'regular' | 'premium' | 'vip';
  price: number;
  isBooked: boolean;
  isSelected: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  movieId: number;
  theaterId: string;
  showtimeId: string;
  seats: Seat[];
  totalAmount: number;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentId?: string;
}

export interface Receipt {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  date: string;
  movieTitle: string;
  theaterName: string;
  seats: string[];
  showtime: string;
}

const LOCATIONS = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune'];

const THEATER_NAMES = [
  'PVR Cinemas', 'INOX', 'Cinepolis', 'Miraj Cinemas', 'Carnival Cinemas', 'Mukta A2'
];

class BookingService {
  private static instance: BookingService;
  private bookings: Booking[] = [];
  private receipts: Receipt[] = [];
  private bookedSeats: Map<string, Set<string>> = new Map();

  static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  getLocations(): string[] {
    return LOCATIONS;
  }

  // Dynamically generate 3-5 theaters for a given location
  getTheatersByLocation(location: string): Theater[] {
    // deterministic based on location string length just to be stable
    const count = 3 + (location.length % 3); 
    const theaters: Theater[] = [];
    
    for (let i = 0; i < count; i++) {
      const nameIndex = (location.length + i) % THEATER_NAMES.length;
      theaters.push({
        id: `th-${location.toLowerCase()}-${i}`,
        name: `${THEATER_NAMES[nameIndex]} ${location} Mall`,
        location: location,
        facilities: ['Recliner', 'Food & Beverage', i % 2 === 0 ? 'IMAX' : 'Dolby Atmos']
      });
    }
    return theaters;
  }

  // Dynamically generate showtimes for a specific movie in a specific location
  async getShowtimes(movieId: number, location: string, date: string): Promise<{ theater: Theater, showtimes: Showtime[] }[]> {
    const theaters = this.getTheatersByLocation(location);
    const result = [];

    // AuraCinema Realism: Deterministically assign movies to only 50% of theaters in a city
    // This makes it feel "real" as not every theater has every movie
    const movieParity = movieId % 2;

    for (let i = 0; i < theaters.length; i++) {
      if ((i + movieParity) % 2 !== 0) continue;

      const theater = theaters[i];
      const seed = movieId + date.length;
      const showtimesCount = 2 + ((seed + i) % 4);
      const showtimes: Showtime[] = [];
      let baseHour = 9 + ((seed + i) % 3);

      for (let j = 0; j < showtimesCount; j++) {
        const timeValue = baseHour + (j * 3);
        const ampm = timeValue >= 12 ? 'PM' : 'AM';
        const displayHour = timeValue > 12 ? timeValue - 12 : timeValue;
        const timeString = `${displayHour}:00 ${ampm}`;
        const isImax = theater.facilities.includes('IMAX') && j % 2 === 0;

        showtimes.push({
          id: `st-${theater.id}-${movieId}-${date}-${timeValue}`,
          theaterId: theater.id,
          time: timeString,
          date: date,
          price: isImax ? 550 : 250 + ((j % 3) * 50),
          availableSeats: 120,
          format: isImax ? 'IMAX 3D' : (j % 3 === 0 ? '4DX' : 'Standard')
        });
      }
      result.push({ theater, showtimes });
    }

    await new Promise(resolve => setTimeout(resolve, 400));
    return result;
  }

  generateSeats(showtimeId: string): Seat[] {
    const seats: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    const seatsPerRow = 16;
    
    const bookedSeatsForShowtime = this.bookedSeats.get(showtimeId) || new Set();
    const basePrice = 250;
    
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        const seatId = `${row}${seatNum}`;
        let type: 'regular' | 'premium' | 'vip' = 'regular';
        let price = basePrice;
        
        if (rowIndex <= 2) {
          type = 'vip'; // Recliner (Top 3 rows)
          price = basePrice + 200;
        } else if (rowIndex <= 7) {
          type = 'premium'; // Prime (Rows 4-8)
          price = basePrice + 80;
        }
        
        seats.push({
          id: seatId,
          row,
          number: seatNum,
          type,
          price,
          isBooked: bookedSeatsForShowtime.has(seatId),
          isSelected: false
        });
      }
    }
    return seats;
  }

  createBooking(booking: Omit<Booking, 'id' | 'bookingDate' | 'status'>): Booking {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      bookingDate: new Date().toISOString(),
      status: 'pending'
    };
    
    this.bookings.push(newBooking);
    
    const bookedSeatsForShowtime = this.bookedSeats.get(booking.showtimeId) || new Set();
    booking.seats.forEach(seat => {
      bookedSeatsForShowtime.add(seat.id);
    });
    this.bookedSeats.set(booking.showtimeId, bookedSeatsForShowtime);
    
    return newBooking;
  }

  async confirmBooking(bookingId: string, paymentId: string): Promise<Receipt> {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    booking.status = 'confirmed';
    booking.paymentId = paymentId;
    
    const movie = await tmdbApi.getMovieDetails(booking.movieId);
    // Find theater
    let theaterName = 'Unknown Theater';
    let showtimeStr = 'Unknown Time';
    
    // Just a mock extraction from ID for display
    const theaterMatch = booking.theaterId.split('-')[1];
    if (theaterMatch) {
        theaterName = `Cinema ${theaterMatch.toUpperCase()}`;
    }
    // Extact time from showtime ID
    const timeMatch = booking.showtimeId.split('-').pop();
    if(timeMatch) {
       showtimeStr = `${timeMatch}:00`;
    }
    
    const receipt: Receipt = {
      id: `rcpt-${Date.now()}`,
      bookingId: booking.id,
      amount: booking.totalAmount,
      paymentMethod: 'Razorpay',
      transactionId: paymentId,
      date: new Date().toISOString(),
      movieTitle: movie?.title || 'Unknown Movie',
      theaterName: theaterName,
      seats: booking.seats.map(seat => `${seat.row}${seat.number}`),
      showtime: showtimeStr // simplified for mock
    };
    
    this.receipts.push(receipt);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('receipts', JSON.stringify(this.receipts));
    }
    
    return receipt;
  }

  getUserBookings(userId: string): Booking[] {
    return this.bookings.filter(booking => booking.userId === userId);
  }

  getUserReceipts(userId: string): Receipt[] {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('receipts');
      if (stored) {
        this.receipts = JSON.parse(stored);
      }
    }
    return this.receipts;
  }
}

export const bookingService = BookingService.getInstance();
