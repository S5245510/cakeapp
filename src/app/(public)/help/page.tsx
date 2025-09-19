'use client';

import { useState } from 'react';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  BookOpen,
  ShoppingCart,
  CreditCard,
  Truck,
  User,
  Settings,
  HelpCircle,
  Play,
  ChevronRight,
  Clock,
  Star,
  MessageCircle,
  Phone,
  Mail,
  Palette,
  Cake
} from 'lucide-react';

interface HelpTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articles: number;
  popular: boolean;
}

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const helpTopics: HelpTopic[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of using our platform',
      icon: <BookOpen className="w-6 h-6" />,
      articles: 12,
      popular: true
    },
    {
      id: 'cake-designer',
      title: '3D Cake Designer',
      description: 'Master our interactive cake customization tool',
      icon: <Palette className="w-6 h-6" />,
      articles: 18,
      popular: true
    },
    {
      id: 'ordering',
      title: 'Ordering Process',
      description: 'Step-by-step guide to placing orders',
      icon: <ShoppingCart className="w-6 h-6" />,
      articles: 15,
      popular: true
    },
    {
      id: 'payment',
      title: 'Payment & Billing',
      description: 'Payment methods and billing information',
      icon: <CreditCard className="w-6 h-6" />,
      articles: 10,
      popular: false
    },
    {
      id: 'delivery',
      title: 'Delivery & Scheduling',
      description: 'Delivery options and scheduling help',
      icon: <Truck className="w-6 h-6" />,
      articles: 14,
      popular: true
    },
    {
      id: 'account',
      title: 'Account Management',
      description: 'Manage your profile and preferences',
      icon: <User className="w-6 h-6" />,
      articles: 8,
      popular: false
    }
  ];

  const quickActions = [
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      icon: <Play className="w-5 h-5" />,
      action: 'Watch Videos'
    },
    {
      title: 'Live Chat Support',
      description: 'Get instant help from our team',
      icon: <MessageCircle className="w-5 h-5" />,
      action: 'Start Chat'
    },
    {
      title: 'Call Us',
      description: 'Speak directly with support',
      icon: <Phone className="w-5 h-5" />,
      action: 'Call Now'
    },
    {
      title: 'Email Support',
      description: 'Send us your detailed questions',
      icon: <Mail className="w-5 h-5" />,
      action: 'Send Email'
    }
  ];

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-green-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <HelpCircle className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How can we help you?
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Find answers, tutorials, and get support for your healthy cake journey
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white border-0 rounded-full shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Need Immediate Help?</h2>
              <p className="text-gray-600">Choose the best way to get support</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                        {action.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                    <Button variant="outline" size="sm">
                      {action.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Help Topics */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Browse by Topic</h2>
              <p className="text-gray-600">Find answers organized by category</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpTopics.map((topic) => (
                <Card key={topic.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-gradient-to-br from-orange-100 to-green-100 p-3 rounded-lg text-orange-600 group-hover:scale-110 transition-transform">
                        {topic.icon}
                      </div>
                      {topic.popular && (
                        <Badge className="bg-green-500 text-white">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{topic.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{topic.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{topic.articles} articles</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-green-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-lg mb-6 opacity-90">
              Our support team is here to help you with any questions about healthy cake ordering and customization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Support
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Phone className="w-5 h-5 mr-2" />
                Schedule a Call
              </Button>
            </div>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

export default HelpPage;
