"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, X as XIcon } from "lucide-react";
import type { ScheduleEntry } from "./schedule-entry-card";

const DAY_OPTIONS = [
  { value: "1", label: "Montag" },
  { value: "2", label: "Dienstag" },
  { value: "3", label: "Mittwoch" },
  { value: "4", label: "Donnerstag" },
  { value: "5", label: "Freitag" },
  { value: "6", label: "Samstag" },
  { value: "7", label: "Sonntag" },
];

interface ScheduleEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: ScheduleEntry | null;
  existingCount: number;
  onSave: (data: {
    day_of_week: number;
    start_time: string;
    end_time: string;
    topic: string;
    session_link: string;
    file?: File | null;
    removeFile?: boolean;
  }) => Promise<{ error?: string }>;
}

export function ScheduleEntryDialog({
  open,
  onOpenChange,
  entry,
  existingCount,
  onSave,
}: ScheduleEntryDialogProps) {
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [topic, setTopic] = useState("");
  const [sessionLink, setSessionLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [removeFile, setRemoveFile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditing = !!entry;
  const showWarning = !isEditing && existingCount >= 2;

  useEffect(() => {
    if (entry) {
      setDayOfWeek(String(entry.day_of_week));
      setStartTime(entry.start_time.slice(0, 5));
      setEndTime(entry.end_time.slice(0, 5));
      setTopic(entry.topic);
      setSessionLink(entry.session_link || "");
      setFile(null);
      setRemoveFile(false);
    } else {
      setDayOfWeek("1");
      setStartTime("09:00");
      setEndTime("11:00");
      setTopic("");
      setSessionLink("");
      setFile(null);
      setRemoveFile(false);
    }
    setError(null);
  }, [entry, open]);

  async function handleSubmit() {
    setError(null);

    if (!topic.trim()) {
      setError("Thema darf nicht leer sein.");
      return;
    }

    if (startTime >= endTime) {
      setError("Startzeit muss vor der Endzeit liegen.");
      return;
    }

    if (sessionLink && !isValidUrl(sessionLink)) {
      setError("Bitte gib eine gültige URL ein (z.B. https://zoom.us/...).");
      return;
    }

    if (file && file.type !== "application/pdf") {
      setError("Nur PDF-Dateien erlaubt.");
      return;
    }

    if (file && file.size > 10 * 1024 * 1024) {
      setError("Datei ist zu groß (max. 10 MB).");
      return;
    }

    setLoading(true);
    const result = await onSave({
      day_of_week: Number(dayOfWeek),
      start_time: startTime,
      end_time: endTime,
      topic: topic.trim(),
      session_link: sessionLink.trim(),
      file: file,
      removeFile: removeFile,
    });
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Session bearbeiten" : "Session hinzufügen"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Ändere die Details dieser Session."
              : "Erstelle eine neue Session für diese Gruppe und Woche."}
          </DialogDescription>
        </DialogHeader>

        {showWarning && (
          <Alert>
            <AlertDescription>
              Diese Gruppe hat bereits {existingCount} Sessions in dieser Woche.
              Trotzdem hinzufügen?
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label>Wochentag</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek} disabled={loading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAY_OPTIONS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Startzeit</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">Endzeit</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Thema</Label>
            <Input
              id="topic"
              placeholder="z.B. Einführung in React"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-link">Session-Link (optional)</Label>
            <Input
              id="session-link"
              type="url"
              placeholder="https://zoom.us/j/..."
              value={sessionLink}
              onChange={(e) => setSessionLink(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Kursmaterial (optional, PDF)</Label>
            {isEditing && entry?.course_material_path && !removeFile && !file ? (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm inline-flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  PDF vorhanden
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setRemoveFile(true)}
                  disabled={loading}
                  className="text-destructive"
                >
                  <XIcon className="h-4 w-4 mr-1" />
                  Entfernen
                </Button>
              </div>
            ) : (
              <div>
                <Input
                  id="course-material"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] || null);
                    setRemoveFile(false);
                  }}
                  disabled={loading}
                />
                {removeFile && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Bestehendes PDF wird beim Speichern entfernt.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Wird gespeichert..."
              : isEditing
                ? "Speichern"
                : "Hinzufügen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
