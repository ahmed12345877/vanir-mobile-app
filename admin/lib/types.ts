export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type UserTier = 'standard' | 'elite' | 'ultra';
export type BookingCategory = 'hotel' | 'flight' | 'car' | 'experience';

export interface Booking {
  id: string;
  confirmationCode: string;
  guestName: string;
  guestEmail: string;
  category: BookingCategory;
  propertyName: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  createdAt: string;
  specialRequests?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tier: UserTier;
  totalBookings: number;
  totalSpend: number;
  currency: string;
  lastActive: string;
  joinedAt: string;
  preferredDestinations: string[];
  assignedConcierge?: string;
}

export interface AIPromptConfig {
  id: string;
  name: string;
  mode: 'concierge' | 'planner' | 'vision';
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  model: string;
  isActive: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface RevenueDataPoint {
  month: string;
  hotels: number;
  flights: number;
  cars: number;
  experiences: number;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueGrowth: number;
  activeBookings: number;
  bookingsGrowth: number;
  totalUsers: number;
  usersGrowth: number;
  aiInteractions: number;
  aiGrowth: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  targetAudience: 'all' | 'elite' | 'ultra' | 'segment';
  sentAt?: string;
  scheduledFor?: string;
  status: 'draft' | 'sent' | 'scheduled';
  openRate?: number;
}
