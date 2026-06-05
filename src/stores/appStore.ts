import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  User,
  Visitor,
  Complaint,
  Bill,
  FacilityBooking,
  Announcement,
  Notification,
  ServiceRequest,
  Poll,
  Event,
  Property,
  Tower,
  WorkOrder,
} from "@/types";
import {
  mockVisitors,
  mockComplaints,
  mockBills,
  mockBookings,
  mockAnnouncements,
  mockServiceRequests,
  mockPolls,
  mockEvents,
  generateNotifications,
  mockProperties,
  mockUsers,
} from "@/constants/mockData";

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;

  // Visitors
  visitors: Visitor[];
  addVisitor: (visitor: Visitor) => void;
  updateVisitorStatus: (id: string, status: Visitor["status"]) => void;

  // Complaints
  complaints: Complaint[];
  addComplaint: (complaint: Complaint) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;

  // Bills
  bills: Bill[];
  payBill: (id: string, method: string) => void;

  // Facility Bookings
  bookings: FacilityBooking[];
  addBooking: (booking: FacilityBooking) => void;
  updateBookingStatus: (id: string, status: FacilityBooking["status"]) => void;

  // Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Announcement) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notification: Notification) => void;

  // Service Requests
  serviceRequests: ServiceRequest[];
  addServiceRequest: (request: ServiceRequest) => void;
  updateServiceRequest: (id: string, updates: Partial<ServiceRequest>) => void;

  // Polls
  polls: Poll[];
  voteOnPoll: (pollId: string, optionId: string) => void;

  // Events
  events: Event[];
  registerForEvent: (eventId: string) => void;

  // Properties
  properties: Property[];
  addProperty: (property: Property) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  removeProperty: (id: string) => void;

  // Towers
  towers: Tower[];
  addTower: (tower: Tower) => void;
  updateTower: (id: string, updates: Partial<Tower>) => void;
  removeTower: (id: string) => void;

  // Users
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  removeUser: (id: string) => void;

  // Work Orders
  workOrders: WorkOrder[];
  addWorkOrder: (wo: WorkOrder) => void;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
  removeWorkOrder: (id: string) => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      login: (user) =>
        set({
          currentUser: user,
          isAuthenticated: true,
          notifications: generateNotifications(user.role),
        }),
      logout: () =>
        set({ currentUser: null, isAuthenticated: false, notifications: [] }),

      visitors: mockVisitors,
      addVisitor: (visitor) =>
        set((state) => ({ visitors: [visitor, ...state.visitors] })),
      updateVisitorStatus: (id, status) =>
        set((state) => ({
          visitors: state.visitors.map((v) =>
            v.id === id
              ? {
                  ...v,
                  status,
                  exitTime: status === "exited" ? new Date().toISOString() : v.exitTime,
                }
              : v
          ),
        })),

      complaints: mockComplaints,
      addComplaint: (complaint) =>
        set((state) => ({ complaints: [complaint, ...state.complaints] })),
      updateComplaint: (id, updates) =>
        set((state) => ({
          complaints: state.complaints.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
        })),

      bills: mockBills,
      payBill: (id, method) =>
        set((state) => ({
          bills: state.bills.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status: "paid" as const,
                  paidDate: new Date().toISOString(),
                  paymentMethod: method,
                  transactionId: `TXN${Date.now()}`,
                }
              : b
          ),
        })),

      bookings: mockBookings,
      addBooking: (booking) =>
        set((state) => ({ bookings: [booking, ...state.bookings] })),
      updateBookingStatus: (id, status) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, status } : b
          ),
        })),

      announcements: mockAnnouncements,
      addAnnouncement: (announcement) =>
        set((state) => ({
          announcements: [announcement, ...state.announcements],
        })),

      notifications: [],
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),
      clearNotifications: () => set({ notifications: [] }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),

      serviceRequests: mockServiceRequests,
      addServiceRequest: (request) =>
        set((state) => ({
          serviceRequests: [request, ...state.serviceRequests],
        })),
      updateServiceRequest: (id, updates) =>
        set((state) => ({
          serviceRequests: state.serviceRequests.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      polls: mockPolls,
      voteOnPoll: (pollId, optionId) =>
        set((state) => ({
          polls: state.polls.map((p) =>
            p.id === pollId
              ? {
                  ...p,
                  userVoted: optionId,
                  totalVotes: p.totalVotes + 1,
                  options: p.options.map((o) =>
                    o.id === optionId ? { ...o, votes: o.votes + 1 } : o
                  ),
                }
              : p
          ),
        })),

      events: mockEvents,
      registerForEvent: (eventId) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  isUserRegistered: !e.isUserRegistered,
                  registeredCount: e.isUserRegistered
                    ? e.registeredCount - 1
                    : e.registeredCount + 1,
                }
              : e
          ),
        })),

      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      authModalOpen: false,
      setAuthModalOpen: (open) => set({ authModalOpen: open }),
      selectedRole: "resident",
      setSelectedRole: (role) => set({ selectedRole: role }),

      // Properties CRUD
      properties: mockProperties,
      addProperty: (property) => set((state) => ({ properties: [...state.properties, property] })),
      updateProperty: (id, updates) => set((state) => ({
        properties: state.properties.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      removeProperty: (id) => set((state) => ({
        properties: state.properties.filter(p => p.id !== id)
      })),

      // Towers CRUD
      towers: [
        { id: "tow_1", propertyId: "prop_001", name: "Tower A", totalFlats: 80, floors: 10, lifts: 2, occupancy: "97% Occupied" },
        { id: "tow_2", propertyId: "prop_001", name: "Tower B", totalFlats: 80, floors: 10, lifts: 2, occupancy: "90% Occupied" },
        { id: "tow_3", propertyId: "prop_001", name: "Tower C", totalFlats: 80, floors: 10, lifts: 2, occupancy: "85% Occupied" },
        { id: "tow_4", propertyId: "prop_001", name: "Tower D", totalFlats: 80, floors: 10, lifts: 2, occupancy: "93% Occupied" },
        { id: "tow_5", propertyId: "prop_001", name: "Tower E", totalFlats: 80, floors: 10, lifts: 2, occupancy: "88% Occupied" },
        { id: "tow_6", propertyId: "prop_001", name: "Tower F", totalFlats: 80, floors: 10, lifts: 2, occupancy: "72% Occupied" },
        { id: "tow_7", propertyId: "prop_002", name: "Tower G", totalFlats: 100, floors: 12, lifts: 3, occupancy: "95% Occupied" },
        { id: "tow_8", propertyId: "prop_002", name: "Tower H", totalFlats: 100, floors: 12, lifts: 3, occupancy: "92% Occupied" },
      ],
      addTower: (tower) => set((state) => ({ towers: [...state.towers, tower] })),
      updateTower: (id, updates) => set((state) => ({
        towers: state.towers.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      removeTower: (id) => set((state) => ({
        towers: state.towers.filter(t => t.id !== id)
      })),

      // Users CRUD
      users: Object.values(mockUsers).map(u => ({ ...u, status: u.status || "Active" })),
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (id, updates) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
      })),
      removeUser: (id) => set((state) => ({
        users: state.users.filter(u => u.id !== id)
      })),

      // Work Orders CRUD
      workOrders: [
        { id: "wo_1", task: "Elevator Rope Inspection", location: "Tower C Lift 2", time: "2026-06-05, 2:00 PM", status: "Scheduled" },
        { id: "wo_2", task: "Water Tank Chlorine Treatment", location: "Central Rooftop Tanks", time: "2026-06-06, 8:00 AM", status: "Scheduled" },
        { id: "wo_3", task: "Basement Lighting Safety Check", location: "Basement Level B1", time: "2026-06-10, 10:00 AM", status: "Pending" },
        { id: "wo_4", task: "Fire Extinguisher Pressure Refill", location: "Towers A & B Lobby", time: "2026-06-12, 11:30 AM", status: "Completed" },
        { id: "wo_5", task: "Main Gate Intercom Line Repair", location: "Security Booth Gate 1", time: "2026-06-04, 3:00 PM", status: "Completed" },
      ],
      addWorkOrder: (wo) => set((state) => ({ workOrders: [wo, ...state.workOrders] })),
      updateWorkOrder: (id, updates) => set((state) => ({
        workOrders: state.workOrders.map(wo => wo.id === id ? { ...wo, ...updates } : wo)
      })),
      removeWorkOrder: (id) => set((state) => ({
        workOrders: state.workOrders.filter(wo => wo.id !== id)
      })),
    }),
    {
      name: "mapleone-storage",
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        notifications: state.notifications,
        bills: state.bills,
        bookings: state.bookings,
        complaints: state.complaints,
        serviceRequests: state.serviceRequests,
        polls: state.polls,
        events: state.events,
        properties: state.properties,
        towers: state.towers,
        users: state.users,
        workOrders: state.workOrders,
      }),
    }
  )
);
