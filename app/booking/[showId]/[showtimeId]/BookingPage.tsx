
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Button from '@/components/ui/Button';
import { bookingService, Show, Showtime, Seat } from '@/lib/booking';
import { authService } from '@/lib/auth';

interface BookingPageProps {
  showId: string;
  showtimeId: string;
}

export default function BookingPage({ showId, showtimeId }: BookingPageProps) {
  const [show, setShow] = useState<Show | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundShow = bookingService.getShow(showId);
        const foundShowtime = foundShow?.showtimes.find(st => st.id === showtimeId);
        const generatedSeats = bookingService.generateSeats(showtimeId);
        
        setShow(foundShow || null);
        setShowtime(foundShowtime || null);
        setSeats(generatedSeats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [showId, showtimeId]);

  const handleSeatClick = (seatId: string) => {
    setSeats(prevSeats => 
      prevSeats.map(seat => 
        seat.id === seatId 
          ? { ...seat, isSelected: !seat.isSelected }
          : seat
      )
    );
  };

  const selectedSeats = seats.filter(seat => seat.isSelected);
  const totalAmount = selectedSeats.reduce((total, seat) => total + seat.price, 0);

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    setBookingLoading(true);

    try {
      // Create booking first
      const booking = bookingService.createBooking({
        userId: user.id,
        showId,
        showtimeId,
        seats: selectedSeats,
        totalAmount
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock payment response
      const mockPaymentResponse = {
        razorpay_payment_id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        razorpay_order_id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        razorpay_signature: `signature_${Math.random().toString(36).substr(2, 20)}`
      };

      // Confirm booking with payment details
      const receipt = bookingService.confirmBooking(booking.id, mockPaymentResponse.razorpay_payment_id);
      
      // Navigate to confirmation page
      router.push(`/booking-confirmation/${receipt.id}`);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
      setBookingLoading(false);
    }
  };

  const getSeatTypeColor = (seat: Seat) => {
    if (seat.isBooked) return 'bg-gray-300 cursor-not-allowed';
    if (seat.isSelected) return 'bg-blue-600 text-white';
    
    switch (seat.type) {
      case 'vip':
        return 'bg-purple-100 hover:bg-purple-200 border-purple-300';
      case 'premium':
        return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300';
      default:
        return 'bg-green-100 hover:bg-green-200 border-green-300';
    }
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

  if (!show || !showtime) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Available</h1>
            <p className="text-gray-600 mb-8">The show or showtime you selected is not available.</p>
            <Button onClick={() => router.push('/shows')}>
              Browse Shows
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{show.title}</h1>
              <p className="text-gray-600">{showtime.date} • {showtime.time}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">₹{showtime.price} per seat</p>
              <p className="text-sm text-gray-600">{show.duration} • {show.language}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Select Your Seats</h2>
              
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-64 h-2 bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">SCREEN</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(row => (
                  <div key={row} className="flex items-center justify-center space-x-2">
                    <div className="w-8 text-center font-medium text-gray-700">{row}</div>
                    <div className="flex space-x-1">
                      {seats
                        .filter(seat => seat.row === row)
                        .map(seat => (
                          <button
                            key={seat.id}
                            onClick={() => !seat.isBooked && handleSeatClick(seat.id)}
                            className={`w-8 h-8 rounded text-xs font-medium border transition-colors cursor-pointer ${getSeatTypeColor(seat)}`}
                            disabled={seat.isBooked}
                            title={seat.isBooked ? 'Booked' : `${seat.type.toUpperCase()} - ₹${seat.price}`}
                          >
                            {seat.number}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center space-x-8 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
                  <span>Regular (₹250)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
                  <span>Premium (₹320)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded mr-2"></div>
                  <span>VIP (₹400)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                  <span>Booked</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Movie:</span>
                  <span className="font-medium">{show.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium">{showtime.date} • {showtime.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Seats:</span>
                  <span className="font-medium">
                    {selectedSeats.length > 0 
                      ? selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')
                      : 'None'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of Seats:</span>
                  <span className="font-medium">{selectedSeats.length}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">₹{totalAmount}</span>
                </div>
              </div>

              <Button
                onClick={handleBooking}
                disabled={selectedSeats.length === 0 || bookingLoading}
                loading={bookingLoading}
                className="w-full"
              >
                {bookingLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="ri-secure-payment-line mr-2"></i>
                    Pay Now
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 mt-2 text-center">
                Secure payment processing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
