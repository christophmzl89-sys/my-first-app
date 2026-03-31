import { createServerSupabaseClient } from "@/lib/supabase-server";
import { GroupList } from "@/components/admin/group-list";

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch groups with member count
  const { data: groups } = await supabase
    .from("groups")
    .select("id, name")
    .order("created_at");

  // Fetch member counts per group
  const { data: profiles } = await supabase
    .from("profiles")
    .select("group_id")
    .not("group_id", "is", null);

  const memberCounts: Record<string, number> = {};
  profiles?.forEach((p) => {
    if (p.group_id) {
      memberCounts[p.group_id] = (memberCounts[p.group_id] || 0) + 1;
    }
  });

  const groupsWithCounts = (groups || []).map((g) => ({
    ...g,
    member_count: memberCounts[g.id] || 0,
  }));

  return <GroupList initialGroups={groupsWithCounts} />;
}
