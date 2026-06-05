import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAppStore } from "@/stores/appStore";
import { CreditCard, Download, CheckCircle, AlertCircle, Clock, X, Printer } from "lucide-react";
import type { Bill } from "@/types";
import jsPDF from "jspdf";

const statusColors: Record<Bill["status"], string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-700",
  partial: "bg-blue-100 text-blue-700",
};

export default function ResidentBills() {
  const { bills, payBill, currentUser } = useAppStore();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paying, setPaying] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);

  const myBills = bills.filter((b) => b.residentId === currentUser?.id);
  const totalPaid = myBills.filter(b => b.status === "paid").reduce((sum, b) => sum + b.totalAmount, 0);
  const totalPending = myBills.filter(b => b.status !== "paid").reduce((sum, b) => sum + b.totalAmount, 0);

  const handlePay = () => {
    if (!selectedBill) return;
    setPaying(true);
    setTimeout(() => {
      payBill(selectedBill.id, paymentMethod);
      setPaying(false);
      setPaidSuccess(true);
      setTimeout(() => {
        setPaidSuccess(false);
        setSelectedBill(null);
      }, 2500);
    }, 1500);
  };

  const generatePDF = (bill: Bill) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(185, 28, 28);
    doc.text("MapleOne", 20, 25);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Premium Society Management Platform", 20, 32);
    doc.setDrawColor(185, 28, 28);
    doc.setLineWidth(1);
    doc.line(20, 36, 190, 36);

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("MAINTENANCE INVOICE", 105, 50, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Invoice #: INV-${bill.id.toUpperCase()}`, 20, 65);
    doc.text(`Bill Period: ${bill.month} ${bill.year}`, 20, 72);
    doc.text(`Resident: ${bill.residentName}`, 20, 79);
    doc.text(`Flat: ${bill.flat}, ${bill.tower}`, 20, 86);
    doc.text(`Due Date: ${new Date(bill.dueDate).toLocaleDateString()}`, 20, 93);
    doc.text(`Status: ${bill.status.toUpperCase()}`, 140, 65);
    if (bill.paidDate) doc.text(`Paid Date: ${new Date(bill.paidDate).toLocaleDateString()}`, 140, 72);
    if (bill.transactionId) doc.text(`Txn ID: ${bill.transactionId}`, 140, 79);

    doc.setLineWidth(0.5);
    doc.setDrawColor(220);
    doc.line(20, 100, 190, 100);
    doc.text("Description", 22, 110);
    doc.text("Amount", 165, 110, { align: "right" });
    doc.line(20, 113, 190, 113);

    const items = [
      ["Maintenance Charges", bill.maintenanceAmount],
      ["Water Charges", bill.waterCharges],
      ["Electricity Charges", bill.electricityCharges],
      ["Parking Charges", bill.parkingCharges],
    ];
    let y = 122;
    items.forEach(([label, amount]) => {
      doc.text(String(label), 22, y);
      doc.text(`₹${Number(amount).toLocaleString()}`, 165, y, { align: "right" });
      y += 9;
    });
    if (bill.penalty > 0) { doc.setTextColor(185, 28, 28); doc.text("Late Payment Penalty", 22, y); doc.text(`₹${bill.penalty}`, 165, y, { align: "right" }); y += 9; doc.setTextColor(80); }
    if (bill.discount > 0) { doc.setTextColor(22, 163, 74); doc.text("Early Payment Discount", 22, y); doc.text(`-₹${bill.discount}`, 165, y, { align: "right" }); y += 9; doc.setTextColor(80); }

    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL AMOUNT", 22, y);
    doc.text(`₹${bill.totalAmount.toLocaleString()}`, 165, y, { align: "right" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text("This is a computer-generated invoice. For queries: billing@mapleone.app | +91 1800 123 4567", 105, 280, { align: "center" });
    doc.text(`Generated on ${new Date().toLocaleString()} by MapleOne`, 105, 285, { align: "center" });

    doc.save(`MapleOne-Invoice-${bill.id}-${bill.month}${bill.year}.pdf`);
  };

  return (
    <DashboardLayout title="Bills & Payments">
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <CheckCircle size={24} className="text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-700">₹{totalPaid.toLocaleString()}</p>
            <p className="text-green-600 text-sm font-medium mt-1">Total Paid (2025)</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <Clock size={24} className="text-amber-600 mb-2" />
            <p className="text-2xl font-bold text-amber-700">₹{totalPending.toLocaleString()}</p>
            <p className="text-amber-600 text-sm font-medium mt-1">Pending Amount</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <CreditCard size={24} className="text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-700">{myBills.length}</p>
            <p className="text-blue-600 text-sm font-medium mt-1">Total Bills</p>
          </div>
        </div>

        {/* Bills List */}
        <div className="dashboard-card">
          <div className="px-6 pt-5 pb-3 border-b border-border">
            <h3 className="font-bold text-lg">Bill History</h3>
          </div>
          <div className="divide-y divide-border">
            {myBills.map((bill) => (
              <div key={bill.id} className="px-6 py-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${statusColors[bill.status].split(" ")[0]}`}>
                      {bill.status === "paid" ? (
                        <CheckCircle size={22} className="text-green-600" />
                      ) : bill.status === "overdue" ? (
                        <AlertCircle size={22} className="text-red-600" />
                      ) : (
                        <Clock size={22} className="text-amber-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold">{bill.month} {bill.year} — Maintenance Bill</p>
                      <p className="text-sm text-muted-foreground">{bill.flat} · {bill.tower}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Due: {new Date(bill.dueDate).toLocaleDateString()}
                        {bill.paidDate && ` · Paid: ${new Date(bill.paidDate).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{bill.totalAmount.toLocaleString()}</p>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[bill.status]}`}>
                        {bill.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => generatePDF(bill)}
                        className="p-2 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>
                      {bill.status !== "paid" && (
                        <button
                          onClick={() => setSelectedBill(bill)}
                          className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
                          title="Pay Now"
                        >
                          <CreditCard size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Modal */}
        {selectedBill && (
          <div className="modal-overlay" onClick={() => !paying && setSelectedBill(null)}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
              {paidSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-700">Payment Successful!</h3>
                  <p className="text-muted-foreground">
                    ₹{selectedBill.totalAmount.toLocaleString()} paid via {paymentMethod}
                  </p>
                  <p className="text-xs text-muted-foreground">Transaction ID: TXN{Date.now()}</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Pay Bill</h3>
                    <button onClick={() => setSelectedBill(null)} className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="bg-muted/30 rounded-2xl p-4 mb-5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Bill Period</span>
                      <span className="font-semibold">{selectedBill.month} {selectedBill.year}</span>
                    </div>
                    {[
                      ["Maintenance", selectedBill.maintenanceAmount],
                      ["Water", selectedBill.waterCharges],
                      ["Electricity", selectedBill.electricityCharges],
                      ["Parking", selectedBill.parkingCharges],
                      ...(selectedBill.penalty > 0 ? [["Penalty", selectedBill.penalty]] : []),
                      ...(selectedBill.discount > 0 ? [["Discount", -selectedBill.discount]] : []),
                    ].map(([label, amt]) => (
                      <div key={String(label)} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                        <span className="text-muted-foreground">{String(label)}</span>
                        <span className={Number(amt) < 0 ? "text-green-600" : ""}>₹{Math.abs(Number(amt)).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-base pt-2">
                      <span>Total</span>
                      <span className="text-primary">₹{selectedBill.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-5">
                    <p className="text-sm font-semibold">Payment Method</p>
                    <div className="grid grid-cols-2 gap-2">
                      {["UPI", "Net Banking", "Credit Card", "Debit Card"].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                            paymentMethod === method ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handlePay}
                    disabled={paying}
                    className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2"
                  >
                    {paying ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard size={18} />
                        Pay ₹{selectedBill.totalAmount.toLocaleString()} via {paymentMethod}
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
