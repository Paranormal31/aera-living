"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Users, Plus, Minus, AlertCircle } from "lucide-react";

type BookingWidgetProps = {
  price: number;
  reviews: number | string;
  maxGuests: number;
  bookedDates: string[]; // Array of date strings in YYYY-MM-DD format
};

export default function BookingWidget({
  price,
  reviews,
  maxGuests,
  bookedDates,
}: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [dateWarning, setDateWarning] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
    return date.toISOString().split("T")[0];
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
    ].join("\n");
    const url = `https://wa.me/918544337974?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };


  const calendarDays = getCalendarDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      {/* Price & Reviews */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-semibold text-foreground">
            ₹{price.toLocaleString()}
          </span>
          <span className="text-gray-500">/ night</span>
        </div>
        <p className="text-sm text-gray-600">
          {typeof reviews === "string" ? reviews : `${reviews} reviews`}
        </p>
      </div>

      {/* Booking Form */}
      <div className="space-y-4">
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
                    title={isBooked ? "Already Booked" : ""}
                  >
                    {date.getDate()}
                    {isBooked && (
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-200 rounded-lg">
                        <span className="text-[10px] font-medium text-gray-700 px-1">
                          Already Booked
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

        {/* Check Availability Button */}
        <button
          type="button"
          onClick={handleCheckAvailability}
          className="w-full bg-foreground text-white py-4 rounded-lg font-medium hover:bg-foreground/90 transition-colors duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!checkIn || !checkOut || !!dateWarning}
        >
          Check Availability
        </button>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 text-center mt-4">
          You won&apos;t be charged yet
        </p>
      </div>
    </div>
  );
}
