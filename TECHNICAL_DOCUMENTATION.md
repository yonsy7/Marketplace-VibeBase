# VibeBase Marketplace - Technical Documentation

## Table of Contents
1. [Application Overview](#application-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Features](#features)
5. [Backend Architecture](#backend-architecture)
6. [Frontend Architecture](#frontend-architecture)
7. [Database Schema](#database-schema)
8. [Authentication & Authorization](#authentication--authorization)
9. [Payment Processing](#payment-processing)
10. [API Routes](#api-routes)
11. [File Upload System](#file-upload-system)
12. [Email System](#email-system)
13. [Deployment](#deployment)
14. [Environment Variables](#environment-variables)
15. [Development Setup](#development-setup)

---

## Application Overview

**VibeBase Marketplace** (also known as MarshalUI) is a modern digital marketplace platform built with Next.js 14, designed for buying and selling digital assets such as Tailwind CSS templates, UI kits, and icon sets. The platform provides a complete e-commerce solution with integrated payment processing through Stripe Connect, enabling sellers to receive payments directly to their connected Stripe accounts.

### Purpose
The marketplace serves as a premier platform for:
- **Sellers**: To monetize their digital design assets (templates, UI kits, icons)
- **Buyers**: To discover and purchase high-quality Tailwind CSS resources

### Key Characteristics
- **Multi-vendor marketplace** with Stripe Connect integration
- **Server-side rendered** for optimal SEO and performance
- **Real-time payment processing** with automated product delivery
- **Secure authentication** with multiple login options
- **Type-safe** end-to-end TypeScript implementation

---

## Technology Stack

### Core Framework
- **Next.js 14.2.3** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5** - Type-safe development

### Backend & Database
- **Prisma 5.13.0** - Type-safe ORM
- **PostgreSQL** - Database (via Supabase)
- **Supabase** - Database hosting and management

### Authentication
- **Kinde Auth 2.2.5** - Authentication provider
  - Multi-Factor Authentication (MFA)
  - Passwordless authentication
  - OAuth (Google & GitHub)

### Payment Processing
- **Stripe 15.6.0** - Payment gateway
- **Stripe Connect** - Marketplace payments
- **Stripe Webhooks** - Event handling

### UI & Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Shadcn/UI** - Component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **Next Themes** - Dark mode support

### Form & Rich Text
- **TipTap 2.3.2** - Rich text editor
- **Zod 3.23.8** - Schema validation
- **React DOM** - Form actions

### File Management
- **UploadThing 6.10.3** - File upload service
- **@uploadthing/react 6.5.3** - React components

### Email
- **Resend 3.2.0** - Email delivery
- **React Email 0.0.17** - Email templates

### UI Components & Utilities
- **class-variance-authority** - Component variants
- **clsx** - Conditional classes
- **tailwind-merge** - Tailwind class merging
- **embla-carousel-react** - Carousel component
- **Sonner** - Toast notifications

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **@tailwindcss/typography** - Prose styling
- **@tailwindcss/aspect-ratio** - Aspect ratio utilities

---

## Architecture Overview

### Application Architecture Pattern
The application follows a **modern Next.js App Router architecture** with:

```
┌─────────────────────────────────────────────────────┐
│                    Client Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  React UI    │  │  TipTap      │  │  Carousel │ │
│  │  Components  │  │  Editor      │  │  Gallery  │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────┐
│                Next.js App Router                    │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ Server       │  │ API Routes   │  │  Server   │ │
│  │ Components   │  │              │  │  Actions  │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────┐
│                   Service Layer                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Kinde   │  │  Stripe  │  │   UploadThing    │  │
│  │  Auth    │  │  Connect │  │                  │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────┐
│                   Data Layer                         │
│  ┌──────────────────────────────────────────────┐   │
│  │         Prisma ORM + PostgreSQL              │   │
│  │              (Supabase)                      │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Server-Side Rendering (SSR)**
   - Leverages Next.js 14 App Router for server components
   - Improved SEO and initial page load performance
   - Dynamic data fetching with `unstable_noStore` for real-time data

2. **Server Actions**
   - Type-safe form submissions without API routes
   - Direct server-side mutations with `"use server"` directive
   - Integrated validation with Zod schemas

3. **Component Architecture**
   - Separation of server and client components
   - Shared UI components via Shadcn/UI
   - Modular component structure in `app/components/`

4. **Type Safety**
   - End-to-end TypeScript
   - Prisma-generated types
   - Zod schema validation

---

## Features

### User Features

#### 1. **Authentication & User Management**
- Multi-factor authentication (MFA)
- Passwordless login
- OAuth integration (Google, GitHub)
- User profile management
- Secure session handling

#### 2. **Product Browsing**
- Category-based navigation (Templates, UI Kits, Icons)
- Product search and filtering
- Image carousels for product previews
- Detailed product pages with rich descriptions
- Price display in USD

#### 3. **Product Selling**
- Rich text product descriptions with TipTap editor
- Multi-image upload (up to 5 images, max 4MB each)
- Product file upload (ZIP format)
- Category selection
- Pricing configuration
- Form validation with real-time feedback

#### 4. **Purchase Flow**
- Stripe Checkout integration
- Secure payment processing
- Automatic product delivery via email
- Success/cancel page handling
- Download links for purchased products

#### 5. **Seller Dashboard**
- Stripe Connect account linking
- Earnings dashboard access
- Product management
- "My Products" view

#### 6. **Email Notifications**
- Automated purchase confirmation emails
- Product delivery emails with download links
- Beautiful email templates with React Email

### Technical Features

#### 1. **Performance Optimizations**
- Server-side rendering
- React Streaming for faster page loads
- Image optimization with Next.js Image
- Lazy loading of components
- Efficient data fetching patterns

#### 2. **Security**
- Server-side validation with Zod
- Protected API routes
- Secure webhook signature verification
- Environment variable management
- SQL injection prevention via Prisma

#### 3. **Developer Experience**
- TypeScript for type safety
- ESLint configuration
- Hot module replacement
- Prisma Studio for database management
- Automatic Prisma client generation

---

## Backend Architecture

### Server Actions

The application uses Next.js Server Actions for form submissions and data mutations:

#### **Product Creation** (`SellProduct`)
```typescript
Location: app/actions.ts
Purpose: Create new product listings
Validation: Zod schema (productSchema)
Flow:
1. Authenticate user via Kinde
2. Validate form data
3. Parse JSON description and images
4. Create product in database
5. Redirect to product page
```

#### **User Settings Update** (`UpdateUserSettings`)
```typescript
Location: app/actions.ts
Purpose: Update user profile information
Validation: userSettingsSchema
Fields: firstName, lastName
```

#### **Product Purchase** (`BuyProduct`)
```typescript
Location: app/actions.ts
Purpose: Initiate Stripe checkout
Flow:
1. Fetch product details
2. Create Stripe checkout session
3. Configure payment intent with application fee (10%)
4. Set up transfer to seller's connected account
5. Redirect to Stripe checkout
```

#### **Stripe Account Management**
- `CreateStripeAccoutnLink`: Onboard sellers to Stripe
- `GetStripeDashboardLink`: Access seller dashboard

### API Routes

#### **Authentication Routes**

**Kinde Auth Handler**
```typescript
Location: app/api/auth/[kindeAuth]/route.ts
Purpose: Handle Kinde authentication callbacks
```

**User Creation**
```typescript
Location: app/api/auth/creation/route.ts
Purpose: Create user and Stripe Connect account
Flow:
1. Get authenticated user from Kinde
2. Check if user exists in database
3. Create Stripe Connect Express account
4. Create user record with connected account ID
5. Redirect to home page
```

#### **Payment Webhooks**

**Stripe Checkout Webhook**
```typescript
Location: app/api/stripe/route.ts
Events: checkout.session.completed
Flow:
1. Verify webhook signature
2. Extract product download link from metadata
3. Send email with product file via Resend
```

**Stripe Connect Webhook**
```typescript
Location: app/api/stripe/connect/route.ts
Events: account.updated
Flow:
1. Verify webhook signature
2. Update user's stripeConnectedLinked status
3. Check account capabilities (transfers)
```

#### **File Upload**

**UploadThing Routes**
```typescript
Location: app/api/uploadthing/core.ts
Endpoints:
- imageUploader: Product images (max 5, 4MB each)
- productFileUpload: Product ZIP files

Middleware: Kinde authentication check
```

### Data Access Layer

**Prisma Client**
```typescript
Location: app/lib/db.ts
Purpose: Singleton Prisma client instance
Features:
- Connection pooling
- Type-safe database queries
- Migration support
```

**Stripe Client**
```typescript
Location: app/lib/stripe.ts
Configuration:
- API Version: 2024-04-10
- TypeScript support enabled
```

---

## Frontend Architecture

### Page Structure

```
app/
├── page.tsx                    # Homepage with product rows
├── layout.tsx                  # Root layout with navbar
├── sell/
│   ├── page.tsx               # Product creation form
│   └── loading.tsx            # Loading skeleton
├── product/[id]/
│   ├── page.tsx               # Product detail page
│   └── loading.tsx            # Loading skeleton
├── products/[category]/
│   ├── page.tsx               # Category listings
│   └── loading.tsx            # Loading skeleton
├── my-products/               # Seller's products
├── billing/
│   └── page.tsx               # Stripe Connect management
├── settings/
│   ├── page.tsx               # User settings
│   └── loading.tsx            # Loading skeleton
├── payment/
│   ├── success/               # Payment success page
│   └── cancel/                # Payment cancel page
└── return/[accountId]/        # Stripe Connect return
```

### Component Architecture

#### **Shared Components** (`app/components/`)

**Navigation Components**
- `Navbar.tsx`: Main navigation with auth state
- `NavbarLinks.tsx`: Category navigation links
- `MobileMenu.tsx`: Mobile responsive menu
- `UserNav.tsx`: User dropdown menu

**Product Components**
- `ProductCard.tsx`: Product preview card with carousel
- `ProductRow.tsx`: Category-based product rows
- `ProductDescription.tsx`: Rich text product details
- `NewestProducts.tsx`: Latest products showcase

**Form Components**
- `form/Sellform.tsx`: Product creation form with TipTap
- `form/SettingsForm.tsx`: User settings form
- `SelectCategory.tsx`: Category selector
- `Editor.tsx`: TipTap rich text editor with toolbar
- `SubmitButtons.tsx`: Form submission buttons with loading states

**Email Component**
- `ProductEmail.tsx`: React Email template for purchases

#### **UI Components** (`components/ui/`)

Based on Shadcn/UI and Radix UI:
- `button.tsx`: Button variants
- `card.tsx`: Card layouts
- `input.tsx`: Form inputs
- `label.tsx`: Form labels
- `textarea.tsx`: Multi-line inputs
- `dropdown-menu.tsx`: Dropdown menus
- `avatar.tsx`: User avatars
- `carousel.tsx`: Image carousels (Embla)
- `skeleton.tsx`: Loading skeletons
- `sonner.tsx`: Toast notifications
- `sheet.tsx`: Side panels

### State Management

**Client State**
- React hooks (`useState`, `useEffect`)
- `useFormState` for server action forms
- TipTap editor state
- Upload state management

**Server State**
- Next.js Server Components for data fetching
- `unstable_noStore` for cache bypassing
- Kinde session management

### Styling System

**Tailwind Configuration**
```typescript
Features:
- Custom color scheme with CSS variables
- Dark mode support (class-based)
- Responsive breakpoints
- Custom animations
- Typography plugin
- Aspect ratio plugin
- UploadThing theme integration
```

**Design System**
- Consistent spacing and sizing
- Color palette with primary/secondary variants
- Typography scale
- Border radius system
- Shadow utilities

---

## Database Schema

### Models

#### **User Model**
```prisma
model User {
  id                    String   @id @unique
  email                 String
  firstName             String
  lastName              String
  profileImage          String
  connectedAccountId    String   @unique
  stripeConnectedLinked Boolean  @default(false)
  Product               Product[]
}
```

**Fields:**
- `id`: Kinde user ID (primary key)
- `email`: User email address
- `firstName`: User's first name
- `lastName`: User's last name
- `profileImage`: Avatar URL
- `connectedAccountId`: Stripe Connect account ID
- `stripeConnectedLinked`: Onboarding status flag

**Relationships:**
- One-to-many with Product (seller relationship)

#### **Product Model**
```prisma
model Product {
  id               String        @id @default(uuid())
  name             String
  price            Int           # Price in cents
  smallDescription String
  description      Json          # TipTap JSON content
  images           String[]      # Array of image URLs
  productFile      String        # ZIP file URL
  category         CategoryTypes
  createdAt        DateTime      @default(now())
  User             User?         @relation(fields: [userId], references: [id])
  userId           String?
}
```

**Fields:**
- `id`: UUID primary key
- `name`: Product name
- `price`: Price in cents (integer)
- `smallDescription`: Brief summary
- `description`: Rich text JSON from TipTap
- `images`: Array of image URLs (UploadThing)
- `productFile`: Download URL for product ZIP
- `category`: Enum (template/uikit/icon)
- `createdAt`: Timestamp
- `userId`: Foreign key to User

#### **CategoryTypes Enum**
```prisma
enum CategoryTypes {
  template
  uikit
  icon
}
```

### Database Provider
- **PostgreSQL** hosted on Supabase
- Direct connection and pooling via Prisma
- Environment variables: `DATABASE_URL`, `DIRECT_URL`

---

## Authentication & Authorization

### Kinde Authentication

**Configuration**
```typescript
Provider: Kinde Auth (@kinde-oss/kinde-auth-nextjs)
Version: 2.2.5
```

**Supported Authentication Methods**
1. **Email/Password** with optional MFA
2. **Passwordless** (magic link)
3. **OAuth Providers:**
   - Google
   - GitHub

**Session Management**
```typescript
Server-side: getKindeServerSession()
Client-side: Login/Register links via Kinde components

Session Access:
- getUser(): Get current user
- isAuthenticated(): Check auth status
```

**User Flow**
```
1. User clicks Login/Register
2. Redirected to Kinde hosted auth
3. After authentication, redirect to /api/auth/creation
4. Create user in database + Stripe Connect account
5. Redirect to homepage
```

### Authorization Patterns

**Protected Routes**
```typescript
// Server Components
const { getUser } = getKindeServerSession();
const user = await getUser();
if (!user) throw new Error("Unauthorized");
```

**API Route Protection**
```typescript
// UploadThing middleware
middleware: async ({ req }) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) throw new UploadThingError("Unauthorized");
  return { userId: user.id };
}
```

**Server Action Protection**
- All server actions check authentication
- User ID retrieved from Kinde session
- Database queries filtered by user ID

---

## Payment Processing

### Stripe Connect Architecture

**Marketplace Model**
- **Platform**: Takes 10% application fee
- **Sellers**: Receive 90% of sale price directly
- **Account Type**: Stripe Connect Express

### Payment Flow

```
1. Buyer clicks "Buy" on product
   ↓
2. Server action creates Stripe Checkout session
   - Line items with product details
   - Application fee: 10% of price
   - Transfer destination: Seller's connected account
   ↓
3. Redirect to Stripe Checkout
   ↓
4. Customer completes payment
   ↓
5. Stripe webhook: checkout.session.completed
   ↓
6. Send email with product download link
   ↓
7. Redirect to success page
```

### Stripe Connect Onboarding

```
1. Seller navigates to /billing
   ↓
2. Click "Link your Account to stripe"
   ↓
3. Server action: CreateStripeAccoutnLink
   - Create Stripe AccountLink
   - Type: account_onboarding
   ↓
4. Redirect to Stripe Express Dashboard
   ↓
5. Complete onboarding
   ↓
6. Webhook: account.updated
   ↓
7. Update stripeConnectedLinked = true
   ↓
8. Redirect to return URL
```

### Checkout Session Configuration

```typescript
{
  mode: "payment",
  line_items: [{
    price_data: {
      currency: "usd",
      unit_amount: price * 100, // Convert to cents
      product_data: {
        name, description, images
      }
    },
    quantity: 1
  }],
  metadata: {
    link: productFile // Download URL
  },
  payment_intent_data: {
    application_fee_amount: price * 100 * 0.1,
    transfer_data: {
      destination: sellerConnectedAccountId
    }
  },
  success_url: "/payment/success",
  cancel_url: "/payment/cancel"
}
```

### Webhook Security

**Signature Verification**
```typescript
const signature = headers().get("Stripe-Signature");
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  webhookSecret
);
```

**Webhook Events**
- `checkout.session.completed`: Payment success
- `account.updated`: Connect account status

---

## API Routes

### Route Overview

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/[kindeAuth]` | GET/POST | Kinde auth callbacks |
| `/api/auth/creation` | GET | User creation after auth |
| `/api/stripe` | POST | Checkout webhook |
| `/api/stripe/connect` | POST | Connect webhook |
| `/api/uploadthing` | GET/POST | File upload endpoints |

### Webhook Endpoints

#### Stripe Checkout Webhook
```typescript
URL: /api/stripe
Method: POST
Signature: STRIPE_SECRET_WEBHOOK
Events:
  - checkout.session.completed
Actions:
  - Send product email via Resend
```

#### Stripe Connect Webhook
```typescript
URL: /api/stripe/connect
Method: POST
Signature: STRIPE_CONNECT_WEBHOOK_SECRET
Events:
  - account.updated
Actions:
  - Update user's stripeConnectedLinked status
```

### UploadThing Endpoints

```typescript
Routes: /api/uploadthing
Endpoints:
  1. imageUploader
     - File types: image/*
     - Max size: 4MB per file
     - Max count: 5 files
  
  2. productFileUpload
     - File types: application/zip
     - Max count: 1 file
     - Authentication: Required
```

---

## File Upload System

### UploadThing Integration

**Configuration**
```typescript
Provider: UploadThing
Version: 6.10.3
Storage: UploadThing cloud storage
```

**Upload Routes**

1. **Image Uploader**
   - Purpose: Product preview images
   - File types: Images only
   - Max file size: 4MB
   - Max files: 5 per upload
   - Returns: Array of image URLs

2. **Product File Uploader**
   - Purpose: Downloadable product files
   - File types: ZIP only
   - Max files: 1 per upload
   - Returns: Download URL

**Client Components**
```typescript
Component: UploadDropzone
Location: app/lib/uploadthing.tsx
Features:
  - Drag and drop
  - Progress indication
  - Error handling
  - Client-side callbacks
```

**Security**
- Authentication required via middleware
- User ID attached to uploads
- File type validation
- Size limit enforcement

---

## Email System

### Resend Integration

**Configuration**
```typescript
Provider: Resend
Version: 3.2.0
API Key: RESEND_API_KEY (environment variable)
```

### Email Templates

**Product Email**
```typescript
Component: ProductEmail
Location: app/components/ProductEmail.tsx
Built with: @react-email/components

Template Features:
- Product download link
- Professional HTML layout
- Responsive design
- Branded styling
```

**Trigger Point**
```typescript
Event: checkout.session.completed
Data: Product download URL from session metadata
Recipient: Customer email from Stripe
```

**Email Content**
```typescript
From: "MarshalUI <onboarding@resend.dev>"
Subject: "Your Product from MarshalUI"
Body: React Email component with download link
```

---

## Deployment

### Recommended Platform: Vercel

**Why Vercel?**
- Built by Next.js creators
- Zero-configuration deployment
- Automatic HTTPS
- Edge network (CDN)
- Environment variable management
- Preview deployments

### Deployment Configuration

**Build Settings**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

**Build Steps**
1. Install dependencies: `npm install`
2. Generate Prisma client: `prisma generate` (via postinstall)
3. Build Next.js: `next build`

### Environment Variables (Production)

Required for Vercel deployment:
```
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Authentication
KINDE_CLIENT_ID=xxx
KINDE_CLIENT_SECRET=xxx
KINDE_ISSUER_URL=https://xxx.kinde.com
KINDE_SITE_URL=https://yourdomain.com
KINDE_POST_LOGOUT_REDIRECT_URL=https://yourdomain.com
KINDE_POST_LOGIN_REDIRECT_URL=https://yourdomain.com/api/auth/creation

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_SECRET_WEBHOOK=whsec_xxx
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_xxx

# UploadThing
UPLOADTHING_SECRET=xxx
UPLOADTHING_APP_ID=xxx

# Email
RESEND_API_KEY=re_xxx
```

### Production URLs

Update hardcoded URLs in:
- `app/actions.ts`: Success/cancel URLs, return URLs
- `app/api/auth/creation/route.ts`: Redirect URL

**Current Production Domain**: `marshal-ui-yt.vercel.app`

---

## Environment Variables

### Complete Environment Configuration

#### Database Configuration
```bash
# PostgreSQL connection string (Supabase)
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true"

# Direct connection (for migrations)
DIRECT_URL="postgresql://user:pass@host:5432/db"
```

#### Kinde Authentication
```bash
KINDE_CLIENT_ID="your_kinde_client_id"
KINDE_CLIENT_SECRET="your_kinde_client_secret"
KINDE_ISSUER_URL="https://yourapp.kinde.com"
KINDE_SITE_URL="http://localhost:3000"
KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3000/api/auth/creation"
```

#### Stripe Configuration
```bash
# Stripe secret key (sk_test_... for development)
STRIPE_SECRET_KEY="sk_test_xxxxx"

# Webhook signing secrets
STRIPE_SECRET_WEBHOOK="whsec_xxxxx"
STRIPE_CONNECT_WEBHOOK_SECRET="whsec_xxxxx"
```

#### UploadThing
```bash
UPLOADTHING_SECRET="sk_live_xxxxx"
UPLOADTHING_APP_ID="your_app_id"
```

#### Email (Resend)
```bash
RESEND_API_KEY="re_xxxxx"
```

#### Node Environment
```bash
NODE_ENV="development" # or "production"
```

---

## Development Setup

### Prerequisites
- Node.js 18+ (with npm)
- PostgreSQL database (or Supabase account)
- Stripe account (with Connect enabled)
- Kinde account
- UploadThing account
- Resend account

### Installation Steps

1. **Clone Repository**
```bash
git clone https://github.com/yonsy7/Marketplace-VibeBase.git
cd Marketplace-VibeBase
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment Variables**
```bash
# Create .env file in root directory
cp .env.example .env

# Fill in all required environment variables
```

4. **Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio
npx prisma studio
```

5. **Configure Third-Party Services**

**Supabase:**
- Create project
- Copy connection strings to `.env`

**Kinde:**
- Create application
- Configure OAuth providers
- Set callback URLs
- Copy credentials to `.env`

**Stripe:**
- Enable Stripe Connect
- Create webhook endpoints:
  - `/api/stripe` → checkout events
  - `/api/stripe/connect` → account events
- Copy API keys and webhook secrets

**UploadThing:**
- Create app
- Copy secret and app ID

**Resend:**
- Create account
- Generate API key
- Verify sending domain (optional)

6. **Run Development Server**
```bash
npm run dev
```

7. **Access Application**
```
http://localhost:3000
```

### Development Scripts

```json
{
  "dev": "next dev",           // Start dev server
  "build": "next build",       // Production build
  "start": "next start",       // Start production server
  "lint": "next lint",         // Run ESLint
  "postinstall": "prisma generate"  // Auto-generate Prisma client
}
```

### Database Management

**Prisma Commands**
```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Format schema
npx prisma format
```

### Testing Webhooks Locally

**Using Stripe CLI**
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe
stripe listen --forward-to localhost:3000/api/stripe/connect

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger account.updated
```

### Code Quality

**Linting**
```bash
npm run lint
```

**Type Checking**
```bash
npx tsc --noEmit
```

---

## Additional Technical Details

### Performance Considerations

1. **Image Optimization**
   - Next.js Image component with automatic optimization
   - UploadThing CDN for fast delivery
   - Lazy loading for images

2. **Data Fetching**
   - Server Components for initial render
   - `unstable_noStore` to prevent stale data
   - Selective data fetching (Prisma select)

3. **Bundle Size**
   - Tree-shaking for unused code
   - Dynamic imports where appropriate
   - Optimized dependencies

### Security Best Practices

1. **Input Validation**
   - Zod schemas on all forms
   - Server-side validation
   - SQL injection prevention via Prisma

2. **Authentication**
   - Secure session management via Kinde
   - Protected API routes
   - CSRF protection (Next.js built-in)

3. **Payment Security**
   - Webhook signature verification
   - No sensitive data in client
   - PCI compliance via Stripe

### Scalability Notes

1. **Database**
   - Indexed foreign keys
   - Connection pooling via Prisma
   - Direct URL for migrations

2. **File Storage**
   - CDN-backed UploadThing
   - Scalable storage solution

3. **Payment Processing**
   - Stripe handles transaction volume
   - Async webhook processing

### Error Handling

1. **Form Errors**
   - Zod validation errors
   - Toast notifications via Sonner
   - Field-level error display

2. **API Errors**
   - Try-catch blocks
   - Appropriate HTTP status codes
   - Error logging

3. **User Feedback**
   - Loading states
   - Success/error messages
   - Redirect on errors

---

## Project Structure Summary

```
Marketplace-VibeBase/
├── app/                          # Next.js App Router
│   ├── actions.ts               # Server Actions
│   ├── layout.tsx               # Root Layout
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global Styles
│   ├── api/                     # API Routes
│   │   ├── auth/               # Authentication
│   │   ├── stripe/             # Payment Webhooks
│   │   └── uploadthing/        # File Upload
│   ├── components/              # App Components
│   │   ├── form/               # Form Components
│   │   ├── Navbar.tsx          # Navigation
│   │   ├── ProductCard.tsx     # Product Display
│   │   └── ...
│   ├── lib/                     # Utilities
│   │   ├── db.ts               # Prisma Client
│   │   ├── stripe.ts           # Stripe Client
│   │   └── uploadthing.tsx     # Upload Config
│   ├── billing/                 # Billing Pages
│   ├── my-products/            # Seller Dashboard
│   ├── product/[id]/           # Product Detail
│   ├── products/[category]/    # Category Pages
│   ├── sell/                    # Sell Product
│   ├── settings/               # User Settings
│   ├── payment/                # Payment Result
│   └── return/                 # Stripe Return
├── components/                   # Shared Components
│   └── ui/                      # Shadcn UI Components
├── prisma/
│   └── schema.prisma           # Database Schema
├── public/                      # Static Assets
├── lib/
│   └── utils.ts                # Utility Functions
├── .eslintrc.json              # ESLint Config
├── .gitignore                  # Git Ignore
├── components.json             # Shadcn Config
├── next.config.mjs             # Next.js Config
├── package.json                # Dependencies
├── postcss.config.mjs          # PostCSS Config
├── tailwind.config.ts          # Tailwind Config
└── tsconfig.json               # TypeScript Config
```

---

## Conclusion

VibeBase Marketplace is a production-ready digital marketplace platform showcasing modern web development practices with Next.js 14, Stripe Connect, and a comprehensive authentication system. The architecture supports multi-vendor functionality, secure payment processing, and seamless digital product delivery.

### Key Strengths
✅ Type-safe end-to-end development
✅ Server-side rendering for performance
✅ Secure authentication with multiple providers
✅ Integrated marketplace payment processing
✅ Automated product delivery
✅ Rich content editing capabilities
✅ Responsive, accessible UI

### Production Readiness
The application is deployed and operational at `marshal-ui-yt.vercel.app`, demonstrating its readiness for real-world use cases in digital asset marketplaces.

---

*Documentation Version: 1.0*  
*Last Updated: December 2024*  
*Repository: https://github.com/yonsy7/Marketplace-VibeBase*
