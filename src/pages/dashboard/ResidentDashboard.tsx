import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAppStore } from "@/stores/appStore";
import { Link, useLocation } from "react-router-dom";
import {
  MapPin, CreditCard, Wrench, Calendar, Bell,
  TrendingUp, AlertCircle, CheckCircle, Clock, Plus,
  Shield, Phone, Trash2, UserPlus, Search, Sparkles, Upload, Lock, ShieldAlert
} from "lucide-react";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";

const billHistory = [
  { month: "Jan", amount: 5200 }, { month: "Feb", amount: 5200 }, { month: "Mar", amount: 5500 },
  { month: "Apr", amount: 5850 }, { month: "May", amount: 5800 },
];

export default function ResidentDashboard() {
  const { currentUser, visitors, complaints, bills, bookings, announcements, events, addComplaint, addNotification, addServiceRequest } = useAppStore();
  const location = useLocation();
  const path = location.pathname;

  // Overview states
  const myBills = bills.filter((b) => b.residentId === currentUser?.id);
  const pendingBill = myBills.find((b) => b.status === "pending" || b.status === "overdue");
  const myVisitors = visitors.filter((v) => v.flatNo === currentUser?.flat);
  const myComplaints = complaints.filter((c) => c.raisedByFlat === currentUser?.flat);
  const myBookings = bookings.filter((b) => b.residentId === currentUser?.id);
  const upcomingEvents = events.slice(0, 2);
  const latestAnnouncements = announcements.slice(0, 3);

  // Sub-view 1: Family Member State
  const [family, setFamily] = useState<{ id: string; name: string; relation: string; phone: string; type: string }[]>(() => {
    const saved = localStorage.getItem("mapleone-family");
    return saved ? JSON.parse(saved) : [
      { id: "fam_1", name: "Neha Sharma", relation: "Spouse", phone: "+91 98765 43211", type: "Co-resident" },
      { id: "fam_2", name: "Kabir Sharma", relation: "Son", phone: "+91 98765 43212", type: "Co-resident" }
    ];
  });
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [newFamilyMember, setNewFamilyMember] = useState({ name: "", relation: "Spouse", phone: "", type: "Co-resident" });

  useEffect(() => {
    localStorage.setItem("mapleone-family", JSON.stringify(family));
  }, [family]);

  const handleAddFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamilyMember.name || !newFamilyMember.phone) return;
    setFamily([...family, { id: `fam_${Date.now()}`, ...newFamilyMember }]);
    setNewFamilyMember({ name: "", relation: "Spouse", phone: "", type: "Co-resident" });
    setShowFamilyForm(false);
  };

  const handleRemoveFamily = (id: string) => {
    setFamily(family.filter(f => f.id !== id));
  };

  // Sub-view 2: Marketplace State
  const marketplaceServices = [
    { id: "srv_pl_1", title: "Leaking Tap & Pipe Repair", category: "Plumbing", vendor: "Ramesh Plumbing", price: 299, rating: 4.8 },
    { id: "srv_el_1", title: "MCB Tripping & Short Circuit Fix", category: "Electrical", vendor: "PowerFix Electricals", price: 399, rating: 4.6 },
    { id: "srv_hk_1", title: "Professional Bathroom Deep Cleaning", category: "Housekeeping", vendor: "CleanHome Services", price: 599, rating: 4.5 },
    { id: "srv_hk_2", title: "Sofa & Upholstery Dry Cleaning", category: "Housekeeping", vendor: "CleanHome Services", price: 999, rating: 4.5 },
    { id: "srv_pl_2", title: "Geyser Installation & Servicing", category: "Plumbing", vendor: "Ramesh Plumbing", price: 499, rating: 4.8 },
  ];
  const [marketSearch, setMarketSearch] = useState("");
  const [marketCat, setMarketCat] = useState("All");
  const [selectedService, setSelectedService] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filteredServices = marketplaceServices.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(marketSearch.toLowerCase()) || s.vendor.toLowerCase().includes(marketSearch.toLowerCase());
    const matchesCat = marketCat === "All" || s.category === marketCat;
    return matchesSearch && matchesCat;
  });

  const handleBookService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !bookingDate || !bookingTime) return;

    addServiceRequest({
      id: `svc_${Date.now()}`,
      type: selectedService.category,
      description: `${selectedService.title} by ${selectedService.vendor}. Scheduled: ${bookingDate} at ${bookingTime}. Notes: ${bookingNotes || "None"}`,
      residentId: currentUser?.id || "usr_001",
      residentName: currentUser?.name || "Aryan Sharma",
      flat: currentUser?.flat || "B-402",
      status: "pending",
      priority: "medium",
      amount: selectedService.price,
      createdAt: new Date().toISOString(),
    });

    // Send a notification
    addNotification({
      id: `notif_${Date.now()}`,
      title: "Service Request Raised",
      message: `Your booking for ${selectedService.title} has been sent to the vendor.`,
      type: "success",
      isRead: false,
      createdAt: new Date().toISOString(),
      category: "Marketplace"
    });

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedService(null);
      setBookingDate("");
      setBookingTime("");
      setBookingNotes("");
    }, 2000);
  };

  // Sub-view 3: SOS State
  const [sosCountdown, setSosCountdown] = useState<number | null>(null);
  const [sosActive, setSosActive] = useState(false);

  useEffect(() => {
    if (sosCountdown === null) return;
    if (sosCountdown === 0) {
      setSosCountdown(null);
      setSosActive(true);
      
      // Trigger Alarm
      addComplaint({
        id: `cmp_${Date.now()}`,
        title: "🚨 SOS EMERGENCY PANIC ALARM",
        description: `Resident ${currentUser?.name} in Flat ${currentUser?.flat} (${currentUser?.tower}) has triggered a panic SOS alert! Gate security and RWA committee notified.`,
        category: "Security",
        status: "open",
        priority: "urgent",
        raisedBy: currentUser?.name || "Aryan Sharma",
        raisedByFlat: currentUser?.flat || "B-402",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      addNotification({
        id: `notif_${Date.now()}`,
        title: "🚨 SOS Alarm Active!",
        message: "Panic alarm logged. Security guard has been dispatched to your flat.",
        type: "error",
        isRead: false,
        createdAt: new Date().toISOString(),
        category: "Security"
      });
      return;
    }

    const timer = setTimeout(() => {
      setSosCountdown(sosCountdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sosCountdown]);

  const triggerSOS = () => {
    setSosCountdown(5);
  };

  const cancelSOS = () => {
    setSosCountdown(null);
    setSosActive(false);
  };

  // Sub-view 4: Profile & KYC State
  const [profileName, setProfileName] = useState(currentUser?.name || "Aryan Sharma");
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || "+91 98765 43210");
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || "aryan.sharma@email.com");
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [kycDocType, setKycDocType] = useState("Aadhaar");
  const [kycDocNum, setKycDocNum] = useState("");
  const [kycFile, setKycFile] = useState<File | null>(null);
  const [kycStatus, setKycStatus] = useState(() => localStorage.getItem("mapleone-kyc-status") || "Verified"); // Default verified for template, but editable
  const [kycUploading, setKycUploading] = useState(false);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2000);
  };

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycDocNum) return;
    setKycUploading(true);
    setTimeout(() => {
      setKycUploading(false);
      setKycStatus("Pending Verification");
      localStorage.setItem("mapleone-kyc-status", "Pending Verification");
      addNotification({
        id: `notif_${Date.now()}`,
        title: "KYC Submitted",
        message: "Your verification documents have been uploaded successfully. RWA will verify soon.",
        type: "info",
        isRead: false,
        createdAt: new Date().toISOString(),
        category: "System"
      });
    }, 2000);
  };

  // Switch views depending on current route
  if (path === "/dashboard/resident/family") {
    return (
      <DashboardLayout title="Family Management">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Add and manage profiles of family members or tenants living in your unit.</p>
            </div>
            <button
              onClick={() => setShowFamilyForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <UserPlus size={18} />
              Add Member
            </button>
          </div>

          {/* Members list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {family.map((f) => (
              <div key={f.id} className="dashboard-card p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold">
                    {f.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{f.name}</p>
                    <p className="text-sm text-muted-foreground">{f.relation} · {f.type}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFamily(f.id)}
                  className="p-2.5 text-muted-foreground hover:text-red-600 bg-muted rounded-xl transition-colors"
                  title="Remove Member"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Add member form modal */}
          {showFamilyForm && (
            <div className="modal-overlay" onClick={() => setShowFamilyForm(false)}>
              <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold font-playfair">Add Family Member</h3>
                  <button onClick={() => setShowFamilyForm(false)} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80">
                    <Trash2 size={14} className="rotate-45" />
                  </button>
                </div>
                <form onSubmit={handleAddFamily} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Full Name *</label>
                    <input required type="text" value={newFamilyMember.name} onChange={(e) => setNewFamilyMember({ ...newFamilyMember, name: e.target.value })} placeholder="Full name" className="input-field" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold">Relationship</label>
                      <select value={newFamilyMember.relation} onChange={(e) => setNewFamilyMember({ ...newFamilyMember, relation: e.target.value })} className="input-field">
                        {["Spouse", "Son", "Daughter", "Parent", "Sibling", "Relative", "Tenant", "Other"].map(r => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold">Profile Type</label>
                      <select value={newFamilyMember.type} onChange={(e) => setNewFamilyMember({ ...newFamilyMember, type: e.target.value })} className="input-field">
                        {["Co-resident", "Owner", "Tenant"].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Phone Number *</label>
                    <input required type="tel" value={newFamilyMember.phone} onChange={(e) => setNewFamilyMember({ ...newFamilyMember, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" className="input-field" />
                  </div>
                  <button type="submit" className="w-full btn-primary py-3.5 flex items-center justify-center gap-2">
                    <UserPlus size={16} />
                    Register Member
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/resident/marketplace") {
    return (
      <DashboardLayout title="Local Services Marketplace">
        <div className="space-y-6">
          {/* Marketplace Banner */}
          <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10 max-w-lg space-y-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">MapleOne Marketplace</span>
              <h2 className="text-2xl font-bold font-playfair">Verified Local Service Experts</h2>
              <p className="text-white/80 text-sm">Book background-checked plumbing, electrical, and housekeeping services from operators approved by your society committee.</p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10 scale-150">
              <Sparkles size={200} />
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search services, categories, or vendors..."
                value={marketSearch}
                onChange={(e) => setMarketSearch(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto scrollbar-hide py-1">
              {["All", "Plumbing", "Electrical", "Housekeeping"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMarketCat(cat)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${
                    marketCat === cat ? "bg-primary text-white" : "bg-white border border-border hover:border-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Service Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="dashboard-card p-5 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-lg font-semibold capitalize">{service.category}</span>
                    <span className="text-amber-500 text-sm font-bold flex items-center gap-0.5">★ {service.rating}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1 leading-snug">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Provided by: <span className="font-semibold text-foreground">{service.vendor}</span></p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
                  <div>
                    <span className="text-xs text-muted-foreground block">Fixed Rate</span>
                    <span className="text-xl font-bold text-primary">₹{service.price}</span>
                  </div>
                  <button
                    onClick={() => setSelectedService(service)}
                    className="btn-primary text-xs px-4 py-2.5"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Booking Modal */}
          {selectedService && (
            <div className="modal-overlay" onClick={() => !bookingSuccess && setSelectedService(null)}>
              <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
                {bookingSuccess ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                      <CheckCircle size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-green-700">Booking Confirmed!</h3>
                    <p className="text-muted-foreground text-sm">
                      Your service request for {selectedService.title} has been logged. Vendor will contact you shortly.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold font-playfair">Schedule Service</h3>
                      <button onClick={() => setSelectedService(null)} className="w-7 h-7 bg-muted rounded-full flex items-center justify-center"><Plus size={14} className="rotate-45" /></button>
                    </div>
                    <div className="bg-muted/30 rounded-2xl p-4 mb-4">
                      <p className="font-bold text-sm">{selectedService.title}</p>
                      <p className="text-xs text-muted-foreground">{selectedService.vendor} · {selectedService.category}</p>
                      <p className="text-primary font-bold text-base mt-2">Price: ₹{selectedService.price}</p>
                    </div>
                    <form onSubmit={handleBookService} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold">Date *</label>
                          <input required type="date" min={new Date().toISOString().split("T")[0]} value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="input-field" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold">Preferred Time *</label>
                          <input required type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="input-field" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold">Notes / Issues Details (Optional)</label>
                        <textarea rows={3} value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)} placeholder="e.g. Toilet tank leaking continually..." className="input-field resize-none" />
                      </div>
                      <button type="submit" className="w-full btn-primary py-3">Confirm Schedule & Book</button>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/resident/sos") {
    return (
      <DashboardLayout title="SOS & Safety Alerts">
        <div className="max-w-2xl mx-auto space-y-6 py-6">
          {/* Emergency Alert Area */}
          <div className="dashboard-card p-8 text-center space-y-6 relative overflow-hidden">
            {sosActive ? (
              <div className="space-y-6 animate-pulse">
                <div className="w-24 h-24 bg-red-100 border-4 border-red-500 rounded-full flex items-center justify-center mx-auto text-red-600 animate-ping absolute left-1/2 -translate-x-1/2 opacity-20" />
                <div className="w-24 h-24 bg-red-100 border-4 border-red-500 rounded-full flex items-center justify-center mx-auto text-red-600 relative z-10">
                  <ShieldAlert size={48} className="text-red-600" />
                </div>
                <div className="space-y-2 relative z-10">
                  <h2 className="text-3xl font-extrabold text-red-600 font-playfair">EMERGENCY SOS ALERTED!</h2>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    A panic signal has been dispatched to Main Gate Security, RWA Administrators, and Emergency Responders. Dispatched location: Flat {currentUser?.flat}, {currentUser?.tower}.
                  </p>
                </div>
                <button
                  onClick={cancelSOS}
                  className="px-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors relative z-10"
                >
                  Cancel SOS / Deactivate Alert
                </button>
              </div>
            ) : sosCountdown !== null ? (
              <div className="space-y-6">
                <div className="w-28 h-28 bg-red-50 rounded-full border-4 border-red-500 flex items-center justify-center mx-auto text-red-600 font-extrabold text-5xl animate-bounce">
                  {sosCountdown}
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-playfair">Triggering Panic Alarm...</h2>
                  <p className="text-muted-foreground text-sm">Emergency dispatch starts in {sosCountdown} seconds. Click below immediately if this was an accident.</p>
                </div>
                <button
                  onClick={cancelSOS}
                  className="px-8 py-3.5 bg-gray-200 text-foreground rounded-xl font-bold hover:bg-gray-300 transition-colors"
                >
                  Cancel Immediately
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-24 h-24 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                  <ShieldAlert size={48} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-playfair">Emergency Panic Dispatch</h2>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    In case of burglary, medical crisis, fire, or immediate threat, trigger SOS. Security team will instantly be dispatched to flat {currentUser?.flat}.
                  </p>
                </div>
                <button
                  onClick={triggerSOS}
                  className="w-full max-w-sm py-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-lg transition-all shadow-lg hover:shadow-red-300"
                >
                  🚨 TRIGGER EMERGENCY SOS
                </button>
              </div>
            )}
          </div>

          {/* Quick Contact Numbers */}
          <div className="dashboard-card p-6 space-y-4">
            <h3 className="font-bold text-lg font-playfair">Society Emergency Directory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Main Gate Guard", number: "+91 99991 88881", icon: Phone },
                { title: "RWA Medical Desk", number: "+91 99991 88882", icon: Phone },
                { title: "Fire Control Station", number: "101", icon: Phone },
                { title: "National Ambulance", number: "102", icon: Phone },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-semibold text-sm">{c.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.number}</p>
                  </div>
                  <a href={`tel:${c.number}`} className="p-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/25 transition-colors">
                    <c.icon size={16} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/resident/profile") {
    return (
      <DashboardLayout title="My Profile & KYC Status">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card / KYC Upload */}
          <div className="lg:col-span-2 space-y-6">
            <div className="dashboard-card p-6">
              <h3 className="font-bold text-lg font-playfair mb-4">Personal Details</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Name</label>
                    <input required type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="input-field" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Phone</label>
                    <input required type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className="input-field" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Email Address</label>
                  <input required type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="input-field" />
                </div>
                <div className="grid grid-cols-3 gap-3 bg-muted/30 p-4 rounded-xl">
                  <div>
                    <span className="text-xs text-muted-foreground block">Society</span>
                    <span className="font-semibold text-sm text-foreground">{currentUser?.society}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Tower</span>
                    <span className="font-semibold text-sm text-foreground">{currentUser?.tower}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Flat No</span>
                    <span className="font-semibold text-sm text-foreground">{currentUser?.flat}</span>
                  </div>
                </div>
                <button type="submit" className="btn-primary py-3.5 px-6 flex items-center gap-2">
                  <CheckCircle size={16} />
                  Update Details
                </button>
                {profileSuccess && (
                  <p className="text-green-600 text-sm font-semibold">✓ Profile details updated successfully!</p>
                )}
              </form>
            </div>

            {/* KYC Section */}
            <div className="dashboard-card p-6">
              <h3 className="font-bold text-lg font-playfair mb-2">KYC Verification Status</h3>
              <p className="text-muted-foreground text-sm mb-4">Submit proof of identity to gain verified badge and access fast-track visitor entries.</p>
              
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  kycStatus === "Verified" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>
                  <Shield size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm capitalize">{kycStatus}</p>
                  <p className="text-xs text-muted-foreground">Document Verified: Aadhaar Card (ending 5678)</p>
                </div>
              </div>

              <form onSubmit={handleKycSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Document Type</label>
                    <select value={kycDocType} onChange={(e) => setKycDocType(e.target.value)} className="input-field">
                      {["Aadhaar", "Passport", "Voter ID", "RWA Identity Card"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Document Number *</label>
                    <input required type="text" placeholder="XXXX-XXXX-XXXX" value={kycDocNum} onChange={(e) => setKycDocNum(e.target.value)} className="input-field" />
                  </div>
                </div>
                <div className="border-2 border-dashed border-border p-6 rounded-xl text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload size={32} className="mx-auto text-muted-foreground/60 mb-2" />
                  <p className="text-sm font-semibold">Drag & Drop ID Document PDF or Image</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Max size: 5MB (PDF, PNG, JPG)</p>
                </div>
                <button type="submit" disabled={kycUploading} className="btn-primary py-3.5 px-6 flex items-center gap-2">
                  {kycUploading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload size={16} />
                      Upload & Verify
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Multi Property Support */}
          <div className="space-y-6">
            <div className="dashboard-card p-6 space-y-4">
              <h3 className="font-bold text-lg font-playfair">Multi-Property Access</h3>
              <p className="text-muted-foreground text-sm">Switch roles or property locations if you own multiple units managed by MapleOne.</p>
              
              <div className="space-y-3">
                {[
                  { society: "Maple Heights", flat: "B-402", active: true },
                  { society: "Maple Gardens", flat: "A-101 (Gurgaon)", active: false }
                ].map((p, i) => (
                  <div key={i} className={`p-4 border rounded-xl flex items-center justify-between ${
                    p.active ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted/30 cursor-pointer"
                  }`}>
                    <div>
                      <p className="font-bold text-sm">{p.society}</p>
                      <p className="text-xs text-muted-foreground">{p.flat}</p>
                    </div>
                    {p.active ? (
                      <span className="text-xs bg-primary text-white font-bold px-2 py-1 rounded-md">Active</span>
                    ) : (
                      <button className="text-xs text-muted-foreground font-semibold hover:underline">Switch</button>
                    )}
                  </div>
                ))}
              </div>
              
              <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border hover:border-primary text-sm font-semibold rounded-xl text-muted-foreground hover:text-primary transition-colors">
                <Plus size={16} /> Register Another Flat
              </button>
            </div>

            <div className="dashboard-card p-6 space-y-3">
              <h3 className="font-bold text-lg font-playfair flex items-center gap-1.5"><Lock size={18} className="text-primary" /> Security Settings</h3>
              <p className="text-muted-foreground text-sm">Control security notifications and RWA guard entry authorization rules.</p>
              <div className="space-y-2 pt-2">
                {[
                  { label: "Cab Instant Auto-Approval", active: true },
                  { label: "Delivery QR Gate Bypass", active: false },
                  { label: "SOS SMS Broadcast", active: true },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-1">
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <button className={`w-10 h-6 rounded-full p-1 transition-colors ${s.active ? "bg-primary" : "bg-gray-300"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${s.active ? "translate-x-4" : ""}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Else render original Overview view
  return (
    <DashboardLayout title="My Dashboard">
      {/* Welcome */}
      <div className="gradient-hero rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Good morning,</p>
            <h2 className="text-2xl font-bold mt-0.5 font-playfair">
              {currentUser?.name} 👋
            </h2>
            <p className="text-white/70 text-sm mt-1">
              {currentUser?.flat} · {currentUser?.tower} · {currentUser?.society}
            </p>
          </div>
          <div className="hidden sm:grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{myVisitors.filter(v => v.status === "inside").length}</p>
              <p className="text-white/60 text-xs">Visitors Inside</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{myComplaints.filter(c => c.status !== "resolved" && c.status !== "closed").length}</p>
              <p className="text-white/60 text-xs">Open Requests</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{myBookings.filter(b => b.status === "confirmed").length}</p>
              <p className="text-white/60 text-xs">Bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Invite Visitor", icon: MapPin, href: "/dashboard/resident/visitors", color: "bg-blue-50 text-blue-600" },
          { label: "Pay Bill", icon: CreditCard, href: "/dashboard/resident/bills", color: "bg-green-50 text-green-600" },
          { label: "Raise Request", icon: Wrench, href: "/dashboard/resident/requests", color: "bg-amber-50 text-amber-600" },
          { label: "Book Facility", icon: Calendar, href: "/dashboard/resident/facilities", color: "bg-purple-50 text-purple-600" },
        ].map((action, i) => (
          <Link
            key={i}
            to={action.href}
            className="dashboard-card p-4 flex flex-col items-center gap-3 hover:-translate-y-0.5 transition-transform text-center"
          >
            <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
              <action.icon size={22} />
            </div>
            <span className="text-sm font-semibold">{action.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Bill Alert */}
          {pendingBill && (
            <div className={`rounded-2xl p-5 border-l-4 ${
              pendingBill.status === "overdue"
                ? "bg-red-50 border-red-500"
                : "bg-amber-50 border-amber-500"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle size={20} className={pendingBill.status === "overdue" ? "text-red-600" : "text-amber-600"} />
                  <div>
                    <p className="font-bold text-sm">
                      {pendingBill.status === "overdue" ? "Overdue Bill!" : "Bill Due Soon"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ₹{pendingBill.totalAmount.toLocaleString()} — {pendingBill.month} {pendingBill.year}
                    </p>
                  </div>
                </div>
                <Link to="/dashboard/resident/bills" className="btn-primary text-xs px-4 py-2">
                  Pay Now
                </Link>
              </div>
            </div>
          )}

          {/* Visitor Status */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h3 className="font-bold text-lg">Recent Visitors</h3>
              <Link to="/dashboard/resident/visitors" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                <Plus size={14} /> Invite <span className="hidden sm:inline">Visitor</span>
              </Link>
            </div>
            <div className="px-6 pb-5 space-y-3">
              {myVisitors.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No visitor records yet</p>
              ) : (
                myVisitors.slice(0, 4).map((visitor) => (
                  <div key={visitor.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary text-xs font-bold">{visitor.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{visitor.name}</p>
                        <p className="text-xs text-muted-foreground">{visitor.purpose} · {visitor.type}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      visitor.status === "inside" ? "bg-green-100 text-green-700" :
                      visitor.status === "pending" ? "bg-amber-100 text-amber-700" :
                      visitor.status === "approved" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {visitor.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bill Trend Chart */}
          <div className="dashboard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Bill History (₹)</h3>
              <TrendingUp size={18} className="text-muted-foreground" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={billHistory}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v/1000).toFixed(1)}k`} />
                <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#B91C1C"
                  strokeWidth={2.5}
                  dot={{ fill: "#B91C1C", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Complaints */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h3 className="font-bold text-lg">My Complaints</h3>
              <Link to="/dashboard/resident/requests" className="text-primary text-sm font-medium hover:underline">
                Raise New +
              </Link>
            </div>
            <div className="px-6 pb-5 space-y-3">
              {myComplaints.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No active complaints</p>
              ) : (
                myComplaints.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      c.priority === "urgent" ? "bg-red-500" :
                      c.priority === "high" ? "bg-amber-500" :
                      "bg-blue-500"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.category}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                      c.status === "resolved" ? "bg-green-100 text-green-700" :
                      c.status === "in-progress" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Announcements */}
          <div className="dashboard-card">
            <div className="px-5 pt-5 pb-3 border-b border-border flex items-center justify-between">
              <h3 className="font-bold">Announcements</h3>
              <Bell size={16} className="text-muted-foreground" />
            </div>
            <div className="p-4 space-y-3">
              {latestAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-3 rounded-xl border-l-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                    ann.priority === "urgent" ? "border-l-red-500 bg-red-50/50" :
                    ann.priority === "important" ? "border-l-amber-500 bg-amber-50/50" :
                    "border-l-blue-300 bg-blue-50/30"
                  }`}
                  style={{ borderLeftWidth: "3px" }}
                >
                  <p className="font-semibold text-xs leading-tight">{ann.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{ann.content}</p>
                  <p className="text-xs text-muted-foreground mt-1.5">{new Date(ann.postedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="dashboard-card">
            <div className="px-5 pt-5 pb-3 border-b border-border flex items-center justify-between">
              <h3 className="font-bold">Upcoming Events</h3>
              <Link to="/dashboard/resident/community" className="text-primary text-xs font-medium hover:underline">View all</Link>
            </div>
            <div className="p-4 space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full font-medium">{event.category}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <p className="font-semibold text-sm">{event.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">{event.venue}</p>
                    <span className={`text-xs font-medium ${event.isUserRegistered ? "text-green-600" : "text-primary"}`}>
                      {event.isUserRegistered ? "✓ Registered" : "Register →"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="dashboard-card p-5 space-y-4">
            <h3 className="font-bold">Account Overview</h3>
            {[
              { label: "Bills Paid (2025)", value: `${myBills.filter(b => b.status === "paid").length} bills`, icon: CheckCircle, color: "text-green-600" },
              { label: "Pending Amount", value: `₹${myBills.filter(b => b.status !== "paid").reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}`, icon: Clock, color: "text-amber-600" },
              { label: "Active Bookings", value: `${myBookings.filter(b => b.status === "confirmed").length} confirmed`, icon: Calendar, color: "text-blue-600" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <stat.icon size={16} className={stat.color} />
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <span className="font-semibold text-sm">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
