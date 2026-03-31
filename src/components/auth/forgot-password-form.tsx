"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) {
        setError("Fehler beim Senden des Links. Bitte versuche es erneut.");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">E-Mail gesendet</CardTitle>
          <CardDescription>
            Wir haben dir einen Link zum Zurücksetzen deines Passworts an{" "}
            <strong>{email}</strong> gesendet. Prüfe auch deinen Spam-Ordner.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zum Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Passwort vergessen?</CardTitle>
        <CardDescription>
          Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum
          Zurücksetzen.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@beispiel.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Wird gesendet..." : "Link senden"}
          </Button>
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Zurück zum Login
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
