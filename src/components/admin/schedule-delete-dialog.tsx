"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ScheduleEntry } from "./schedule-entry-card";

const DAY_NAMES: Record<number, string> = {
  1: "Montag",
  2: "Dienstag",
  3: "Mittwoch",
  4: "Donnerstag",
  5: "Freitag",
  6: "Samstag",
  7: "Sonntag",
};

interface ScheduleDeleteDialogProps {
  entry: ScheduleEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
}

export function ScheduleDeleteDialog({
  entry,
  open,
  onOpenChange,
  onConfirm,
}: ScheduleDeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!entry) return;
    setLoading(true);
    await onConfirm(entry.id);
    setLoading(false);
    onOpenChange(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Session löschen?</AlertDialogTitle>
          <AlertDialogDescription>
            {entry && (
              <>
                Möchtest du die Session am{" "}
                <strong>{DAY_NAMES[entry.day_of_week]}</strong> zum Thema{" "}
                <strong>&quot;{entry.topic}&quot;</strong> wirklich löschen? Diese
                Aktion kann nicht rückgängig gemacht werden.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Wird gelöscht..." : "Löschen"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
