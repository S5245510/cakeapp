# 🍰 Healthy Cakes Deployment Guide

Complete deployment guide for the Healthy Cakes online shop platform.

## 📋 Prerequisites

- Node.js 18.x or later
- Git account
- Vercel account (free tier available)
- Supabase account (free tier available)
- Stripe account (for payments)
- Anthropic API key (for AI features)

## 🚀 Quick Deployment (5 minutes)

### 1. Fork & Clone Repository

```bash
git clone <your-forked-repo>
cd Jazila-bazar-main
npm install --legacy-peer-deps
```

### 2. Set Up Supabase Database

1. Visit [supabase.com](https://supabase.com) and create a new project
2. Go to Settings → Database and copy your connection string
3. In the SQL Editor, run the contents of `supabase/schema.sql`
4. Optionally run `supabase/seed.sql` for sample data

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your environment variables:

```env
# Application
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production

# Database (from Supabase)
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
DIRECT_URL=postgresql://postgres:[password]@[host]:5432/postgres

# Authentication
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=https://your-app.vercel.app

# Stripe (from stripe.com)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Integration (from anthropic.com)
ANTHROPIC_API_KEY=sk-ant-...

# Optional features
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...
```

### 4. Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

Or use the Vercel dashboard:
1. Connect your GitHub repository
2. Import the project
3. Add environment variables in Vercel dashboard
4. Deploy

## 🔧 Detailed Setup Guide

### Supabase Setup

#### 1. Create Project
- Go to [supabase.com](https://supabase.com)
- Click "New Project"
- Choose organization and region
- Set database password

#### 2. Database Configuration
```sql
-- Run these commands in Supabase SQL Editor
-- 1. Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Run the complete schema
-- Copy and paste contents from supabase/schema.sql

-- 3. Add sample data (optional)
-- Copy and paste contents from supabase/seed.sql
```

#### 3. Get Connection Strings
- Go to Settings → Database
- Copy "Connection string" and "Direct connection"
- Use these for `DATABASE_URL` and `DIRECT_URL`

### Stripe Setup

#### 1. Create Account
- Sign up at [stripe.com](https://stripe.com)
- Complete account verification for live payments

#### 2. Get API Keys
- Dashboard → Developers → API keys
- Copy Publishable key → `STRIPE_PUBLIC_KEY`
- Copy Secret key → `STRIPE_SECRET_KEY`

#### 3. Configure Webhooks
- Dashboard → Developers → Webhooks
- Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
- Select events: `checkout.session.completed`, `payment_intent.succeeded`
- Copy signing secret → `STRIPE_WEBHOOK_SECRET`

### Anthropic API Setup

#### 1. Get API Key
- Visit [console.anthropic.com](https://console.anthropic.com)
- Create account and get API key
- Copy to `ANTHROPIC_API_KEY`

#### 2. AI Features Enabled
The following AI features will work with your API key:
- Cake design suggestions
- Product description generation
- Customer service chatbot

### File Upload Setup (Optional)

#### 1. UploadThing Account
- Sign up at [uploadthing.com](https://uploadthing.com)
- Create new app
- Copy App ID and Secret

#### 2. Configuration
```env
UPLOADTHING_SECRET=sk_live_your_secret
UPLOADTHING_APP_ID=your_app_id
```

### Vercel Deployment

#### 1. Method 1: CLI Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Add environment variables
vercel env add STRIPE_SECRET_KEY
vercel env add DATABASE_URL
# ... add all other env vars
```

#### 2. Method 2: GitHub Integration
1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import GitHub repository
4. Configure environment variables
5. Deploy

#### 3. Environment Variables in Vercel
Go to Project Settings → Environment Variables and add:

```
DATABASE_URL                = postgresql://...
DIRECT_URL                 = postgresql://...
NEXTAUTH_SECRET           = your-secret-key
NEXTAUTH_URL              = https://your-app.vercel.app
STRIPE_PUBLIC_KEY         = pk_live_...
STRIPE_SECRET_KEY         = sk_live_...
STRIPE_WEBHOOK_SECRET     = whsec_...
ANTHROPIC_API_KEY         = sk-ant-...
NEXT_PUBLIC_APP_URL       = https://your-app.vercel.app
```

## 🛠️ Post-Deployment Configuration

### 1. Admin Access Setup

1. Visit `https://your-app.vercel.app/admin`
2. Create admin account with email from `ADMIN_EMAIL` env var
3. Configure site settings through admin panel

### 2. Content Management

Access the admin panel to:
- Add/edit products
- Manage categories
- Update site content
- Configure delivery areas
- Set business hours

### 3. Payment Testing

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### 4. Domain Configuration

1. Add custom domain in Vercel dashboard
2. Update environment variables with new domain
3. Update Stripe webhook URLs

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Homepage loads correctly
- [ ] Product catalog displays
- [ ] Shopping cart functionality
- [ ] Checkout process works
- [ ] Payment processing (test mode)
- [ ] Admin panel accessible
- [ ] 3D cake designer loads
- [ ] Language switching works
- [ ] Mobile responsiveness
- [ ] Database connections
- [ ] API endpoints respond

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# If you get dependency conflicts
npm install --legacy-peer-deps

# If TypeScript errors
npm run type-check
```

#### Database Connection Issues
- Verify connection strings are correct
- Check Supabase project is active
- Ensure database schema is applied

#### Payment Issues
- Verify Stripe keys are correct
- Check webhook endpoint is reachable
- Ensure webhook signing secret matches

#### 3D Designer Not Loading
- Check browser console for Three.js errors
- Verify WebGL support in browser
- Check if JavaScript is enabled

### Performance Optimization

#### Image Optimization
- Use Next.js Image component
- Enable automatic image optimization
- Configure image domains in `next.config.js`

#### Database Optimization
- Add indexes for frequently queried fields
- Use connection pooling
- Monitor query performance

#### CDN Configuration
- Vercel provides automatic CDN
- Configure caching headers
- Optimize static assets

## 📊 Monitoring & Analytics

### Error Tracking
- Enable Vercel Analytics
- Set up error boundary reporting
- Monitor API response times

### Business Metrics
- Track conversion rates
- Monitor cart abandonment
- Analyze popular products

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use Vercel's environment variable system
- Rotate secrets regularly

### Payment Security
- Use Stripe's secure checkout
- Implement proper webhook validation
- Never store payment details locally

### Database Security
- Use Row Level Security (RLS) in Supabase
- Implement proper authentication
- Validate all inputs

## 🔄 Updates & Maintenance

### Deploying Updates
```bash
# Method 1: Automatic (GitHub integration)
git push origin main

# Method 2: Manual
vercel --prod
```

### Database Migrations
```bash
# Generate new migration
npx supabase migration new add_new_feature

# Apply migration
npx supabase db push
```

### Dependency Updates
```bash
# Check outdated packages
npm outdated

# Update dependencies
npm update

# Test before deploying
npm run build
```

## 📞 Support

### Getting Help
- Check Vercel documentation
- Supabase documentation
- Stripe documentation
- Create GitHub issues for bugs

### Professional Support
For custom development or enterprise features:
- Custom integrations
- Performance optimization
- Advanced AI features
- White-label solutions

---

## 🎉 You're Live!

Congratulations! Your healthy cake shop is now live and ready to serve customers worldwide.

Your platform includes:
- ✅ Complete e-commerce functionality
- ✅ Multilingual support (English/Chinese)
- ✅ 3D cake customization
- ✅ AI-powered suggestions
- ✅ Mobile-responsive design
- ✅ Secure payment processing
- ✅ Admin content management
- ✅ Performance optimized

Start customizing your content and adding your delicious cake products! 🍰