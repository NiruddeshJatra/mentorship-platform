// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'mentor' | 'mentee';
  bio?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'mentor' | 'mentee';
}

// Mentor Types
export interface Mentor {
  id: string;
  userId: string;
  user: User;
  company?: string;
  experience?: string;
  baseHourlyRate?: number;
  rating?: number;
  expertise: MentorExpertise[];
  availabilitySlots: AvailabilitySlot[];
}

export interface MentorExpertise {
  id: string;
  mentorId: string;
  topicId: string;
  topic: Topic;
  duration: number;
  price: number;
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

// Availability & Booking Types
export interface AvailabilitySlot {
  id: string;
  mentorId: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  status: 'available' | 'booked' | 'unavailable';
}

export interface Booking {
  id: string;
  menteeId: string;
  mentorId: string;
  mentorExpertiseId: string;
  availabilitySlotId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
  mentee: User;
  mentor: Mentor;
  mentorExpertise: MentorExpertise;
  availabilitySlot: AvailabilitySlot;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}