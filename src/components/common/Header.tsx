'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useCartStore } from '@/stores/cartStore';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Menu,
  ShoppingCart,
  User,
  Search,
  Heart,
  Package,
  Palette
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const navigation = [
  {
    name: 'Home',
    href: '/',
    key: 'home'
  },
  {
    name: 'Products',
    href: '/products',
    key: 'products',
    submenu: [
      { name: 'All Cakes', href: '/products' },
      { name: 'Birthday Cakes', href: '/products?category=birthday' },
      { name: 'Wedding Cakes', href: '/products?category=wedding' },
      { name: 'Cupcakes', href: '/products?category=cupcakes' },
      { name: 'Custom Orders', href: '/custom-cake' },
    ]
  },
  {
    name: 'Custom Cake',
    href: '/custom-cake',
    key: 'customCake'
  },
  {
    name: 'About',
    href: '/about',
    key: 'about'
  },
  {
    name: 'Contact',
    href: '/contact',
    key: 'contact'
  }
];

export function Header() {
  const t = useTranslations('nav');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalItems, toggleCart } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🧁</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">
              Healthy Cakes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem key={item.key}>
                  {item.submenu ? (
                    <>
                      <NavigationMenuTrigger className="bg-transparent">
                        {t(item.key)}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {item.submenu.map((subitem) => (
                            <li key={subitem.name}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={subitem.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {subitem.name}
                                  </div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        {t(item.key)}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Wishlist</span>
            </Button>

            {/* Account */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <User className="h-4 w-4" />
              <span className="sr-only">{t('account')}</span>
            </Button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Cart */}
            <CartDrawer>
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {totalItems}
                  </Badge>
                )}
                <span className="sr-only">{t('cart')}</span>
              </Button>
            </CartDrawer>

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Navigation Links */}
                  {navigation.map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Link
                        href={item.href}
                        className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t(item.key)}
                      </Link>
                      {item.submenu && (
                        <div className="pl-4 space-y-1">
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.name}
                              href={subitem.href}
                              className="block px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subitem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Wishlist
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Package className="h-4 w-4 mr-2" />
                      Orders
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <Button asChild className="w-full">
                      <Link href="/custom-cake" onClick={() => setMobileMenuOpen(false)}>
                        <Palette className="h-4 w-4 mr-2" />
                        Design Custom Cake
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}