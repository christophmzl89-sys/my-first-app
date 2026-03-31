import { createServerSupabaseClient } from "@/lib/supabase-server";
import { MemberList } from "@/components/admin/member-list";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch group
  const { data: group } = await supabase
    .from("groups")
    .select("id, name")
    .eq("id", id)
    .single();

  if (!group) {
    notFound();
  }

  // Fetch members of this group
  const { data: members } = await supabase
    .from("profiles")
    .select("id, display_name, email")
    .eq("group_id", id)
    .eq("role", "teilnehmer")
    .order("display_name");

  // Fetch available users (not in this group, only teilnehmer)
  const { data: allUsers } = await supabase
    .from("profiles")
    .select("id, display_name, email, group_id")
    .eq("role", "teilnehmer")
    .neq("group_id", id)
    .order("display_name");

  // Also fetch users with null group_id
  const { data: unassignedUsers } = await supabase
    .from("profiles")
    .select("id, display_name, email, group_id")
    .eq("role", "teilnehmer")
    .is("group_id", null)
    .order("display_name");

  // Fetch all groups for labeling
  const { data: allGroups } = await supabase
    .from("groups")
    .select("id, name");

  const groupNames: Record<string, string> = {};
  allGroups?.forEach((g) => {
    groupNames[g.id] = g.name;
  });

  const availableUsers = [
    ...(unassignedUsers || []).map((u) => ({
      ...u,
      group_name: null,
    })),
    ...(allUsers || []).map((u) => ({
      ...u,
      group_name: u.group_id ? groupNames[u.group_id] || null : null,
    })),
  ];

  return (
    <div className="space-y-4">
      <Link href="/admin">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zur Übersicht
        </Button>
      </Link>
      <MemberList
        groupId={group.id}
        groupName={group.name}
        initialMembers={members || []}
        availableUsers={availableUsers}
      />
    </div>
  );
}
