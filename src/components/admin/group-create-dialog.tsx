"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface GroupCreateDialogProps {
  onCreate: (name: string) => Promise<{ error?: string }>;
}

export function GroupCreateDialog({ onCreate }: GroupCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) {
      setError("Name darf nicht leer sein.");
      return;
    }

    setLoading(true);
    setError(null);
    const result = await onCreate(name.trim());
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setName("");
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Neue Gruppe
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neue Gruppe erstellen</DialogTitle>
          <DialogDescription>
            Gib einen Namen für die neue Gruppe ein.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="group-name">Gruppenname</Label>
          <Input
            id="group-name"
            placeholder="z.B. Gruppe A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setName("");
              setError(null);
            }}
            disabled={loading}
          >
            Abbrechen
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Wird erstellt..." : "Erstellen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
