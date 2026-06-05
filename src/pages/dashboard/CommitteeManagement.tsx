import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAppStore } from "@/stores/appStore";
import { mockStaff } from "@/constants/mockData";
import { Users, AlertTriangle, CheckCircle, X, Plus, Bell, FileText, TrendingUp, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link, useLocation } from "react-router-dom";

const weeklyData = [
  { day: "Mon", entries: 45 }, { day: "Tue", entries: 62 }, { day: "Wed", entries: 38 },
  { day: "Thu", entries: 71 }, { day: "Fri", entries: 89 }, { day: "Sat", entries: 120 }, { day: "Sun", entries: 95 },
];

export default function CommitteeResidents() {
  const { complaints, updateComplaint, announcements, addAnnouncement, currentUser } = useAppStore();
  const location = useLocation();

  const getInitialTab = (pathname: string) => {
    if (pathname.includes("complaints")) return "complaints";
    if (pathname.includes("announcements")) return "announcements";
    if (pathname.includes("staff")) return "staff";
    return "residents";
  };

  const [tab, setTab] = useState<"residents" | "complaints" | "announcements" | "staff">(() =>
    getInitialTab(location.pathname)
  );

  useEffect(() => {
    setTab(getInitialTab(location.pathname));
  }, [location.pathname]);

  const [annForm, setAnnForm] = useState({ title: "", content: "", category: "General", priority: "normal" as "normal" | "important" | "urgent" });
  const [showAnnForm, setShowAnnForm] = useState(false);

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({
      id: `ann_${Date.now()}`,
      title: annForm.title,
      content: annForm.content,
      category: annForm.category,
      postedBy: currentUser?.name || "Committee",
      postedAt: new Date().toISOString(),
      priority: annForm.priority,
      targetRoles: ["resident", "security", "maintenance", "committee"],
      views: 0,
    });
    setShowAnnForm(false);
    setAnnForm({ title: "", content: "", category: "General", priority: "normal" });
  };

  return (
    <DashboardLayout title="Society Management">
      <div className="space-y-6">
        <div className="flex gap-2 flex-wrap items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {(["residents", "complaints", "announcements", "staff"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? "bg-primary text-white" : "bg-white border border-border hover:border-primary"}`}>
                {t}
              </button>
            ))}
          </div>
          {tab === "announcements" && (
            <button onClick={() => setShowAnnForm(true)} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={16} /> Post Announcement
            </button>
          )}
        </div>

        {tab === "residents" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Flats", value: "480", color: "bg-blue-50 text-blue-700 border-blue-200" },
                { label: "Occupied", value: "421", color: "bg-green-50 text-green-700 border-green-200" },
                { label: "Vacant", value: "59", color: "bg-amber-50 text-amber-700 border-amber-200" },
                { label: "Residents", value: "1,246", color: "bg-purple-50 text-purple-700 border-purple-200" },
              ].map((s, i) => (
                <div key={i} className={`rounded-2xl p-4 border ${s.color}`}>
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="text-sm font-medium mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="dashboard-card p-6">
              <h3 className="font-bold text-lg mb-4">Weekly Visitor Traffic</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="entries" fill="#B91C1C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="dashboard-card">
              <div className="px-6 pt-5 pb-3 border-b border-border">
                <h3 className="font-bold">Towers Overview</h3>
              </div>
              <div className="divide-y divide-border">
                {["A", "B", "C", "D", "E", "F"].map((tower, i) => {
                  const total = 80; const occupied = [72, 78, 68, 75, 70, 58][i];
                  return (
                    <div key={tower} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 gradient-maple rounded-xl flex items-center justify-center text-white font-bold">{tower}</div>
                        <div>
                          <p className="font-semibold">Tower {tower}</p>
                          <p className="text-xs text-muted-foreground">{occupied}/{total} units occupied</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${(occupied/total)*100}%` }} />
                        </div>
                        <span className="font-bold text-sm text-primary">{Math.round((occupied/total)*100)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === "complaints" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { l: "Open", v: complaints.filter(c => c.status === "open").length, c: "bg-red-50 text-red-700 border-red-200" },
                { l: "In Progress", v: complaints.filter(c => c.status === "in-progress").length, c: "bg-blue-50 text-blue-700 border-blue-200" },
                { l: "Resolved", v: complaints.filter(c => c.status === "resolved").length, c: "bg-green-50 text-green-700 border-green-200" },
                { l: "Total", v: complaints.length, c: "bg-muted text-foreground border-border" },
              ].map((s, i) => (
                <div key={i} className={`rounded-2xl p-4 border ${s.c}`}>
                  <p className="text-2xl font-bold">{s.v}</p>
                  <p className="text-sm font-medium mt-1">{s.l}</p>
                </div>
              ))}
            </div>
            {complaints.map((c) => (
              <div key={c.id} className="dashboard-card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.priority === "urgent" ? "bg-red-100 text-red-700" : c.priority === "high" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>{c.priority}</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-lg">{c.category}</span>
                    </div>
                    <p className="font-bold">{c.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">By {c.raisedBy} · {c.raisedByFlat} · {new Date(c.createdAt).toLocaleDateString()}</p>
                    {c.assignedTo && <p className="text-xs text-blue-600 mt-1">Assigned: {c.assignedTo}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.status === "resolved" ? "bg-green-100 text-green-700" : c.status === "in-progress" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>{c.status}</span>
                    {c.status === "open" && (
                      <button onClick={() => updateComplaint(c.id, { status: "in-progress" })} className="text-xs text-primary font-medium hover:underline">Assign →</button>
                    )}
                    {c.status === "in-progress" && (
                      <button onClick={() => updateComplaint(c.id, { status: "resolved" })} className="text-xs text-green-600 font-medium hover:underline">Mark Resolved →</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "announcements" && (
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div key={ann.id} className={`dashboard-card p-5 border-l-4 ${ann.priority === "urgent" ? "border-l-red-500" : ann.priority === "important" ? "border-l-amber-500" : "border-l-blue-400"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${ann.priority === "urgent" ? "bg-red-100 text-red-700" : ann.priority === "important" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{ann.priority}</span>
                      <span className="px-2.5 py-0.5 bg-muted rounded-full text-xs">{ann.category}</span>
                    </div>
                    <p className="font-bold text-lg">{ann.title}</p>
                    <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{ann.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">{ann.views} views · {new Date(ann.postedAt).toLocaleDateString()} · By {ann.postedBy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "staff" && (
          <div className="space-y-3">
            {mockStaff.map((s) => (
              <div key={s.id} className="dashboard-card p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 gradient-maple rounded-2xl flex items-center justify-center text-white font-bold">{s.name.split(" ").map(n => n[0]).join("")}</div>
                  <div>
                    <p className="font-bold">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{s.role} · {s.department}</p>
                    <p className="text-xs text-muted-foreground">{s.shift} · Joined {new Date(s.joinedDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-amber-500">{"★".repeat(Math.round(s.rating))}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Announcement Form Modal */}
        {showAnnForm && (
          <div className="modal-overlay" onClick={() => setShowAnnForm(false)}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Post Announcement</h3>
                <button onClick={() => setShowAnnForm(false)} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center"><X size={16} /></button>
              </div>
              <form onSubmit={handlePostAnnouncement} className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {(["normal", "important", "urgent"] as const).map((p) => (
                    <button key={p} type="button" onClick={() => setAnnForm({ ...annForm, priority: p })}
                      className={`py-2 rounded-xl text-xs font-semibold capitalize border-2 transition-all ${annForm.priority === p ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>
                      {p}
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Title *</label>
                  <input required type="text" value={annForm.title} onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })} placeholder="Announcement title" className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Category</label>
                  <select value={annForm.category} onChange={(e) => setAnnForm({ ...annForm, category: e.target.value })} className="input-field">
                    {["General", "Maintenance", "Security", "Events", "Finance", "Society"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Message *</label>
                  <textarea required rows={4} value={annForm.content} onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })} placeholder="Write the announcement..." className="input-field resize-none" />
                </div>
                <button type="submit" className="w-full btn-primary py-3.5 flex items-center justify-center gap-2"><Bell size={16} /> Post Announcement</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
