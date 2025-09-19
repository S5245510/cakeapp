'use client';

import { useState } from 'react';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Gift,
  Calendar,
  Star,
  Users,
  Zap,
  CheckCircle,
  Heart,
  Sparkles,
  Bell
} from 'lucide-react';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const benefits = [
    {
      title: 'Early Access to New Designs',
      description: 'Be the first to try our latest cake designs and seasonal offerings',
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: 'Exclusive Discounts',
      description: 'Subscriber-only promotions and special pricing on custom orders',
      icon: <Gift className="w-6 h-6" />
    },
    {
      title: 'Healthy Baking Tips',
      description: 'Expert advice on organic ingredients and healthy baking techniques',
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: 'Design Inspiration',
      description: 'Weekly 3D design showcases and creative cake ideas',
      icon: <Sparkles className="w-6 h-6" />
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubscribed(true);
    setIsLoading(false);
  };

  if (isSubscribed) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center">
          <Card className="max-w-lg mx-4 text-center">
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Our Newsletter!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for subscribing! You'll receive your first newsletter within the next 24 hours.
              </p>
              <Button
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-orange-500 to-green-500 text-white"
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-green-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Mail className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Stay Sweet & Healthy
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Join 25,000+ cake lovers getting exclusive recipes, designs, and healthy baking tips
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {[
                { icon: <Users className="w-5 h-5" />, label: '25,000+ Subscribers' },
                { icon: <Star className="w-5 h-5" />, label: '4.9/5 Rating' },
                { icon: <Gift className="w-5 h-5" />, label: '50+ Exclusive Offers' }
              ].map((stat, index) => (
                <div key={index} className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                  {stat.icon}
                  <span className="ml-2 text-sm font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">What You'll Get</h2>
              <p className="text-xl text-gray-600">Exclusive content delivered straight to your inbox</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                        {benefit.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Subscription Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">Join Our Community</CardTitle>
                  <p className="text-gray-600">Get exclusive access to healthy cake recipes and tips</p>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Checkbox required className="mt-1" />
                        <Label className="text-sm">
                          I agree to receive newsletters and promotional emails. I can unsubscribe at any time.
                        </Label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Subscribing...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 mr-2" />
                          Subscribe to Newsletter
                        </div>
                      )}
                    </Button>

                    <p className="text-sm text-gray-500 text-center">
                      Join 25,000+ happy subscribers • Free to unsubscribe anytime
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">What Our Subscribers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah Chen',
                  comment: 'The weekly recipes have transformed my baking! Love the healthy alternatives.'
                },
                {
                  name: 'Mike Johnson',
                  comment: 'My kids love the organic cakes, and I love the peace of mind about ingredients.'
                },
                {
                  name: 'Lisa Wang',
                  comment: 'The 3D design tips helped me create amazing custom cakes for clients.'
                }
              ].map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-4">"{testimonial.comment}"</p>
                    <p className="font-semibold">{testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

export default NewsLetter;