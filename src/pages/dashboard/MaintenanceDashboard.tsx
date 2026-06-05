import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAppStore } from "@/stores/appStore";
import { useState } from "react";
import { Wrench, Clock, CheckCircle, AlertTriangle, TrendingUp, User, Store, Activity, FileText, ClipboardList, Check, Plus, Edit2, Trash2, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useLocation } from "react-router-dom";
import { mockVendors } from "@/constants/mockData";
import type { WorkOrder } from "@/types";

const weeklyWork = [
  { day: "Mon", completed: 4 }, { day: "Tue", completed: 6 }, { day: "Wed", completed: 3 },
  { day: "Thu", completed: 7 }, { day: "Fri", completed: 5 }, { day: "Sat", completed: 2 },
];

export default function MaintenanceDashboard() {
  const { complaints, updateComplaint, serviceRequests, updateServiceRequest, currentUser, workOrders, addWorkOrder, updateWorkOrder, removeWorkOrder } = useAppStore();
  const location = useLocation();
  const path = location.pathname;

  // Work Order CRUD states
  const [isAddWOModalOpen, setIsAddWOModalOpen] = useState(false);
  const [isEditWOModalOpen, setIsEditWOModalOpen] = useState(false);
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);

  const [woForm, setWoForm] = useState({
    task: "",
    location: "",
    time: "",
    status: "Scheduled" as "Scheduled" | "Pending" | "Completed",
  });

  const resetWOForm = () => {
    setWoForm({
      task: "",
      location: "",
      time: "",
      status: "Scheduled",
    });
  };

  const handleOpenEditWO = (wo: WorkOrder) => {
    setSelectedWO(wo);
    setWoForm({
      task: wo.task,
      location: wo.location,
      time: wo.time,
      status: wo.status as "Scheduled" | "Pending" | "Completed",
    });
    setIsEditWOModalOpen(true);
  };

  const handleAddWOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWO: WorkOrder = {
      id: `wo_${Date.now()}`,
      task: woForm.task,
      location: woForm.location,
      time: woForm.time,
      status: woForm.status,
    };
    addWorkOrder(newWO);
    setIsAddWOModalOpen(false);
    resetWOForm();
  };

  const handleEditWOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWO) return;
    updateWorkOrder(selectedWO.id, {
      task: woForm.task,
      location: woForm.location,
      time: woForm.time,
      status: woForm.status,
    });
    setIsEditWOModalOpen(false);
    setSelectedWO(null);
    resetWOForm();
  };

  const myTickets = complaints.filter(c => c.assignedTo === currentUser?.name || c.status === "open" || c.status === "in-progress");
  const myCompletedTickets = complaints.filter(c => c.status === "resolved" && (c.assignedTo === currentUser?.name || !c.assignedTo));

  // Sub-view checklist tracking state
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Inspect toolkit & check replacement components", done: true },
    { id: 2, text: "Examine site & verify safety protocols", done: false },
    { id: 3, text: "Perform mechanical repairs / replacement", done: false },
    { id: 4, text: "Clean work area and dispose waste", done: false },
    { id: 5, text: "Register final status update & request review", done: false },
  ]);

  const toggleCheckItem = (id: number) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  // Sub-view routing
  if (path === "/dashboard/maintenance/tickets") {
    return (
      <DashboardLayout title="Ticket Queue">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm">Assign jobs or mark outstanding tickets as in-progress.</p>
          </div>

          <div className="space-y-4">
            {myTickets.filter(c => c.status !== "resolved").map((c) => (
              <div key={c.id} className="dashboard-card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      c.priority === "urgent" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                    }`}>
                      <Wrench size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold">{c.title}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          c.priority === "urgent" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                        }`}>{c.priority}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>Flat: {c.raisedByFlat}</span>
                        <span>Category: {c.category}</span>
                        <span>Raised: {new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className="px-2.5 py-0.5 bg-muted text-muted-foreground rounded-full text-xs font-semibold">{c.status}</span>
                    {c.status === "open" ? (
                      <button
                        onClick={() => updateComplaint(c.id, { status: "in-progress", assignedTo: currentUser?.name })}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Accept Job →
                      </button>
                    ) : (
                      <button
                        onClick={() => updateComplaint(c.id, { status: "resolved" })}
                        className="text-xs font-semibold text-green-600 hover:underline"
                      >
                        Mark Completed ✓
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/maintenance/workorders") {
    const activeWorkOrders = workOrders.filter(w => w.status !== "Completed");
    return (
      <DashboardLayout title="Maintenance Work Orders">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm">System scheduled routine inspections and preventative tasks.</p>
            <button
              onClick={() => { resetWOForm(); setIsAddWOModalOpen(true); }}
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
            >
              <Plus size={16} /> Add Work Order
            </button>
          </div>
          
          <div className="space-y-4">
            {activeWorkOrders.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No scheduled or pending work orders.</p>
            ) : (
              activeWorkOrders.map(wo => (
                <div key={wo.id} className="dashboard-card p-5 flex items-center justify-between hover:bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <ClipboardList size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{wo.task}</p>
                      <p className="text-xs text-muted-foreground">{wo.location} · {wo.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                      wo.status === "Scheduled" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                    }`}>{wo.status}</span>
                    <button
                      onClick={() => updateWorkOrder(wo.id, { status: "Completed" })}
                      className="text-xs px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl font-bold transition-colors"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleOpenEditWO(wo)}
                      className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => removeWorkOrder(wo.id)}
                      className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Work Order Modal */}
        {isAddWOModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAddWOModalOpen(false)}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold font-serif">Add Work Order</h3>
                <button onClick={() => setIsAddWOModalOpen(false)} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleAddWOSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Task Name *</label>
                  <input required type="text" value={woForm.task} onChange={(e) => setWoForm({ ...woForm, task: e.target.value })} className="input-field" placeholder="Elevator Inspection" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Location *</label>
                  <input required type="text" value={woForm.location} onChange={(e) => setWoForm({ ...woForm, location: e.target.value })} className="input-field" placeholder="Tower C Lift 2" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Scheduled Time *</label>
                  <input required type="text" value={woForm.time} onChange={(e) => setWoForm({ ...woForm, time: e.target.value })} className="input-field" placeholder="Today, 2:00 PM" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Status *</label>
                  <select value={woForm.status} onChange={(e) => setWoForm({ ...woForm, status: e.target.value as any })} className="input-field select-field bg-white border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="Scheduled">Scheduled</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-semibold">
                  <Plus size={18} /> Schedule Task
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Work Order Modal */}
        {isEditWOModalOpen && (
          <div className="modal-overlay" onClick={() => { setIsEditWOModalOpen(false); setSelectedWO(null); }}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold font-serif">Edit Work Order</h3>
                <button onClick={() => { setIsEditWOModalOpen(false); setSelectedWO(null); }} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleEditWOSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Task Name *</label>
                  <input required type="text" value={woForm.task} onChange={(e) => setWoForm({ ...woForm, task: e.target.value })} className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Location *</label>
                  <input required type="text" value={woForm.location} onChange={(e) => setWoForm({ ...woForm, location: e.target.value })} className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Scheduled Time *</label>
                  <input required type="text" value={woForm.time} onChange={(e) => setWoForm({ ...woForm, time: e.target.value })} className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Status *</label>
                  <select value={woForm.status} onChange={(e) => setWoForm({ ...woForm, status: e.target.value as any })} className="input-field select-field bg-white border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="Scheduled">Scheduled</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-semibold">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/maintenance/vendors") {
    return (
      <DashboardLayout title="Partner Vendor Directory">
        <div className="space-y-6">
          <p className="text-muted-foreground text-sm">Coordinated external vendor operators for complex society maintenance calls.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockVendors.map(v => (
              <div key={v.id} className="dashboard-card p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                    {v.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-base">{v.businessName}</p>
                    <p className="text-sm text-muted-foreground">{v.category} · {v.phone}</p>
                    <p className="text-xs text-amber-500 font-bold">★ {v.rating} ({v.completedJobs} completed jobs)</p>
                  </div>
                </div>
                <a href={`tel:${v.phone}`} className="btn-primary text-xs px-4 py-2">Call Vendor</a>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/maintenance/tracking") {
    return (
      <DashboardLayout title="Work Tracking Checklist">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="dashboard-card p-6 space-y-4">
            <h3 className="font-bold text-lg font-playfair mb-2">Job Steps Checklist</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">Ensure all procedures are ticked off before submitting a final ticket resolution report.</p>
            
            <div className="space-y-3 pt-2">
              {checklist.map(item => (
                <div key={item.id} className="flex items-center gap-3 py-1.5 cursor-pointer" onClick={() => toggleCheckItem(item.id)}>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    item.done ? "bg-primary border-primary text-white" : "border-border"
                  }`}>
                    {item.done && <Check size={14} />}
                  </div>
                  <span className={`text-sm ${item.done ? "line-through text-muted-foreground" : "text-foreground font-medium"}`}>{item.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setChecklist(checklist.map(item => ({ ...item, done: true })));
              }}
              className="w-full btn-primary py-3"
            >
              Complete All Steps
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/maintenance/completed") {
    const completedWorkOrders = workOrders.filter(w => w.status === "Completed");
    return (
      <DashboardLayout title="Completed Work History">
        <div className="space-y-6">
          <p className="text-muted-foreground text-sm">Review closed logs and feedback evaluations from residents as well as routine inspections.</p>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-base mb-3 font-serif">Completed Work Orders</h3>
              <div className="space-y-3">
                {completedWorkOrders.length === 0 ? (
                  <p className="text-muted-foreground text-xs bg-muted/40 p-4 rounded-xl text-center">No completed work orders yet.</p>
                ) : (
                  completedWorkOrders.map(wo => (
                    <div key={wo.id} className="dashboard-card p-4 flex items-center justify-between hover:bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                          <CheckCircle size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{wo.task}</p>
                          <p className="text-xs text-muted-foreground">{wo.location} · {wo.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateWorkOrder(wo.id, { status: "Scheduled" })}
                          className="text-xs px-3 py-1.5 bg-muted text-muted-foreground hover:bg-muted/80 rounded-xl font-bold transition-colors"
                        >
                          Re-open
                        </button>
                        <button
                          onClick={() => handleOpenEditWO(wo)}
                          className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => removeWorkOrder(wo.id)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-base mb-3 font-serif">Resolved Resident Tickets</h3>
              <div className="space-y-4">
                {myCompletedTickets.length === 0 ? (
                  <p className="text-muted-foreground text-xs bg-muted/40 p-4 rounded-xl text-center">No completed resident tickets yet.</p>
                ) : (
                  myCompletedTickets.map(c => (
                    <div key={c.id} className="dashboard-card p-5 hover:bg-muted/20 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-sm">{c.title}</p>
                          <p className="text-xs text-muted-foreground">{c.raisedByFlat} · resolved on {new Date(c.updatedAt).toLocaleDateString()}</p>
                          {c.rating && (
                            <div className="mt-2 text-xs bg-green-50 p-2.5 rounded-lg text-green-700">
                              <span className="font-semibold">Rating:</span> {"★".repeat(c.rating)}
                              {c.feedback && <p className="mt-0.5">"{c.feedback}"</p>}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateComplaint(c.id, { status: "in-progress" })}
                            className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl font-bold transition-colors"
                          >
                            Re-open
                          </button>
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase">Resolved</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Work Order Modal */}
        {isEditWOModalOpen && (
          <div className="modal-overlay" onClick={() => { setIsEditWOModalOpen(false); setSelectedWO(null); }}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold font-serif">Edit Work Order</h3>
                <button onClick={() => { setIsEditWOModalOpen(false); setSelectedWO(null); }} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleEditWOSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Task Name *</label>
                  <input required type="text" value={woForm.task} onChange={(e) => setWoForm({ ...woForm, task: e.target.value })} className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Location *</label>
                  <input required type="text" value={woForm.location} onChange={(e) => setWoForm({ ...woForm, location: e.target.value })} className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Scheduled Time *</label>
                  <input required type="text" value={woForm.time} onChange={(e) => setWoForm({ ...woForm, time: e.target.value })} className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Status *</label>
                  <select value={woForm.status} onChange={(e) => setWoForm({ ...woForm, status: e.target.value as any })} className="input-field select-field bg-white border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="Scheduled">Scheduled</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-semibold">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </DashboardLayout>
    );
  }

  // Else render original overview
  return (
    <DashboardLayout title="Maintenance Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="gradient-hero rounded-2xl p-5 text-white">
          <h2 className="font-bold text-xl mb-1 font-playfair">Work Overview</h2>
          <p className="text-white/70 text-sm">{currentUser?.name} · Maintenance Staff</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              { label: "Assigned", value: myTickets.filter(t => t.status === "in-progress").length },
              { label: "Open Queue", value: myTickets.filter(t => t.status === "open").length },
              { label: "Completed Today", value: 3 },
              { label: "Avg. Resolution", value: "4.2h" },
            ].map((s, i) => (
              <div key={i} className="bg-white/15 rounded-xl p-3 text-center">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Ticket Queue */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-bold text-xl font-playfair">Active Tickets</h2>
            {myTickets.filter(c => c.status !== "resolved" && c.status !== "closed").map((c) => (
              <div key={c.id} className="dashboard-card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${c.priority === "urgent" ? "bg-red-100" : c.priority === "high" ? "bg-amber-100" : "bg-blue-100"}`}>
                      <Wrench size={20} className={c.priority === "urgent" ? "text-red-600" : c.priority === "high" ? "text-amber-600" : "text-blue-600"} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold">{c.title}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.priority === "urgent" ? "bg-red-100 text-red-700" : c.priority === "high" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>{c.priority}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><User size={12} /> {c.raisedByFlat}</span>
                        <span className="bg-muted px-2 py-0.5 rounded-md">{c.category}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${c.status === "in-progress" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{c.status}</span>
                    {c.status === "open" && (
                      <button onClick={() => updateComplaint(c.id, { status: "in-progress", assignedTo: currentUser?.name })}
                        className="text-xs font-medium text-primary hover:underline">Accept Job →</button>
                    )}
                    {c.status === "in-progress" && (
                      <button onClick={() => updateComplaint(c.id, { status: "resolved" })}
                        className="text-xs font-medium text-green-600 hover:underline">Mark Done ✓</button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {myTickets.filter(c => c.status === "resolved").length > 0 && (
              <div>
                <h3 className="font-bold mb-3 text-muted-foreground text-sm uppercase tracking-wider">Recently Resolved</h3>
                {myTickets.filter(c => c.status === "resolved").map((c) => (
                  <div key={c.id} className="dashboard-card p-4 flex items-center justify-between opacity-70 mb-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-green-600" />
                      <div>
                        <p className="font-medium text-sm">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.raisedByFlat} · {c.category}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Resolved</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="space-y-5">
            <div className="dashboard-card p-5">
              <h3 className="font-bold mb-4">Weekly Performance</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyWork}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#16A34A" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-2 mt-3">
                <TrendingUp size={16} className="text-green-600" />
                <p className="text-sm text-green-600 font-medium">27 jobs completed this week</p>
              </div>
            </div>

            <div className="dashboard-card p-5 space-y-3">
              <h3 className="font-bold">Today's Summary</h3>
              {[
                { label: "Jobs Completed", value: "3", color: "text-green-600" },
                { label: "In Progress", value: "2", color: "text-blue-600" },
                { label: "Pending Queue", value: `${myTickets.filter(t => t.status === "open").length}`, color: "text-amber-600" },
                { label: "Avg. Time/Job", value: "1.8 hrs", color: "text-purple-600" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className={`font-bold text-sm ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
