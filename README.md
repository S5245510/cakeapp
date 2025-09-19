# 🍰 Healthy Cakes - Premium Online Cake Shop

A modern, multilingual e-commerce platform for healthy, organic cake sales with advanced 3D customization and AI-powered features.

## ✨ Features

### 🛒 E-commerce Core
- **Complete Shopping Experience**: Product catalog, cart, checkout, and order management
- **Stripe Integration**: Secure payment processing with multiple payment methods
- **Inventory Management**: Real-time stock tracking and automated notifications
- **Order Scheduling**: Advanced delivery date and time selection

### 🌍 Multilingual Support
- **English & Chinese**: Complete translation coverage
- **RTL Support**: Right-to-left language compatibility
- **Dynamic Switching**: Seamless language switching without page reload
- **SEO Optimized**: Multi-language SEO with proper hreflang tags

### 🎨 3D Cake Designer
- **Interactive 3D Preview**: Real-time cake visualization using Three.js
- **Drag & Drop Customization**: Intuitive layer and decoration placement
- **AI Suggestions**: Smart recommendations based on preferences
- **Custom Sizing**: Multiple size options with automatic pricing

### 🤖 AI-Powered Features
- **Smart Suggestions**: Anthropic Claude integration for personalized recommendations
- **Content Generation**: Automatic product descriptions and SEO content
- **Design Assistance**: AI-powered cake design suggestions
- **Customer Support**: Intelligent chatbot for customer inquiries

### 📱 Performance & UX
- **Mobile-First Design**: Fully responsive across all devices
- **Lazy Loading**: Optimized loading with intersection observers
- **Error Boundaries**: Graceful error handling with recovery options
- **Progressive Enhancement**: Works without JavaScript

### 🔧 Content Management
- **User-Friendly CMS**: Non-technical user interface for content updates
- **WYSIWYG Editor**: Rich text editing with TipTap integration
- **Media Management**: Drag-and-drop image handling with optimization
- **Multi-language Content**: Separate content management for each language

### 🍃 Health-Focused Features
- **Ingredient Tracking**: Detailed ingredient lists with allergen information
- **Nutritional Data**: Calorie and nutritional information display
- **Dietary Filters**: Vegan, gluten-free, sugar-free options
- **Organic Certification**: Organic ingredient highlighting

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or later
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Jazila-bazar-main

# Install dependencies (use legacy-peer-deps for compatibility)
npm install --legacy-peer-deps

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Setup
Configure your `.env.local` file with:

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database (Supabase)
DATABASE_URL=postgresql://username:password@db.supabase.co:5432/postgres
DIRECT_URL=postgresql://username:password@db.supabase.co:5432/postgres

# Stripe Payment
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Integration
ANTHROPIC_API_KEY=sk-ant-...

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 🏗️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Radix UI**: Accessible component primitives

### 3D & Interactive
- **Three.js**: 3D graphics and rendering
- **React Three Fiber**: React integration for Three.js
- **React Three Drei**: Useful Three.js helpers
- **React DnD**: Drag and drop functionality

### State Management
- **Zustand**: Lightweight state management
- **React Query**: Server state management
- **React Hook Form**: Form state and validation

### Backend & Database
- **Supabase**: PostgreSQL database and backend services
- **Stripe**: Payment processing
- **Anthropic Claude**: AI integration
- **Next.js API Routes**: Serverless API endpoints

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── page.tsx       # Homepage
│   │   ├── products/      # Product catalog
│   │   ├── custom-cake/   # 3D cake designer
│   │   ├── checkout/      # Checkout process
│   │   └── admin/         # Admin panel
│   └── api/               # API routes
│       ├── checkout/      # Stripe integration
│       ├── ai/           # AI features
│       └── admin/        # Admin APIs
├── components/
│   ├── ui/               # Reusable UI components
│   ├── common/           # Shared components
│   ├── cart/             # Shopping cart
│   ├── cake-designer/    # 3D designer components
│   ├── admin/            # Admin interface
│   └── layout/           # Layout components
├── stores/               # Zustand stores
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript definitions
└── i18n/                 # Internationalization
    └── messages/         # Translation files
```

## 🎯 Key Features

### 🛍️ Shopping Experience
- **Smart Product Catalog**: Advanced filtering and search
- **Wishlist Functionality**: Save products for later
- **Guest Checkout**: Purchase without account creation
- **Order Tracking**: Real-time order status updates

### 🎨 Cake Customization
- **Layer Customization**: Multiple layers with different flavors
- **Decoration Tools**: Drag-and-drop decorative elements
- **Color Picker**: Custom color selection for decorations
- **Text Addition**: Custom messages and typography
- **Size Options**: Multiple cake sizes with dynamic pricing

### 📊 Admin Features
- **Dashboard Analytics**: Sales and performance metrics
- **Product Management**: Easy product creation and editing
- **Order Management**: Process and track orders
- **Customer Management**: Customer database and communication
- **Content Management**: Update site content without coding

### 🔒 Security & Performance
- **Payment Security**: PCI DSS compliant payment processing
- **Data Protection**: GDPR compliant data handling
- **Performance Monitoring**: Real-time performance tracking
- **Error Tracking**: Comprehensive error logging
- **SEO Optimization**: Search engine friendly structure

## 🌐 Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deploy
1. **Database**: Set up Supabase project and run schema
2. **Payment**: Configure Stripe account and webhooks
3. **Hosting**: Deploy to Vercel with environment variables
4. **Content**: Access admin panel to configure site

### Supported Platforms
- **Vercel** (Recommended): Seamless Next.js deployment
- **Netlify**: Static site generation support
- **AWS**: Full-stack deployment with Amplify
- **Docker**: Container-based deployment

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint configuration
- Prettier formatting
- Conventional commits

## 📖 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Complete deployment instructions
- [API Documentation](docs/API.md) - Backend API reference
- [Component Library](docs/COMPONENTS.md) - UI component documentation
- [Translation Guide](docs/TRANSLATIONS.md) - Adding new languages

## 🆘 Support

### Community Support
- [GitHub Issues](https://github.com/your-repo/issues) - Bug reports and feature requests
- [Discussions](https://github.com/your-repo/discussions) - Community Q&A

### Commercial Support
For enterprise features and custom development:
- Custom integrations
- Advanced AI features
- White-label solutions
- Performance optimization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: Amazing React framework
- **Vercel**: Excellent hosting platform
- **Supabase**: Modern backend services
- **Stripe**: Reliable payment processing
- **Anthropic**: Advanced AI capabilities
- **Three.js**: Powerful 3D graphics library
- **Original Jazila Bazar**: Foundation platform by SM Tanimur Rahman

---

## 🎉 Ready to Launch Your Cake Business?

This platform provides everything you need to start selling healthy, organic cakes online:

- ✅ Professional e-commerce platform
- ✅ Advanced 3D customization
- ✅ AI-powered features
- ✅ Multi-language support
- ✅ Mobile-optimized design
- ✅ Secure payment processing

**[Start your deployment now →](DEPLOYMENT.md)**

---

Made with ❤️ for healthy cake lovers worldwide 🍰




