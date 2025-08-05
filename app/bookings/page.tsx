
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { bookingService, Receipt } from '@/lib/booking';
import { authService } from '@/lib/auth';

export default function BookingsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    setTimeout(() => {
      const userReceipts = bookingService.getUserReceipts(user.id);
      setReceipts(userReceipts);
      setLoading(false);
    }, 500);
  }, [router]);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
          <p className="text-gray-600">View and manage your movie ticket bookings</p>
        </div>

        {receipts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-ticket-line text-2xl text-gray-400"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h2>
            <p className="text-gray-600 mb-6">You haven't booked any movie tickets yet.</p>
            <Link
              href="/shows"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {receipts.map((receipt) => (
              <div key={receipt.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{receipt.showTitle}</h3>
                      <p className="text-gray-600">{receipt.showtime}</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Confirmed
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Booking ID:</strong> {receipt.id}</p>
                        <p><strong>Seats:</strong> {receipt.seats.join(', ')}</p>
                        <p><strong>Number of Seats:</strong> {receipt.seats.length}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Payment Information</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Amount:</strong> ₹{receipt.amount}</p>
                        <p><strong>Payment Method:</strong> {receipt.paymentMethod}</p>
                        <p><strong>Transaction ID:</strong> {receipt.transactionId.slice(0, 16)}...</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Booking Date</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(receipt.date).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Link
                      href={`/booking-confirmation/${receipt.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center whitespace-nowrap"
                    >
                      <i className="ri-eye-line mr-2"></i>
                      View Details
                    </Link>
                    <button
                      onClick={() => window.print()}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
                    >
                      <i className="ri-printer-line mr-2"></i>
                      Print Ticket
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
