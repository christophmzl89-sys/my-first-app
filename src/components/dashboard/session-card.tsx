"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";
import { getMaterialUrl } from "@/lib/storage";
import { format, setISOWeek, setYear, setISODay } from "date-fns";
import { de } from "date-fns/locale";

interface SessionCardProps {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  topic: string;
  sessionLink: string | null;
  courseMaterialPath: string | null;
  week: number;
  year: number;
  isToday: boolean;
}

export function SessionCard({
  dayOfWeek,
  startTime,
  endTime,
  topic,
  sessionLink,
  courseMaterialPath,
  week,
  year,
  isToday,
}: SessionCardProps) {
  // Calculate concrete date from year + week + day
  const date = setISODay(setISOWeek(setYear(new Date(), year), week), dayOfWeek);
  const formattedDate = format(date, "EEEE, d. MMMM", { locale: de });

  return (
    <Card className={isToday ? "border-primary border-2" : ""}>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium capitalize">{formattedDate}</span>
            {isToday && (
              <Badge variant="default" className="text-xs">
                Heute
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {startTime.slice(0, 5)} – {endTime.slice(0, 5)}
          </span>
        </div>

        <p className="text-lg font-semibold">{topic}</p>

        <div className="space-y-2">
          {sessionLink ? (
            <a href={sessionLink} target="_blank" rel="noopener noreferrer">
              <Button className="w-full" size="lg">
                <ExternalLink className="h-4 w-4 mr-2" />
                Zur Session beitreten
              </Button>
            </a>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Link nicht verfügbar
            </p>
          )}
          {courseMaterialPath && (
            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={async () => {
                const url = await getMaterialUrl(courseMaterialPath);
                if (url) window.open(url, "_blank");
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Material herunterladen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
