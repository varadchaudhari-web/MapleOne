import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAppStore } from "@/stores/appStore";
import { mockVendors } from "@/constants/mockData";
import { useState } from "react";
import {
  Store, Star, TrendingUp, CheckCircle, Clock, DollarSign,
  Briefcase, Plus, Trash2, Calendar, FileText, Download, User
} from "lucide-react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";

const earningsData = [
  { month: "Jan", earnings: 12000 }, { month: "Feb", earnings: 14500 }, { month: "Mar", earnings: 11000 },
  { month: "Apr", earnings: 16000 }, { month: "May", earnings: 18500 },
];

export default function VendorDashboard() {
  const { serviceRequests, updateServiceRequest, currentUser, addNotification } = useAppStore();
  const location = useLocation();
  const path = location.pathname;

  const vendor = mockVendors[0];

  // Sub-view 1: Catalog Services
  const [catalog, setCatalog] = useState(vendor.services);
  const [newService, setNewService] = useState("");
  const [showCatalogForm, setShowCatalogForm] = useState(false);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.trim()) return;
    setCatalog([...catalog, newService.trim()]);
    setNewService("");
    setShowCatalogForm(false);
  };

  const handleRemoveService = (service: string) => {
    setCatalog(catalog.filter(s => s !== service));
  };

  // Sub-view 2: Slots Booking Calendar
  const [slots, setSlots] = useState([
    { id: 1, day: "Monday", time: "09:00 AM - 11:00 AM", status: "Reserved (B-402, Aryan Sharma)", blocked: false },
    { id: 2, day: "Tuesday", time: "10:00 AM - 12:00 PM", status: "Available", blocked: false },
    { id: 3, day: "Wednesday", time: "03:00 PM - 05:00 PM", status: "Reserved (C-303, Meena Reddy)", blocked: false },
    { id: 4, day: "Thursday", time: "11:00 AM - 01:00 PM", status: "Available", blocked: true },
  ]);

  const toggleBlockSlot = (id: number) => {
    setSlots(slots.map(s => s.id === id ? { ...s, blocked: !s.blocked, status: s.blocked ? "Available" : "Blocked" } : s));
  };

  // Sub-view 3: Reviews
  const reviews = [
    { id: 1, author: "Aryan Sharma", flat: "B-402", rating: 5, text: "Excellent plumbing work. Fixed the tap drip in under 20 minutes, left the site clean." },
    { id: 2, author: "Rajesh Kumar", flat: "A-201", rating: 4, text: "mcB switch replaced quickly. Punctual and polite staff." },
  ];

  // Sub-view 4: PDF Earnings Generation
  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(22, 163, 74);
    doc.text(vendor.businessName, 20, 25);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Professional Partner Earnings Invoice Summary", 20, 32);
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(1);
    doc.line(20, 36, 190, 36);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("PARTNER PROFILE", 20, 50);
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Lead Technician: ${vendor.name}`, 22, 60);
    doc.text(`Category: ${vendor.category}`, 22, 67);
    doc.text(`Phone: ${vendor.phone}`, 22, 74);
    doc.text(`Approval Status: Verified Partner`, 22, 81);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("EARNINGS SUMMARY", 20, 95);
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Total Registered Jobs: ${vendor.totalJobs}`, 22, 105);
    doc.text(`Completed Jobs: ${vendor.completedJobs}`, 22, 112);
    doc.text(`Cumulative Revenue: ₹${vendor.earnings.toLocaleString()}`, 22, 119);
    doc.text(`Avg. Service Rating: ${vendor.rating} ★`, 22, 126);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("RECENT TRANSACTIONS INFLOW", 20, 140);
    doc.setFontSize(9);
    doc.setTextColor(80);
    
    let y = 150;
    doc.text("Job ID", 22, y);
    doc.text("Resident", 55, y);
    doc.text("Flat", 95, y);
    doc.text("Type", 125, y);
    doc.text("Amount", 160, y);
    doc.line(20, y+2, 190, y+2);
    y += 10;

    serviceRequests.forEach((req, idx) => {
      doc.text(req.id.slice(0, 8), 22, y);
      doc.text(req.residentName, 55, y);
      doc.text(req.flat, 95, y);
      doc.text(req.type, 125, y);
      doc.text(`₹${req.amount || 350}`, 160, y);
      y += 8;
    });

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("This is an official MapleOne Partner earnings statement generated automatically.", 105, 275, { align: "center" });
    doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 280, { align: "center" });

    doc.save(`MapleOne-Vendor-Invoice-${vendor.name.replace(/\s+/g, "_")}.pdf`);
  };

  // Router views switcher
  if (path === "/dashboard/vendor/catalog") {
    return (
      <DashboardLayout title="Service Catalog">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Add or edit services offered to society residents.</p>
            </div>
            <button onClick={() => setShowCatalogForm(true)} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Add Service
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {catalog.map(service => (
              <div key={service} className="dashboard-card p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                    {service[0]}
                  </div>
                  <div>
                    <p className="font-bold text-base">{service}</p>
                    <p className="text-xs text-muted-foreground">Standard Callout Service</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveService(service)}
                  className="p-2.5 text-muted-foreground hover:text-red-600 bg-muted rounded-xl transition-colors"
                  title="Remove Service"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Add service modal */}
          {showCatalogForm && (
            <div className="modal-overlay" onClick={() => setShowCatalogForm(false)}>
              <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold font-playfair">Add Service Catalog</h3>
                  <button onClick={() => setShowCatalogForm(false)} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center"><Trash2 size={14} className="rotate-45" /></button>
                </div>
                <form onSubmit={handleAddService} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Service Name *</label>
                    <input required type="text" value={newService} onChange={(e) => setNewService(e.target.value)} placeholder="e.g. Toilet Flush Syphon Repair" className="input-field" />
                  </div>
                  <button type="submit" className="w-full btn-primary py-3">Publish Service</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/vendor/requests") {
    return (
      <DashboardLayout title="Callout Requests Queue">
        <div className="space-y-6">
          <p className="text-muted-foreground text-sm">Review plumbing, electrical, or utility support requests raised by residents.</p>
          
          <div className="space-y-4">
            {serviceRequests.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No callout requests open.</p>
            ) : (
              serviceRequests.map((req) => (
                <div key={req.id} className="dashboard-card p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{req.type} Callout — {req.residentName}</p>
                        <p className="text-xs text-muted-foreground">flat {req.flat} · {req.description}</p>
                        {req.amount && <p className="text-xs font-semibold text-primary mt-1">Fee: ₹{req.amount}</p>}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        req.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      }`}>{req.status}</span>
                      
                      {req.status === "pending" && (
                        <button
                          onClick={() => {
                            updateServiceRequest(req.id, { status: "assigned", assignedTo: vendor.name });
                          }}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          Accept Job →
                        </button>
                      )}
                      {req.status === "assigned" && (
                        <button
                          onClick={() => {
                            updateServiceRequest(req.id, { status: "in-progress" });
                          }}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          Start Work →
                        </button>
                      )}
                      {req.status === "in-progress" && (
                        <button
                          onClick={() => {
                            updateServiceRequest(req.id, { status: "completed", completedDate: new Date().toISOString() });
                            addNotification({
                              id: `notif_${Date.now()}`,
                              title: "Job Completed",
                              message: `Plumbing job at Flat ${req.flat} has been marked complete.`,
                              type: "success",
                              isRead: false,
                              createdAt: new Date().toISOString(),
                              category: "System"
                            });
                          }}
                          className="text-xs font-bold text-green-600 hover:underline"
                        >
                          Complete Callout ✓
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/vendor/bookings") {
    return (
      <DashboardLayout title="Slots Scheduling Calendar">
        <div className="space-y-6">
          <p className="text-muted-foreground text-sm">Control availability slots for automatic marketplace resident schedulers.</p>
          
          <div className="space-y-4">
            {slots.map(s => (
              <div key={s.id} className="dashboard-card p-5 flex items-center justify-between hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{s.day} · {s.time}</p>
                    <p className={`text-xs ${s.blocked ? "text-red-500 font-medium" : "text-muted-foreground"}`}>{s.status}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleBlockSlot(s.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    s.blocked ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {s.blocked ? "Unblock Slot" : "Block Slot"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/vendor/ratings") {
    return (
      <DashboardLayout title="Customer Reviews Feed">
        <div className="space-y-6">
          <p className="text-muted-foreground text-sm">Review quality feedback appraisals registered by society residents.</p>
          
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="dashboard-card p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{r.author}</p>
                      <p className="text-xs text-muted-foreground">Flat {r.flat}</p>
                    </div>
                  </div>
                  <span className="text-amber-500 text-sm font-bold">{"★".repeat(r.rating)}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic">"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/vendor/earnings") {
    return (
      <DashboardLayout title="Earnings Ledger">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="dashboard-card p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <DollarSign size={32} />
            </div>
            <h2 className="text-xl font-bold font-playfair">Partner Financial Invoice</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Compile full work logs history, rating averages, and billing summaries into an official MapleOne RWA Partner Invoice sheet.
            </p>
            <button
              onClick={handleDownloadInvoice}
              className="btn-primary py-3 px-8 flex items-center gap-2 mx-auto"
            >
              <Download size={18} /> Download Invoice PDF
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Else render original overview
  return (
    <DashboardLayout title="Vendor Dashboard">
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="gradient-hero rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-bold text-2xl font-playfair">{vendor.businessName}</h2>
              <p className="text-white/70 text-sm mt-1">{vendor.name} · {vendor.category}</p>
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(vendor.rating) ? "text-yellow-400 fill-yellow-400" : "text-white/30"} />
                ))}
                <span className="text-white/80 text-sm ml-1">{vendor.rating} ({vendor.totalJobs} jobs)</span>
              </div>
            </div>
            <span className="px-3 py-1.5 bg-green-400/30 text-green-200 text-xs font-bold rounded-full">Verified</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {[
              { label: "Total Jobs", value: vendor.totalJobs },
              { label: "Completed", value: vendor.completedJobs },
              { label: "Rating", value: `${vendor.rating}★` },
              { label: "Total Earnings", value: `₹${(vendor.earnings/1000).toFixed(0)}k` },
            ].map((s, i) => (
              <div key={i} className="bg-white/15 rounded-xl p-3 text-center">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Service Requests */}
            <div className="dashboard-card">
              <div className="px-6 pt-5 pb-3 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-lg">Active Service Requests</h3>
                <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-semibold">{serviceRequests.filter(r => r.status !== "completed").length} active</span>
              </div>
              <div className="divide-y divide-border">
                {serviceRequests.map((req) => (
                  <div key={req.id} className="px-6 py-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Briefcase size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-bold">{req.type} — {req.residentName}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{req.description}</p>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <span className="text-xs text-muted-foreground">{req.flat}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${req.priority === "high" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>{req.priority}</span>
                            {req.scheduledDate && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={10} />{new Date(req.scheduledDate).toLocaleDateString()}</span>}
                            {req.amount && <span className="text-xs font-semibold text-primary">₹{req.amount}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${req.status === "completed" ? "bg-green-100 text-green-700" : req.status === "assigned" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                          {req.status}
                        </span>
                        {req.status === "assigned" && (
                          <button onClick={() => updateServiceRequest(req.id, { status: "in-progress" })}
                            className="text-xs text-primary font-medium hover:underline">Start Work →</button>
                        )}
                        {req.status === "in-progress" && (
                          <button onClick={() => updateServiceRequest(req.id, { status: "completed", completedDate: new Date().toISOString() })}
                            className="text-xs text-green-600 font-medium hover:underline">Complete ✓</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Earnings Chart */}
            <div className="dashboard-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Monthly Earnings (₹)</h3>
                <TrendingUp size={18} className="text-green-600" />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={earningsData}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => [`₹${v}`, "Earnings"]} />
                  <Line type="monotone" dataKey="earnings" stroke="#16A34A" strokeWidth={2.5} dot={{ fill: "#16A34A", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-5">
            <div className="dashboard-card p-5">
              <h3 className="font-bold mb-4">Services Offered</h3>
              <div className="space-y-2">
                {vendor.services.map((service) => (
                  <div key={service} className="flex items-center gap-2 py-2 border-b border-border last:border-0">
                    <CheckCircle size={15} className="text-accent" />
                    <span className="text-sm">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card p-5 space-y-3">
              <h3 className="font-bold">Performance Metrics</h3>
              {[
                { label: "Completion Rate", value: `${Math.round((vendor.completedJobs/vendor.totalJobs)*100)}%` },
                { label: "Avg. Rating", value: `${vendor.rating}/5` },
                { label: "Response Time", value: "< 30 min" },
                { label: "Repeat Clients", value: "72%" },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{m.label}</span>
                  <span className="font-bold text-sm text-green-600">{m.value}</span>
                </div>
              ))}
            </div>

            <div className="dashboard-card p-5">
              <h3 className="font-bold mb-3 flex items-center gap-2"><DollarSign size={18} className="text-green-600" /> This Month</h3>
              <div className="text-3xl font-bold text-green-600 font-playfair">₹18,500</div>
              <p className="text-sm text-muted-foreground mt-1">+15% from last month</p>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jobs this month</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Pending payment</span>
                  <span className="font-semibold text-amber-600">₹3,200</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
