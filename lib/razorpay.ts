
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

export class RazorpayService {
  private static razorpayKey = 'rzp_test_1234567890';

  static loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  static async createOrder(amount: number): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
      }, 500);
    });
  }

  static async initiatePayment(
    amount: number,
    userDetails: { name: string; email: string; contact: string },
    onSuccess: (response: any) => void,
    onError: (error: any) => void
  ): Promise<void> {
    try {
      const scriptLoaded = await this.loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay script failed to load');
      }

      const orderId = await this.createOrder(amount);

      const options: RazorpayOptions = {
        key: this.razorpayKey,
        amount: amount * 100,
        currency: 'INR',
        name: 'TicketBooking',
        description: 'Movie Ticket Booking',
        order_id: orderId,
        handler: (response: any) => {
          onSuccess({
            ...response,
            amount: amount
          });
        },
        prefill: userDetails,
        theme: {
          color: '#3B82F6'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', onError);
      rzp.open();
    } catch (error) {
      onError(error);
    }
  }

  static simulatePayment(
    amount: number,
    userDetails: { name: string; email: string; contact: string },
    onSuccess: (response: any) => void,
    onError: (error: any) => void
  ): void {
    setTimeout(() => {
      const mockResponse = {
        razorpay_payment_id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        razorpay_order_id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        razorpay_signature: `signature_${Math.random().toString(36).substr(2, 20)}`,
        amount: amount
      };
      onSuccess(mockResponse);
    }, 2000);
  }
}
