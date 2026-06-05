import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAppStore } from "@/stores/appStore";
import { mockFacilities } from "@/constants/mockData";
import { Calendar, Clock, Users, Plus, X, CheckCircle } from "lucide-react";
import type { FacilityBooking } from "@/types";

const facilityIcons: Record<string, string> = {
  clubhouse: "🏛️",
  pool: "🏊",
  gym: "💪",
  sports: "🏸",
  hall: "🎭",
  guestroom: "🛏️",
};

export default function ResidentFacilities() {
  const { bookings, addBooking, currentUser } = useAppStore();
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState({ date: "", startTime: "", endTime: "", purpose: "", guestCount: "1" });
  const [success, setSuccess] = useState(false);

  const myBookings = bookings.filter((b) => b.residentId === currentUser?.id);
  const facility = mockFacilities.find((f) => f.id === selectedFacility);

  const getDurationHours = () => {
    if (!bookingForm.startTime || !bookingForm.endTime) return 2; // Default to 2 hours
    const [startH, startM] = bookingForm.startTime.split(":").map(Number);
    const [endH, endM] = bookingForm.endTime.split(":").map(Number);
    const diffMins = (endH * 60 + endM) - (startH * 60 + startM);
    if (diffMins <= 0) return 2; // Default if negative or 0
    return parseFloat((diffMins / 60).toFixed(2));
  };

  const duration = getDurationHours();
  const calculatedAmount = Math.ceil(duration * (facility?.pricePerHour || 0));

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facility || !currentUser) return;
    const newBooking: FacilityBooking = {
      id: `bkng_${Date.now()}`,
      facilityName: facility.name,
      facilityType: facility.type,
      residentId: currentUser.id,
      residentName: currentUser.name,
      flat: currentUser.flat || "",
      date: bookingForm.date,
      startTime: bookingForm.startTime,
      endTime: bookingForm.endTime,
      status: "confirmed",
      amount: calculatedAmount,
      purpose: bookingForm.purpose,
      guestCount: parseInt(bookingForm.guestCount),
    };
    addBooking(newBooking);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSelectedFacility(null);
      setBookingForm({ date: "", startTime: "", endTime: "", purpose: "", guestCount: "1" });
    }, 2000);
  };

  const statusColors: Record<FacilityBooking["status"], string> = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-gray-100 text-gray-600",
  };

  return (
    <DashboardLayout title="Facility Booking">
      <div className="space-y-6">
        {/* Facilities Grid */}
        <div>
          <h2 className="font-bold text-xl mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Available Facilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFacilities.map((fac) => (
              <div
                key={fac.id}
                onClick={() => fac.isAvailable && setSelectedFacility(fac.id)}
                className={`dashboard-card p-5 transition-all ${
                  fac.isAvailable
                    ? "hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-3xl">{facilityIcons[fac.type] || "🏢"}</span>
                    <h3 className="font-bold text-lg mt-1">{fac.name}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    fac.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {fac.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>

                {!fac.isAvailable && fac.maintenanceSchedule && (
                  <p className="text-xs text-red-600 mb-2">Maintenance: {fac.maintenanceSchedule}</p>
                )}

                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>Capacity: {fac.capacity} persons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span className="text-xs">{fac.availability[0]}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {fac.amenities.slice(0, 3).map((a) => (
                    <span key={a} className="px-2 py-0.5 bg-muted rounded-md text-xs">{a}</span>
                  ))}
                  {fac.amenities.length > 3 && (
                    <span className="px-2 py-0.5 bg-muted rounded-md text-xs">+{fac.amenities.length - 3}</span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-primary font-bold">₹{fac.pricePerHour}/hour</span>
                  {fac.isAvailable && (
                    <button className="btn-primary text-xs px-4 py-2">Book Now</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Bookings */}
        <div className="dashboard-card">
          <div className="px-6 pt-5 pb-3 border-b border-border">
            <h3 className="font-bold text-lg">My Bookings</h3>
          </div>
          <div className="divide-y divide-border">
            {myBookings.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Calendar size={40} className="mx-auto opacity-30 mb-2" />
                <p className="text-sm">No bookings yet. Book a facility above!</p>
              </div>
            ) : (
              myBookings.map((booking) => (
                <div key={booking.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{facilityIcons[booking.facilityType] || "🏢"}</span>
                    <div>
                      <p className="font-bold">{booking.facilityName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} · {booking.startTime} – {booking.endTime}
                      </p>
                      {booking.purpose && <p className="text-xs text-muted-foreground">{booking.purpose}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary">₹{booking.amount}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Booking Modal */}
        {selectedFacility && facility && (
          <div className="modal-overlay" onClick={() => setSelectedFacility(null)}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
              {success ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-700">Booking Confirmed!</h3>
                  <p className="text-muted-foreground">{facility.name} has been booked successfully.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-2xl">{facilityIcons[facility.type]}</p>
                      <h3 className="text-xl font-bold mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Book {facility.name}
                      </h3>
                    </div>
                    <button onClick={() => setSelectedFacility(null)} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <X size={16} />
                    </button>
                  </div>
                  <form onSubmit={handleBook} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">Date *</label>
                      <input required type="date" value={bookingForm.date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} className="input-field" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold">Start Time *</label>
                        <input required type="time" value={bookingForm.startTime} onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })} className="input-field" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold">End Time *</label>
                        <input required type="time" value={bookingForm.endTime} onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })} className="input-field" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">Guest Count</label>
                      <input type="number" min="1" max={facility.capacity} value={bookingForm.guestCount} onChange={(e) => setBookingForm({ ...bookingForm, guestCount: e.target.value })} className="input-field" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">Purpose (Optional)</label>
                      <input type="text" value={bookingForm.purpose} onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })} placeholder="e.g. Birthday celebration" className="input-field" />
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-sm">
                      <p className="font-semibold text-primary">Estimated Amount: ₹{calculatedAmount}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">Based on ₹{facility.pricePerHour}/hr × {duration} hrs</p>
                    </div>
                    <button type="submit" className="w-full btn-primary py-3.5 flex items-center justify-center gap-2">
                      <Plus size={18} /> Confirm Booking
                    </button>
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
