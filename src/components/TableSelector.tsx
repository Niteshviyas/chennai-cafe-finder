import { useState, useEffect } from "react";
import { Users, Lock, Coffee, Armchair, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TableSelectorProps {
  cafeId: string;
  onSelectTable: (tableId: string) => void;
}

interface TableInfo {
  id: string;
  label: string;
  seats: number;
  shape: "round" | "rect" | "square";
  x: number;
  y: number;
  width: number;
  height: number;
}

const TABLES: TableInfo[] = [
  { id: "T1", label: "T1", seats: 2, shape: "round", x: 6, y: 18, width: 14, height: 16 },
  { id: "T2", label: "T2", seats: 2, shape: "round", x: 6, y: 52, width: 14, height: 16 },
  { id: "T3", label: "T3", seats: 4, shape: "rect", x: 28, y: 12, width: 18, height: 22 },
  { id: "T4", label: "T4", seats: 4, shape: "rect", x: 28, y: 48, width: 18, height: 22 },
  { id: "T5", label: "T5", seats: 4, shape: "square", x: 55, y: 12, width: 16, height: 18 },
  { id: "T6", label: "T6", seats: 4, shape: "square", x: 55, y: 50, width: 16, height: 18 },
  { id: "T7", label: "T7", seats: 6, shape: "rect", x: 78, y: 10, width: 18, height: 28 },
  { id: "T8", label: "T8", seats: 8, shape: "rect", x: 78, y: 52, width: 18, height: 30 },
];

const TableSelector = ({ cafeId, onSelectTable }: TableSelectorProps) => {
  const [bookedTables, setBookedTables] = useState<string[]>([]);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookedTables = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("bookings")
        .select("booking_time")
        .eq("cafe_id", cafeId)
        .eq("booking_date", today)
        .eq("status", "confirmed");

      const count = data?.length || 0;
      const hash = cafeId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      const booked: string[] = [];
      TABLES.forEach((t, i) => {
        if ((hash + i) % 3 === 0 && booked.length < Math.max(count, 2)) {
          booked.push(t.id);
        }
      });
      setBookedTables(booked);
    };
    fetchBookedTables();
  }, [cafeId]);

  const availableCount = TABLES.length - bookedTables.length;

  const getShapeClasses = (shape: TableInfo["shape"]) => {
    switch (shape) {
      case "round": return "rounded-full";
      case "rect": return "rounded-2xl";
      case "square": return "rounded-xl";
    }
  };

  const renderSeats = (table: TableInfo, isBooked: boolean) => {
    const seatColor = isBooked
      ? "bg-destructive/25 border-destructive/35"
      : "bg-primary/20 border-primary/35";
    const seats: JSX.Element[] = [];
    const count = table.seats;

    if (table.shape === "round") {
      for (let i = 0; i < count; i++) {
        const angle = (360 / count) * i - 90;
        const rad = (angle * Math.PI) / 180;
        const radius = 130;
        seats.push(
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full border ${seatColor} transition-all duration-500`}
            style={{
              left: `calc(50% + ${Math.cos(rad) * radius}% - 4px)`,
              top: `calc(50% + ${Math.sin(rad) * radius}% - 4px)`,
            }}
          />
        );
      }
    } else {
      const perSide = Math.ceil(count / 2);
      for (let i = 0; i < perSide; i++) {
        const offset = ((i + 1) / (perSide + 1)) * 100;
        seats.push(
          <div key={`top-${i}`} className={`absolute w-2 h-2 rounded-full border ${seatColor} transition-all duration-500`}
            style={{ left: `${offset}%`, top: "-8px", transform: "translateX(-50%)" }} />
        );
      }
      for (let i = 0; i < count - perSide; i++) {
        const offset = ((i + 1) / (count - perSide + 1)) * 100;
        seats.push(
          <div key={`bot-${i}`} className={`absolute w-2 h-2 rounded-full border ${seatColor} transition-all duration-500`}
            style={{ left: `${offset}%`, bottom: "-8px", transform: "translateX(-50%)" }} />
        );
      }
    }
    return seats;
  };

  return (
    <div className="mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <Armchair className="h-4.5 w-4.5 text-primary" />
            </div>
            Select Your Table
          </h2>
          <p className="text-sm text-muted-foreground mt-1 ml-[3rem]">
            Tap an available table to reserve your spot
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">{availableCount} available</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-5 px-1">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/40 shadow-sm shadow-primary/10" />
          <span className="text-xs font-medium text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-destructive/30 to-destructive/10 border border-destructive/40" />
          <span className="text-xs font-medium text-muted-foreground">Booked</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
            <span className="w-3 h-3 rounded-full border border-dashed border-muted-foreground/30" />
            Round
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
            <span className="w-3 h-2 rounded-sm border border-dashed border-muted-foreground/30" />
            Rect
          </div>
        </div>
      </div>

      {/* Floor Plan */}
      <div className="relative w-full rounded-3xl border-2 border-border bg-gradient-to-br from-muted/40 via-background to-muted/20 overflow-hidden shadow-[var(--shadow-card)]" style={{ aspectRatio: "16/9" }}>
        {/* Subtle floor pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }} />

        {/* Inner wall glow */}
        <div className="absolute inset-2 rounded-2xl border border-border/60 pointer-events-none" />
        <div className="absolute inset-2 rounded-2xl pointer-events-none" style={{ boxShadow: "inset 0 0 30px hsl(var(--primary) / 0.03)" }} />

        {/* Windows — left wall */}
        <div className="absolute left-0 top-[15%] w-1 h-[20%] rounded-r-full bg-gradient-to-b from-accent to-primary/20 shadow-[0_0_8px_hsl(var(--primary)/0.15)]" />
        <div className="absolute left-0 top-[50%] w-1 h-[20%] rounded-r-full bg-gradient-to-b from-accent to-primary/20 shadow-[0_0_8px_hsl(var(--primary)/0.15)]" />

        {/* Windows — top wall */}
        <div className="absolute top-0 left-[20%] h-1 w-[18%] rounded-b-full bg-gradient-to-r from-accent to-primary/20 shadow-[0_0_8px_hsl(var(--primary)/0.15)]" />
        <div className="absolute top-0 left-[55%] h-1 w-[18%] rounded-b-full bg-gradient-to-r from-accent to-primary/20 shadow-[0_0_8px_hsl(var(--primary)/0.15)]" />

        {/* Window — right wall */}
        <div className="absolute right-0 top-[35%] w-1 h-[25%] rounded-l-full bg-gradient-to-b from-primary/20 to-accent shadow-[0_0_8px_hsl(var(--primary)/0.15)]" />

        {/* Entrance */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 pb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 rounded-full bg-border" />
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-primary/40 via-primary/60 to-primary/40 shadow-sm" />
            <div className="w-6 h-0.5 rounded-full bg-border" />
          </div>
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Entrance</span>
        </div>

        {/* Window label */}
        <div className="absolute top-3 left-3.5 flex items-center gap-1.5 opacity-50">
          <div className="w-1 h-1 rounded-full bg-primary/60" />
          <span className="text-[7px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Window</span>
        </div>

        {/* Counter */}
        <div className="absolute top-3 right-3.5 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/15 backdrop-blur-sm">
          <Coffee className="h-3 w-3 text-primary" />
          <span className="text-[9px] font-bold text-primary uppercase tracking-[0.15em]">Counter</span>
        </div>

        {/* Tables */}
        {TABLES.map((table, index) => {
          const isBooked = bookedTables.includes(table.id);
          const isHovered = hoveredTable === table.id;
          const isSelected = selectedPreview === table.id;

          return (
            <button
              key={table.id}
              disabled={isBooked}
              onClick={() => {
                setSelectedPreview(table.id);
                onSelectTable(table.id);
              }}
              onMouseEnter={() => setHoveredTable(table.id)}
              onMouseLeave={() => setHoveredTable(null)}
              className={`absolute flex flex-col items-center justify-center border-2 transition-all duration-300 booking-fade-up group ${getShapeClasses(table.shape)} ${
                isBooked
                  ? "bg-destructive/8 border-destructive/25 cursor-not-allowed opacity-60"
                  : isSelected
                  ? "bg-primary/20 border-primary/50 scale-110 shadow-xl shadow-primary/20 z-10 ring-2 ring-primary/30 ring-offset-1 ring-offset-background"
                  : isHovered
                  ? "bg-primary/15 border-primary/40 scale-110 shadow-lg shadow-primary/15 z-10"
                  : "bg-primary/5 border-primary/20 hover:bg-primary/12 hover:border-primary/35 hover:scale-105 hover:shadow-md hover:z-10"
              }`}
              style={{
                left: `${table.x}%`,
                top: `${table.y}%`,
                width: `${table.width}%`,
                height: `${table.height}%`,
                animationDelay: `${index * 0.07}s`,
              }}
            >
              {renderSeats(table, isBooked)}

              {isBooked ? (
                <Lock className="h-3.5 w-3.5 text-destructive/60 mb-0.5" />
              ) : (
                <Users className="h-3 w-3 text-primary/50 mb-0.5 transition-all group-hover:text-primary group-hover:scale-110" />
              )}
              <span className={`text-xs sm:text-sm font-bold leading-none transition-colors ${
                isBooked ? "text-destructive/40" : isSelected ? "text-primary" : "text-foreground"
              }`}>
                {table.label}
              </span>
              <span className={`text-[7px] sm:text-[8px] font-semibold mt-0.5 transition-colors uppercase tracking-wider ${
                isBooked ? "text-destructive/30" : "text-muted-foreground/70"
              }`}>
                {table.seats} seats
              </span>

              {/* Tooltip */}
              {isHovered && !isBooked && (
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-foreground text-background text-[10px] font-bold whitespace-nowrap shadow-xl animate-fade-in z-20">
                  Book {table.label} · {table.seats} seats
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45 rounded-sm" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TableSelector;
