import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAppStore } from "@/stores/appStore";
import { useState } from "react";
import {
  Users, AlertTriangle, CreditCard, Bell, TrendingUp, CheckCircle,
  Clock, BarChart3, Settings, ClipboardList, FileText, Sparkles, Plus, Trash2, Download
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Link, useLocation } from "react-router-dom";
import jsPDF from "jspdf";

const collectionData = [
  { month: "Jan", collected: 380000, pending: 42000 },
  { month: "Feb", collected: 390000, pending: 35000 },
  { month: "Mar", collected: 375000, pending: 50000 },
  { month: "Apr", collected: 395000, pending: 28000 },
  { month: "May", collected: 362000, pending: 58000 },
];

const complaintByCategory = [
  { name: "Plumbing", value: 28 },
  { name: "Electrical", value: 22 },
  { name: "Housekeeping", value: 18 },
  { name: "Amenities", value: 15 },
  { name: "Security", value: 10 },
  { name: "Others", value: 7 },
];

const COLORS = ["#B91C1C", "#92400E", "#16A34A", "#2563EB", "#7C3AED", "#6B7280"];

export default function CommitteeDashboard() {
  const { complaints, bills, visitors, announcements, currentUser, addNotification } = useAppStore();
  const location = useLocation();
  const path = location.pathname;

  // Overview metrics
  const openComplaints = complaints.filter((c) => c.status === "open" || c.status === "in-progress");
  const totalDue = bills.filter(b => b.status !== "paid").reduce((sum, b) => sum + b.totalAmount, 0);
  const totalCollected = bills.filter(b => b.status === "paid").reduce((sum, b) => sum + b.totalAmount, 0);

  // Sub-view 1: Financial Configuration & Dues
  const [baseFee, setBaseFee] = useState("3500");
  const [penaltyFee, setPenaltyFee] = useState("350");
  const [discountFee, setDiscountFee] = useState("200");
  const [feeSuccess, setFeeSuccess] = useState(false);

  const handleUpdateFees = (e: React.FormEvent) => {
    e.preventDefault();
    setFeeSuccess(true);
    setTimeout(() => setFeeSuccess(false), 2000);
    addNotification({
      id: `notif_${Date.now()}`,
      title: "Fee Configurations Updated",
      message: `RWA maintenance fee set to ₹${baseFee}, penalty to ₹${penaltyFee}.`,
      type: "success",
      isRead: false,
      createdAt: new Date().toISOString(),
      category: "Finance"
    });
  };

  // Sub-view 2: Maintenance Vendors List
  const [vendors, setVendors] = useState([
    { id: "vnd_1", name: "Ramesh Kumar", business: "Ramesh Plumbing", phone: "+91 91111 22222", rating: "4.8" },
    { id: "vnd_2", name: "Suresh Yadav", business: "PowerFix Electricals", phone: "+91 82222 33333", rating: "4.6" },
  ]);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: "", business: "", phone: "", rating: "4.5" });

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.name || !newVendor.phone) return;
    setVendors([...vendors, { id: `vnd_${Date.now()}`, ...newVendor }]);
    setNewVendor({ name: "", business: "", phone: "", rating: "4.5" });
    setShowVendorForm(false);
  };

  const handleRemoveVendor = (id: string) => {
    setVendors(vendors.filter(v => v.id !== id));
  };

  // Sub-view 3: Reports PDF Generation
  const handleGenerateAuditPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(185, 28, 28);
    doc.text("MapleOne RWA Audit Report", 20, 25);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Maple Heights RWA Executive Audit Overview", 20, 32);
    doc.setDrawColor(185, 28, 28);
    doc.setLineWidth(1);
    doc.line(20, 36, 190, 36);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("1. SOCIETY DEMOGRAPHICS", 20, 50);
    doc.setFontSize(10);
    doc.text(`Total Units: 480 Flats`, 22, 60);
    doc.text(`Occupancy Rate: 87.7% (421 occupied units)`, 22, 67);
    doc.text(`Vacant Units: 59 vacant units`, 22, 74);
    doc.text(`Total Registered Residents: 1,246 residents`, 22, 81);

    doc.setFontSize(14);
    doc.text("2. FINANCIAL PERFORMANCE SUMMARY", 20, 95);
    doc.setFontSize(10);
    doc.text(`Monthly Collection Rate: 94.3%`, 22, 105);
    doc.text(`Total Collected Maintenance Dues (FY 2025): ₹${totalCollected.toLocaleString()}`, 22, 112);
    doc.text(`Total Outstanding Dues (Current): ₹${totalDue.toLocaleString()}`, 22, 119);

    doc.setFontSize(14);
    doc.text("3. SECURITY AND VISITOR INFLOWS", 20, 135);
    doc.setFontSize(10);
    doc.text(`Average Daily Visitors: 42 visitors`, 22, 145);
    doc.text(`Pre-approved Entries: 78% of total visits`, 22, 152);
    doc.text(`Flagged / Blocked Incidents: 0 incidents this week`, 22, 159);

    doc.setFontSize(14);
    doc.text("4. TICKET RESOLUTION AND MAINTENANCE", 20, 175);
    doc.setFontSize(10);
    doc.text(`Active Registered Staff Members: 3 members`, 22, 185);
    doc.text(`Pending Support Complaints: ${openComplaints.length} tickets open`, 22, 192);
    doc.text(`Average Ticket Close Time: 2.1 hours`, 22, 199);

    doc.setLineWidth(0.5);
    doc.line(20, 240, 190, 240);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("This report is confidential and intended for RWA Executives and Committee Members of Maple Heights.", 20, 248);
    doc.text(`Generated on: ${new Date().toLocaleString()} | MapleOne Enterprise Dashboard`, 20, 254);

    doc.save(`MapleHeights-RWA-Audit-Report-${Date.now()}.pdf`);
  };

  // Sub-view 4: Settings Toggles
  const [restrictNightEntry, setRestrictNightEntry] = useState(true);
  const [allowDeliveriesTowers, setAllowDeliveriesTowers] = useState(true);
  const [autoApproveClubhouse, setAutoApproveClubhouse] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2000);
  };

  // Route rendering checks
  if (path === "/dashboard/committee/financials") {
    return (
      <DashboardLayout title="Financial Oversight">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Main stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                <p className="text-2xl font-bold text-green-700">₹{totalCollected.toLocaleString()}</p>
                <p className="text-green-600 text-xs mt-1">Total Collected</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
                <p className="text-2xl font-bold text-amber-700">₹{totalDue.toLocaleString()}</p>
                <p className="text-amber-600 text-xs mt-1">Outstanding Due</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
                <p className="text-2xl font-bold text-blue-700">94.3%</p>
                <p className="text-blue-600 text-xs mt-1">Collection Efficiency</p>
              </div>
            </div>

            {/* Inflow chart */}
            <div className="dashboard-card p-6">
              <h3 className="font-bold text-lg mb-4">RWA Collections & Pending Dues</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={collectionData}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()}`} />
                  <Bar dataKey="collected" name="Collected" fill="#16A34A" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="pending" name="Outstanding" fill="#B91C1C" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* List of pending dues */}
            <div className="dashboard-card">
              <div className="px-6 pt-5 pb-3 border-b border-border">
                <h3 className="font-bold">Pending Dues Ledger</h3>
              </div>
              <div className="divide-y divide-border">
                {bills.filter(b => b.status !== "paid").map(bill => (
                  <div key={bill.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30">
                    <div>
                      <p className="font-bold text-sm">{bill.residentName} ({bill.flat})</p>
                      <p className="text-xs text-muted-foreground">{bill.month} {bill.year} · Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">₹{bill.totalAmount.toLocaleString()}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold uppercase">{bill.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Fee Settings Form */}
          <div className="space-y-6">
            <div className="dashboard-card p-5">
              <h3 className="font-bold text-lg font-playfair mb-3">Fee Configuration</h3>
              <form onSubmit={handleUpdateFees} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Monthly Maintenance (₹)</label>
                  <input required type="number" value={baseFee} onChange={(e) => setBaseFee(e.target.value)} className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Late Penalty Charges (₹)</label>
                  <input required type="number" value={penaltyFee} onChange={(e) => setPenaltyFee(e.target.value)} className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Early Payment Discount (₹)</label>
                  <input required type="number" value={discountFee} onChange={(e) => setDiscountFee(e.target.value)} className="input-field" />
                </div>
                <button type="submit" className="w-full btn-primary py-3">Apply Rates</button>
                {feeSuccess && (
                  <p className="text-green-600 text-xs text-center font-semibold">✓ Rates updated successfully!</p>
                )}
              </form>
            </div>

            <div className="dashboard-card p-5 space-y-3">
              <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Financial Policy</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Fees apply starting the 1st of every month. Automatic penalty triggers on the 10th if dues remain unpaid. Discount is applicable for payments received before the 5th of the month.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/committee/maintenance") {
    return (
      <DashboardLayout title="Maintenance Operations">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Coordinate on work schedules and manage partner vendors approved for society calls.</p>
            </div>
            <button onClick={() => setShowVendorForm(true)} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Add Partner Vendor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendors.map(v => (
              <div key={v.id} className="dashboard-card p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                    {v.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-base">{v.business}</p>
                    <p className="text-sm text-muted-foreground">{v.name} · {v.phone}</p>
                    <p className="text-xs text-amber-500 font-bold">Rating: ★ {v.rating}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveVendor(v.id)}
                  className="p-2.5 text-muted-foreground hover:text-red-600 bg-muted rounded-xl transition-colors"
                  title="Remove Vendor Partner"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Add vendor modal */}
          {showVendorForm && (
            <div className="modal-overlay" onClick={() => setShowVendorForm(false)}>
              <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold font-playfair">Add Partner Vendor</h3>
                  <button onClick={() => setShowVendorForm(false)} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center"><Trash2 size={14} className="rotate-45" /></button>
                </div>
                <form onSubmit={handleAddVendor} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Vendor Name *</label>
                    <input required type="text" value={newVendor.name} onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })} placeholder="Full name" className="input-field" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Business/Service Category *</label>
                    <input required type="text" value={newVendor.business} onChange={(e) => setNewVendor({ ...newVendor, business: e.target.value })} placeholder="e.g. CleanHome Services" className="input-field" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold">Phone *</label>
                      <input required type="tel" value={newVendor.phone} onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })} placeholder="+91 XXXXX" className="input-field" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold">Initial Rating</label>
                      <input type="number" step="0.1" max="5" min="1" value={newVendor.rating} onChange={(e) => setNewVendor({ ...newVendor, rating: e.target.value })} className="input-field" />
                    </div>
                  </div>
                  <button type="submit" className="w-full btn-primary py-3">Register Partner</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/committee/reports") {
    return (
      <DashboardLayout title="Society Reports">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="dashboard-card p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-primary rounded-full flex items-center justify-center mx-auto">
              <FileText size={32} />
            </div>
            <h2 className="text-xl font-bold font-playfair">Generate Society Audit Report</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Compile monthly society occupancy, security logs, visitor metrics, pending complaints, and RWA due collections into a printable PDF ledger.
            </p>
            <button
              onClick={handleGenerateAuditPDF}
              className="btn-primary py-3.5 px-8 flex items-center gap-2 mx-auto"
            >
              <Download size={18} />
              Export RWA Report (PDF)
            </button>
          </div>

          <div className="dashboard-card p-6 space-y-3">
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Report Sections Included</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">✓ Demographics (Occupancy, Total Residents, Vacant units)</li>
              <li className="flex items-center gap-2">✓ Financial Performance (Collection Rate, outstanding dues)</li>
              <li className="flex items-center gap-2">✓ Security Statistics (Daily traffic averages, incident lists)</li>
              <li className="flex items-center gap-2">✓ Maintenance resolution logs</li>
            </ul>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/committee/settings") {
    return (
      <DashboardLayout title="Society Settings">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="dashboard-card p-6 space-y-4">
            <h3 className="font-bold text-lg font-playfair">RWA Gate Security Rules</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <p className="font-bold text-sm">Night Entry Approvals</p>
                  <p className="text-xs text-muted-foreground">Force manual resident approval on visitor entries between 10PM - 6AM.</p>
                </div>
                <button onClick={() => setRestrictNightEntry(!restrictNightEntry)} className={`w-11 h-6 rounded-full p-1 transition-colors ${restrictNightEntry ? "bg-primary" : "bg-gray-300"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${restrictNightEntry ? "translate-x-5" : ""}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <p className="font-bold text-sm">Delivery Entry</p>
                  <p className="text-xs text-muted-foreground">Allow delivery agents (Zomato, Swiggy, Amazon) inside towers rather than gate pickup.</p>
                </div>
                <button onClick={() => setAllowDeliveriesTowers(!allowDeliveriesTowers)} className={`w-11 h-6 rounded-full p-1 transition-colors ${allowDeliveriesTowers ? "bg-primary" : "bg-gray-300"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${allowDeliveriesTowers ? "translate-x-5" : ""}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <p className="font-bold text-sm">Clubhouse Slots Auto-Approval</p>
                  <p className="text-xs text-muted-foreground">Instantly approve resident Clubhouse bookings if slots are empty, bypassing RWA check.</p>
                </div>
                <button onClick={() => setAutoApproveClubhouse(!autoApproveClubhouse)} className={`w-11 h-6 rounded-full p-1 transition-colors ${autoApproveClubhouse ? "bg-primary" : "bg-gray-300"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${autoApproveClubhouse ? "translate-x-5" : ""}`} />
                </button>
              </div>
            </div>

            <button onClick={handleSaveSettings} className="btn-primary py-3 px-6 mt-2">Save Rule Configurations</button>
            {settingsSuccess && (
              <p className="text-green-600 text-sm font-semibold">✓ Rules configuration updated successfully!</p>
            )}
          </div>

          <div className="dashboard-card p-6 space-y-3">
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Society Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs">Register Name</span>
                <span className="font-semibold text-foreground">Maple Heights Housing Society Ltd.</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Registration ID</span>
                <span className="font-semibold text-foreground">REG/NOIDA/2018/00912</span>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Otherwise, default overview screen
  return (
    <DashboardLayout title="Committee Dashboard">
      <div className="space-y-6">
        {/* Welcome */}
        <div className="gradient-hero rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold font-playfair">
            Society Overview — Maple Heights
          </h2>
          <p className="text-white/70 text-sm mt-1">Committee Member · {currentUser?.flat}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
            {[
              { label: "Total Flats", value: "480" },
              { label: "Occupancy", value: "87.7%" },
              { label: "Active Residents", value: "1,246" },
              { label: "Staff Members", value: "24" },
            ].map((s, i) => (
              <div key={i} className="bg-white/15 rounded-xl p-3 text-center">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Open Complaints", value: openComplaints.length, sub: "Needs attention", icon: AlertTriangle, color: "text-red-600 bg-red-50" },
            { label: "Bills Pending", value: bills.filter(b => b.status !== "paid").length, sub: `₹${(totalDue/1000).toFixed(0)}k outstanding`, icon: CreditCard, color: "text-amber-600 bg-amber-50" },
            { label: "Visitors Today", value: visitors.length, sub: `${visitors.filter(v => v.status === "inside").length} inside now`, icon: Users, color: "text-blue-600 bg-blue-50" },
            { label: "Collection Rate", value: "94.3%", sub: `₹${(totalCollected/1000).toFixed(0)}k collected`, icon: TrendingUp, color: "text-green-600 bg-green-50" },
          ].map((kpi, i) => (
            <div key={i} className="dashboard-card p-5">
              <div className={`w-11 h-11 ${kpi.color} rounded-xl flex items-center justify-center mb-3`}>
                <kpi.icon size={20} />
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="font-semibold text-sm mt-0.5">{kpi.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Collection Chart */}
          <div className="dashboard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Monthly Collection (₹)</h3>
              <BarChart3 size={18} className="text-muted-foreground" />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={collectionData} barGap={4}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, ""]} />
                <Bar dataKey="collected" name="Collected" fill="#16A34A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#B91C1C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Complaint by Category */}
          <div className="dashboard-card p-6">
            <h3 className="font-bold text-lg mb-4">Complaints by Category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={complaintByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85}>
                  {complaintByCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={10} formatter={(value) => <span style={{ fontSize: 11 }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Complaints */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border">
              <h3 className="font-bold">Recent Complaints</h3>
              <Link to="/dashboard/committee/complaints" className="text-primary text-sm hover:underline">View all →</Link>
            </div>
            <div className="divide-y divide-border">
              {complaints.slice(0, 5).map((c) => (
                <div key={c.id} className="px-6 py-3 flex items-center justify-between hover:bg-muted/30 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.priority === "urgent" ? "bg-red-500" : c.priority === "high" ? "bg-amber-500" : "bg-blue-500"}`} />
                    <div>
                      <p className="font-medium text-sm">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.raisedByFlat} · {c.category}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.status === "resolved" ? "bg-green-100 text-green-700" : c.status === "in-progress" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements & Actions */}
          <div className="space-y-4">
            <div className="dashboard-card p-5">
              <h3 className="font-bold mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Post Announcement", href: "/dashboard/committee/announcements", color: "bg-primary/10 text-primary" },
                  { label: "Create Poll", href: "/dashboard/committee/engagement", color: "bg-purple-100 text-purple-700" },
                  { label: "Generate Report", href: "/dashboard/committee/reports", color: "bg-green-100 text-green-700" },
                  { label: "Manage Residents", href: "/dashboard/committee/residents", color: "bg-blue-100 text-blue-700" },
                ].map((a, i) => (
                  <Link key={i} to={a.href} className={`${a.color} rounded-xl p-3 text-sm font-semibold text-center hover:opacity-80 transition-opacity`}>
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="dashboard-card p-5">
              <h3 className="font-bold mb-3">Recent Announcements</h3>
              <div className="space-y-2">
                {announcements.slice(0, 3).map((ann) => (
                  <div key={ann.id} className="flex items-start gap-2 py-2 border-b border-border last:border-0">
                    <Bell size={14} className={`mt-0.5 flex-shrink-0 ${ann.priority === "urgent" ? "text-red-500" : "text-amber-500"}`} />
                    <div>
                      <p className="text-sm font-medium leading-tight">{ann.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{ann.views} views · {new Date(ann.postedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
