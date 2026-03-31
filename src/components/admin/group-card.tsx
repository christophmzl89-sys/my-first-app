"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Pencil, Check, X } from "lucide-react";

interface GroupCardProps {
  id: string;
  name: string;
  memberCount: number;
  onRename: (id: string, newName: string) => Promise<{ error?: string }>;
}

export function GroupCard({ id, name, memberCount, onRename }: GroupCardProps) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRename() {
    if (editName.trim() === name) {
      setEditing(false);
      return;
    }
    if (!editName.trim()) {
      setError("Name darf nicht leer sein.");
      return;
    }

    setLoading(true);
    setError(null);
    const result = await onRename(id, editName.trim());
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setEditing(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        {editing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-8"
              autoFocus
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") {
                  setEditing(false);
                  setEditName(name);
                  setError(null);
                }
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleRename}
              disabled={loading}
              aria-label="Speichern"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => {
                setEditing(false);
                setEditName(name);
                setError(null);
              }}
              disabled={loading}
              aria-label="Abbrechen"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{name}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setEditing(true)}
              aria-label="Umbenennen"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Users className="h-4 w-4" />
            <span>
              {memberCount} {memberCount === 1 ? "Mitglied" : "Mitglieder"}
            </span>
          </div>
          <Link href={`/admin/groups/${id}`}>
            <Button variant="outline" size="sm">
              Mitglieder anzeigen
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
