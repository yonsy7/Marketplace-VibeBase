# MarshalUI - Digital Marketplace Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Features](#features)
5. [Database Schema](#database-schema)
6. [Authentication & Authorization](#authentication--authorization)
7. [Payment Processing](#payment-processing)
8. [File Upload System](#file-upload-system)
9. [API Routes](#api-routes)
10. [Frontend Architecture](#frontend-architecture)
11. [Server Actions](#server-actions)
12. [Email System](#email-system)
13. [Deployment](#deployment)
14. [Environment Variables](#environment-variables)

---

## Overview

MarshalUI is a full-stack digital marketplace application built with Next.js 14, designed for buying and selling digital products (templates, UI kits, and icons) related to Tailwind CSS. The platform enables creators to sell their digital products while handling payments, file delivery, and marketplace operations through Stripe Connect.

### Key Characteristics
- **Type**: Digital Marketplace Platform
- **Primary Use Case**: E-commerce for digital products (Templates, UI Kits, Icons)
- **Monetization**: Platform takes 10% application fee on each transaction
- **Architecture**: Server-side rendered with React Server Components
- **Database**: PostgreSQL (via Supabase)
- **Payment Provider**: Stripe with Connect for marketplace functionality

---

## Technology Stack

### Core Framework
- **Next.js 14.2.3** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5** - Type-safe JavaScript

### Authentication
- **Kinde Auth** (`@kinde-oss/kinde-auth-nextjs`) - Authentication provider
  - Multi-factor authentication (MFA)
  - Passwordless authentication
  - OAuth providers (Google, GitHub)
  - Server-side session management

### Database & ORM
- **PostgreSQL** - Relational database (hosted on Supabase)
- **Prisma 5.13.0** - Type-safe ORM
  - Database migrations
  - Type generation
  - Connection pooling

### Payment Processing
- **Stripe 15.6.0** - Payment processing
  - Stripe Checkout for customer payments
  - Stripe Connect for marketplace functionality
  - Webhook handling for payment events
  - Express Dashboard integration

### File Management
- **UploadThing 6.10.3** - File upload service
  - Image uploads (max 4MB, up to 5 files)
  - Product file uploads (ZIP format)
  - CDN integration via utfs.io

### Email Service
- **Resend 3.2.0** - Email delivery service
- **React Email 0.0.17** - Email template components

### UI & Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI
- **Radix UI** - Headless UI components
  - Avatar, Dialog, Dropdown Menu, Label, Slot
- **Lucide React** - Icon library
- **Sonner** - Toast notification system
- **next-themes** - Theme management (dark mode support)

### Rich Text Editing
- **TipTap 2.3.2** - Rich text editor
  - Starter Kit extension
  - JSON-based content storage

### Form Validation
- **Zod 3.23.8** - Schema validation library
  - Server-side validation
  - Type inference

### Additional Libraries
- **class-variance-authority** - Component variant management
- **clsx** - Conditional class names
- **tailwind-merge** - Tailwind class merging
- **embla-carousel-react** - Carousel component

---

## Architecture Overview

### Application Structure

```
/app
  /api                    # API routes
    /auth/[kindeAuth]     # Authentication endpoints
    /stripe               # Payment webhooks
      /connect            # Stripe Connect webhooks
    /uploadthing          # File upload endpoints
  /components             # React components
    /form                 # Form components
    /ui                   # shadcn/ui components
  /lib                    # Utility libraries
  /[routes]               # Page routes
    /product/[id]         # Product detail pages
    /products/[category]  # Category listing pages
    /sell                 # Product creation page
    /my-products          # Seller dashboard
    /billing              # Stripe Connect setup
    /settings             # User settings
    /payment              # Payment success/cancel pages
    /return/[id]          # Stripe Connect return page
```

### Rendering Strategy

The application uses **Next.js App Router** with a hybrid rendering approach:

1. **Server Components** (Default)
   - Product listings
   - Product detail pages
   - User dashboard pages
   - All data fetching happens on the server

2. **Client Components** (`"use client"`)
   - Interactive forms (SellForm, SettingsForm)
   - Rich text editor
   - File upload components
   - Navigation menus
   - Toast notifications

3. **Server Actions** (`"use server"`)
   - Form submissions
   - Payment processing
   - Stripe account linking
   - Database mutations

### Data Flow

```
User Request → Next.js Route Handler
  ↓
Server Component (fetches data)
  ↓
Prisma ORM → PostgreSQL Database
  ↓
Render HTML with React Server Components
  ↓
Hydrate Client Components
  ↓
User Interaction → Server Action / API Route
  ↓
Update Database / External Service
  ↓
Redirect / Revalidate
```

---

## Features

### 1. User Authentication & Management

#### Authentication Methods
- **Email/Password** - Traditional authentication
- **Passwordless** - Magic link authentication
- **OAuth** - Google and GitHub integration
- **Multi-Factor Authentication (MFA)** - Enhanced security

#### User Profile Management
- Profile image from OAuth providers or generated avatars
- First name and last name editing
- Email management (read-only from Kinde)
- User settings page with form validation

### 2. Product Management

#### Product Categories
- **Templates** - Website/page templates
- **UI Kits** - Component libraries
- **Icons** - Icon sets

#### Product Creation Flow
1. User must link Stripe Connect account (verified)
2. Product creation form with:
   - Name (min 3 characters)
   - Category selection
   - Price (minimum $1)
   - Small description (min 10 characters)
   - Rich text description (TipTap editor)
   - Product images (up to 5, max 4MB each)
   - Product file (ZIP format)
3. Server-side validation using Zod
4. Product stored in database with user association

#### Product Display
- Homepage with featured sections:
  - Newest Products
  - Templates
  - UI Kits
  - Icons
- Category-based filtering
- Product detail pages with:
  - Image carousel
  - Product information
  - Purchase button
  - Seller information
  - Rich text description

#### Seller Dashboard
- "My Products" page showing all seller's products
- Product cards with images, name, price, description
- Direct links to product detail pages

### 3. Payment Processing

#### Stripe Integration

**Customer Checkout Flow:**
1. User clicks "Buy" on product page
2. Server action creates Stripe Checkout session
3. Payment intent includes:
   - Product price
   - 10% application fee (to platform)
   - Transfer to seller's Stripe Connect account
   - Product file link in metadata
4. User redirected to Stripe Checkout
5. After payment, webhook triggers email delivery

**Stripe Connect Integration:**
- Sellers create Stripe Express accounts
- Account onboarding flow
- Dashboard access for sellers
- Transfer capabilities verification
- Webhook updates account status

**Payment Webhooks:**
- `checkout.session.completed` - Triggers product email delivery
- `account.updated` - Updates seller account status

### 4. File Upload System

#### UploadThing Configuration

**Image Uploader:**
- Endpoint: `imageUploader`
- File type: Images
- Max file size: 4MB
- Max file count: 5
- Authentication required
- Files stored on utfs.io CDN

**Product File Upload:**
- Endpoint: `productFileUpload`
- File type: ZIP archives (`application/zip`)
- Max file count: 1
- Authentication required
- File URL stored in database

#### Upload Flow
1. User selects files in form
2. Files uploaded to UploadThing
3. URLs returned to client
4. URLs stored in hidden form fields
5. Submitted with product data

### 5. Email System

#### Email Delivery
- **Service**: Resend
- **Template Engine**: React Email
- **Trigger**: Successful payment webhook

#### Email Content
- Purchase confirmation
- Product download link
- Branded email template
- Responsive design

### 6. Search & Filtering

- Category-based filtering
- Product listing pages by category
- Newest products sorting
- Responsive grid layouts

### 7. User Interface Features

- **Responsive Design** - Mobile-first approach
- **Loading States** - Skeleton loaders for async content
- **Error Handling** - Form validation errors, toast notifications
- **Navigation** - Desktop and mobile menus
- **Theme Support** - Dark mode ready (next-themes)

---

## Database Schema

### Prisma Schema

```prisma
model User {
  id                    String  @id @unique
  email                 String
  firstName             String
  lastName              String
  profileImage          String
  connectedAccountId    String  @unique
  stripeConnectedLinked Boolean @default(false)

  Product Product[]
}

model Product {
  id               String        @id @default(uuid())
  name             String
  price            Int
  smallDescription String
  description      Json          // TipTap JSON content
  images           String[]      // Array of image URLs
  productFile      String        // ZIP file URL
  category         CategoryTypes

  createdAt DateTime @default(now())
  User      User?    @relation(fields: [userId], references: [id])
  userId    String?
}

enum CategoryTypes {
  template
  uikit
  icon
}
```

### Relationships
- **User → Product**: One-to-Many (User can have multiple products)
- **Product → User**: Many-to-One (Product belongs to one user)

### Key Fields

**User Model:**
- `connectedAccountId`: Stripe Connect account ID
- `stripeConnectedLinked`: Boolean flag for account verification status

**Product Model:**
- `description`: JSON field storing TipTap editor content
- `images`: Array of image URLs from UploadThing
- `productFile`: Single URL to ZIP file
- `price`: Stored in cents (integer)

---

## Authentication & Authorization

### Kinde Auth Integration

#### Configuration
- Server-side session management
- Protected routes via middleware
- User data available in Server Components

#### Authentication Flow
```
User clicks Login/Register
  ↓
Redirected to Kinde Auth
  ↓
OAuth / Email / Passwordless
  ↓
Callback to /api/auth/[kindeAuth]
  ↓
Session created
  ↓
User redirected to app
```

#### Protected Routes
- `/sell` - Requires authentication + Stripe Connect
- `/my-products` - Requires authentication
- `/billing` - Requires authentication
- `/settings` - Requires authentication

#### Authorization Checks
- Server actions verify user session
- Database queries filter by `userId`
- Stripe operations require authenticated user

---

## Payment Processing

### Stripe Checkout Flow

#### Checkout Session Creation
```typescript
stripe.checkout.sessions.create({
  mode: "payment",
  line_items: [{
    price_data: {
      currency: "usd",
      unit_amount: price * 100, // Convert to cents
      product_data: {
        name: productName,
        description: smallDescription,
        images: productImages
      }
    },
    quantity: 1
  }],
  metadata: {
    link: productFileUrl
  },
  payment_intent_data: {
    application_fee_amount: price * 100 * 0.1, // 10% platform fee
    transfer_data: {
      destination: sellerConnectedAccountId
    }
  },
  success_url: "/payment/success",
  cancel_url: "/payment/cancel"
})
```

### Stripe Connect Flow

#### Account Creation
1. User visits `/billing`
2. Clicks "Link Account to Stripe"
3. Redirected to Stripe onboarding
4. Completes Express account setup
5. Returns to `/return/[accountId]`
6. Webhook updates `stripeConnectedLinked` status

#### Account Status Management
- Webhook listens for `account.updated` events
- Checks `account.capabilities.transfers` status
- Updates database accordingly
- Sellers can access Stripe Express Dashboard

### Webhook Security
- Signature verification using webhook secrets
- Separate secrets for payment and connect webhooks
- Error handling for invalid signatures

---

## File Upload System

### UploadThing Architecture

#### File Router Configuration
```typescript
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async ({ req }) => {
      // Verify authentication
      const user = await getUser();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Log upload completion
      return { uploadedBy: metadata.userId };
    }),

  productFileUpload: f({ "application/zip": { maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Verify authentication
      const user = await getUser();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Log upload completion
      return { uploadedBy: metadata.userId };
    })
}
```

#### Upload Flow
1. Client component renders `UploadDropzone`
2. User selects files
3. Files uploaded to UploadThing
4. URLs returned via `onClientUploadComplete` callback
5. URLs stored in React state
6. Submitted with form data

### File Storage
- Files stored on UploadThing's CDN (utfs.io)
- Images accessible via HTTPS URLs
- Product files (ZIP) downloadable via URLs

---

## API Routes

### `/api/auth/[kindeAuth]/route.ts`
- **Method**: GET
- **Purpose**: Handles all Kinde authentication callbacks
- **Handler**: `handleAuth()` from Kinde SDK

### `/api/stripe/route.ts`
- **Method**: POST
- **Purpose**: Payment webhook handler
- **Events Handled**:
  - `checkout.session.completed` - Sends product email

### `/api/stripe/connect/route.ts`
- **Method**: POST
- **Purpose**: Stripe Connect webhook handler
- **Events Handled**:
  - `account.updated` - Updates seller account status

### `/api/uploadthing/core.ts`
- **Purpose**: Defines file upload routes
- **Endpoints**:
  - `imageUploader` - Image uploads
  - `productFileUpload` - ZIP file uploads

### `/api/uploadthing/route.ts`
- **Purpose**: UploadThing API route handler
- **Generated**: Automatically by UploadThing SDK

---

## Frontend Architecture

### Component Structure

#### Layout Components
- **Navbar** - Main navigation with auth state
- **MobileMenu** - Mobile navigation drawer
- **UserNav** - User dropdown menu

#### Product Components
- **ProductCard** - Product preview card
- **ProductRow** - Category product listings
- **ProductDescription** - Rich text product description renderer
- **NewestProducts** - Featured products section

#### Form Components
- **SellForm** - Product creation form
- **SettingsForm** - User settings form
- **SelectCategory** - Category selection dropdown
- **SubmitButtons** - Form submission buttons

#### Editor Components
- **TipTapEditor** - Rich text editor
- **MenuBar** - Editor toolbar

#### UI Components (shadcn/ui)
- Avatar, Button, Card, Carousel, Dropdown Menu
- Input, Label, Sheet, Skeleton, Sonner (Toast)
- Textarea

### State Management
- **React Server Components** - Server-side state
- **React Hooks** - Client-side state (`useState`, `useFormState`)
- **Form State** - Server Actions with `useFormState`
- **Toast Notifications** - Sonner for user feedback

### Data Fetching Patterns

#### Server Components
```typescript
async function getData() {
  const data = await prisma.product.findMany({
    // Query options
  });
  return data;
}

export default async function Page() {
  const data = await getData();
  return <Component data={data} />;
}
```

#### Loading States
- Suspense boundaries for async components
- Skeleton loaders during data fetching
- `unstable_noStore()` for dynamic rendering

---

## Server Actions

### Location: `/app/actions.ts`

#### `SellProduct(prevState, formData)`
- **Purpose**: Create new product listing
- **Validation**: Zod schema validation
- **Process**:
  1. Verify user authentication
  2. Validate form data
  3. Parse JSON fields (description, images)
  4. Create product in database
  5. Redirect to product page

#### `UpdateUserSettings(prevState, formData)`
- **Purpose**: Update user profile information
- **Validation**: Zod schema validation
- **Process**:
  1. Verify user authentication
  2. Validate form data
  3. Update user in database
  4. Return success state

#### `BuyProduct(formData)`
- **Purpose**: Initiate purchase flow
- **Process**:
  1. Fetch product and seller data
  2. Create Stripe Checkout session
  3. Configure payment intent with:
     - Application fee (10%)
     - Transfer to seller
     - Product metadata
  4. Redirect to Stripe Checkout

#### `CreateStripeAccoutnLink()`
- **Purpose**: Create Stripe Connect onboarding link
- **Process**:
  1. Verify user authentication
  2. Get user's connected account ID
  3. Create account link with return URLs
  4. Redirect to Stripe onboarding

#### `GetStripeDashboardLink()`
- **Purpose**: Generate Stripe Express Dashboard login link
- **Process**:
  1. Verify user authentication
  2. Get user's connected account ID
  3. Create login link
  4. Redirect to Stripe dashboard

---

## Email System

### Email Service: Resend

#### Configuration
- API key from environment variables
- From address: "MarshalUI <onboarding@resend.dev>"
- React Email templates

#### Email Template: ProductEmail
- **Component**: `/app/components/ProductEmail.tsx`
- **Purpose**: Product delivery email
- **Content**:
  - Purchase confirmation message
  - Download button with product link
  - Branded styling

#### Email Trigger
- Webhook: `checkout.session.completed`
- Extracts product file URL from metadata
- Sends email to customer
- Uses React Email for template rendering

---

## Deployment

### Platform: Vercel

#### Build Configuration
- Framework: Next.js
- Build command: `next build`
- Output directory: `.next`
- Node.js version: Compatible with Next.js 14

#### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct database connection (for migrations)
- `KINDE_CLIENT_ID` - Kinde authentication client ID
- `KINDE_CLIENT_SECRET` - Kinde authentication secret
- `KINDE_ISSUER_URL` - Kinde issuer URL
- `KINDE_SITE_URL` - Application URL
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_SECRET_WEBHOOK` - Payment webhook secret
- `STRIPE_CONNECT_WEBHOOK_SECRET` - Connect webhook secret
- `RESEND_API_KEY` - Resend email API key
- `UPLOADTHING_SECRET` - UploadThing secret key
- `UPLOADTHING_APP_ID` - UploadThing app ID

#### Post-Installation
- `postinstall` script runs `prisma generate`
- Ensures Prisma Client is generated after install

#### Webhook Configuration
- Stripe webhooks must be configured in Stripe Dashboard
- Point to production URLs:
  - Payment: `https://yourdomain.com/api/stripe`
  - Connect: `https://yourdomain.com/api/stripe/connect`

---

## Environment Variables

### Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Authentication
KINDE_CLIENT_ID="your_kinde_client_id"
KINDE_CLIENT_SECRET="your_kinde_client_secret"
KINDE_ISSUER_URL="https://your_kinde_domain.kinde.com"
KINDE_SITE_URL="https://your_app_domain.com"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_SECRET_WEBHOOK="whsec_..."
STRIPE_CONNECT_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."

# File Upload
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your_app_id"
```

### Development vs Production
- URLs differ between environments
- Webhook secrets are environment-specific
- Stripe keys differ (test vs live)

---

## Security Considerations

### Authentication
- Server-side session validation
- Protected routes require authentication
- Stripe Connect requires verified accounts

### Data Validation
- Zod schema validation on server
- Type-safe database queries with Prisma
- File type and size restrictions

### Payment Security
- Webhook signature verification
- Server-side payment processing
- No sensitive data in client-side code

### File Upload Security
- Authentication required for uploads
- File type restrictions
- File size limits
- Files stored on CDN (not server)

---

## Performance Optimizations

### Next.js Optimizations
- Server Components for reduced client bundle
- Image optimization with `next/image`
- Static generation where possible
- Dynamic rendering with `unstable_noStore()`

### Database Optimizations
- Prisma connection pooling
- Selective field queries (`select`)
- Indexed fields (`@id`, `@unique`)

### Frontend Optimizations
- Code splitting with dynamic imports
- Suspense boundaries for loading states
- Optimized images via Next.js Image component

---

## Future Enhancements (Potential)

### Suggested Improvements
1. **Search Functionality** - Full-text search for products
2. **Reviews & Ratings** - Customer feedback system
3. **Wishlist** - Save products for later
4. **Order History** - Customer purchase history
5. **Analytics Dashboard** - Seller analytics
6. **Product Variants** - Multiple pricing tiers
7. **Discount Codes** - Promotional codes
8. **Refund System** - Automated refund processing
9. **Multi-language Support** - Internationalization
10. **Advanced Filtering** - Price range, date filters

---

## Development Workflow

### Local Development Setup

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd digital-marketplace-yt
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in all required variables

4. **Set Up Database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Access Application**
   - Open `http://localhost:3000`

### Database Migrations
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### Linting
```bash
npm run lint
```

---

## Conclusion

MarshalUI is a comprehensive digital marketplace platform built with modern web technologies. It provides a complete solution for selling digital products with integrated payment processing, file management, and user authentication. The architecture leverages Next.js 14's App Router for optimal performance and developer experience, while Stripe Connect enables marketplace functionality with automated fee distribution.

The platform is production-ready and can be deployed to Vercel with proper environment configuration. The codebase follows best practices for security, validation, and user experience.

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Maintained By**: Development Team
