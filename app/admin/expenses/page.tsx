"use client";

import { useState, useEffect, useMemo } from "react";
import { LogOut, Trash2, Plus, DollarSign, User, Building, MapPin, Tag, Calendar as CalendarIcon, RefreshCw, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

type Expense = {
  id: string;
  amount: number;
  merchant: string;
  category: string;
  location: string;
  paymentMethod: "Cash" | "UPI";
  spender: "Ekaagra" | "Achal" | "Tiwari";
  property: "Doons Den" | "The Retro Den" | "Terra House" | "Studio";
  date: string;
  createdAt: string;
};

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const dateObj = new Date(year, month, day);

  if (isNaN(dateObj.getTime())) return dateStr;

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Ordinal suffix helper
  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) suffix = "st";
  else if (day === 2 || day === 22) suffix = "nd";
  else if (day === 3 || day === 23) suffix = "rd";

  return `${day}${suffix} ${months[month]}`;
}

export default function AdminExpensesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [showPasskey, setShowPasskey] = useState(false);
  const [authError, setAuthError] = useState("");

  // Data States
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form States
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState<"Labour" | "Raw Material" | "Other">("Labour");
  const [customCategory, setCustomCategory] = useState("");
  const [location, setLocation] = useState<"Prem Nagar" | "Paltan Bajar" | "Chandani Chowk" | "Banjara Market" | "Other">("Prem Nagar");
  const [customLocation, setCustomLocation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "UPI">("Cash");
  const [spender, setSpender] = useState<"Ekaagra" | "Achal" | "Tiwari">("Ekaagra");
  const [property, setProperty] = useState<"Doons Den" | "The Retro Den" | "Terra House" | "Studio">("Doons Den");
  const [date, setDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  // Authenticate using simple session storage gatekeeper
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/admin/check-auth?type=expenses");
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(data.authenticated);
        }
      } catch (err) {
        console.error("Auth check failed", err);
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkey, type: "expenses" }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setAuthError("");
      } else {
        const data = await res.json().catch(() => ({}));
        setAuthError(data.error || "Invalid passkey. Please try again.");
      }
    } catch (err) {
      setAuthError("An error occurred during login. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed", err);
    }
    setIsAuthenticated(false);
    setPasskey("");
  };

  // Fetch expenses
  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/expenses");
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.expenses || []);
      }
    } catch (err) {
      console.error("Failed to load expenses", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenses();
    }
  }, [isAuthenticated]);

  // Add Expense
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !merchant) {
      setMessage({ text: "Please enter Merchant/Vendor and Amount.", type: "error" });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    const finalCategory = category === "Other" ? customCategory.trim() : category;
    const finalLocation = location === "Other" ? customLocation.trim() : location;

    if (!finalCategory) {
      setMessage({ text: "Please specify a category name.", type: "error" });
      setIsSaving(false);
      return;
    }
    if (!finalLocation) {
      setMessage({ text: "Please specify a location/city.", type: "error" });
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          merchant,
          category: finalCategory,
          location: finalLocation,
          paymentMethod,
          spender,
          property,
          date,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Expense recorded successfully!", type: "success" });
        setAmount("");
        setMerchant("");
        setCategory("Labour");
        setCustomCategory("");
        setLocation("Prem Nagar");
        setCustomLocation("");
        setPaymentMethod("Cash");
        setSpender("Ekaagra");
        setProperty("Doons Den");
        fetchExpenses();
      } else {
        setMessage({ text: data.error || "Failed to save expense", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to record expense", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Expense
  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense entry?")) {
      return;
    }
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/expenses?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage({ text: "Expense deleted successfully.", type: "success" });
        fetchExpenses();
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Failed to delete expense", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to delete expense", type: "error" });
    }
  };

  // Stats Calculations
  const stats = useMemo(() => {
    let total = 0;
    const byProperty: Record<string, number> = { "Doons Den": 0, "The Retro Den": 0, "Terra House": 0, "Studio": 0 };
    const bySpender: Record<string, number> = { Ekaagra: 0, Achal: 0, Tiwari: 0 };
    const byCategory: Record<string, number> = {};

    expenses.forEach((exp) => {
      total += exp.amount;
      if (byProperty[exp.property] !== undefined) {
        byProperty[exp.property] += exp.amount;
      }
      if (bySpender[exp.spender] !== undefined) {
        bySpender[exp.spender] += exp.amount;
      }
      byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
    });

    return { total, byProperty, bySpender, byCategory };
  }, [expenses]);

  if (!isAuthenticated) {
    return (
      <main className="bg-[#fafaf8] min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-['Cormorant'] font-semibold text-gray-950">AeraLiving Admin</h1>
            <p className="text-sm text-gray-500">Please enter the security passkey to access the expense management dashboard.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Passkey</label>
              <div className="relative">
                <input
                  type={showPasskey ? "text" : "password"}
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Enter admin passkey"
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPasskey ? "Hide passkey" : "Show passkey"}
                >
                  {showPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {authError && <p className="text-xs text-red-600 font-medium">{authError}</p>}
            <button
              type="submit"
              className="w-full bg-foreground text-white py-3.5 rounded-xl font-medium hover:bg-foreground/95 transition-colors"
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-xs text-gray-400">Default security gate active</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#fafaf8] min-h-screen p-6 lg:p-12 text-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-['Cormorant'] font-semibold text-gray-900">Expense Tracker</h1>
            <p className="text-sm text-gray-500">Track and manage cash and UPI expenses for AeraLiving properties.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchExpenses}
              disabled={isLoading}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh Data
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-100 transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {message && (
          <div className={`flex items-start gap-3 p-4 rounded-xl border ${
            message.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
          }`}>
            {message.type === "success" ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-700 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-900">₹{stats.total.toLocaleString("en-IN")}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Building className="w-4 h-4 text-blue-600" />
              <span>By Property</span>
            </div>
            <div className="text-xs space-y-1">
              {Object.entries(stats.byProperty).map(([prop, val]) => (
                <div key={prop} className="flex justify-between">
                  <span className="text-gray-600">{prop}</span>
                  <span className="font-semibold text-gray-900">₹{val.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <User className="w-4 h-4 text-purple-600" />
              <span>By Spender</span>
            </div>
            <div className="text-xs space-y-1">
              {Object.entries(stats.bySpender).map(([sp, val]) => (
                <div key={sp} className="flex justify-between">
                  <span className="text-gray-600">{sp}</span>
                  <span className="font-semibold text-gray-900">₹{val.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>By Category</span>
            </div>
            <div className="text-xs space-y-1 max-h-24 overflow-y-auto">
              {Object.entries(stats.byCategory).length === 0 ? (
                <p className="text-gray-400 italic">No data yet</p>
              ) : (
                Object.entries(stats.byCategory).map(([cat, val]) => (
                  <div key={cat} className="flex justify-between">
                    <span className="text-gray-600 truncate mr-2">{cat}</span>
                    <span className="font-semibold text-gray-900">₹{val.toLocaleString("en-IN")}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Expenses Log Form */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Plus className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900 font-['Cormorant']">Log New Expense</h2>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-500 font-semibold">₹</span>
                  <input
                    type="number"
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Merchant/Vendor</label>
                <input
                  type="text"
                  required
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="e.g. Local Hardware shop, Cement supplier"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Spender</label>
                  <select
                    value={spender}
                    onChange={(e) => setSpender(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:border-foreground"
                  >
                    <option value="Ekaagra">Ekaagra</option>
                    <option value="Achal">Achal</option>
                    <option value="Tiwari">Tiwari</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Property</label>
                  <select
                    value={property}
                    onChange={(e) => setProperty(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:border-foreground"
                  >
                    <option value="Doons Den">Doons Den</option>
                    <option value="The Retro Den">The Retro Den</option>
                    <option value="Terra House">Terra House</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:border-foreground"
                >
                  <option value="Labour">Labour</option>
                  <option value="Raw Material">Raw Material</option>
                  <option value="Other">Other</option>
                </select>
                {category === "Other" && (
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom category"
                    className="w-full px-3 py-2.5 mt-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-foreground"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Location / City</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value as any)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:border-foreground"
                >
                  <option value="Prem Nagar">Prem Nagar</option>
                  <option value="Paltan Bajar">Paltan Bajar</option>
                  <option value="Chandani Chowk">Chandani Chowk</option>
                  <option value="Banjara Market">Banjara Market</option>
                  <option value="Other">Other</option>
                </select>
                {location === "Other" && (
                  <input
                    type="text"
                    required
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="Enter custom location"
                    className="w-full px-3 py-2.5 mt-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-foreground"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Payment Method</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash"
                      checked={paymentMethod === "Cash"}
                      onChange={() => setPaymentMethod("Cash")}
                      className="text-foreground focus:ring-foreground"
                    />
                    Cash
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={() => setPaymentMethod("UPI")}
                      className="text-foreground focus:ring-foreground"
                    />
                    UPI
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-foreground text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-foreground text-white py-3 rounded-lg font-semibold hover:bg-foreground/95 transition flex items-center justify-center gap-2 mt-6"
              >
                {isSaving ? "Saving..." : "Record Expense"}
              </button>
            </form>
          </div>

          {/* Historical Log list */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 font-['Cormorant']">Expense Logs</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
                  <tr>
                    <th scope="col" className="px-4 py-3">Date</th>
                    <th scope="col" className="px-4 py-3">Vendor / Details</th>
                    <th scope="col" className="px-4 py-3">Location / Property</th>
                    <th scope="col" className="px-4 py-3">Who / Pay</th>
                    <th scope="col" className="px-4 py-3 text-right">Amount</th>
                    <th scope="col" className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Loading expenses...
                      </td>
                    </tr>
                  ) : expenses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400 italic">
                        No expenses logged yet.
                      </td>
                    </tr>
                  ) : (
                    expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                          {formatDisplayDate(exp.date)}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900">{exp.merchant}</p>
                          <span className="inline-block text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-md font-medium mt-0.5">
                            {exp.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <p className="text-gray-700 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {exp.location}
                          </p>
                          <p className="text-gray-400 mt-0.5">{exp.property}</p>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <p className="text-gray-700 font-medium">{exp.spender}</p>
                          <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded-full border mt-0.5 ${
                            exp.paymentMethod === "Cash" 
                              ? "bg-amber-50 text-amber-700 border-amber-200" 
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}>
                            {exp.paymentMethod}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                          ₹{exp.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete expense entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
