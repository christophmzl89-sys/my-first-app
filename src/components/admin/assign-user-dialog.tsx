"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";

interface AvailableUser {
  id: string;
  display_name: string | null;
  email: string | null;
  group_id: string | null;
  group_name: string | null;
}

interface AssignUserDialogProps {
  availableUsers: AvailableUser[];
  onAssign: (userId: string) => Promise<{ error?: string }>;
}

export function AssignUserDialog({
  availableUsers,
  onAssign,
}: AssignUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  async function handleAssign(userId: string) {
    setLoadingUserId(userId);
    const result = await onAssign(userId);
    setLoadingUserId(null);

    if (!result.error) {
      setOpen(false);
    }
  }

  const unassigned = availableUsers.filter((u) => !u.group_id);
  const fromOtherGroups = availableUsers.filter((u) => u.group_id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Nutzer zuweisen
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nutzer zuweisen</DialogTitle>
          <DialogDescription>
            Wähle einen Nutzer aus, um ihn dieser Gruppe zuzuweisen.
          </DialogDescription>
        </DialogHeader>

        {availableUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Keine weiteren Nutzer verfügbar.
          </p>
        ) : (
          <div className="space-y-4">
            {unassigned.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Nicht zugewiesen
                </p>
                {unassigned.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {user.display_name || "Kein Name"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAssign(user.id)}
                      disabled={loadingUserId === user.id}
                    >
                      {loadingUserId === user.id ? "..." : "Zuweisen"}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {fromOtherGroups.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  In anderer Gruppe
                </p>
                {fromOtherGroups.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {user.display_name || "Kein Name"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Aktuell: {user.group_name}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAssign(user.id)}
                      disabled={loadingUserId === user.id}
                    >
                      {loadingUserId === user.id ? "..." : "Verschieben"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
