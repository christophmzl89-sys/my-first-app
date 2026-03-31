"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssignUserDialog } from "./assign-user-dialog";
import { UserMinus } from "lucide-react";

interface Member {
  id: string;
  display_name: string | null;
  email: string | null;
}

interface AvailableUser {
  id: string;
  display_name: string | null;
  email: string | null;
  group_id: string | null;
  group_name: string | null;
}

interface MemberListProps {
  groupId: string;
  groupName: string;
  initialMembers: Member[];
  availableUsers: AvailableUser[];
}

export function MemberList({
  groupId,
  groupName,
  initialMembers,
  availableUsers,
}: MemberListProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [available, setAvailable] = useState<AvailableUser[]>(availableUsers);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const router = useRouter();

  async function handleAssign(userId: string): Promise<{ error?: string }> {
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ group_id: groupId })
      .eq("id", userId);

    if (error) {
      return { error: "Fehler beim Zuweisen." };
    }

    const assignedUser = available.find((u) => u.id === userId);
    if (assignedUser) {
      setMembers((prev) => [
        ...prev,
        {
          id: assignedUser.id,
          display_name: assignedUser.display_name,
          email: assignedUser.email,
        },
      ]);
      setAvailable((prev) => prev.filter((u) => u.id !== userId));
    }

    router.refresh();
    return {};
  }

  async function handleRemove(userId: string) {
    setRemovingId(userId);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ group_id: null })
      .eq("id", userId);

    setRemovingId(null);

    if (!error) {
      const removedMember = members.find((m) => m.id === userId);
      setMembers((prev) => prev.filter((m) => m.id !== userId));
      if (removedMember) {
        setAvailable((prev) => [
          ...prev,
          {
            id: removedMember.id,
            display_name: removedMember.display_name,
            email: removedMember.email,
            group_id: null,
            group_name: null,
          },
        ]);
      }
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{groupName}</h2>
          <p className="text-sm text-muted-foreground">
            {members.length}{" "}
            {members.length === 1 ? "Mitglied" : "Mitglieder"}
          </p>
        </div>
        <AssignUserDialog
          availableUsers={available}
          onAssign={handleAssign}
        />
      </div>

      {members.length === 0 ? (
        <div className="text-center py-12 border rounded-lg border-dashed">
          <p className="text-muted-foreground">
            Keine Mitglieder in dieser Gruppe.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Weise Nutzer über den Button oben zu.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.display_name || "Kein Name"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.email}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRemove(member.id)}
                      disabled={removingId === member.id}
                      aria-label="Aus Gruppe entfernen"
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
