"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Users, Plus, Minus, AlertCircle } from "lucide-react";

type BookingWidgetProps = {
  price: number;
  reviews: number | string;
  maxGuests: number;
  bookedDates: string[]; // Array of date strings in YYYY-MM-DD format
  maxBedrooms?: number;
  pricePerBedroom?: number;
  propertySlug: string;
};

export default function BookingWidget({
  price,
  reviews,
  maxGuests,
  bookedDates,
  maxBedrooms,
  pricePerBedroom,
  propertySlug,
}: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [selectedBedrooms, setSelectedBedrooms] = useState(1);
  const [dateWarning, setDateWarning] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [bookingMode, setBookingMode] = useState<"inquiry" | "pay">("pay");
  const [showForm, setShowForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const currentPrice = pricePerBedroom ? selectedBedrooms * pricePerBedroom : price;

  // Convert booked dates to Date objects for easier comparison
  const bookedDatesSet = useMemo(() => {
    return new Set(bookedDates.map((date) => date));
  }, [bookedDates]);

  // Check if a date is booked
  const isDateBooked = (date: Date): boolean => {
    const dateStr = formatDateForComparison(date);
    return bookedDatesSet.has(dateStr);
  };

  // Format date for comparison (YYYY-MM-DD)
  const formatDateForComparison = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Check if dates overlap with booked dates
  const checkDateAvailability = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let hasConflict = false;

    // Check each day in the range
    const current = new Date(start);
    while (current < end) {
      if (isDateBooked(current)) {
        hasConflict = true;
        break;
      }
      current.setDate(current.getDate() + 1);
    }

    if (hasConflict) {
      setDateWarning("These dates are already booked. Please select different dates.");
    } else {
      setDateWarning("");
    }
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    // Don't allow selection of booked dates or past dates
    if (isDateBooked(date) || date < new Date(new Date().setHours(0, 0, 0, 0))) {
      return;
    }

    // If no check-in selected, or if clicking before current check-in, set as check-in
    if (!checkIn || (checkOut && date < checkIn)) {
      setCheckIn(date);
      setCheckOut(null);
      setDateWarning("");
    } else if (!checkOut) {
      // Set check-out
      if (date <= checkIn) {
        // If clicked date is before or same as check-in, swap them
        setCheckOut(checkIn);
        setCheckIn(date);
      } else {
        setCheckOut(date);
        checkDateAvailability(checkIn, date);
      }
    } else {
      // Both dates selected, start fresh
      setCheckIn(date);
      setCheckOut(null);
      setDateWarning("");
    }
  };

  // Check if date is in selected range
  const isInSelectedRange = (date: Date): boolean => {
    if (!checkIn || !checkOut) return false;
    const dateStr = formatDateForComparison(date);
    const startStr = formatDateForComparison(checkIn);
    const endStr = formatDateForComparison(checkOut);
    return dateStr >= startStr && dateStr <= endStr;
  };

  // Check if date is check-in or check-out
  const isCheckInOrOut = (date: Date): boolean => {
    if (!checkIn || !checkOut) {
      return checkIn ? formatDateForComparison(date) === formatDateForComparison(checkIn) : false;
    }
    const dateStr = formatDateForComparison(date);
    return (
      dateStr === formatDateForComparison(checkIn) ||
      dateStr === formatDateForComparison(checkOut)
    );
  };

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Format month/year for display
  const getMonthYearString = () => {
    return currentMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Check if date is today or in the past
  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const incrementGuests = () => {
    if (guests < maxGuests) {
      setGuests(guests + 1);
    }
  };

  const decrementGuests = () => {
    if (guests > 1) {
      setGuests(guests - 1);
    }
  };

  const getNightsCount = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffMs = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  };

  const nightsCount = getNightsCount();
  const totalCost = nightsCount * currentPrice;

  const formatDateForMessage = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const handleCheckAvailability = () => {
    if (!checkIn || !checkOut || dateWarning) return;
    const message = [
      "Hi! I want to check availability.",
      `Check-in: ${formatDateForMessage(checkIn)}`,
      `Check-out: ${formatDateForMessage(checkOut)}`,
      `Guests: ${guests}`,
    ];
    
    if (pricePerBedroom && maxBedrooms) {
      message.push(`Bedrooms: ${selectedBedrooms}`);
      message.push(`Price per bedroom: ₹${pricePerBedroom.toLocaleString("en-IN")}`);
    }

    const url = `https://wa.me/918544337974?text=${encodeURIComponent(message.join("\n"))}`;
    window.open(url, "_blank");
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOnlineBooking = async () => {
    if (!checkIn || !checkOut || !customerName || !customerContact) {
      setBookingError("Please fill in your name and contact details.");
      return;
    }
    setIsProcessing(true);
    setBookingError("");

    try {
      // 1. Create order
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertySlug,
          checkIn: formatDateForComparison(checkIn),
          checkOut: formatDateForComparison(checkOut),
          guests,
          name: customerName,
          contact: customerContact,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.error || "Failed to create booking order");
      }

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load payment gateway checkout");
      }

      // 3. Open Razorpay Checkout or handle Mock simulation
      if (orderData.orderId.startsWith("order_mock_")) {
        // Mock payment confirmation workflow for ease of testing
        const confirmRes = await fetch("/api/checkout/webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: orderData.bookingId,
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: "pay_mock_" + Math.random().toString(36).substring(2, 9),
            razorpay_signature: "mock_signature",
            isMock: true,
          }),
        });
        const confirmData = await confirmRes.json();
        if (confirmRes.ok) {
          setPaymentSuccess(true);
        } else {
          throw new Error(confirmData.error || "Failed to verify mock payment");
        }
      } else {
        // Real Razorpay integration
        const options = {
          key: orderData.keyId,
          amount: orderData.amount * 100,
          currency: orderData.currency,
          name: "AeraLiving",
          description: `Booking for ${orderData.propertyName}`,
          order_id: orderData.orderId,
          handler: async function (response: any) {
            setIsProcessing(true);
            try {
              const confirmRes = await fetch("/api/checkout/webhook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  bookingId: orderData.bookingId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const confirmData = await confirmRes.json();
              if (confirmRes.ok) {
                setPaymentSuccess(true);
              } else {
                setBookingError(confirmData.error || "Payment verification failed");
              }
            } catch (err: any) {
              setBookingError(err.message || "Failed to verify payment");
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: customerName,
            contact: customerContact,
          },
          theme: {
            color: "#0a0a0a",
          },
        };
        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      }
    } catch (err: any) {
      setBookingError(err.message || "Something went wrong during checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  const calendarDays = getCalendarDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (paymentSuccess) {
    return (
      <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-8 border border-green-100 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center border border-green-200">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 font-['Cormorant']">Booking Confirmed!</h3>
          <p className="text-gray-500 text-sm mt-1">We've locked your dates. Have a beautiful stay!</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-left text-sm space-y-2 border border-gray-100">
          <div className="flex justify-between">
            <span className="text-gray-500">Check-in:</span>
            <span className="font-medium text-gray-900">
              {checkIn?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Check-out:</span>
            <span className="font-medium text-gray-900">
              {checkOut?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Guests:</span>
            <span className="font-medium text-gray-900">{guests} guests</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
            <span className="text-gray-900 font-medium">Paid:</span>
            <span className="font-semibold text-green-700">₹{totalCost.toLocaleString("en-IN")}</span>
          </div>
        </div>
        <button
          onClick={() => {
            setCheckIn(null);
            setCheckOut(null);
            setPaymentSuccess(false);
            setShowForm(false);
          }}
          className="w-full bg-foreground text-white py-3 rounded-lg font-medium hover:bg-foreground/90 transition-colors"
        >
          Book Another Stay
        </button>
      </div>
    );
  }

  return (
    <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      {/* Price & Reviews */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-semibold text-foreground">
            ₹{currentPrice.toLocaleString()}
          </span>
          <span className="text-gray-500">/ night</span>
        </div>
        <p className="text-sm text-gray-600">
          {typeof reviews === "string" ? reviews : `${reviews} reviews`}
        </p>
      </div>

      {showForm ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-950 font-['Cormorant'] text-lg">Guest Details</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              Back to dates
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                Contact (Phone or Email)
              </label>
              <input
                type="text"
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                placeholder="e.g. +91 9999999999 or user@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-foreground"
              />
            </div>
          </div>

          {/* Pricing Breakout */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-2 mt-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>₹{currentPrice.toLocaleString()} x {nightsCount} nights</span>
              <span>₹{totalCost.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-950 border-t border-gray-200 pt-2">
              <span>Total amount</span>
              <span>₹{totalCost.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {bookingError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="text-red-600 w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-700">{bookingError}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleOnlineBooking}
            disabled={isProcessing || !customerName || !customerContact}
            className="w-full bg-foreground text-white py-4 rounded-lg font-medium hover:bg-foreground/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              `Pay ₹${totalCost.toLocaleString("en-IN")} & Confirm`
            )}
          </button>
        </div>
      ) : (
        /* Booking Form */
        <div className="space-y-4">
          {/* Booking Mode Selector */}
          <div className="flex rounded-lg bg-gray-100 p-0.5 border border-gray-200">
            <button
              type="button"
              onClick={() => setBookingMode("pay")}
              className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all ${
                bookingMode === "pay"
                  ? "bg-white text-gray-950 shadow-sm"
                  : "text-gray-500 hover:text-gray-950"
              }`}
            >
              Book & Pay Online
            </button>
            <button
              type="button"
              onClick={() => setBookingMode("inquiry")}
              className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all ${
                bookingMode === "inquiry"
                  ? "bg-white text-gray-950 shadow-sm"
                  : "text-gray-500 hover:text-gray-950"
              }`}
            >
              WhatsApp Inquiry
            </button>
          </div>

          {/* Calendar */}
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-3">
              SELECT DATES
            </label>

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-base font-semibold text-gray-900">
                {getMonthYearString()}
              </h3>
              <button
                type="button"
                onClick={goToNextMonth}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="mb-2">
              {/* Week day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const isBooked = isDateBooked(date);
                  const isPast = isPastDate(date);
                  const inRange = isInSelectedRange(date);
                  const isSelected = isCheckInOrOut(date);
                  const isDisabled = isBooked || isPast;

                  return (
                    <button
                      key={formatDateForComparison(date)}
                      type="button"
                      onClick={() => handleDateClick(date)}
                      disabled={isDisabled}
                      className={`
                        aspect-square text-sm rounded-lg transition-all
                        ${isDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"}
                        ${isBooked ? "bg-gray-200 text-gray-500" : ""}
                        ${isPast && !isBooked ? "text-gray-300" : ""}
                        ${!isDisabled && !isBooked ? "text-gray-700" : ""}
                        ${inRange && !isBooked ? "bg-blue-50 text-blue-700" : ""}
                        ${isSelected && !isBooked ? "bg-foreground text-white font-semibold" : ""}
                        relative group
                      `}
                      title={isBooked ? "Blocked" : ""}
                    >
                      {date.getDate()}
                      {isBooked && (
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-200 rounded-lg">
                          <span className="text-[10px] font-medium text-gray-700 px-1">
                            Blocked
                          </span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected dates display */}
            {(checkIn || checkOut) && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex gap-4 text-xs">
                  {checkIn && (
                    <div>
                      <span className="text-gray-500">Check-in: </span>
                      <span className="font-medium text-gray-700">
                        {checkIn.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  {checkOut && (
                    <div>
                      <span className="text-gray-500">Check-out: </span>
                      <span className="font-medium text-gray-700">
                        {checkOut.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Date Warning */}
          {dateWarning && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="text-red-600 w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-700">{dateWarning}</p>
            </div>
          )}

          {/* Guests */}
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
              GUESTS
            </label>
            <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg">
              <button
                type="button"
                onClick={decrementGuests}
                disabled={guests === 1}
                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease guests"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <div className="flex-1 flex items-center gap-2">
                <Users className="text-gray-400 w-5 h-5" />
                <span className="text-gray-700 font-medium">
                  {guests} {guests === 1 ? "guest" : "guests"}
                </span>
              </div>
              <button
                type="button"
                onClick={incrementGuests}
                disabled={guests >= maxGuests}
                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase guests"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Bedrooms */}
          {maxBedrooms && pricePerBedroom && (
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                SELECT BEDROOMS
              </label>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: maxBedrooms }, (_, index) => index + 1).map((bedroomCount) => (
                  <button
                    key={bedroomCount}
                    type="button"
                    onClick={() => setSelectedBedrooms(bedroomCount)}
                    className={`rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                      selectedBedrooms === bedroomCount
                        ? "border-foreground bg-foreground text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    aria-label={`Select ${bedroomCount} bedroom${bedroomCount === 1 ? "" : "s"}`}
                  >
                    {bedroomCount}
                    <span className="block text-[11px] font-normal mt-1 opacity-90">
                      {bedroomCount === 1 ? "Bedroom" : "Bedrooms"}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                ₹{pricePerBedroom.toLocaleString("en-IN")} per bedroom
              </p>
            </div>
          )}

          {/* Total Cost */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total for {nightsCount} {nightsCount === 1 ? "night" : "nights"}</span>
              <span className="font-semibold text-gray-900">
                ₹{totalCost.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {guests} {guests === 1 ? "guest" : "guests"}
            </div>
          </div>

          {/* Main Booking Action Button */}
          {bookingMode === "pay" ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="w-full bg-foreground text-white py-4 rounded-lg font-medium hover:bg-foreground/90 transition-colors duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!checkIn || !checkOut || !!dateWarning}
            >
              Book Now
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCheckAvailability}
              className="w-full bg-[#25D366] text-white py-4 rounded-lg font-medium hover:bg-[#20ba59] transition-colors duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={!checkIn || !checkOut || !!dateWarning}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.419 1.451 5.561 0 10.085-4.52 10.089-10.081.002-2.696-1.042-5.229-2.942-7.129-1.9-1.9-4.433-2.943-7.135-2.944-5.567 0-10.096 4.525-10.1 10.087-.001 1.93.504 3.812 1.465 5.517l-.961 3.51 3.593-.942zm11.758-6.83c-.302-.152-1.791-.883-2.067-.984-.277-.101-.478-.152-.678.152-.2.302-.777.984-.952 1.185-.177.2-.353.227-.655.076-.302-.152-1.277-.47-2.434-1.502-.9-.8-1.507-1.79-1.684-2.09-.177-.302-.019-.465.132-.615.136-.135.302-.353.454-.53.151-.177.202-.303.303-.505.101-.202.051-.379-.025-.53-.076-.152-.678-1.634-.93-2.238-.244-.589-.493-.51-.678-.519-.174-.009-.374-.01-.573-.01-.2 0-.526.075-.802.378-.277.302-1.057 1.034-1.057 2.522 0 1.488 1.082 2.923 1.232 3.125.152.202 2.128 3.25 5.157 4.561.72.31 1.28.497 1.718.637.724.23 1.382.197 1.902.12.58-.087 1.792-.733 2.043-1.44.251-.707.251-1.313.176-1.44-.075-.126-.277-.202-.578-.354z" />
              </svg>
              Inquire on WhatsApp
            </button>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Secured payments via Razorpay / Cards / UPI
          </p>
        </div>
      )}
    </div>
  );
}
