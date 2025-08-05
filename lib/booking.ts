
export interface Show {
  id: string;
  title: string;
  description: string;
  duration: string;
  rating: string;
  genre: string;
  language: string;
  image: string;
  showtimes: Showtime[];
}

export interface Showtime {
  id: string;
  time: string;
  date: string;
  price: number;
  availableSeats: number;
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
  showId: string;
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
  showTitle: string;
  seats: string[];
  showtime: string;
}

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

  getShows(): Show[] {
    return [
      {
        id: '1',
        title: 'Avengers: Endgame',
        description: 'The epic conclusion to the Marvel Cinematic Universe\'s Infinity Saga brings together all the heroes for the ultimate battle.',
        duration: '3h 1m',
        rating: '8.4',
        genre: 'Action, Adventure, Drama',
        language: 'English',
        image: 'https://readdy.ai/api/search-image?query=Avengers%20Endgame%20movie%20poster%20with%20dark%20cosmic%20background%2C%20superhero%20team%20assembled%2C%20dramatic%20lighting%2C%20high%20quality%20movie%20poster%20design%20with%20clean%20minimal%20background&width=400&height=600&seq=avengers1&orientation=portrait',
        showtimes: [
          { id: '1-1', time: '10:00 AM', date: '2024-01-15', price: 250, availableSeats: 120 },
          { id: '1-2', time: '2:00 PM', date: '2024-01-15', price: 300, availableSeats: 120 },
          { id: '1-3', time: '6:00 PM', date: '2024-01-15', price: 350, availableSeats: 120 }
        ]
      },
      {
        id: '2',
        title: 'The Dark Knight',
        description: 'Batman faces his greatest challenge yet as the Joker wreaks havoc on Gotham City in this critically acclaimed superhero thriller.',
        duration: '2h 32m',
        rating: '9.0',
        genre: 'Action, Crime, Drama',
        language: 'English',
        image: 'https://readdy.ai/api/search-image?query=The%20Dark%20Knight%20movie%20poster%20with%20Batman%20silhouette%20against%20Gotham%20city%20skyline%2C%20dark%20moody%20atmosphere%2C%20minimal%20clean%20background%2C%20professional%20movie%20poster%20design&width=400&height=600&seq=batman1&orientation=portrait',
        showtimes: [
          { id: '2-1', time: '11:00 AM', date: '2024-01-15', price: 280, availableSeats: 150 },
          { id: '2-2', time: '3:00 PM', date: '2024-01-15', price: 320, availableSeats: 150 },
          { id: '2-3', time: '7:00 PM', date: '2024-01-15', price: 380, availableSeats: 150 }
        ]
      },
      {
        id: '3',
        title: 'Spider-Man: No Way Home',
        description: 'Peter Parker\'s secret identity is revealed, leading to unprecedented consequences and a multiverse-spanning adventure.',
        duration: '2h 28m',
        rating: '8.2',
        genre: 'Action, Adventure, Fantasy',
        language: 'English',
        image: 'https://readdy.ai/api/search-image?query=Spider-Man%20No%20Way%20Home%20movie%20poster%20with%20multiple%20Spider-Man%20figures%2C%20web%20patterns%2C%20dynamic%20action%20pose%2C%20clean%20minimal%20background%2C%20modern%20movie%20poster%20design&width=400&height=600&seq=spiderman1&orientation=portrait',
        showtimes: [
          { id: '3-1', time: '9:30 AM', date: '2024-01-15', price: 300, availableSeats: 180 },
          { id: '3-2', time: '1:30 PM', date: '2024-01-15', price: 350, availableSeats: 180 },
          { id: '3-3', time: '5:30 PM', date: '2024-01-15', price: 400, availableSeats: 180 }
        ]
      },
      {
        id: '4',
        title: 'Inception',
        description: 'A thief who enters people\'s dreams to steal secrets is given the inverse task of planting an idea in someone\'s mind.',
        duration: '2h 28m',
        rating: '8.8',
        genre: 'Action, Sci-Fi, Thriller',
        language: 'English',
        image: 'https://readdy.ai/api/search-image?query=Inception%20movie%20poster%20with%20surreal%20dream-like%20architecture%2C%20floating%20city%20elements%2C%20mysterious%20atmosphere%2C%20clean%20minimal%20background%2C%20sophisticated%20movie%20poster%20design&width=400&height=600&seq=inception1&orientation=portrait',
        showtimes: [
          { id: '4-1', time: '10:30 AM', date: '2024-01-15', price: 270, availableSeats: 140 },
          { id: '4-2', time: '2:30 PM', date: '2024-01-15', price: 320, availableSeats: 140 },
          { id: '4-3', time: '6:30 PM', date: '2024-01-15', price: 370, availableSeats: 140 }
        ]
      },
      {
        id: '5',
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        duration: '2h 49m',
        rating: '8.6',
        genre: 'Adventure, Drama, Sci-Fi',
        language: 'English',
        image: 'https://readdy.ai/api/search-image?query=Interstellar%20movie%20poster%20with%20space%20exploration%20theme%2C%20cosmic%20wormhole%2C%20astronaut%20figure%2C%20deep%20space%20atmosphere%2C%20clean%20minimal%20background%2C%20epic%20movie%20poster%20design&width=400&height=600&seq=interstellar1&orientation=portrait',
        showtimes: [
          { id: '5-1', time: '9:00 AM', date: '2024-01-15', price: 280, availableSeats: 160 },
          { id: '5-2', time: '1:00 PM', date: '2024-01-15', price: 330, availableSeats: 160 },
          { id: '5-3', time: '5:00 PM', date: '2024-01-15', price: 380, availableSeats: 160 }
        ]
      }
    ];
  }

  getShow(id: string): Show | undefined {
    return this.getShows().find(show => show.id === id);
  }

  generateSeats(showtimeId: string): Seat[] {
    const seats: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = 12;
    
    const bookedSeatsForShowtime = this.bookedSeats.get(showtimeId) || new Set();
    
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        const seatId = `${row}${seatNum}`;
        let type: 'regular' | 'premium' | 'vip' = 'regular';
        let price = 250;
        
        if (rowIndex >= 7) {
          type = 'vip';
          price = 400;
        } else if (rowIndex >= 4) {
          type = 'premium';
          price = 320;
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

  confirmBooking(bookingId: string, paymentId: string): Receipt {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    booking.status = 'confirmed';
    booking.paymentId = paymentId;
    
    const show = this.getShow(booking.showId);
    const showtime = show?.showtimes.find(st => st.id === booking.showtimeId);
    
    const receipt: Receipt = {
      id: Date.now().toString(),
      bookingId: booking.id,
      amount: booking.totalAmount,
      paymentMethod: 'Razorpay',
      transactionId: paymentId,
      date: new Date().toISOString(),
      showTitle: show?.title || 'Unknown Show',
      seats: booking.seats.map(seat => `${seat.row}${seat.number}`),
      showtime: showtime ? `${showtime.date} ${showtime.time}` : 'Unknown Time'
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
