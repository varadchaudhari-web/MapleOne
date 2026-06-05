import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAppStore } from "@/stores/appStore";
import { Plus, Wrench, X, AlertTriangle } from "lucide-react";
import type { Complaint } from "@/types";

const categories = ["Plumbing", "Electrical", "Civil / Structural", "Housekeeping", "Lift / Elevator", "Security", "Parking", "Amenities", "Internet / TV", "Other"];

export default function ResidentRequests() {
  const { complaints, serviceRequests, addComplaint, currentUser } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "Plumbing", priority: "medium" as Complaint["priority"] });
  const [tab, setTab] = useState<"complaints" | "services">("complaints");

  const myComplaints = complaints.filter((c) => c.raisedByFlat === currentUser?.flat);
  const myServices = serviceRequests.filter((s) => s.residentId === currentUser?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newComplaint: Complaint = {
      id: `cmp_${Date.now()}`,
      title: form.title,
      description: form.description,
      category: form.category,
      status: "open",
      priority: form.priority,
      raisedBy: currentUser?.name || "",
      raisedByFlat: currentUser?.flat || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addComplaint(newComplaint);
    setShowForm(false);
    setForm({ title: "", description: "", category: "Plumbing", priority: "medium" });
  };

  const statusColors: Record<string, string> = {
    open: "bg-red-100 text-red-700",
    "in-progress": "bg-blue-100 text-blue-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-600",
  };

  const priorityColors: Record<string, string> = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  return (
    <DashboardLayout title="Service Requests">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(["complaints", "services"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                  tab === t ? "bg-primary text-white" : "bg-white border border-border hover:border-primary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Raise Complaint
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Open", value: myComplaints.filter(c => c.status === "open").length, color: "bg-red-50 text-red-700 border-red-200" },
            { label: "In Progress", value: myComplaints.filter(c => c.status === "in-progress").length, color: "bg-blue-50 text-blue-700 border-blue-200" },
            { label: "Resolved", value: myComplaints.filter(c => c.status === "resolved").length, color: "bg-green-50 text-green-700 border-green-200" },
            { label: "Total", value: myComplaints.length, color: "bg-muted text-foreground border-border" },
          ].map((s, i) => (
            <div key={i} className={`rounded-2xl p-4 border ${s.color}`}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* List */}
        {tab === "complaints" && (
          <div className="space-y-3">
            {myComplaints.length === 0 ? (
              <div className="dashboard-card p-12 text-center">
                <Wrench size={48} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No complaints raised yet</p>
                <button onClick={() => setShowForm(true)} className="btn-primary mt-4 px-6 py-2.5 text-sm">Raise a Complaint</button>
              </div>
            ) : (
              myComplaints.map((c) => (
                <div key={c.id} className="dashboard-card p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangle size={18} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-bold">{c.title}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityColors[c.priority]}`}>{c.priority}</span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">{c.description}</p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="text-xs bg-muted px-2 py-1 rounded-lg">{c.category}</span>
                          {c.assignedTo && <span className="text-xs text-muted-foreground">Assigned: {c.assignedTo}</span>}
                          <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 ml-3 ${statusColors[c.status]}`}>
                      {c.status.replace("-", " ")}
                    </span>
                  </div>
                  {c.status === "resolved" && c.rating && (
                    <div className="mt-3 pt-3 border-t border-border bg-green-50 rounded-xl p-3">
                      <p className="text-green-700 text-sm font-medium">✓ Resolved · Rating: {"★".repeat(c.rating)}{"☆".repeat(5 - c.rating)}</p>
                      {c.feedback && <p className="text-green-600 text-xs mt-1">"{c.feedback}"</p>}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {tab === "services" && (
          <div className="space-y-3">
            {myServices.length === 0 ? (
              <div className="dashboard-card p-12 text-center">
                <Wrench size={48} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No service requests yet</p>
              </div>
            ) : (
              myServices.map((s) => (
                <div key={s.id} className="dashboard-card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold">{s.type} Service Request</p>
                      <p className="text-muted-foreground text-sm mt-1">{s.description}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {s.assignedTo && <span className="text-xs text-muted-foreground">Vendor: {s.assignedTo}</span>}
                        {s.scheduledDate && <span className="text-xs text-muted-foreground">Scheduled: {new Date(s.scheduledDate).toLocaleDateString()}</span>}
                        {s.amount && <span className="text-xs font-medium text-primary">₹{s.amount}</span>}
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 ml-3 ${statusColors[s.status] || "bg-gray-100 text-gray-600"}`}>
                      {s.status.replace("-", " ")}
                    </span>
                  </div>
                  {s.status === "completed" && s.rating && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-green-700 text-sm">Rating: {"★".repeat(s.rating)} · {s.feedback}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Add Complaint Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Raise a Complaint</h3>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Title *</label>
                  <input required type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Brief title of the issue" className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Priority</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["low", "medium", "high", "urgent"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setForm({ ...form, priority: p })}
                        className={`py-2 rounded-xl text-xs font-medium capitalize border-2 transition-all ${
                          form.priority === p ? "border-primary bg-primary/5 text-primary" : "border-border"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Description *</label>
                  <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue in detail..." className="input-field resize-none" />
                </div>
                <button type="submit" className="w-full btn-primary py-3.5">Submit Complaint</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
