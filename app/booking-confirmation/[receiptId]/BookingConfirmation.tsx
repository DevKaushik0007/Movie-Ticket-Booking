
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Button from '@/components/ui/Button';
import { bookingService, Receipt } from '@/lib/booking';
import { authService } from '@/lib/auth';

interface BookingConfirmationProps {
  receiptId: string;
}

export default function BookingConfirmation({ receiptId }: BookingConfirmationProps) {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    setTimeout(() => {
      const receipts = bookingService.getUserReceipts(user.id);
      const foundReceipt = receipts.find(r => r.id === receiptId);
      setReceipt(foundReceipt || null);
      setLoading(false);
    }, 500);
  }, [receiptId, router]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!receipt) return;
    
    const receiptData = {
      id: receipt.id,
      showTitle: receipt.showTitle,
      showtime: receipt.showtime,
      seats: receipt.seats,
      amount: receipt.amount,
      transactionId: receipt.transactionId,
      date: receipt.date
    };
    
    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ticket-${receipt.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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

  if (!receipt) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Receipt Not Found</h1>
            <p className="text-gray-600 mb-8">The booking confirmation you're looking for doesn't exist.</p>
            <Link href="/bookings" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
              View My Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-green-600 text-white p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-check-line text-3xl"></i>
            </div>
            <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-green-100">Your tickets have been successfully booked</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium">{receipt.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Movie:</span>
                    <span className="font-medium">{receipt.showTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Show Time:</span>
                    <span className="font-medium">{receipt.showtime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats:</span>
                    <span className="font-medium">{receipt.seats.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Seats:</span>
                    <span className="font-medium">{receipt.seats.length}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium text-sm">{receipt.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{receipt.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium text-lg text-green-600">₹{receipt.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Date:</span>
                    <span className="font-medium">{new Date(receipt.date).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="ri-information-line text-blue-400 text-xl"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Important:</strong> Please arrive at the cinema at least 15 minutes before show time. 
                    You can show this confirmation or present your booking ID at the counter.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handlePrint} variant="outline">
                <i className="ri-printer-line mr-2"></i>
                Print Receipt
              </Button>
              
              <Button onClick={handleDownload} variant="outline">
                <i className="ri-download-line mr-2"></i>
                Download Receipt
              </Button>
              
              <Link href="/bookings" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center whitespace-nowrap">
                <i className="ri-list-check mr-2"></i>
                View All Bookings
              </Link>
              
              <Link href="/shows" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-center whitespace-nowrap">
                <i className="ri-ticket-line mr-2"></i>
                Book More Tickets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
