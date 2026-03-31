import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ScheduleWeekView } from "@/components/admin/schedule-week-view";
import { getISOWeek } from "date-fns";

export default async function SchedulePage() {
  const supabase = await createServerSupabaseClient();
  const now = new Date();
  const currentWeek = getISOWeek(now);
  const currentYear = now.getFullYear();

  // Fetch all groups
  const { data: groups } = await supabase
    .from("groups")
    .select("id, name")
    .order("created_at");

  const firstGroupId = groups?.[0]?.id || null;

  // Fetch entries for first group + current week
  let initialEntries: Array<{
    id: string;
    group_id: string;
    calendar_week: number;
    year: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
    topic: string;
    session_link: string | null;
    course_material_path: string | null;
  }> = [];

  if (firstGroupId) {
    const { data } = await supabase
      .from("schedule_entries")
      .select("*")
      .eq("group_id", firstGroupId)
      .eq("calendar_week", currentWeek)
      .eq("year", currentYear)
      .order("day_of_week")
      .order("start_time");

    initialEntries = data || [];
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Stundenplan</h2>
      <ScheduleWeekView
        groups={groups || []}
        initialEntries={initialEntries}
        initialGroupId={firstGroupId}
        initialWeek={currentWeek}
        initialYear={currentYear}
      />
    </div>
  );
}
