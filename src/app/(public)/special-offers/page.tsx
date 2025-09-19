'use client';

import { useState, useEffect } from 'react';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Gift,
  Clock,
  Star,
  Users,
  Zap,
  ShoppingCart,
  Percent,
  Timer,
  Fire,
  TrendingUp
} from 'lucide-react';

interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  originalPrice?: number;
  finalPrice?: number;
  validUntil: Date;
  claimed: number;
  maxClaims: number;
  code?: string;
  featured: boolean;
  urgent: boolean;
  icon: React.ReactNode;
}

const SpecialOffer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const offers: SpecialOffer[] = [
    {
      id: 'flash-sale',
      title: 'Flash Sale: 50% Off All 3D Custom Cakes',
      description: 'Limited time offer on our signature 3D customizable cakes. Perfect for special occasions!',
      discount: 50,
      discountType: 'percentage',
      originalPrice: 89.99,
      finalPrice: 44.99,
      validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      claimed: 847,
      maxClaims: 1000,
      code: 'FLASH50',
      featured: true,
      urgent: true,
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 'first-order',
      title: 'Welcome Bonus: $20 Off First Order',
      description: 'New to healthy baking? Get a sweet welcome discount on your first organic cake order.',
      discount: 20,
      discountType: 'fixed',
      originalPrice: 65.99,
      finalPrice: 45.99,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      claimed: 1205,
      maxClaims: 2000,
      code: 'WELCOME20',
      featured: true,
      urgent: false,
      icon: <Gift className="w-6 h-6" />
    },
    {
      id: 'bulk-order',
      title: 'Event Special: 30% Off Orders Over $200',
      description: 'Planning a big celebration? Save big on bulk orders for weddings, parties, and corporate events.',
      discount: 30,
      discountType: 'percentage',
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      claimed: 89,
      maxClaims: 200,
      code: 'EVENT30',
      featured: false,
      urgent: false,
      icon: <Users className="w-6 h-6" />
    }
  ];

  const featuredOffers = offers.filter(offer => offer.featured);
  const urgentOffers = offers.filter(offer => offer.urgent);

  useEffect(() => {
    const timer = setInterval(() => {
      if (urgentOffers.length > 0) {
        const targetDate = urgentOffers[0].validUntil;
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;

        if (distance > 0) {
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
          });
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [urgentOffers]);

  const formatDiscount = (offer: SpecialOffer) => {
    return offer.discountType === 'percentage'
      ? `${offer.discount}% OFF`
      : `$${offer.discount} OFF`;
  };

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Gift className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Special Offers & Deals
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Sweet savings on healthy, organic cakes. Limited time offers you don't want to miss!
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {[
                { icon: <Fire className="w-5 h-5" />, label: `${urgentOffers.length} Flash Sales Active` },
                { icon: <Percent className="w-5 h-5" />, label: 'Up to 50% Off' },
                { icon: <Users className="w-5 h-5" />, label: '2,500+ Claims Today' }
              ].map((stat, index) => (
                <div key={index} className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                  {stat.icon}
                  <span className="ml-2 text-sm font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Urgent Offers Banner */}
        {urgentOffers.length > 0 && (
          <section className="bg-gradient-to-r from-yellow-400 to-red-500 text-white py-8">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <div className="flex justify-center items-center mb-4">
                  <Fire className="w-8 h-8 mr-3 animate-pulse" />
                  <h2 className="text-2xl font-bold">URGENT: Flash Sale Ending Soon!</h2>
                </div>
                <div className="flex space-x-2 justify-center text-center">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Minutes', value: timeLeft.minutes },
                    { label: 'Seconds', value: timeLeft.seconds }
                  ].map((item, index) => (
                    <div key={index} className="bg-white/20 rounded-lg p-2 min-w-[50px]">
                      <div className="text-lg font-bold">{item.value.toString().padStart(2, '0')}</div>
                      <div className="text-xs opacity-80">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Featured Offers */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Deals</h2>
              <p className="text-xl text-gray-600">Our most popular offers this week</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {featuredOffers.map((offer) => (
                <Card key={offer.id} className="relative overflow-hidden hover:shadow-xl transition-shadow border-2 border-orange-200">
                  {offer.urgent && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-sm font-bold">
                      🔥 URGENT
                    </div>
                  )}

                  <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {offer.icon}
                        <Badge className="ml-2 bg-white/20 text-white">
                          {formatDiscount(offer)}
                        </Badge>
                      </div>
                      {offer.code && (
                        <Badge variant="secondary" className="bg-white text-orange-600 font-mono">
                          {offer.code}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{offer.title}</CardTitle>
                    <p className="text-white/90">{offer.description}</p>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* Pricing */}
                    {offer.originalPrice && offer.finalPrice && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-green-600">
                            ${offer.finalPrice.toFixed(2)}
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            ${offer.originalPrice.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          You save ${(offer.originalPrice - offer.finalPrice).toFixed(2)}!
                        </p>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Claimed: {offer.claimed}/{offer.maxClaims}</span>
                        <span>{Math.round((offer.claimed / offer.maxClaims) * 100)}%</span>
                      </div>
                      <Progress
                        value={(offer.claimed / offer.maxClaims) * 100}
                        className="h-2"
                      />
                    </div>

                    {/* Timer */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <Timer className="w-4 h-4 mr-2" />
                          Expires:
                        </div>
                        <div className="text-sm font-medium">
                          {offer.validUntil.toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Claim This Offer
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* All Offers */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">All Special Offers</h2>
              <p className="text-xl text-gray-600">Don't miss out on these amazing deals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer) => (
                <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="text-orange-600 mr-2">{offer.icon}</div>
                        <Badge className="bg-orange-100 text-orange-800">
                          {formatDiscount(offer)}
                        </Badge>
                      </div>
                      {offer.code && (
                        <Badge variant="outline" className="font-mono text-xs">
                          {offer.code}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{offer.title}</CardTitle>
                    <p className="text-gray-600">{offer.description}</p>
                  </CardHeader>

                  <CardContent>
                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Claimed</span>
                        <span>{offer.claimed}/{offer.maxClaims}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${(offer.claimed / offer.maxClaims) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Expiry */}
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Clock className="w-4 h-4 mr-2" />
                      Valid until {offer.validUntil.toLocaleDateString()}
                    </div>

                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Never Miss a Deal!</h2>
            <p className="text-xl mb-8 opacity-90">
              Subscribe to our newsletter and be the first to know about new offers and flash sales.
            </p>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              <TrendingUp className="w-5 h-5 mr-2" />
              Subscribe to Newsletter
            </Button>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

export default SpecialOffer;