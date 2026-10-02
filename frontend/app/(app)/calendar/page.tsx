"use client";

import React, { useState } from "react";
import { useCalendar } from "@/hooks/useContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, truncate } from "@/lib/utils";
import {
  ChevronLeft, ChevronRight, Calendar, Clock,
  MessageSquare, CheckCircle2, AlertCircle, X, Zap,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday } from "date-fns";

const STATUS_STYLES: Record<string, string> = {
  scheduled:  "bg-blue-100 text-blue-800 border-blue-200",
  sent:       "bg-emerald-100 text-emerald-800 border-emerald-200",
  failed:     "bg-red-100 text-red-800 border-red-200",
  cancelled:  "bg-zinc-100 text-zinc-600 border-zinc-200",
  processing: "bg-amber-100 text-amber-800 border-amber-200",
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "list">("month");

  const monthStart = startOfMonth(currentDate);
  const monthEnd   = endOfMonth(currentDate);
  const startDate  = format(startOfWeek(monthStart, { weekStartsOn: 1 }), "yyyy-MM-dd HH:mm:ss");
  const endDate    = format(endOfWeek(monthEnd, { weekStartsOn: 1 }), "yyyy-MM-dd HH:mm:ss");

  const { events, loading, refetch } = useCalendar(startDate, endDate);

  // Build day cells
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const days: Date[] = [];
  let day = calendarStart;
  while (day <= endOfWeek(monthEnd, { weekStartsOn: 1 })) {
    days.push(day);
    day = addDays(day, 1);
  }

  const eventsForDay = (d: Date) =>
    events.filter((e) => isSameDay(new Date(e.next_run_at), d));

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Content Calendar</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {events.length} scheduled posts this month
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View selector */}
          <div className="flex bg-zinc-100 rounded-lg p-1 gap-0.5">
            {(["month", "week", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                  view === v ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          {/* Navigation */}
          <div className="flex items-center gap-1">
            <Button size="icon" variant="outline" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-xs font-medium border border-zinc-200 rounded-lg bg-white hover:bg-zinc-50"
            >
              Today
            </button>
            <Button size="icon" variant="outline" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-sm font-semibold text-zinc-900 min-w-[140px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </h2>
        </div>
      </div>

      {view === "list" ? (
        /* ── List View ── */
        <Card>
          <div className="divide-y divide-zinc-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-5 py-4 animate-pulse flex gap-4">
                  <div className="h-10 w-16 bg-zinc-100 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-zinc-100 rounded w-1/3" />
                    <div className="h-3 bg-zinc-100 rounded w-2/3" />
                  </div>
                </div>
              ))
            ) : events.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <Calendar className="h-10 w-10 text-zinc-200 mx-auto mb-3" />
                <p className="text-sm font-medium text-zinc-400">No scheduled content</p>
                <p className="text-xs text-zinc-300 mt-1">Schedule content from the Content Studio</p>
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="px-5 py-4 flex items-center gap-4 hover:bg-zinc-50">
                  <div className="text-center min-w-[60px]">
                    <p className="text-lg font-bold text-zinc-900">
                      {format(new Date(event.next_run_at), "d")}
                    </p>
                    <p className="text-[10px] text-zinc-400 uppercase font-medium">
                      {format(new Date(event.next_run_at), "MMM")}
                    </p>
                  </div>
                  <div className="h-10 w-px bg-zinc-200" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-zinc-900">{event.title}</span>
                      <Badge variant={
                        event.status === "sent" ? "success" :
                        event.status === "failed" ? "destructive" :
                        event.status === "scheduled" ? "warning" : "secondary"
                      }>
                        {event.status}
                      </Badge>
                      {event.schedule_type === "recurring" && (
                        <Badge variant="secondary">Recurring</Badge>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{truncate(event.content_body, 80)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-zinc-700">
                      {format(new Date(event.next_run_at), "h:mm a")}
                    </p>
                    {event.business_name && (
                      <p className="text-[10px] text-zinc-400">{event.business_name}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      ) : (
        /* ── Month/Week View ── */
        <Card>
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-zinc-100">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="py-3 text-center text-xs font-medium text-zinc-500">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {days.map((d, idx) => {
              const dayEvents = eventsForDay(d);
              const isCurrentMonth = isSameMonth(d, currentDate);
              const today = isToday(d);
              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-[110px] p-2 border-b border-r border-zinc-100 last:border-r-0",
                    !isCurrentMonth && "bg-zinc-50/40",
                    idx % 7 === 6 && "border-r-0"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={cn(
                      "h-6 w-6 rounded-full text-xs font-medium flex items-center justify-center",
                      today && "bg-[#2563eb] text-white",
                      !today && isCurrentMonth && "text-zinc-700",
                      !today && !isCurrentMonth && "text-zinc-300"
                    )}>
                      {format(d, "d")}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {loading ? null : dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded truncate border",
                          STATUS_STYLES[event.status] || "bg-zinc-100 text-zinc-700 border-zinc-200"
                        )}
                        title={event.title}
                      >
                        {format(new Date(event.next_run_at), "h:mma")} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-zinc-400 px-1.5">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4">
        {Object.entries(STATUS_STYLES).map(([status, cls]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className={cn("h-2.5 w-2.5 rounded-full border", cls)} />
            <span className="text-xs text-zinc-500 capitalize">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
