import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";
import {
  Building2, Users, TrendingUp, Activity, BarChart3,
  CheckCircle, Plus, Trash2, Download, FileText, Edit2, X
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import { useAppStore } from "@/stores/appStore";
import type { Tower, Property } from "@/types";

const occupancyData = [
  { tower: "A", occupied: 72, vacant: 8 },
  { tower: "B", occupied: 78, vacant: 2 },
  { tower: "C", occupied: 68, vacant: 12 },
  { tower: "D", occupied: 75, vacant: 5 },
  { tower: "E", occupied: 70, vacant: 10 },
  { tower: "F", occupied: 58, vacant: 22 },
];

const healthMetrics = [
  { name: "Collection Rate", value: 94, fill: "#16A34A" },
  { name: "Complaint Resolution", value: 88, fill: "#2563EB" },
  { name: "Resident Satisfaction", value: 91, fill: "#7C3AED" },
  { name: "Facility Utilization", value: 76, fill: "#CA8A04" },
];

export default function BuilderDashboard() {
  const location = useLocation();
  const path = location.pathname;

  const { properties, addProperty, updateProperty, removeProperty, towers, addTower, updateTower, removeTower } = useAppStore();
  const [showPropForm, setShowPropForm] = useState(false);
  const [newProp, setNewProp] = useState({ societyName: "", address: "", city: "", totalTowers: 4, totalFlats: 100, occupiedFlats: 0, vacantFlats: 100, totalResidents: 0, buildYear: 2025, monthlyMaintenance: 3000, healthScore: 90 });

  // Tower CRUD Modals state
  const [isAddTowerModalOpen, setIsAddTowerModalOpen] = useState(false);
  const [isEditTowerModalOpen, setIsEditTowerModalOpen] = useState(false);
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);

  // Tower Form state
  const [towerForm, setTowerForm] = useState({
    name: "",
    propertyId: "",
    totalFlats: 80,
    floors: 10,
    lifts: 2,
    occupancy: "90% Occupied",
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState("");

  const resetTowerForm = () => {
    setTowerForm({
      name: "",
      propertyId: properties[0]?.id || "",
      totalFlats: 80,
      floors: 10,
      lifts: 2,
      occupancy: "90% Occupied",
    });
  };

  const handleOpenEditTower = (tower: Tower) => {
    setSelectedTower(tower);
    setTowerForm({
      name: tower.name,
      propertyId: tower.propertyId,
      totalFlats: tower.totalFlats,
      floors: tower.floors,
      lifts: tower.lifts,
      occupancy: tower.occupancy,
    });
    setIsEditTowerModalOpen(true);
  };

  const handleAddTowerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTower: Tower = {
      id: `tow_${Date.now()}`,
      name: towerForm.name,
      propertyId: towerForm.propertyId || properties[0]?.id || "",
      totalFlats: towerForm.totalFlats,
      floors: towerForm.floors,
      lifts: towerForm.lifts,
      occupancy: towerForm.occupancy,
    };
    addTower(newTower);
    setIsAddTowerModalOpen(false);
    resetTowerForm();
  };

  const handleEditTowerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTower) return;
    updateTower(selectedTower.id, {
      name: towerForm.name,
      propertyId: towerForm.propertyId,
      totalFlats: towerForm.totalFlats,
      floors: towerForm.floors,
      lifts: towerForm.lifts,
      occupancy: towerForm.occupancy,
    });
    setIsEditTowerModalOpen(false);
    setSelectedTower(null);
    resetTowerForm();
  };

  const handleAddProp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.societyName || !newProp.address) return;
    addProperty({ id: `prop_${Date.now()}`, ...newProp, amenities: ["Gym", "Security", "Backup Pool"] });
    setShowPropForm(false);
    setNewProp({ societyName: "", address: "", city: "", totalTowers: 4, totalFlats: 100, occupiedFlats: 0, vacantFlats: 100, totalResidents: 0, buildYear: 2025, monthlyMaintenance: 3000, healthScore: 90 });
  };

  const handleRemoveProp = (id: string) => {
    removeProperty(id);
  };

  // Sub-view 2: PDF Portfolio Reports
  const handleDownloadBuilderPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Builder primary blue
    doc.text("Kapoor Properties Portfolio Audit", 20, 25);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Portfolio Performance Audit & Occupancy Ledger", 20, 32);
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(1);
    doc.line(20, 36, 190, 36);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("PORTFOLIO DEMOGRAPHICS SUMMARY", 20, 50);
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Total Managed Properties: ${properties.length}`, 22, 60);
    doc.text(`Total Built Units: ${properties.reduce((s, p) => s + p.totalFlats, 0)} Flats`, 22, 67);
    doc.text(`Occupied Units: ${properties.reduce((s, p) => s + p.occupiedFlats, 0)} Flats`, 22, 74);
    doc.text(`Total Portfolio Residents: ${properties.reduce((s, p) => s + p.totalResidents, 0).toLocaleString()} residents`, 22, 81);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("PROPERTY BREAKDOWN", 20, 95);
    let y = 105;
    properties.forEach(p => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(p.societyName, 22, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`${p.address}, ${p.city} | Health: ${p.healthScore}%`, 22, y+5);
      doc.text(`Units: ${p.occupiedFlats}/${p.totalFlats} occupied · Maint: ₹${p.monthlyMaintenance}/mo`, 22, y+10);
      y += 18;
    });

    doc.setLineWidth(0.5);
    doc.line(20, 240, 190, 240);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Confidential Builder Portfolio Audit Statement generated via MapleOne platform.", 105, 248, { align: "center" });
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 254, { align: "center" });

    doc.save(`Builder-Portfolio-Audit-${Date.now()}.pdf`);
  };

  // Router views switcher
  if (path === "/dashboard/builder/properties") {
    return (
      <DashboardLayout title="Portfolio Properties">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Add or manage multi-society properties registered in your portfolio.</p>
            </div>
            <button onClick={() => setShowPropForm(true)} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Onboard New Property
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {properties.map((prop) => (
              <div key={prop.id} className="dashboard-card p-6 hover:shadow-card-hover transition-shadow relative">
                <button
                  onClick={() => handleRemoveProp(prop.id)}
                  className="absolute top-5 right-5 p-2 text-muted-foreground hover:text-red-600 bg-muted rounded-xl transition-colors"
                  title="Remove Property"
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex items-start justify-between mb-4 pr-8">
                  <div>
                    <h3 className="font-bold text-xl">{prop.societyName}</h3>
                    <p className="text-muted-foreground text-sm mt-0.5">{prop.address} · {prop.city}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4 text-center">
                  {[
                    { label: "Towers", value: prop.totalTowers },
                    { label: "Total Flats", value: prop.totalFlats },
                    { label: "Occupied", value: prop.occupiedFlats },
                    { label: "Residents", value: prop.totalResidents.toLocaleString() },
                  ].map((s, i) => (
                    <div key={i} className="bg-muted/50 rounded-xl p-2">
                      <p className="font-bold text-sm">{s.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Occupancy</span>
                    <span>{prop.totalFlats > 0 ? Math.round((prop.occupiedFlats/prop.totalFlats)*100) : 0}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: `${prop.totalFlats > 0 ? (prop.occupiedFlats/prop.totalFlats)*100 : 0}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border mt-4">
                  <span className="text-sm font-semibold text-primary">₹{prop.monthlyMaintenance.toLocaleString()}/month maintenance</span>
                  <span className="text-xs font-bold text-green-600">Health: {prop.healthScore}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add property modal */}
          {showPropForm && (
            <div className="modal-overlay" onClick={() => setShowPropForm(false)}>
              <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold font-playfair">Onboard Property</h3>
                  <button onClick={() => setShowPropForm(false)} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center"><Trash2 size={14} className="rotate-45" /></button>
                </div>
                <form onSubmit={handleAddProp} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Society Name *</label>
                    <input required type="text" value={newProp.societyName} onChange={(e) => setNewProp({ ...newProp, societyName: e.target.value })} placeholder="e.g. Maple Enclave" className="input-field" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Address *</label>
                    <input required type="text" value={newProp.address} onChange={(e) => setNewProp({ ...newProp, address: e.target.value })} placeholder="Sector/Street address" className="input-field" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold">City *</label>
                      <input required type="text" value={newProp.city} onChange={(e) => setNewProp({ ...newProp, city: e.target.value })} placeholder="City, State" className="input-field" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold">Build Year</label>
                      <input type="number" value={newProp.buildYear} onChange={(e) => setNewProp({ ...newProp, buildYear: Number(e.target.value) })} className="input-field" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Towers</label>
                      <input type="number" value={newProp.totalTowers} onChange={(e) => setNewProp({ ...newProp, totalTowers: Number(e.target.value) })} className="input-field" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Flats</label>
                      <input type="number" value={newProp.totalFlats} onChange={(e) => setNewProp({ ...newProp, totalFlats: Number(e.target.value) })} className="input-field" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Maint. (₹)</label>
                      <input type="number" value={newProp.monthlyMaintenance} onChange={(e) => setNewProp({ ...newProp, monthlyMaintenance: Number(e.target.value) })} className="input-field" />
                    </div>
                  </div>
                  <button type="submit" className="w-full btn-primary py-3">Register Society</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/builder/towers") {
    const activePropertyId = selectedPropertyId || properties[0]?.id || "";
    const activeProperty = properties.find(p => p.id === activePropertyId);
    const propertyTowers = towers.filter(t => t.propertyId === activePropertyId);

    // Map tower occupancy for BarChart
    const dynamicOccupancyData = propertyTowers.map(t => {
      const match = t.occupancy.match(/(\d+)%/);
      const pct = match ? parseInt(match[1]) : 90;
      const occupied = Math.round(t.totalFlats * (pct / 100));
      const vacant = t.totalFlats - occupied;
      return {
        tower: t.name,
        occupied,
        vacant,
      };
    });

    return (
      <DashboardLayout title="Towers & Flats breakdown">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-muted-foreground">Select Society:</label>
              <select
                value={activePropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="input-field select-field bg-white border border-input rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-56"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.societyName}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                resetTowerForm();
                setTowerForm(prev => ({ ...prev, propertyId: activePropertyId }));
                setIsAddTowerModalOpen(true);
              }}
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
            >
              <Plus size={16} /> Add Tower
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Occupancy breakdown chart */}
            <div className="dashboard-card p-6">
              <h3 className="font-bold text-lg mb-4">Tower Occupancy breakdown — {activeProperty?.societyName || "Selected Property"}</h3>
              {dynamicOccupancyData.length === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                  Add towers to view chart.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={dynamicOccupancyData}>
                    <XAxis dataKey="tower" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="occupied" name="Occupied Units" stackId="a" fill="#16A34A" />
                    <Bar dataKey="vacant" name="Vacant Units" stackId="a" fill="#FCA5A5" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Tower list */}
            <div className="dashboard-card">
              <div className="px-6 pt-5 pb-3 border-b border-border">
                <h3 className="font-bold text-lg">Tower Registry</h3>
              </div>
              <div className="divide-y divide-border">
                {propertyTowers.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p className="text-sm">No towers registered for this property.</p>
                  </div>
                ) : (
                  propertyTowers.map(t => (
                    <div key={t.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30">
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.totalFlats} units total · {t.floors} Floors · {t.lifts} lifts installed
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2.5 py-1 font-bold rounded-full ${
                          parseInt(t.occupancy) > 90 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {t.occupancy}
                        </span>
                        <button
                          onClick={() => handleOpenEditTower(t)}
                          className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
                          title="Edit Tower"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => removeTower(t.id)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Delete Tower"
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
        </div>

        {/* Add Tower Modal */}
        {isAddTowerModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAddTowerModalOpen(false)}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold font-serif">Add New Tower</h3>
                <button onClick={() => setIsAddTowerModalOpen(false)} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleAddTowerSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Tower Name *</label>
                  <input required type="text" value={towerForm.name} onChange={(e) => setTowerForm({ ...towerForm, name: e.target.value })} className="input-field" placeholder="e.g. Tower C" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Total Flats *</label>
                    <input required type="number" value={towerForm.totalFlats} onChange={(e) => setTowerForm({ ...towerForm, totalFlats: parseInt(e.target.value) })} className="input-field" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Floors *</label>
                    <input required type="number" value={towerForm.floors} onChange={(e) => setTowerForm({ ...towerForm, floors: parseInt(e.target.value) })} className="input-field" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Lifts *</label>
                    <input required type="number" value={towerForm.lifts} onChange={(e) => setTowerForm({ ...towerForm, lifts: parseInt(e.target.value) })} className="input-field" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Occupancy Status *</label>
                  <input required type="text" value={towerForm.occupancy} onChange={(e) => setTowerForm({ ...towerForm, occupancy: e.target.value })} className="input-field" placeholder="e.g. 90% Occupied" />
                </div>
                <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-semibold">
                  <Plus size={18} /> Register Tower
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Tower Modal */}
        {isEditTowerModalOpen && (
          <div className="modal-overlay" onClick={() => { setIsEditTowerModalOpen(false); setSelectedTower(null); }}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold font-serif">Edit Tower details</h3>
                <button onClick={() => { setIsEditTowerModalOpen(false); setSelectedTower(null); }} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleEditTowerSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Tower Name *</label>
                  <input required type="text" value={towerForm.name} onChange={(e) => setTowerForm({ ...towerForm, name: e.target.value })} className="input-field" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Total Flats *</label>
                    <input required type="number" value={towerForm.totalFlats} onChange={(e) => setTowerForm({ ...towerForm, totalFlats: parseInt(e.target.value) })} className="input-field" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Floors *</label>
                    <input required type="number" value={towerForm.floors} onChange={(e) => setTowerForm({ ...towerForm, floors: parseInt(e.target.value) })} className="input-field" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Lifts *</label>
                    <input required type="number" value={towerForm.lifts} onChange={(e) => setTowerForm({ ...towerForm, lifts: parseInt(e.target.value) })} className="input-field" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Occupancy Status *</label>
                  <input required type="text" value={towerForm.occupancy} onChange={(e) => setTowerForm({ ...towerForm, occupancy: e.target.value })} className="input-field" />
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

  if (path === "/dashboard/builder/occupancy") {
    return (
      <DashboardLayout title="Occupancy Ratios">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="dashboard-card p-6 space-y-4">
            <h3 className="font-bold text-lg font-playfair mb-3">Occupancy Breakdown (Averages)</h3>
            <div className="space-y-3">
              {[
                { label: "Owner-Occupied units", value: "64.2% (270 flats)", color: "bg-green-600" },
                { label: "Tenant-Occupied units", value: "23.5% (99 flats)", color: "bg-blue-600" },
                { label: "Vacant / Unsold units", value: "12.3% (51 flats)", color: "bg-red-500" },
              ].map(o => (
                <div key={o.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{o.label}</span>
                    <span className="font-bold">{o.value}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className={`h-2 rounded-full ${o.color}`} style={{ width: o.value.split("%")[0] + "%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/builder/health") {
    return (
      <DashboardLayout title="Community Health Audit">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="dashboard-card p-6">
            <h3 className="font-bold text-lg mb-4">Society Health Metrics Breakdown</h3>
            <div className="space-y-4">
              {healthMetrics.map((m) => (
                <div key={m.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{m.name}</span>
                    <span className="font-bold" style={{ color: m.fill }}>{m.value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="h-2.5 rounded-full transition-all" style={{ width: `${m.value}%`, backgroundColor: m.fill }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card p-6 space-y-3">
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Health Status Policy</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Health score checks are audited every Sunday. Societies scoring above 85% gain the "MapleOne Star Society" badge. Scores below 70% require builder maintenance lead intervention and automatic operations reviews.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (path === "/dashboard/builder/reports") {
    return (
      <DashboardLayout title="Portfolio Performance Reports">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="dashboard-card p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <FileText size={32} />
            </div>
            <h2 className="text-xl font-bold font-playfair">Download Portfolio Report</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Download comprehensive RWA ledger records, tower occupancies, society health metrics, and MRR collection reports in PDF.
            </p>
            <button
              onClick={handleDownloadBuilderPDF}
              className="btn-primary py-3 px-8 flex items-center gap-2 mx-auto"
            >
              <Download size={18} /> Download Audit Ledger
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Otherwise, default overview screen
  return (
    <DashboardLayout title="Portfolio Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="gradient-hero rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-1 font-playfair">Property Portfolio Overview</h2>
          <p className="text-white/70 text-sm">Kapoor Properties · Builder / Property Manager</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
            {[
              { label: "Total Properties", value: properties.length },
              { label: "Total Units", value: properties.reduce((s, p) => s + p.totalFlats, 0) },
              { label: "Occupancy Rate", value: "87.7%" },
              { label: "Total Residents", value: properties.reduce((s, p) => s + p.totalResidents, 0).toLocaleString() },
            ].map((s, i) => (
              <div key={i} className="bg-white/15 rounded-xl p-3 text-center">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Properties */}
        <div>
          <h2 className="font-bold text-xl mb-4 font-playfair">Managed Properties</h2>
          <div className="grid lg:grid-cols-2 gap-5">
            {properties.map((prop) => (
              <div key={prop.id} className="dashboard-card p-6 hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-xl">{prop.societyName}</h3>
                    <p className="text-muted-foreground text-sm mt-0.5">{prop.address} · {prop.city}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{prop.healthScore}</div>
                    <p className="text-xs text-muted-foreground">Health Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4 text-center">
                  {[
                    { label: "Towers", value: prop.totalTowers },
                    { label: "Total Flats", value: prop.totalFlats },
                    { label: "Occupied", value: prop.occupiedFlats },
                    { label: "Residents", value: prop.totalResidents.toLocaleString() },
                  ].map((s, i) => (
                    <div key={i} className="bg-muted/50 rounded-xl p-2">
                      <p className="font-bold text-sm">{s.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Occupancy</span>
                    <span>{prop.totalFlats > 0 ? Math.round((prop.occupiedFlats/prop.totalFlats)*100) : 0}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: `${prop.totalFlats > 0 ? (prop.occupiedFlats/prop.totalFlats)*100 : 0}%` }} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {prop.amenities.slice(0, 4).map((a) => (
                    <span key={a} className="px-2 py-0.5 bg-muted rounded-md text-xs">{a}</span>
                  ))}
                  {prop.amenities.length > 4 && <span className="px-2 py-0.5 bg-muted rounded-md text-xs">+{prop.amenities.length - 4}</span>}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm font-semibold text-primary">₹{prop.monthlyMaintenance.toLocaleString()}/month maintenance</span>
                  <button className="text-xs text-primary font-medium hover:underline">View Details →</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Tower Occupancy Chart */}
          <div className="dashboard-card p-6">
            <h3 className="font-bold text-lg mb-4">Tower Occupancy — Maple Heights</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={occupancyData}>
                <XAxis dataKey="tower" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="occupied" name="Occupied" stackId="a" fill="#16A34A" radius={[0, 0, 0, 0]} />
                <Bar dataKey="vacant" name="Vacant" stackId="a" fill="#FCA5A5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Health Metrics */}
          <div className="dashboard-card p-6">
            <h3 className="font-bold text-lg mb-4">Community Health Metrics</h3>
            <div className="space-y-4">
              {healthMetrics.map((m) => (
                <div key={m.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{m.name}</span>
                    <span className="font-bold" style={{ color: m.fill }}>{m.value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="h-2.5 rounded-full transition-all" style={{ width: `${m.value}%`, backgroundColor: m.fill }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-border flex items-center gap-2">
              <Activity size={16} className="text-green-600" />
              <span className="text-sm text-green-600 font-medium">Overall community health: Excellent</span>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="dashboard-card p-6">
          <h3 className="font-bold text-xl mb-4 font-playfair">Portfolio Financial Summary</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Monthly Revenue", value: "₹18.5L", change: "+8%", color: "text-green-600" },
              { label: "Collection Efficiency", value: "94.3%", change: "+2.1%", color: "text-green-600" },
              { label: "Pending Dues", value: "₹1.8L", change: "-5%", color: "text-red-600" },
              { label: "Annual Revenue", value: "₹2.1Cr", change: "+12%", color: "text-green-600" },
            ].map((s, i) => (
              <div key={i} className="bg-muted/30 rounded-2xl p-4">
                <p className="text-muted-foreground text-xs mb-1">{s.label}</p>
                <p className="font-bold text-2xl">{s.value}</p>
                <p className={`text-xs font-medium mt-1 ${s.color}`}>{s.change} vs last month</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
