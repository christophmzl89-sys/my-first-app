"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { getISOWeek, getISODay } from "date-fns";
import { WeekNavigator } from "@/components/admin/week-navigator";
import { SessionCard } from "./session-card";

interface ScheduleEntry {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  topic: string;
  session_link: string | null;
  course_material_path: string | null;
  calendar_week: number;
  year: number;
}

interface ParticipantScheduleProps {
  groupId: string;
  initialEntries: ScheduleEntry[];
  initialWeek: number;
  initialYear: number;
}

export function ParticipantSchedule({
  groupId,
  initialEntries,
  initialWeek,
  initialYear,
}: ParticipantScheduleProps) {
  const [entries, setEntries] = useState<ScheduleEntry[]>(initialEntries);
  const [week, setWeek] = useState(initialWeek);
  const [year, setYear] = useState(initialYear);

  const now = new Date();
  const currentWeek = getISOWeek(now);
  const currentYear = now.getFullYear();
  const currentDayOfWeek = getISODay(now);

  const sortedEntries = [...entries].sort((a, b) => {
    if (a.day_of_week !== b.day_of_week) return a.day_of_week - b.day_of_week;
    return a.start_time.localeCompare(b.start_time);
  });

  async function handleWeekChange(w: number, y: number) {
    setWeek(w);
    setYear(y);

    const supabase = createClient();
    const { data } = await supabase
      .from("schedule_entries")
      .select("*")
      .eq("group_id", groupId)
      .eq("calendar_week", w)
      .eq("year", y)
      .order("day_of_week")
      .order("start_time");

    setEntries(data || []);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <WeekNavigator week={week} year={year} onWeekChange={handleWeekChange} />
      </div>

      {sortedEntries.length === 0 ? (
        <div className="text-center py-12 border rounded-lg border-dashed">
          <p className="text-muted-foreground">
            Keine Sessions in dieser Woche.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedEntries.map((entry) => (
            <SessionCard
              key={entry.id}
              dayOfWeek={entry.day_of_week}
              startTime={entry.start_time}
              endTime={entry.end_time}
              topic={entry.topic}
              sessionLink={entry.session_link}
              courseMaterialPath={entry.course_material_path}
              week={week}
              year={year}
              isToday={
                week === currentWeek &&
                year === currentYear &&
                entry.day_of_week === currentDayOfWeek
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
