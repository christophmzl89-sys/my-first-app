import { createServerSupabaseClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";
import { ParticipantSchedule } from "@/components/dashboard/participant-schedule";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { getISOWeek } from "date-fns";

export default async function DashboardPage() {
  const user = await requireAuth();
  const supabase = await createServerSupabaseClient();

  // Fetch user profile with group
  const { data: profile } = await supabase
    .from("profiles")
    .select("group_id")
    .eq("id", user.id)
    .single();

  const groupId = profile?.group_id;

  // No group assigned
  if (!groupId) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6 text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="font-medium">Keine Gruppe zugewiesen</p>
          <p className="text-sm text-muted-foreground">
            Du bist noch keiner Gruppe zugeordnet. Bitte kontaktiere deinen
            Admin.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Fetch schedule for current week
  const now = new Date();
  const currentWeek = getISOWeek(now);
  const currentYear = now.getFullYear();

  const { data: entries } = await supabase
    .from("schedule_entries")
    .select("*")
    .eq("group_id", groupId)
    .eq("calendar_week", currentWeek)
    .eq("year", currentYear)
    .order("day_of_week")
    .order("start_time");

  return (
    <ParticipantSchedule
      groupId={groupId}
      initialEntries={entries || []}
      initialWeek={currentWeek}
      initialYear={currentYear}
    />
  );
}
