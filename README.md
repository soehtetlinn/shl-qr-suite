# QR Suite - Dynamic QR Code Generator

A modern, feature-rich QR code generator with dynamic URLs, advanced analytics, and beautiful customization options including heart shapes, custom frames, and logos.

## Features

- 🎨 **Customizable Design** - Create stunning QR codes with custom colors, heart shapes, frames, and logos
- 📊 **Advanced Analytics** - Track scans, location data, device types, and user behavior in real-time
- 🔄 **Dynamic QR Codes** - Edit destination URLs anytime without reprinting your QR code
- 💰 **Flexible Pricing** - Start with a 10-day free trial, scale as you grow
- 🔒 **Secure & Reliable** - Enterprise-grade security with JWT authentication
- ⚡ **Lightning Fast** - Instant QR code generation and lightning-fast redirects

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: React Bootstrap
- **Charts**: Chart.js, react-chartjs-2
- **QR Generation**: qrcode.react
- **Routing**: React Router DOM
- **API Client**: Axios
- **Notifications**: React Toastify
- **Backend API**: Node.js, Express, Prisma (located at /root/shltechent/sonesoebid_server, runs on port 4000)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running at http://localhost:4000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```
VITE_API_BASE_URL=http://localhost:4000
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser at `http://localhost:3002`

> **Port Configuration**: QR Suite runs on port 3002 to avoid conflicts with the main Sonesoebid frontend (port 3000)

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── QRCodeGenerator.tsx
│   ├── QRCodeAnalytics.tsx
│   ├── LandingPage.tsx
│   ├── Pricing.tsx
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
├── context/            # React context providers
│   └── AuthContext.tsx
├── utils/              # Utility functions
│   ├── api.ts
│   └── auth.ts
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## Features in Detail

### QR Code Customization

- **Colors**: Custom foreground and background colors with preset palettes
- **Styles**: Choose between squares and dots
- **Frames**: Multiple frame options including heart, round, badge, and square
- **Logos**: Upload custom logos to center of QR code
- **Size**: Adjustable size from 128px to 512px
- **Error Correction**: Four levels (L, M, Q, H)

### Analytics Dashboard

- Total scans, scans today, this week, and this month
- Scans over time chart
- Device type distribution
- Geographic location tracking
- Browser and OS statistics
- Recent scans table with detailed information

### Dynamic QR Codes

- Short URL generation (e.g., https://qr.shltechent.com/xyz123)
- Edit destination URL without reprinting
- Trial period for free users (10 days)
- Automatic redirect with scan tracking
- Status management (Active, Inactive, Expired, Suspended)

### User Management

- JWT-based authentication
- Secure password hashing
- Token refresh mechanism
- Protected routes
- User profile management

## API Endpoints Used

### Authentication
- POST `/api/login` - User login
- POST `/api/register` - User registration
- POST `/api/refresh` - Refresh JWT token

### QR Codes
- POST `/api/qr/dynamic` - Create dynamic QR code
- GET `/api/qr/dynamic` - Get user's QR codes
- GET `/api/qr/dynamic/:id` - Get specific QR code
- PUT `/api/qr/dynamic/:id` - Update QR code
- DELETE `/api/qr/dynamic/:id` - Delete QR code
- GET `/api/qr/dynamic/:id/analytics` - Get QR code analytics

### Subscriptions
- GET `/api/subscription-plans` - Get available plans

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:4000)

## Port Configuration

- **Frontend Dev**: Port 3002 (changed from 3000 to avoid conflict)
- **Backend API**: Port 4000 (shared with main Sonesoebid system)
- **Production**: Served via Nginx at https://qr-suite.shltechent.com

## License

Proprietary - SHL Tech Entertainment

## Support

For support, email support@shltechent.com or visit our website.
