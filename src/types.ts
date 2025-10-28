export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface QRCode {
  id: string;
  userId: number;
  shortCode: string;
  shortUrl: string;
  destinationUrl: string;
  title?: string;
  description?: string;
  type: 'STATIC' | 'DYNAMIC';
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'SUSPENDED';
  scanCount: number;
  lastScannedAt?: string;
  expiresAt?: string;
  isTrial: boolean;
  trialEndsAt?: string;
  metadata?: QRCodeMetadata;
  createdAt: string;
  updatedAt: string;
  scans?: QRCodeScan[];
}

export interface QRCodeMetadata {
  fgColor?: string;
  bgColor?: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  imageSettings?: {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
  };
  qrStyle?: 'squares' | 'dots' | 'rounded' | 'heart';
  frameStyle?: string;
  frameName?: string;
  frameColor?: string;
}

export interface QRCodeScan {
  id: string;
  qrCodeId: string;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
  referrer?: string;
  scannedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  billingInterval: string;
  features?: string[];
  maxProducts?: number;
  maxBids?: number;
  prioritySupport: boolean;
  analyticsAccess: boolean;
  customBranding: boolean;
  apiAccess: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  id: string;
  userId: number;
  planId: string;
  plan: SubscriptionPlan;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAUSED' | 'PENDING';
  startDate: string;
  endDate?: string;
  nextBillingDate?: string;
  autoRenew: boolean;
  trialEndsAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  totalScans: number;
  scansToday: number;
  scansThisWeek: number;
  scansThisMonth: number;
  scansByDate: { date: string; count: number }[];
  scansByCountry: { country: string; count: number }[];
  scansByDevice: { device: string; count: number }[];
  scansByBrowser: { browser: string; count: number }[];
  scansByOS: { os: string; count: number }[];
}

