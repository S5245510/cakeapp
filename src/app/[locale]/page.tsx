import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="min-h-screen">
      {/* Header with Language Switcher */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">🧁 Healthy Cakes</h1>
          <LanguageSwitcher variant="full" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/products">
              {t('cta')}
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('whyChooseUs')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-2">{t('healthyIngredients')}</h3>
              <p className="text-gray-600">All our cakes are made with 100% natural ingredients, sourced from local organic farms.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">{t('customizable')}</h3>
              <p className="text-gray-600">Design your perfect cake with our 3D customization tool and AI-powered suggestions.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">👨‍🍳</div>
              <h3 className="text-xl font-semibold mb-2">{t('freshBaked')}</h3>
              <p className="text-gray-600">Every cake is freshly baked to order with love and attention to detail.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('featured')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Placeholder for featured products */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">🧁 Cake {i}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Healthy Chocolate Cake</h3>
                  <p className="text-gray-600 mb-4">Made with organic cocoa and natural sweeteners</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">$25</span>
                    <Button>Add to Cart</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Healthy Cakes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}