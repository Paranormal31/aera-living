"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Calendar, Trash2, Plus, Minus, LogOut, CheckCircle, AlertCircle } from "lucide-react";
import { PROPERTY_DATA } from "@/lib/siteContent";

type BlockedDate = {
  id: string;
  date: string;
  type: "airbnb" | "manual" | "direct_website";
  bookingId?: string;
};

type Booking = {
  id: string;
  propertySlug: string;
  name: string;
  contact: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
  source: string;
  amountPaid?: number;
};

export default function AdminCalendarPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [authError, setAuthError] = useState("");

  const [selectedProperty, setSelectedProperty] = useState("retro-den");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Data States
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [bookings, setBookings] = useState<Record<string, Booking>>({});
  const [airbnbUrlInput, setAirbnbUrlInput] = useState("");
  const [pastedHtml, setPastedHtml] = useState("");
  
  // Form States
  const [manualName, setManualName] = useState("");
  const [manualContact, setManualContact] = useState("");
  const [manualCheckIn, setManualCheckIn] = useState("");
  const [manualCheckOut, setManualCheckOut] = useState("");
  const [manualGuests, setManualGuests] = useState(1);
  
  // Status States
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Authenticate using simple session storage gatekeeper
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/admin/check-auth");
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
        body: JSON.stringify({ passkey }),
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

  // Fetch blocked dates and config
  const fetchData = async () => {
    try {
      // Let's call our custom admin API to list blocked dates
      const datesRes = await fetch(`/api/admin/blocked-dates?propertySlug=${selectedProperty}`);
      if (datesRes.ok) {
        const data = await datesRes.json();
        setBlockedDates(data.blockedDates || []);
        setBookings(data.bookings || {});
        if (data.config?.airbnbCalendarUrl) {
          setAirbnbUrlInput(data.config.airbnbCalendarUrl);
        } else {
          setAirbnbUrlInput("");
        }
      }
    } catch (err) {
      console.error("Failed to load admin calendar data", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, selectedProperty]);

  // Sync Calendar
  const handleSyncCalendar = async () => {
    setIsSyncing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/sync/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertySlug: selectedProperty,
          airbnbCalendarUrl: airbnbUrlInput || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: `Synced successfully! Blocked ${data.blockedCount || 0} dates.`, type: "success" });
        fetchData();
      } else {
        setMessage({ text: data.error || "Sync failed", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to sync calendar", type: "error" });
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync All Calendars configured in Firestore
  const handleSyncAllCalendars = async () => {
    setIsSyncing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/sync/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        let msg = "All calendars synced successfully!";
        if (data.results) {
          const summary = Object.entries(data.results)
            .map(([slug, res]: [string, any]) => {
              const name = PROPERTY_DATA[slug]?.name || slug;
              return res.success 
                ? `${name}: Blocked ${res.blockedCount} dates` 
                : `${name}: Failed (${res.error})`;
            })
            .join(", ");
          msg = `Sync complete: ${summary}`;
        }
        setMessage({ text: msg, type: "success" });
        fetchData();
      } else {
        setMessage({ text: data.error || "Sync failed", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to sync calendars", type: "error" });
    } finally {
      setIsSyncing(false);
    }
  };

  // Save Config
  const handleSaveConfig = async () => {
    setMessage(null);
    try {
      const res = await fetch("/api/sync/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertySlug: selectedProperty,
          airbnbCalendarUrl: airbnbUrlInput,
        }),
      });
      if (res.ok) {
        setMessage({ text: "Airbnb Calendar configuration updated.", type: "success" });
        fetchData();
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Failed to save configuration", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to save configuration", type: "error" });
    }
  };

  // Add Manual Block
  const handleAddManualBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCheckIn || !manualCheckOut || !manualName) {
      setMessage({ text: "Please enter Name, Check-in and Check-out dates.", type: "error" });
      return;
    }
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/manual-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertySlug: selectedProperty,
          name: manualName,
          contact: manualContact,
          checkIn: manualCheckIn,
          checkOut: manualCheckOut,
          guests: manualGuests,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Manual booking created successfully!", type: "success" });
        setManualName("");
        setManualContact("");
        setManualCheckIn("");
        setManualCheckOut("");
        setManualGuests(1);
        fetchData();
      } else {
        setMessage({ text: data.error || "Failed to create manual block", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to create manual booking", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Manual Booking
  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this manual booking and unblock these dates?")) {
      return;
    }
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/manual-booking?bookingId=${bookingId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage({ text: "Booking deleted successfully.", type: "success" });
        fetchData();
      } else {
        const data = await res.json();
        setMessage({ text: data.error || "Failed to delete booking", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to delete booking", type: "error" });
    }
  };

  const handleHtmlPasteSync = async () => {
    if (!pastedHtml) {
      setMessage({ text: "Please paste the HTML source code first.", type: "error" });
      return;
    }
    setIsSyncing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/sync/html-paste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertySlug: selectedProperty,
          htmlContent: pastedHtml,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: `HTML parsed successfully! Blocked ${data.blockedCount || 0} dates.`, type: "success" });
        setPastedHtml("");
        fetchData();
      } else {
        setMessage({ text: data.error || "Failed to parse HTML source", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to connect to parser", type: "error" });
    } finally {
      setIsSyncing(false);
    }
  };

  // Calendar logic helpers
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const formatDateString = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const calendarDays = getCalendarDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Map dates for quick lookups
  const blockedDatesMap = useMemo(() => {
    const map: Record<string, BlockedDate> = {};
    for (const item of blockedDates) {
      map[item.date] = item;
    }
    return map;
  }, [blockedDates]);

  if (!isAuthenticated) {
    return (
      <main className="bg-[#fafaf8] min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-['Cormorant'] font-semibold text-gray-950">AeraLiving Admin</h1>
            <p className="text-sm text-gray-500">Please enter the security passkey to access the calendar management dashboard.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Passkey</label>
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter admin passkey"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-foreground"
              />
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
    <main className="bg-[#fafaf8] min-h-screen p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-['Cormorant'] font-semibold text-gray-900">Property Calendars</h1>
            <p className="text-sm text-gray-500">Sync Airbnb reservations and manage manual block dates for direct bookings.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncAllCalendars}
              disabled={isSyncing}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
              Sync All Calendars
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

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Calendar View */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Property tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 flex gap-1">
              {Object.entries(PROPERTY_DATA).map(([slug, prop]) => (
                <button
                  key={slug}
                  onClick={() => setSelectedProperty(slug)}
                  className={`flex-1 py-3 text-sm font-semibold rounded-xl transition ${
                    selectedProperty === slug ? "bg-foreground text-white shadow-sm" : "text-gray-600 hover:text-gray-950 hover:bg-gray-50"
                  }`}
                >
                  {prop.name}
                </button>
              ))}
            </div>

            {/* Calendar Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-950">
                  {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                    className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                    className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div>
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {weekDays.map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((date, idx) => {
                    if (!date) return <div key={`empty-${idx}`} className="aspect-square bg-gray-50/50 rounded-xl" />;
                    
                    const dateStr = formatDateString(date);
                    const block = blockedDatesMap[dateStr];
                    const isManual = block?.type === "manual";
                    const isAirbnb = block?.type === "airbnb";
                    const isWebsite = block?.type === "direct_website";

                    let bgClass = "bg-white hover:bg-gray-50 text-gray-800 border border-gray-100";
                    if (isAirbnb) bgClass = "bg-amber-50 text-amber-800 border border-amber-200 font-semibold";
                    if (isManual) bgClass = "bg-blue-50 text-blue-800 border border-blue-200 font-semibold";
                    if (isWebsite) bgClass = "bg-green-50 text-green-800 border border-green-200 font-semibold";

                    return (
                      <div
                        key={dateStr}
                        className={`aspect-square rounded-xl p-2 flex flex-col justify-between transition text-sm ${bgClass}`}
                      >
                        <span className="text-xs">{date.getDate()}</span>
                        {block && (
                          <span className="text-[10px] tracking-tight uppercase truncate">
                            {isAirbnb ? "Airbnb" : isManual ? "Manual" : "Website"}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex gap-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-100 border border-amber-300 rounded-sm" />
                  <span>Airbnb Synced</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-sm" />
                  <span>Manual Blocks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-sm" />
                  <span>Direct Website</span>
                </div>
              </div>

            </div>

            {/* List of active bookings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-950 font-['Cormorant']">Active Bookings & Manual Blocks</h3>
              <div className="divide-y divide-gray-100">
                {Object.values(bookings).length === 0 ? (
                  <p className="text-sm text-gray-500 py-4">No bookings or manual blocks recorded for this property.</p>
                ) : (
                  Object.values(bookings)
                    .filter(b => b.propertySlug === selectedProperty || !b.propertySlug)
                    .map((b) => (
                      <div key={b.id} className="py-4 flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900">{b.name}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              b.status === "confirmed" 
                                ? "bg-green-50 text-green-700 border border-green-200" 
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}>
                              {b.status === "confirmed" ? "Website Booking" : "Manual Block"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 flex items-center gap-2">
                            <span>📞 {b.contact}</span>
                            <span>•</span>
                            <span>👥 {b.guests} guests</span>
                            <span>•</span>
                            <span>📅 {b.checkIn} to {b.checkOut}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Forms & Configuration */}
          <div className="space-y-6">
            
            {/* Airbnb URL config */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-950">Airbnb Sync</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Paste your listing's private iCal Export link. You can get this in Airbnb Listing Settings &rarr; Pricing and availability &rarr; Calendar sync.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={airbnbUrlInput}
                  onChange={(e) => setAirbnbUrlInput(e.target.value)}
                  placeholder="https://www.airbnb.com/calendar/ical/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-foreground"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveConfig}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 transition"
                  >
                    Save URL
                  </button>
                  <button
                    onClick={handleSyncCalendar}
                    disabled={isSyncing || !airbnbUrlInput}
                    className="flex-1 bg-foreground text-white py-2 rounded-lg text-xs font-semibold hover:bg-foreground/90 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                    Sync Now
                  </button>
                </div>
              </div>
            </div>

            {/* Manual Bookings Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-950">Add In-Person Booking</h3>
              </div>
              <form onSubmit={handleAddManualBlock} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Guest Name</label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Phone/Email</label>
                  <input
                    type="text"
                    value={manualContact}
                    onChange={(e) => setManualContact(e.target.value)}
                    placeholder="e.g. +91 99999 88888"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Check-in</label>
                    <input
                      type="date"
                      required
                      value={manualCheckIn}
                      onChange={(e) => setManualCheckIn(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Check-out</label>
                    <input
                      type="date"
                      required
                      value={manualCheckOut}
                      onChange={(e) => setManualCheckOut(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-foreground text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Guests</label>
                  <div className="flex items-center justify-between border border-gray-300 rounded-lg p-2 bg-white">
                    <span className="text-gray-950 px-1 font-medium">{manualGuests} {manualGuests === 1 ? "Guest" : "Guests"}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setManualGuests(Math.max(1, manualGuests - 1))}
                        disabled={manualGuests <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold disabled:opacity-40 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setManualGuests(manualGuests + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-foreground text-white py-3 rounded-lg font-semibold hover:bg-foreground/95 transition flex items-center justify-center gap-2"
                >
                  {isSaving ? "Saving..." : "Create Block"}
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
