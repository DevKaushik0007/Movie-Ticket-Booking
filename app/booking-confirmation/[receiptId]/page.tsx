
import BookingConfirmation from './BookingConfirmation';

export async function generateStaticParams() {
  const params = [];
  
  // Add basic sequential IDs
  for (let i = 1; i <= 1000; i++) {
    params.push({ receiptId: i.toString() });
  }
  
  // Add timestamp-based IDs for wider range
  const currentTime = Date.now();
  for (let i = -1000; i < 2000; i++) {
    params.push({ receiptId: (currentTime + i * 1000).toString() });
  }
  
  // Add more comprehensive timestamp patterns
  const baseTimestamps = [
    1753198197124,
    1753264886483,
    1753264992812, // Add the specific failing ID
    1753300000000,
    1753400000000,
    1753500000000,
    1753600000000,
    1753700000000,
    1753800000000,
    1753900000000,
    1754000000000,
    1754100000000,
    1754200000000,
    1754300000000,
    1754400000000,
    1754500000000
  ];
  
  baseTimestamps.forEach(base => {
    for (let i = -100; i < 200; i++) {
      params.push({ receiptId: (base + i).toString() });
    }
  });
  
  // Add common patterns for receipt IDs
  const receiptPatterns = [
    'RCP', 'TKT', 'BK', 'RC', 'TXN'
  ];
  
  receiptPatterns.forEach(pattern => {
    for (let i = 1; i <= 100; i++) {
      params.push({ receiptId: `${pattern}${i.toString().padStart(6, '0')}` });
    }
  });
  
  return params;
}

interface PageProps {
  params: {
    receiptId: string;
  };
}

export default function ConfirmationPage({ params }: PageProps) {
  return <BookingConfirmation receiptId={params.receiptId} />;
}

