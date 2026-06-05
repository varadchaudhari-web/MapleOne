import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAppStore } from "@/stores/appStore";
import { Plus, MapPin, QrCode, Phone, Clock, CheckCircle, X, Car, Package, User } from "lucide-react";
import type { Visitor } from "@/types";

const purposeOptions = ["Personal Visit", "Guest Visit", "Relative Visit", "Food Delivery", "Package Delivery", "Domestic Help", "Cab / Transport", "Vendor / Service", "Other"];

export default function ResidentVisitors() {
  const { visitors, addVisitor, updateVisitorStatus, currentUser } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "inside" | "pending" | "exited">("all");
  const [form, setForm] = useState({ name: "", phone: "", purpose: "Personal Visit", type: "visitor" as Visitor["type"], vehicleNo: "" });

  const myVisitors = visitors.filter((v) => v.flatNo === currentUser?.flat);
  const filtered = filter === "all" ? myVisitors : myVisitors.filter((v) => v.status === filter);

  const handleAddVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    const newVisitor: Visitor = {
      id: `vis_${Date.now()}`,
      name: form.name,
      phone: form.phone,
      purpose: form.purpose,
      flatNo: currentUser?.flat || "",
      tower: currentUser?.tower || "",
      entryTime: "",
      status: "pending",
      type: form.type,
      vehicleNo: form.vehicleNo || undefined,
    };
    addVisitor(newVisitor);
    setShowForm(false);
    setForm({ name: "", phone: "", purpose: "Personal Visit", type: "visitor", vehicleNo: "" });
  };

  const getTypeIcon = (type: Visitor["type"]) => {
    switch (type) {
      case "delivery": return Package;
      case "staff": return User;
      case "cab": return Car;
      default: return MapPin;
    }
  };

  return (
    <DashboardLayout title="Visitor Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Manage and track all visitors to {currentUser?.flat}</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Invite Visitor
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Inside Now", value: myVisitors.filter(v => v.status === "inside").length, color: "bg-green-50 text-green-700 border-green-200" },
            { label: "Pending", value: myVisitors.filter(v => v.status === "pending").length, color: "bg-amber-50 text-amber-700 border-amber-200" },
            { label: "Today's Total", value: myVisitors.length, color: "bg-blue-50 text-blue-700 border-blue-200" },
            { label: "Exited", value: myVisitors.filter(v => v.status === "exited").length, color: "bg-gray-50 text-gray-700 border-gray-200" },
          ].map((s, i) => (
            <div key={i} className={`rounded-2xl p-4 border ${s.color}`}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "inside", "pending", "exited"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filter === f ? "bg-primary text-white" : "bg-white border border-border hover:border-primary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Visitor List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="dashboard-card p-12 text-center">
              <MapPin size={48} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="font-semibold text-muted-foreground">No visitors found</p>
              <button onClick={() => setShowForm(true)} className="btn-primary mt-4 px-6 py-2.5 text-sm">
                Invite a Visitor
              </button>
            </div>
          ) : (
            filtered.map((visitor) => {
              const TypeIcon = getTypeIcon(visitor.type);
              return (
                <div key={visitor.id} className="dashboard-card p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <TypeIcon size={22} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-bold">{visitor.name}</p>
                        <p className="text-sm text-muted-foreground">{visitor.purpose}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone size={12} /> {visitor.phone}
                          </span>
                          {visitor.vehicleNo && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Car size={12} /> {visitor.vehicleNo}
                            </span>
                          )}
                        </div>
                        {visitor.entryTime && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock size={12} /> Entry: {new Date(visitor.entryTime).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        visitor.status === "inside" ? "bg-green-100 text-green-700" :
                        visitor.status === "pending" ? "bg-amber-100 text-amber-700" :
                        visitor.status === "approved" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {visitor.status}
                      </span>
                      {visitor.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateVisitorStatus(visitor.id, "approved")}
                            className="p-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => updateVisitorStatus(visitor.id, "rejected")}
                            className="p-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Visitor Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Invite Visitor</h3>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleAddVisitor} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {(["visitor", "delivery", "staff", "cab"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, type: t })}
                      className={`py-2 rounded-xl text-sm font-medium capitalize border-2 transition-all ${
                        form.type === t ? "border-primary bg-primary/5 text-primary" : "border-border"
                      }`}
                    >
                      {t === "staff" ? "Domestic Staff" : t === "cab" ? "Cab / Transport" : t === "delivery" ? "Delivery" : "Visitor"}
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Visitor Name *</label>
                  <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Phone Number *</label>
                  <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Purpose of Visit</label>
                  <select value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="input-field">
                    {purposeOptions.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                {(form.type === "visitor" || form.type === "cab") && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Vehicle Number (Optional)</label>
                    <input type="text" value={form.vehicleNo} onChange={(e) => setForm({ ...form, vehicleNo: e.target.value })} placeholder="e.g. MH 01 AB 1234" className="input-field" />
                  </div>
                )}
                <button type="submit" className="w-full btn-primary py-3.5 flex items-center justify-center gap-2">
                  <QrCode size={18} />
                  Send Visitor Invite
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
