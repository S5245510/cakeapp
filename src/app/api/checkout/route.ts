import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerInfo, totals } = body;

    // Create customer in Stripe
    const customer = await stripe.customers.create({
      email: customerInfo.email,
      name: `${customerInfo.firstName} ${customerInfo.lastName}`,
      phone: customerInfo.phone,
      address: {
        line1: customerInfo.address,
        city: customerInfo.city,
        postal_code: customerInfo.postalCode,
        country: customerInfo.country,
      },
      metadata: {
        deliveryDate: customerInfo.deliveryDate,
        deliveryTime: customerInfo.deliveryTime,
        specialInstructions: customerInfo.specialInstructions || '',
      },
    });

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          description: `Healthy homemade cake - ${item.name}`,
          metadata: {
            product_id: item.id,
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if applicable
    if (totals.shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Delivery charges',
          },
          unit_amount: Math.round(totals.shipping * 100),
        },
        quantity: 1,
      });
    }

    // Add tax as a line item
    if (totals.tax > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
            description: 'Sales tax',
          },
          unit_amount: Math.round(totals.tax * 100),
        },
        quantity: 1,
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout?cancelled=true`,
      metadata: {
        customerEmail: customerInfo.email,
        deliveryDate: customerInfo.deliveryDate,
        deliveryTime: customerInfo.deliveryTime,
        totalAmount: totals.total.toString(),
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'CN', 'AU', 'GB'],
      },
      phone_number_collection: {
        enabled: true,
      },
      custom_fields: [
        {
          key: 'delivery_instructions',
          label: {
            type: 'custom',
            custom: 'Special delivery instructions',
          },
          type: 'text',
          optional: true,
        },
      ],
      invoice_creation: {
        enabled: true,
      },
      payment_intent_data: {
        description: `Healthy Cake Order - ${items.length} item(s)`,
        metadata: {
          order_type: 'cake_order',
          item_count: items.length.toString(),
          delivery_date: customerInfo.deliveryDate,
        },
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}