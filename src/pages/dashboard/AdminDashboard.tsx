import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockProperties, mockVendors, mockUsers } from "@/constants/mockData";
import { useState } from "react";
import {
  Globe, Users, Shield, Activity, CreditCard, Settings,
  BarChart3, FileText, TrendingUp, Check, ShieldAlert, CheckCircle, X,
  Search, Plus, Edit2, Trash2, Lock, Unlock
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from "recharts";
import { useLocation } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import type { User, UserRole } from "@/types";

const platformMetrics = [
  { month: "Nov", communities: 430, users: 85000, revenue: 3400000 },
  { month: "Dec", communities: 448, users: 88500, revenue: 3580000 },
  { month: "Jan", communities: 462, users: 91000, revenue: 3720000 },
  { month: "Feb", communities: 475, users: 94500, revenue: 3890000 },
  { month: "Mar", communities: 488, users: 98000, revenue: 4050000 },
  { month: "Apr", communities: 500, users: 102000, revenue: 4200000 },
  { month: "May", communities: 512, users: 105500, revenue: 4380000 },
];

const auditLogs = [
  { action: "User Role Changed", user: "admin@mapleone.app", target: "security.guard@maple.com", time: "2 min ago", type: "warning" },
  { action: "New Community Onboarded", user: "admin@mapleone.app", target: "Maple Gardens, Gurgaon", time: "1 hr ago", type: "success" },
  { action: "Subscription Upgraded", user: "rwa@mapleheights.com", target: "Professional Plan", time: "3 hr ago", type: "success" },
  { action: "Bulk Billing Generated", user: "committee@mapleheights.com", target: "480 units", time: "5 hr ago", type: "info" },
  { action: "Security Incident Reported", user: "security.rajan@maple.com", target: "Maple Heights – Gate 1", time: "6 hr ago", type: "error" },
];

export default function AdminDashboard() {
  const location = useLocation();
  const path = location.pathname;

  const { users, addUser, updateUser, removeUser, properties } = useAppStore();
  const [userSearch, setUserSearch] = useState("");

  // CRUD Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form State
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "resident" as UserRole,
    flat: "",
    tower: "",
    society: "Maple Heights",
  });

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      flat: user.flat || "",
      tower: user.tower || "",
      society: user.society || "Maple Heights",
    });
    setIsEditModalOpen(true);
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userForm.name,
      email: userForm.email,
      phone: userForm.phone,
      role: userForm.role,
      flat: userForm.flat,
      tower: userForm.tower,
      society: userForm.society,
      isVerified: true,
      joinedDate: new Date().toISOString().split("T")[0],
      status: "Active",
    };
    addUser(newUser);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    updateUser(selectedUser.id, {
      name: userForm.name,
      email: userForm.email,
      phone: userForm.phone,
      role: userForm.role,
      flat: userForm.flat,
      tower: userForm.tower,
      society: userForm.society,
    });
    setIsEditModalOpen(false);
    setSelectedUser(null);
    resetForm();
  };

  const resetForm = () => {
    setUserForm({
      name: "",
      email: "",
      phone: "",
      role: "resident",
      flat: "",
      tower: "",
      society: "Maple Heights",
    });
  };

  const toggleUserStatus = (id: string, currentStatus?: string) => {
    const nextStatus = currentStatus === "Blocked" ? "Active" : "Blocked";
    updateUser(id, { status: nextStatus });
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Sub-view 2: Permissions Matrix
  const [permissions, setPermissions] = useState([
    { module: "Billing Access", resident: true, committee: true, security: false, maintenance: false, vendor: false },
    { module: "Announcements Edit", resident: false, committee: true, security: false, maintenance: false, vendor: false },
    { module: "Visitor Log Grant", resident: true, committee: false, security: true, maintenance: false, vendor: false },
    { module: "Ticket Assignment", resident: false, committee: true, security: false, maintenance: true, vendor: false },
    { module: "Society Configuration", resident: false, committee: true, security: false, maintenance: false, vendor: false },
  ]);

  const togglePermission = (idx: number, role: "resident" | "committee" | "security" | "maintenance" | "vendor") => {
    const next = [...permissions];
    next[idx][role] = !next[idx][role];
    setPermissions(next);
  };

  // Sub-view 3: Subscriptions Admin
  const [subs, setSubs] = useState([
    { name: "Starter Tier", price: "₹2,999/mo", communities: 124, status: "Active" },
    { name: "Society Tier", price: "₹7,999/mo", communities: 322, status: "Active" },
    { name: "Builder Enterprise", price: "Custom", communities: 66, status: "Active" },
  ]);

  // Sub-view 4: Settings config
  const [appName, setAppName] = useState("MapleOne");
  const [adminSuccess, setAdminSuccess] = useState(false);

  const handleAdminSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminSuccess(true);
    setTimeout(() => setAdminSuccess(false), 2000);
  };

  // Router views switcher
  if (path === "/dashboard/admin/communities") {
    return (
      <DashboardLayout title="Communities Registry">
        <div className="space-y-6">
          <p className="text-muted-foreground text-sm">Review onboarded residential housing societies and portals status.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map(p => (
              <div key={p.id} className="dashboard-card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                    {p.societyName[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-base">{p.societyName}</h4>
                    <p className="text-xs text-muted-foreground">{p.city}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs py-2 bg-muted/40 rounded-xl text-center mb-3">
                  <div>
                    <span className="text-muted-foreground">Units</span>
                    <p className="font-bold">{p.totalFlats}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Occupancy</span>
                    <p className="font-bold">{p.occupiedFlats}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-border">
                  <span className="text-green-600 font-bold">Health: {p.healthScore}%</span>
                  <span className="text-muted-foreground font-semibold">Registered: {p.buildYear}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/admin/users") {
    return (
      <DashboardLayout title="User Directories">
        <div className="space-y-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search user profile database by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <button
              onClick={() => { resetForm(); setIsAddModalOpen(true); }}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
            >
              <Plus size={18} /> Add User
            </button>
          </div>

          <div className="dashboard-card">
            <div className="px-6 pt-5 pb-3 border-b border-border">
              <h3 className="font-bold text-lg">System Accounts Matrix</h3>
            </div>
            <div className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No users found matching your search.</p>
                </div>
              ) : (
                filteredUsers.map(u => (
                  <div key={u.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30">
                    <div>
                      <p className="font-bold text-sm">{u.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {u.email} · Phone: {u.phone} · Role: <span className="capitalize font-semibold text-primary">{u.role}</span>
                      </p>
                      {(u.flat || u.tower || u.society) && (
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {[u.society, u.tower, u.flat].filter(Boolean).join(" - ")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        u.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>{u.status}</span>
                      <button
                        onClick={() => toggleUserStatus(u.id, u.status)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-colors ${
                          u.status === "Active" ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {u.status === "Active" ? "Block" : "Unblock"}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
                        title="Edit User"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => removeUser(u.id)}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Add User Modal */}
        {isAddModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold font-serif">
                  Add New Platform User
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleAddUserSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Full Name *</label>
                  <input required type="text" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} className="input-field" placeholder="Rahul Sharma" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Email *</label>
                  <input required type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className="input-field" placeholder="rahul@example.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Phone Number *</label>
                  <input required type="text" value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} className="input-field" placeholder="+91 98765 43210" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Role *</label>
                    <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value as UserRole })} className="input-field select-field bg-white border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                      <option value="resident">Resident</option>
                      <option value="committee">Committee</option>
                      <option value="security">Security</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="vendor">Vendor</option>
                      <option value="builder">Builder</option>
                      <option value="admin">Super Admin</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Society</label>
                    <input type="text" value={userForm.society} onChange={(e) => setUserForm({ ...userForm, society: e.target.value })} className="input-field" placeholder="Maple Heights" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Tower</label>
                    <input type="text" value={userForm.tower} onChange={(e) => setUserForm({ ...userForm, tower: e.target.value })} className="input-field" placeholder="Tower B" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Flat</label>
                    <input type="text" value={userForm.flat} onChange={(e) => setUserForm({ ...userForm, flat: e.target.value })} className="input-field" placeholder="402" />
                  </div>
                </div>
                <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-semibold">
                  <Plus size={18} /> Create User Account
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {isEditModalOpen && (
          <div className="modal-overlay" onClick={() => { setIsEditModalOpen(false); setSelectedUser(null); }}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold font-serif">
                  Edit User Account
                </h3>
                <button onClick={() => { setIsEditModalOpen(false); setSelectedUser(null); }} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleEditUserSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Full Name *</label>
                  <input required type="text" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Email *</label>
                  <input required type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Phone Number *</label>
                  <input required type="text" value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Role *</label>
                    <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value as UserRole })} className="input-field select-field bg-white border border-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                      <option value="resident">Resident</option>
                      <option value="committee">Committee</option>
                      <option value="security">Security</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="vendor">Vendor</option>
                      <option value="builder">Builder</option>
                      <option value="admin">Super Admin</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Society</label>
                    <input type="text" value={userForm.society} onChange={(e) => setUserForm({ ...userForm, society: e.target.value })} className="input-field" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Tower</label>
                    <input type="text" value={userForm.tower} onChange={(e) => setUserForm({ ...userForm, tower: e.target.value })} className="input-field" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Flat</label>
                    <input type="text" value={userForm.flat} onChange={(e) => setUserForm({ ...userForm, flat: e.target.value })} className="input-field" />
                  </div>
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

  if (path === "/dashboard/admin/permissions") {
    return (
      <DashboardLayout title="Platform Role Matrix">
        <div className="space-y-6">
          <p className="text-muted-foreground text-sm">Toggle role scopes and platform action privileges globally.</p>
          
          <div className="dashboard-card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/60 text-xs font-bold uppercase border-b border-border">
                  <th className="p-4">Action Privileges</th>
                  <th className="p-4 text-center">Resident</th>
                  <th className="p-4 text-center">Committee</th>
                  <th className="p-4 text-center">Security</th>
                  <th className="p-4 text-center">Maintenance</th>
                  <th className="p-4 text-center">Vendor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {permissions.map((p, idx) => (
                  <tr key={p.module} className="hover:bg-muted/30">
                    <td className="p-4 font-semibold">{p.module}</td>
                    {(["resident", "committee", "security", "maintenance", "vendor"] as const).map(role => (
                      <td key={role} className="p-4 text-center">
                        <button
                          onClick={() => togglePermission(idx, role)}
                          className={`w-5 h-5 mx-auto rounded-md border flex items-center justify-center transition-all ${
                            p[role] ? "bg-primary border-primary text-white" : "border-border"
                          }`}
                        >
                          {p[role] && <Check size={14} />}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/admin/analytics") {
    return (
      <DashboardLayout title="Growth Analytics">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Platform Growth */}
          <div className="dashboard-card p-6">
            <h3 className="font-bold text-lg mb-4">Platform Growth (Users vs Societies)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={platformMetrics}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#2563EB" fill="#DBEAFE" strokeWidth={2} />
                <Area type="monotone" dataKey="communities" stroke="#16A34A" fill="#DCFCE7" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue */}
          <div className="dashboard-card p-6">
            <h3 className="font-bold text-lg mb-4">Monthly Revenue Inflow (₹)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={platformMetrics}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#B91C1C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/admin/logs") {
    return (
      <DashboardLayout title="Security Audit Logs">
        <div className="space-y-6">
          <div className="dashboard-card">
            <div className="px-6 pt-5 pb-3 border-b border-border">
              <h3 className="font-bold text-lg">System Events Log</h3>
            </div>
            <div className="divide-y divide-border">
              {auditLogs.map((log, i) => (
                <div key={i} className="px-6 py-3.5 hover:bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      log.type === "success" ? "bg-green-500" :
                      log.type === "error" ? "bg-red-500" :
                      "bg-amber-500"
                    }`} />
                    <div>
                      <p className="font-semibold text-sm">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.target} · user: {log.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/admin/subscriptions") {
    return (
      <DashboardLayout title="Payment Plans Management">
        <div className="space-y-6">
          <p className="text-muted-foreground text-sm">Platform billing packages configuration scopes.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {subs.map(s => (
              <div key={s.name} className="dashboard-card p-6 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-lg mb-1">{s.name}</h4>
                  <p className="text-2xl font-bold text-primary mb-3">{s.price}</p>
                  <p className="text-xs text-muted-foreground">Active Subscribed Communities: {s.communities}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full font-bold uppercase">{s.status}</span>
                  <button className="text-xs text-primary font-bold hover:underline">Edit Tier Rates</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/admin/monitor") {
    return (
      <DashboardLayout title="Platform Monitor">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="dashboard-card p-5 text-center space-y-2">
            <h4 className="text-muted-foreground text-xs font-bold uppercase">Average Server CPU Load</h4>
            <p className="text-3xl font-extrabold text-green-600 font-playfair">12.4%</p>
            <span className="text-xs text-green-500 font-medium">✓ Optimal Status</span>
          </div>

          <div className="dashboard-card p-5 text-center space-y-2">
            <h4 className="text-muted-foreground text-xs font-bold uppercase">System Memory Usage</h4>
            <p className="text-3xl font-extrabold text-green-600 font-playfair">4.2GB / 8GB</p>
            <span className="text-xs text-green-500 font-medium">✓ 52.5% Available</span>
          </div>

          <div className="dashboard-card p-5 text-center space-y-2">
            <h4 className="text-muted-foreground text-xs font-bold uppercase">Live Socket Sessions</h4>
            <p className="text-3xl font-extrabold text-primary font-playfair">1,246</p>
            <span className="text-xs text-muted-foreground">Active connected web terminals</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/admin/settings") {
    return (
      <DashboardLayout title="System Settings">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="dashboard-card p-6">
            <h3 className="font-bold text-lg font-playfair mb-3">Core App Properties</h3>
            <form onSubmit={handleAdminSettingsSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Application Title Name</label>
                <input required type="text" value={appName} onChange={(e) => setAppName(e.target.value)} className="input-field" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Support Desk Hotline Email</label>
                <input required type="email" defaultValue="support@mapleone.app" className="input-field" />
              </div>
              <button type="submit" className="btn-primary py-3.5 px-6">Apply Changes</button>
              {adminSuccess && (
                <p className="text-green-600 text-sm font-semibold mt-2">✓ Platform settings updated successfully.</p>
              )}
            </form>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Otherwise, default overview screen
  return (
    <DashboardLayout title="Super Admin Console">
      <div className="space-y-6">
        {/* Header */}
        <div className="gradient-hero rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold font-playfair">Platform Control Center</h2>
              <p className="text-white/70 text-sm">MapleOne Super Admin · Full Access</p>
            </div>
            <div className="flex items-center gap-2 bg-green-400/20 px-3 py-2 rounded-xl">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">All Systems Operational</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Communities", value: "512" },
              { label: "Total Users", value: "1,05,500" },
              { label: "MRR", value: "₹43.8L" },
              { label: "Uptime", value: "99.97%" },
            ].map((s, i) => (
              <div key={i} className="bg-white/15 rounded-xl p-3 text-center">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Active Subscriptions", value: "498", sub: "14 trials ending soon", icon: CreditCard, color: "bg-blue-50 text-blue-600" },
            { label: "Verified Vendors", value: "542", sub: "12 pending approval", icon: Users, color: "bg-green-50 text-green-600" },
            { label: "Security Events", value: "23", sub: "This week", icon: Shield, color: "bg-red-50 text-red-600" },
            { label: "Platform Health", value: "98.4%", sub: "All services normal", icon: Activity, color: "bg-purple-50 text-purple-600" },
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
          {/* Platform Growth */}
          <div className="dashboard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Platform Growth</h3>
              <TrendingUp size={18} className="text-green-600" />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={platformMetrics}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v, n) => [n === "users" ? `${Number(v).toLocaleString()}` : v, n === "users" ? "Users" : "Communities"]} />
                <Area type="monotone" dataKey="users" stroke="#2563EB" fill="#DBEAFE" strokeWidth={2} />
                <Area type="monotone" dataKey="communities" stroke="#16A34A" fill="#DCFCE7" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue */}
          <div className="dashboard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Monthly Revenue (₹)</h3>
              <BarChart3 size={18} className="text-muted-foreground" />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={platformMetrics}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
                <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#B91C1C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Communities */}
          <div className="dashboard-card">
            <div className="px-5 pt-5 pb-3 border-b border-border flex items-center justify-between">
              <h3 className="font-bold">Communities</h3>
              <span className="text-xs text-primary font-medium">View All →</span>
            </div>
            <div className="divide-y divide-border">
              {mockProperties.map((p) => (
                <div key={p.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-muted/30 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 gradient-maple rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {p.societyName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{p.societyName}</p>
                      <p className="text-xs text-muted-foreground">{p.city} · {p.totalFlats} units</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">{p.healthScore}%</p>
                    <p className="text-xs text-muted-foreground">health</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vendors */}
          <div className="dashboard-card">
            <div className="px-5 pt-5 pb-3 border-b border-border flex items-center justify-between">
              <h3 className="font-bold">Top Vendors</h3>
              <span className="text-xs text-primary font-medium">Manage →</span>
            </div>
            <div className="divide-y divide-border">
              {mockVendors.map((v) => (
                <div key={v.id} className="px-5 py-3.5 hover:bg-muted/30 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{v.businessName}</p>
                      <p className="text-xs text-muted-foreground">{v.category} · {v.completedJobs} jobs</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500 text-sm">★{v.rating}</span>
                      <span className="w-2 h-2 rounded-full bg-green-400" title="Verified" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="dashboard-card">
            <div className="px-5 pt-5 pb-3 border-b border-border flex items-center justify-between">
              <h3 className="font-bold">Recent Audit Logs</h3>
              <FileText size={16} className="text-muted-foreground" />
            </div>
            <div className="divide-y divide-border">
              {auditLogs.map((log, i) => (
                <div key={i} className="px-5 py-3 hover:bg-muted/30 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${log.type === "success" ? "bg-green-400" : log.type === "error" ? "bg-red-400" : log.type === "warning" ? "bg-amber-400" : "bg-blue-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs">{log.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{log.target}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{log.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="dashboard-card p-6">
          <h3 className="font-bold text-lg mb-4 font-playfair">System Status</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { service: "API Gateway", status: "Operational", uptime: "99.99%", color: "text-green-600" },
              { service: "Database", status: "Operational", uptime: "99.97%", color: "text-green-600" },
              { service: "Notification Service", status: "Operational", uptime: "99.95%", color: "text-green-600" },
              { service: "Payment Gateway", status: "Operational", uptime: "99.98%", color: "text-green-600" },
              { service: "File Storage", status: "Operational", uptime: "100%", color: "text-green-600" },
              { service: "AI Engine", status: "Operational", uptime: "99.92%", color: "text-green-600" },
              { service: "Email Service", status: "Operational", uptime: "99.89%", color: "text-green-600" },
              { service: "SMS Gateway", status: "Operational", uptime: "99.94%", color: "text-green-600" },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 px-4 bg-green-50 rounded-xl border border-green-200">
                <div>
                  <p className="font-semibold text-xs">{s.service}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Uptime: {s.uptime}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
