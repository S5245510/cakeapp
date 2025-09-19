'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  Package,
  Clock,
  Mail,
  Phone,
  Home,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface OrderDetails {
  id: string;
  customerEmail: string;
  deliveryDate: string;
  deliveryTime: string;
  totalAmount: string;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function CheckoutSuccessPage() {
  const t = useTranslations('checkout');
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Fetch order details from Stripe session
      fetchOrderDetails(sessionId);
      // Clear the cart
      clearCart();
    }
  }, [sessionId, clearCart]);

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/checkout/session?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your order. We'll start preparing your delicious healthy cakes right away!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderDetails ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-medium">#{orderDetails.id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium">${orderDetails.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {orderDetails.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{orderDetails.customerEmail}</span>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-medium">#12345678</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Confirmed
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderDetails ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Date:</span>
                    <span className="font-medium">{orderDetails.deliveryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Window:</span>
                    <span className="font-medium">{orderDetails.deliveryTime}</span>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <span className="font-medium">24-48 hours</span>
                  </div>
                </div>
              )}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  You'll receive a confirmation email with tracking information once your order is prepared.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What's Next */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">Order Confirmation</h3>
                <p className="text-sm text-gray-600">
                  You'll receive a detailed confirmation email within a few minutes.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-3">
                  <Package className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-medium mb-2">Preparation Starts</h3>
                <p className="text-sm text-gray-600">
                  Our bakers will start preparing your fresh, healthy cakes using natural ingredients.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <Home className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium mb-2">Fresh Delivery</h3>
                <p className="text-sm text-gray-600">
                  Your cakes will be delivered fresh to your door at the scheduled time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link href="/account/orders">
              <Package className="h-4 w-4" />
              View Order History
            </Link>
          </Button>
          <Button asChild className="flex items-center gap-2">
            <Link href="/products">
              <Home className="h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Support Information */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@healthycakes.com"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Mail className="h-4 w-4" />
              support@healthycakes.com
            </a>
            <a
              href="tel:+1234567890"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Phone className="h-4 w-4" />
              (123) 456-7890
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Our customer support team is available Monday-Friday, 9 AM - 6 PM EST
          </p>
        </div>
      </div>
    </div>
  );
}