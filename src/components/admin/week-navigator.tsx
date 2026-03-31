"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeekNavigatorProps {
  week: number;
  year: number;
  onWeekChange: (week: number, year: number) => void;
}

export function WeekNavigator({ week, year, onWeekChange }: WeekNavigatorProps) {
  function handlePrev() {
    if (week === 1) {
      onWeekChange(52, year - 1);
    } else {
      onWeekChange(week - 1, year);
    }
  }

  function handleNext() {
    if (week === 52) {
      onWeekChange(1, year + 1);
    } else {
      onWeekChange(week + 1, year);
    }
  }

  function handleToday() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor(
      (now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
    );
    const currentWeek = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    onWeekChange(currentWeek, now.getFullYear());
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={handlePrev} aria-label="Vorherige Woche">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium min-w-[100px] text-center">
        KW {week} / {year}
      </span>
      <Button variant="outline" size="icon" onClick={handleNext} aria-label="Nächste Woche">
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleToday}>
        Heute
      </Button>
    </div>
  );
}
