"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { GroupCard } from "./group-card";
import { GroupCreateDialog } from "./group-create-dialog";

interface Group {
  id: string;
  name: string;
  member_count: number;
}

interface GroupListProps {
  initialGroups: Group[];
}

export function GroupList({ initialGroups }: GroupListProps) {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const router = useRouter();

  async function handleCreate(name: string): Promise<{ error?: string }> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("groups")
      .insert({ name })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return { error: "Eine Gruppe mit diesem Namen existiert bereits." };
      }
      return { error: "Fehler beim Erstellen der Gruppe." };
    }

    setGroups((prev) => [...prev, { ...data, member_count: 0 }]);
    router.refresh();
    return {};
  }

  async function handleRename(
    id: string,
    newName: string
  ): Promise<{ error?: string }> {
    const supabase = createClient();
    const { error } = await supabase
      .from("groups")
      .update({ name: newName })
      .eq("id", id);

    if (error) {
      if (error.code === "23505") {
        return { error: "Eine Gruppe mit diesem Namen existiert bereits." };
      }
      return { error: "Fehler beim Umbenennen." };
    }

    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, name: newName } : g))
    );
    router.refresh();
    return {};
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gruppen</h2>
        <GroupCreateDialog onCreate={handleCreate} />
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-12 border rounded-lg border-dashed">
          <p className="text-muted-foreground mb-4">
            Noch keine Gruppen vorhanden.
          </p>
          <p className="text-sm text-muted-foreground">
            Erstelle deine erste Gruppe, um Teilnehmer zuzuordnen.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              id={group.id}
              name={group.name}
              memberCount={group.member_count}
              onRename={handleRename}
            />
          ))}
        </div>
      )}
    </div>
  );
}
