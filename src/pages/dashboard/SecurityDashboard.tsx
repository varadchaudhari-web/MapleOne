import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAppStore } from "@/stores/appStore";
import {
  Shield, CheckCircle, X, QrCode, Car, Package, User, Clock,
  Users, AlertTriangle, Plus, Search, FileText, Download, ShieldCheck
} from "lucide-react";
import type { Visitor } from "@/types";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export default function SecurityDashboard() {
  const { visitors, updateVisitorStatus, addVisitor, currentUser, addComplaint, addNotification } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const [scanningActive, setScanningActive] = useState(false);

  // Overview stats
  const [filter, setFilter] = useState<"all" | "pending" | "inside" | "exited">("all");
  const [showEntry, setShowEntry] = useState(false);
  const [entryForm, setEntryForm] = useState({ name: "", phone: "", purpose: "Personal Visit", flatNo: "", tower: "Tower A", type: "visitor" as Visitor["type"], vehicleNo: "" });

  const filtered = filter === "all" ? visitors : visitors.filter((v) => v.status === filter);

  const handleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    addVisitor({
      id: `vis_${Date.now()}`,
      ...entryForm,
      entryTime: new Date().toISOString(),
      status: "inside",
    });
    setShowEntry(false);
    setEntryForm({ name: "", phone: "", purpose: "Personal Visit", flatNo: "", tower: "Tower A", type: "visitor", vehicleNo: "" });
  };

  const typeIcon = (t: Visitor["type"]) => {
    switch (t) {
      case "delivery": return Package;
      case "staff": return User;
      case "cab": return Car;
      default: return Users;
    }
  };

  // Sub-view 1: QR Verification
  const [qrInput, setQrInput] = useState("");
  const [scannedVisitor, setScannedVisitor] = useState<Visitor | null>(null);
  const [qrError, setQrError] = useState("");

  const handleQRScan = (e: React.FormEvent) => {
    e.preventDefault();
    const found = visitors.find(v => v.id.toLowerCase() === qrInput.trim().toLowerCase() || v.phone.includes(qrInput.trim()));
    if (found) {
      setScannedVisitor(found);
      setQrError("");
    } else {
      setScannedVisitor(null);
      setQrError("Invalid pass ID or registered phone number.");
    }
  };

  const printVisitorPass = (vis: Visitor) => {
    const doc = new jsPDF();
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 20, 170, 110, "F");
    doc.setDrawColor(185, 28, 28);
    doc.setLineWidth(1.5);
    doc.rect(20, 20, 170, 110);

    // Letterhead
    doc.setFontSize(18);
    doc.setTextColor(185, 28, 28);
    doc.text("MapleOne Gate Entry Pass", 105, 35, { align: "center" });

    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("Verified Visitor Identification Card", 105, 41, { align: "center" });
    doc.line(30, 45, 180, 45);

    // Pass details
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(`Visitor Name: ${vis.name}`, 35, 60);
    doc.text(`Contact: ${vis.phone}`, 35, 68);
    doc.text(`Destination flat: ${vis.flatNo} (${vis.tower})`, 35, 76);
    doc.text(`Purpose: ${vis.purpose}`, 35, 84);
    if (vis.vehicleNo) doc.text(`Vehicle No: ${vis.vehicleNo}`, 35, 92);
    
    // Status
    doc.setFontSize(12);
    doc.setTextColor(22, 163, 74);
    doc.text(`STATUS: ${vis.status.toUpperCase()}`, 115, 60);

    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text("Gate 1 Reception, Maple Heights", 105, 115, { align: "center" });
    doc.text(`Checked-in: ${vis.entryTime ? new Date(vis.entryTime).toLocaleString() : new Date().toLocaleString()}`, 105, 122, { align: "center" });

    doc.save(`VisitorPass-${vis.name.replace(/\s+/g, "_")}.pdf`);
  };

  // Sub-view 2: Vehicle Entry Form
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleDriver, setVehicleDriver] = useState("");
  const [vehicleFlat, setVehicleFlat] = useState("");
  const [vehicleSuccess, setVehicleSuccess] = useState(false);

  const handleVehicleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehiclePlate || !vehicleFlat) return;
    addVisitor({
      id: `vis_${Date.now()}`,
      name: vehicleDriver || "Cab Driver",
      phone: "+91 XXXXX XXXXX",
      purpose: "Cab Service",
      flatNo: vehicleFlat,
      tower: "Tower A",
      entryTime: new Date().toISOString(),
      status: "inside",
      type: "cab",
      vehicleNo: vehiclePlate,
    });
    setVehicleSuccess(true);
    setTimeout(() => {
      setVehicleSuccess(false);
      setVehiclePlate("");
      setVehicleDriver("");
      setVehicleFlat("");
    }, 2000);
  };

  // Sub-view 3: Deliveries State
  const [delivAgency, setDelivAgency] = useState("Amazon");
  const [delivPartner, setDelivPartner] = useState("");
  const [delivFlat, setDelivFlat] = useState("");
  const [delivDesc, setDelivDesc] = useState("Package");
  const [delivSuccess, setDelivSuccess] = useState(false);

  const handleDeliveryEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delivFlat) return;
    addVisitor({
      id: `vis_${Date.now()}`,
      name: `${delivAgency} Courier (${delivPartner || "Partner"})`,
      phone: "+91 XXXXX XXXXX",
      purpose: `Delivery: ${delivDesc}`,
      flatNo: delivFlat,
      tower: "Tower B",
      entryTime: new Date().toISOString(),
      status: "inside",
      type: "delivery",
    });
    setDelivSuccess(true);
    setTimeout(() => {
      setDelivSuccess(false);
      setDelivPartner("");
      setDelivFlat("");
      setDelivDesc("Package");
    }, 2000);
  };

  // Sub-view 4: Incident Reports State
  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentSeverity, setIncidentSeverity] = useState("high");
  const [incidentCat, setIncidentCat] = useState("Parking Dispute");
  const [incidentDesc, setIncidentDesc] = useState("");
  const [incidentSuccess, setIncidentSuccess] = useState(false);

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentTitle || !incidentDesc) return;
    
    // Add to complaints so committee sees it
    addComplaint({
      id: `cmp_${Date.now()}`,
      title: `⚠️ SECURITY INCIDENT: ${incidentTitle}`,
      description: incidentDesc,
      category: incidentCat,
      status: "open",
      priority: incidentSeverity as any,
      raisedBy: "Gate Security Guard",
      raisedByFlat: "Main Gate 1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Add alert
    addNotification({
      id: `notif_${Date.now()}`,
      title: "Security Incident Reported",
      message: `Incident reported: ${incidentTitle} (Severity: ${incidentSeverity})`,
      type: "error",
      isRead: false,
      createdAt: new Date().toISOString(),
      category: "Security"
    });

    setIncidentSuccess(true);
    setTimeout(() => {
      setIncidentSuccess(false);
      setIncidentTitle("");
      setIncidentDesc("");
    }, 2000);
  };

  // Sub-view 5: History Search State
  const [historySearch, setHistorySearch] = useState("");
  const filteredHistory = visitors.filter(v => 
    v.status === "exited" && 
    (v.name.toLowerCase().includes(historySearch.toLowerCase()) || 
     v.flatNo.toLowerCase().includes(historySearch.toLowerCase()) || 
     (v.vehicleNo && v.vehicleNo.toLowerCase().includes(historySearch.toLowerCase())))
  );

  // Router views switcher
  if (path === "/dashboard/security/qr") {
    return (
      <DashboardLayout title="QR Verification Terminal">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="dashboard-card p-6">
            <h3 className="font-bold text-lg font-playfair mb-3">Scan Entry Code</h3>
            <p className="text-muted-foreground text-sm mb-4">Enter the visitor pass code (e.g. vis_004, vis_001) or registered phone number to verify gate clearance.</p>
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setScanningActive(!scanningActive)}
                className="w-full py-2.5 px-4 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <QrCode size={18} />
                {scanningActive ? "Close Camera Scanner" : "Open Camera Scanner"}
              </button>
            </div>

            {scanningActive && (
              <div className="border border-dashed border-primary/50 bg-black/5 rounded-2xl p-6 text-center space-y-4 mb-4 relative overflow-hidden animate-pulse">
                {/* Red Scanning Laser Line */}
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,1)] animate-bounce" />
                <div className="w-48 h-48 border-4 border-primary/30 border-t-primary rounded-xl mx-auto flex items-center justify-center bg-black/10">
                  <span className="text-muted-foreground text-xs font-semibold">Webcam Active...</span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Select a resident code to simulate scanner hardware input:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["vis_001", "vis_002", "vis_003", "vis_004"].map(code => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          setQrInput(code);
                          const found = visitors.find(v => v.id.toLowerCase() === code);
                          if (found) {
                            setScannedVisitor(found);
                            setQrError("");
                          }
                          setScanningActive(false);
                        }}
                        className="px-2.5 py-1 bg-white border border-border text-xs rounded-lg hover:border-primary font-semibold"
                      >
                        Scan {code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleQRScan} className="flex gap-2 mb-4">
              <input
                required
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder="Enter Visitor Code / Phone..."
                className="input-field"
              />
              <button type="submit" className="btn-primary px-6 flex items-center gap-1.5"><QrCode size={16} /> Verify</button>
            </form>
            {qrError && (
              <p className="text-red-600 text-sm font-semibold">✕ {qrError}</p>
            )}
          </div>

          {scannedVisitor && (
            <div className="dashboard-card p-6 space-y-4 border-2 border-primary/20">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base">Visitor Clearance Profile</h4>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  scannedVisitor.status === "inside" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>{scannedVisitor.status}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl">
                <div>
                  <span className="text-xs text-muted-foreground block">Name</span>
                  <span className="font-semibold">{scannedVisitor.name}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Phone</span>
                  <span className="font-semibold">{scannedVisitor.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Destination Flat</span>
                  <span className="font-semibold">{scannedVisitor.flatNo} ({scannedVisitor.tower})</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Purpose</span>
                  <span className="font-semibold">{scannedVisitor.purpose}</span>
                </div>
                {scannedVisitor.vehicleNo && (
                  <div className="col-span-2">
                    <span className="text-xs text-muted-foreground block">Vehicle Number</span>
                    <span className="font-semibold">{scannedVisitor.vehicleNo}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {scannedVisitor.status === "pending" && (
                  <button
                    onClick={() => {
                      updateVisitorStatus(scannedVisitor.id, "inside");
                      setScannedVisitor({ ...scannedVisitor, status: "inside" });
                    }}
                    className="flex-1 btn-primary py-3 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle size={16} /> Grant Entry Check-in
                  </button>
                )}
                {scannedVisitor.status === "inside" && (
                  <button
                    onClick={() => {
                      updateVisitorStatus(scannedVisitor.id, "exited");
                      setScannedVisitor({ ...scannedVisitor, status: "exited" });
                    }}
                    className="flex-1 bg-red-600 text-white hover:bg-red-700 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <X size={16} /> Check-out Visitor
                  </button>
                )}
                <button
                  onClick={() => printVisitorPass(scannedVisitor)}
                  className="px-4 py-3 bg-muted rounded-xl hover:bg-muted/80 text-muted-foreground transition-colors flex items-center gap-1.5"
                  title="Print Pass PDF"
                >
                  <Download size={16} /> Print Pass
                </button>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/security/vehicles") {
    return (
      <DashboardLayout title="Vehicle Logging Control">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="dashboard-card">
              <div className="px-6 pt-5 pb-3 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-lg">Vehicles Inside Complex</h3>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-bold">
                  {visitors.filter(v => v.status === "inside" && (v.vehicleNo || v.type === "cab")).length} active
                </span>
              </div>
              <div className="divide-y divide-border">
                {visitors.filter(v => v.status === "inside" && (v.vehicleNo || v.type === "cab")).map(v => (
                  <div key={v.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Car size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{v.vehicleNo || "NO PLATE"} — {v.name}</p>
                        <p className="text-xs text-muted-foreground">{v.purpose} · flat {v.flatNo}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateVisitorStatus(v.id, "exited")}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      Log Exit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="dashboard-card p-5">
              <h3 className="font-bold text-lg font-playfair mb-3">Check-in Vehicle</h3>
              <form onSubmit={handleVehicleEntry} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">License Plate *</label>
                  <input required type="text" placeholder="e.g. MH 01 AB 1234" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Driver Name / Service</label>
                  <input type="text" placeholder="e.g. Ola Driver" value={vehicleDriver} onChange={(e) => setVehicleDriver(e.target.value)} className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Destination Flat *</label>
                  <input required type="text" placeholder="B-402" value={vehicleFlat} onChange={(e) => setVehicleFlat(e.target.value)} className="input-field" />
                </div>
                <button type="submit" className="w-full btn-primary py-3">Log Check-in</button>
                {vehicleSuccess && (
                  <p className="text-green-600 text-xs font-semibold text-center">✓ Vehicle entry recorded!</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/security/deliveries") {
    return (
      <DashboardLayout title="Deliveries Tracking">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="dashboard-card">
              <div className="px-6 pt-5 pb-3 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-lg">Parcels Currently at Gate</h3>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-bold">
                  {visitors.filter(v => v.status === "inside" && v.type === "delivery").length} items
                </span>
              </div>
              <div className="divide-y divide-border">
                {visitors.filter(v => v.status === "inside" && v.type === "delivery").map(v => (
                  <div key={v.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{v.name}</p>
                        <p className="text-xs text-muted-foreground">{v.purpose} · Destination: Flat {v.flatNo}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateVisitorStatus(v.id, "exited")}
                      className="text-xs text-green-600 font-bold hover:underline"
                    >
                      Delivered / Handed Over
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="dashboard-card p-5">
              <h3 className="font-bold text-lg font-playfair mb-3">Log Incoming Package</h3>
              <form onSubmit={handleDeliveryEntry} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Delivery Agency</label>
                  <select value={delivAgency} onChange={(e) => setDelivAgency(e.target.value)} className="input-field">
                    {["Amazon", "Flipkart", "Swiggy", "Zomato", "Dunzo", "Blinkit", "BlueDart", "Other"].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Partner Name / ID</label>
                  <input type="text" placeholder="e.g. Ramesh" value={delivPartner} onChange={(e) => setDelivPartner(e.target.value)} className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Destination Flat *</label>
                  <input required type="text" placeholder="e.g. B-402" value={delivFlat} onChange={(e) => setDelivFlat(e.target.value)} className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Description</label>
                  <input required type="text" value={delivDesc} onChange={(e) => setDelivDesc(e.target.value)} className="input-field" />
                </div>
                <button type="submit" className="w-full btn-primary py-3">Log Package</button>
                {delivSuccess && (
                  <p className="text-green-600 text-xs font-semibold text-center">✓ Delivery logged & resident notified!</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/security/incidents") {
    return (
      <DashboardLayout title="Incident Reporting Console">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="dashboard-card p-6">
            <h3 className="font-bold text-lg font-playfair mb-3">File Incident Report</h3>
            <p className="text-muted-foreground text-sm mb-4">Log security disputes, infrastructure leakages, power faults, or safety violations to alert the committee.</p>
            
            <form onSubmit={handleIncidentSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Incident Title *</label>
                <input required type="text" placeholder="e.g. Water logging in basement level B2" value={incidentTitle} onChange={(e) => setIncidentTitle(e.target.value)} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Severity / Priority</label>
                  <select value={incidentSeverity} onChange={(e) => setIncidentSeverity(e.target.value)} className="input-field">
                    <option value="low">Low (General)</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (Urgent)</option>
                    <option value="urgent">Critical Emergency</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Category</label>
                  <select value={incidentCat} onChange={(e) => setIncidentCat(e.target.value)} className="input-field">
                    {["Parking Dispute", "Civil Damage", "Electrical Fault", "Theft / Burglary", "Visitor Dispute", "Other"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Details & Actions Taken *</label>
                <textarea required rows={4} placeholder="Explain details..." value={incidentDesc} onChange={(e) => setIncidentDesc(e.target.value)} className="input-field resize-none" />
              </div>
              <button type="submit" className="w-full btn-primary py-3.5 flex items-center justify-center gap-1.5"><AlertTriangle size={18} /> File Report</button>
              {incidentSuccess && (
                <p className="text-green-600 text-sm font-semibold text-center">✓ Incident filed successfully. RWA and Lead Maintenance notified.</p>
              )}
            </form>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/security/history") {
    return (
      <DashboardLayout title="Visitor Log History">
        <div className="space-y-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search history by name, flat, or vehicle plate..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="input-field pl-12"
              />
            </div>
          </div>

          <div className="dashboard-card">
            <div className="px-6 pt-5 pb-3 border-b border-border">
              <h3 className="font-bold">Historical Check-outs</h3>
            </div>
            <div className="divide-y divide-border">
              {filteredHistory.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-6">No historical matches found</p>
              ) : (
                filteredHistory.map(v => {
                  const Icon = typeIcon(v.type);
                  return (
                    <div key={v.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground flex-shrink-0">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{v.name}</p>
                          <p className="text-xs text-muted-foreground">flat {v.flatNo} · {v.purpose} · {v.phone}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Checked out: {v.exitTime ? new Date(v.exitTime).toLocaleString() : "Exited"}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 font-bold uppercase">{v.status}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Otherwise, default overview screen
  return (
    <DashboardLayout title="Security Dashboard">
      <div className="space-y-6">
        {/* Stats */}
        <div className="gradient-hero rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-xl font-playfair">Gate Security Control</h2>
              <p className="text-white/70 text-sm">Maple Heights — Main Gate · {currentUser?.name}</p>
            </div>
            <div className="flex items-center gap-2 bg-green-400/20 px-3 py-2 rounded-xl">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">On Duty</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Inside Now", value: visitors.filter(v => v.status === "inside").length },
              { label: "Pending Approval", value: visitors.filter(v => v.status === "pending").length },
              { label: "Today's Entries", value: visitors.length },
              { label: "Today's Exits", value: visitors.filter(v => v.status === "exited").length },
            ].map((s, i) => (
              <div key={i} className="bg-white/15 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "New Entry", icon: Plus, action: () => setShowEntry(true), color: "bg-primary text-white" },
            { label: "QR Scan", icon: QrCode, action: () => navigate("/dashboard/security/qr"), color: "bg-blue-100 text-blue-700" },
            { label: "Vehicle Entry", icon: Car, action: () => navigate("/dashboard/security/vehicles"), color: "bg-amber-100 text-amber-700" },
            { label: "Incident Report", icon: AlertTriangle, action: () => navigate("/dashboard/security/incidents"), color: "bg-red-100 text-red-700" },
          ].map((a, i) => (
            <button key={i} onClick={a.action} className={`${a.color} rounded-2xl p-4 flex flex-col items-center gap-3 hover:opacity-90 transition-opacity font-semibold text-sm`}>
              <a.icon size={24} />
              {a.label}
            </button>
          ))}
        </div>

        {/* Pending Approvals */}
        {visitors.filter(v => v.status === "pending").length > 0 && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={20} className="text-amber-600" />
              <h3 className="font-bold text-amber-800">Pending Approvals ({visitors.filter(v => v.status === "pending").length})</h3>
            </div>
            <div className="space-y-3">
              {visitors.filter(v => v.status === "pending").map((v) => (
                <div key={v.id} className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="font-bold">{v.name}</p>
                    <p className="text-sm text-muted-foreground">{v.purpose} → {v.flatNo}</p>
                    <p className="text-xs text-muted-foreground">{v.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateVisitorStatus(v.id, "inside")} className="flex items-center gap-1.5 px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-semibold hover:bg-green-200 transition-colors">
                      <CheckCircle size={16} /> Allow Entry
                    </button>
                    <button onClick={() => updateVisitorStatus(v.id, "rejected")} className="flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-200 transition-colors">
                      <X size={16} /> Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "inside", "pending", "exited"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? "bg-primary text-white" : "bg-white border border-border hover:border-primary"}`}>
              {f} {f !== "all" && `(${visitors.filter(v => v.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Visitor Log */}
        <div className="dashboard-card">
          <div className="px-6 pt-5 pb-3 border-b border-border">
            <h3 className="font-bold text-lg">Visitor Log</h3>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((v) => {
              const Icon = typeIcon(v.type);
              return (
                <div key={v.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{v.name}</p>
                      <p className="text-sm text-muted-foreground">{v.purpose} · {v.flatNo}, {v.tower}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-muted-foreground">{v.phone}</span>
                        {v.vehicleNo && <span className="text-xs bg-muted px-2 py-0.5 rounded-md">{v.vehicleNo}</span>}
                        {v.entryTime && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={10} /> {new Date(v.entryTime).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${v.status === "inside" ? "bg-green-100 text-green-700" : v.status === "pending" ? "bg-amber-100 text-amber-700" : v.status === "approved" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{v.status}</span>
                    {v.status === "inside" && (
                      <button onClick={() => updateVisitorStatus(v.id, "exited")} className="text-xs text-red-600 font-medium hover:underline">Mark Exit</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Manual Entry Modal */}
        {showEntry && (
          <div className="modal-overlay" onClick={() => setShowEntry(false)}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold font-playfair">Manual Visitor Entry</h3>
                <button onClick={() => setShowEntry(false)} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center"><X size={16} /></button>
              </div>
              <form onSubmit={handleEntry} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {(["visitor", "delivery", "staff", "cab"] as const).map((t) => (
                    <button key={t} type="button" onClick={() => setEntryForm({ ...entryForm, type: t })}
                      className={`py-2 rounded-xl text-xs font-semibold capitalize border-2 transition-all ${entryForm.type === t ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>
                      {t === "staff" ? "Domestic Staff" : t}
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Visitor Name *</label>
                  <input required type="text" value={entryForm.name} onChange={(e) => setEntryForm({ ...entryForm, name: e.target.value })} placeholder="Full name" className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Phone *</label>
                    <input required type="tel" value={entryForm.phone} onChange={(e) => setEntryForm({ ...entryForm, phone: e.target.value })} placeholder="+91 XXXXX" className="input-field" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Flat No *</label>
                    <input required type="text" value={entryForm.flatNo} onChange={(e) => setEntryForm({ ...entryForm, flatNo: e.target.value })} placeholder="B-402" className="input-field" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Tower</label>
                  <select value={entryForm.tower} onChange={(e) => setEntryForm({ ...entryForm, tower: e.target.value })} className="input-field">
                    {["Tower A", "Tower B", "Tower C", "Tower D", "Tower E", "Tower F"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                {entryForm.type === "visitor" && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Vehicle No (Optional)</label>
                    <input type="text" value={entryForm.vehicleNo} onChange={(e) => setEntryForm({ ...entryForm, vehicleNo: e.target.value })} placeholder="MH 01 AB 1234" className="input-field" />
                  </div>
                )}
                <button type="submit" className="w-full btn-primary py-3.5 flex items-center justify-center gap-2"><Shield size={16} /> Allow Entry</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
