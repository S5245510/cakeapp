'use client';

import { useCartStore } from '@/stores/cartStore';
import { useTranslations } from 'next-intl';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface CartDrawerProps {
  children?: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const t = useTranslations('cart');
  const locale = useLocale() as 'en' | 'zh';
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="relative">
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {totalItems}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {t('title')} ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-auto py-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('empty')}
                </h3>
                <p className="text-gray-500 mb-6">
                  Add some delicious cakes to get started!
                </p>
                <Button asChild onClick={closeCart}>
                  <Link href="/products">
                    {t('continueShopping')}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <img
                      src={item.image || '/api/placeholder/80/80'}
                      alt={item.name[locale]}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight">
                        {item.name[locale]}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.category}
                      </p>

                      {/* Dietary Info */}
                      {item.dietaryInfo && item.dietaryInfo.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.dietaryInfo.slice(0, 2).map((info) => (
                            <Badge key={info} variant="secondary" className="text-xs">
                              {info}
                            </Badge>
                          ))}
                          {item.dietaryInfo.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.dietaryInfo.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Customization Info */}
                      {item.customization && (
                        <div className="mt-2 text-xs text-gray-600">
                          {item.customization.size && (
                            <div>Size: {item.customization.size}</div>
                          )}
                          {item.customization.flavor && (
                            <div>Flavor: {item.customization.flavor}</div>
                          )}
                          {item.customization.deliveryDate && (
                            <div>Delivery: {item.customization.deliveryDate}</div>
                          )}
                        </div>
                      )}

                      {/* Price and Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('subtotal')}</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>{t('total')}</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full" onClick={closeCart}>
                  <Link href="/checkout">
                    {t('checkout')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full" onClick={closeCart}>
                  <Link href="/products">
                    {t('continueShopping')}
                  </Link>
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Free delivery on orders over $50
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}