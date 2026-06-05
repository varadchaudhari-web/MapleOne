export type UserRole =
  | "resident"
  | "committee"
  | "security"
  | "maintenance"
  | "vendor"
  | "builder"
  | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  flat?: string;
  tower?: string;
  society?: string;
  isVerified: boolean;
  joinedDate: string;
  status?: string;
}

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  flatNo: string;
  tower: string;
  entryTime: string;
  exitTime?: string;
  status: "pending" | "approved" | "rejected" | "inside" | "exited";
  photo?: string;
  qrCode?: string;
  approvedBy?: string;
  vehicleNo?: string;
  type: "visitor" | "delivery" | "staff" | "cab";
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  raisedBy: string;
  raisedByFlat: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  images?: string[];
  feedback?: string;
  rating?: number;
}

export interface Bill {
  id: string;
  residentId: string;
  residentName: string;
  flat: string;
  tower: string;
  month: string;
  year: number;
  maintenanceAmount: number;
  waterCharges: number;
  electricityCharges: number;
  parkingCharges: number;
  penalty: number;
  discount: number;
  totalAmount: number;
  dueDate: string;
  paidDate?: string;
  status: "pending" | "paid" | "overdue" | "partial";
  paymentMethod?: string;
  transactionId?: string;
}

export interface FacilityBooking {
  id: string;
  facilityName: string;
  facilityType: string;
  residentId: string;
  residentName: string;
  flat: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  amount: number;
  purpose?: string;
  guestCount?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  postedBy: string;
  postedAt: string;
  priority: "normal" | "important" | "urgent";
  targetRoles: UserRole[];
  attachments?: string[];
  views: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
  actionLink?: string;
  category: string;
}

export interface Facility {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerHour: number;
  amenities: string[];
  availability: string[];
  image?: string;
  isAvailable: boolean;
  maintenanceSchedule?: string;
}

export interface ServiceRequest {
  id: string;
  type: string;
  description: string;
  residentId: string;
  residentName: string;
  flat: string;
  status: "pending" | "assigned" | "in-progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  assignedTo?: string;
  vendorId?: string;
  scheduledDate?: string;
  completedDate?: string;
  amount?: number;
  rating?: number;
  feedback?: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  businessName: string;
  category: string;
  phone: string;
  email: string;
  rating: number;
  totalJobs: number;
  completedJobs: number;
  earnings: number;
  isApproved: boolean;
  services: string[];
  joinedDate: string;
}

export interface Property {
  id: string;
  societyName: string;
  address: string;
  city: string;
  totalTowers: number;
  totalFlats: number;
  occupiedFlats: number;
  vacantFlats: number;
  totalResidents: number;
  buildYear: number;
  amenities: string[];
  monthlyMaintenance: number;
  healthScore: number;
}

export interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  totalVotes: number;
  userVoted?: string;
  status: "active" | "closed";
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  maxAttendees: number;
  registeredCount: number;
  category: string;
  image?: string;
  isUserRegistered?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  shift: string;
  status: "active" | "on-leave" | "inactive";
  joinedDate: string;
  salary: number;
  rating: number;
}

export interface Tower {
  id: string;
  propertyId: string;
  name: string;
  totalFlats: number;
  floors: number;
  lifts: number;
  occupancy: string;
}

export interface WorkOrder {
  id: string;
  task: string;
  location: string;
  time: string;
  status: string;
}


