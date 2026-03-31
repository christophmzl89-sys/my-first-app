"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ExternalLink, FileText } from "lucide-react";

const DAY_NAMES: Record<number, string> = {
  1: "Montag",
  2: "Dienstag",
  3: "Mittwoch",
  4: "Donnerstag",
  5: "Freitag",
  6: "Samstag",
  7: "Sonntag",
};

export interface ScheduleEntry {
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
}

interface ScheduleEntryCardProps {
  entry: ScheduleEntry;
  onEdit: (entry: ScheduleEntry) => void;
  onDelete: (entry: ScheduleEntry) => void;
}

export function ScheduleEntryCard({
  entry,
  onEdit,
  onDelete,
}: ScheduleEntryCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 pt-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {DAY_NAMES[entry.day_of_week] || `Tag ${entry.day_of_week}`}
            </span>
            <span className="text-sm text-muted-foreground">
              {entry.start_time.slice(0, 5)} – {entry.end_time.slice(0, 5)}
            </span>
          </div>
          <p className="font-medium">{entry.topic}</p>
          <div className="flex items-center gap-3">
            {entry.session_link && (
              <a
                href={entry.session_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                Session-Link
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {entry.course_material_path && (
              <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
                <FileText className="h-3 w-3" />
                PDF
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(entry)}
            aria-label="Bearbeiten"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => onDelete(entry)}
            aria-label="Löschen"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
