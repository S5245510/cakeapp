'use client';

import { useState } from 'react';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Eye,
  Lock,
  UserCheck,
  Globe,
  Mail,
  Calendar,
  CheckCircle,
  Download
} from 'lucide-react';

const PrivacyPage = () => {
  const lastUpdated = "January 15, 2024";

  const privacySections = [
    {
      title: 'Information We Collect',
      icon: <Eye className="w-5 h-5" />,
      content: 'We collect information you provide directly, including name, email, delivery address, and payment information when you create an account or place an order.'
    },
    {
      title: 'How We Use Your Information',
      icon: <UserCheck className="w-5 h-5" />,
      content: 'We use your information to process orders, provide customer support, improve our services, and send you important updates about your orders.'
    },
    {
      title: 'Data Security',
      icon: <Lock className="w-5 h-5" />,
      content: 'All sensitive data is encrypted using industry-standard methods. We use Stripe for secure payment processing and never store complete credit card information.'
    },
    {
      title: 'Your Privacy Rights',
      icon: <Shield className="w-5 h-5" />,
      content: 'You can access, correct, or delete your personal information anytime. You can also opt-out of marketing communications and request data portability.'
    }
  ];

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Shield className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Your privacy is our priority. Learn how we protect and handle your information.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="text-sm">Last Updated: {lastUpdated}</span>
              </div>
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">GDPR Compliant</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Summary */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Privacy at a Glance</h2>
                <p className="text-gray-600">Key points about how we handle your information</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: <Lock className="w-6 h-6" />,
                    title: 'Secure by Design',
                    description: 'Industry-standard encryption and security measures'
                  },
                  {
                    icon: <Eye className="w-6 h-6" />,
                    title: 'Full Transparency',
                    description: 'Clear information about data collection and use'
                  },
                  {
                    icon: <UserCheck className="w-6 h-6" />,
                    title: 'Your Control',
                    description: 'Access, correct, or delete your information anytime'
                  },
                  {
                    icon: <CheckCircle className="w-6 h-6" />,
                    title: 'Legal Compliance',
                    description: 'GDPR, CCPA, and other privacy laws compliance'
                  }
                ].map((item, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="p-6">
                      <div className="flex justify-center mb-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                          {item.icon}
                        </div>
                      </div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Policy Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {privacySections.map((section, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <div className="mr-3 text-blue-600">
                          {section.icon}
                        </div>
                        <span>{index + 1}. {section.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {section.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Contact Information */}
              <Card className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h2>
                  <p className="text-lg mb-6 opacity-90">
                    We're here to help you understand how your information is protected.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      <Mail className="w-5 h-5 mr-2" />
                      Contact Privacy Team
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      <Download className="w-5 h-5 mr-2" />
                      Download Policy PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

export default PrivacyPage;