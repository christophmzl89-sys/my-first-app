"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { uploadMaterial, deleteMaterial } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { WeekNavigator } from "./week-navigator";
import { ScheduleEntryCard, type ScheduleEntry } from "./schedule-entry-card";
import { ScheduleEntryDialog } from "./schedule-entry-dialog";
import { ScheduleDeleteDialog } from "./schedule-delete-dialog";

interface Group {
  id: string;
  name: string;
}

interface ScheduleWeekViewProps {
  groups: Group[];
  initialEntries: ScheduleEntry[];
  initialGroupId: string | null;
  initialWeek: number;
  initialYear: number;
}

export function ScheduleWeekView({
  groups,
  initialEntries,
  initialGroupId,
  initialWeek,
  initialYear,
}: ScheduleWeekViewProps) {
  const [entries, setEntries] = useState<ScheduleEntry[]>(initialEntries);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    initialGroupId || groups[0]?.id || ""
  );
  const [week, setWeek] = useState(initialWeek);
  const [year, setYear] = useState(initialYear);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<ScheduleEntry | null>(null);
  const router = useRouter();

  const sortedEntries = [...entries].sort((a, b) => {
    if (a.day_of_week !== b.day_of_week) return a.day_of_week - b.day_of_week;
    return a.start_time.localeCompare(b.start_time);
  });

  async function fetchEntries(groupId: string, w: number, y: number) {
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

  function handleGroupChange(groupId: string) {
    setSelectedGroupId(groupId);
    fetchEntries(groupId, week, year);
  }

  function handleWeekChange(w: number, y: number) {
    setWeek(w);
    setYear(y);
    if (selectedGroupId) {
      fetchEntries(selectedGroupId, w, y);
    }
  }

  async function handleSave(data: {
    day_of_week: number;
    start_time: string;
    end_time: string;
    topic: string;
    session_link: string;
    file?: File | null;
    removeFile?: boolean;
  }): Promise<{ error?: string }> {
    const supabase = createClient();

    if (editingEntry) {
      let courseMaterialPath = editingEntry.course_material_path;

      // Handle file removal
      if (data.removeFile && courseMaterialPath) {
        await deleteMaterial(courseMaterialPath);
        courseMaterialPath = null;
      }

      // Handle file upload
      if (data.file) {
        if (courseMaterialPath) {
          await deleteMaterial(courseMaterialPath);
        }
        const result = await uploadMaterial(data.file, editingEntry.group_id, editingEntry.id);
        if ("error" in result) return { error: result.error };
        courseMaterialPath = result.path;
      }

      const { error } = await supabase
        .from("schedule_entries")
        .update({
          day_of_week: data.day_of_week,
          start_time: data.start_time,
          end_time: data.end_time,
          topic: data.topic,
          session_link: data.session_link || null,
          course_material_path: courseMaterialPath,
        })
        .eq("id", editingEntry.id);

      if (error) return { error: "Fehler beim Speichern." };

      setEntries((prev) =>
        prev.map((e) =>
          e.id === editingEntry.id
            ? { ...e, ...data, session_link: data.session_link || null, course_material_path: courseMaterialPath }
            : e
        )
      );
      setEditingEntry(null);
    } else {
      // Create entry first, then upload file
      const { data: newEntry, error } = await supabase
        .from("schedule_entries")
        .insert({
          group_id: selectedGroupId,
          calendar_week: week,
          year: year,
          day_of_week: data.day_of_week,
          start_time: data.start_time,
          end_time: data.end_time,
          topic: data.topic,
          session_link: data.session_link || null,
          course_material_path: null,
        })
        .select()
        .single();

      if (error) return { error: "Fehler beim Erstellen." };

      // Upload file if provided
      if (data.file && newEntry) {
        const result = await uploadMaterial(data.file, selectedGroupId, newEntry.id);
        if ("error" in result) {
          // Entry created but upload failed — update entry without file
          setEntries((prev) => [...prev, newEntry]);
          router.refresh();
          return { error: result.error };
        }

        // Update entry with file path
        await supabase
          .from("schedule_entries")
          .update({ course_material_path: result.path })
          .eq("id", newEntry.id);

        newEntry.course_material_path = result.path;
      }

      setEntries((prev) => [...prev, newEntry]);
    }

    router.refresh();
    return {};
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("schedule_entries").delete().eq("id", id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    router.refresh();
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg border-dashed">
        <p className="text-muted-foreground">
          Erstelle zuerst Gruppen, bevor du Stundenpläne pflegen kannst.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Select value={selectedGroupId} onValueChange={handleGroupChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Gruppe wählen" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <WeekNavigator week={week} year={year} onWeekChange={handleWeekChange} />
        </div>
        <Button
          onClick={() => {
            setEditingEntry(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Session hinzufügen
        </Button>
      </div>

      {sortedEntries.length === 0 ? (
        <div className="text-center py-12 border rounded-lg border-dashed">
          <p className="text-muted-foreground mb-2">
            Keine Sessions in dieser Woche.
          </p>
          <p className="text-sm text-muted-foreground">
            Füge eine Session über den Button oben hinzu.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {sortedEntries.map((entry) => (
            <ScheduleEntryCard
              key={entry.id}
              entry={entry}
              onEdit={(e) => {
                setEditingEntry(e);
                setDialogOpen(true);
              }}
              onDelete={(e) => setDeletingEntry(e)}
            />
          ))}
        </div>
      )}

      <ScheduleEntryDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingEntry(null);
        }}
        entry={editingEntry}
        existingCount={entries.length}
        onSave={handleSave}
      />

      <ScheduleDeleteDialog
        entry={deletingEntry}
        open={!!deletingEntry}
        onOpenChange={(open) => {
          if (!open) setDeletingEntry(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
