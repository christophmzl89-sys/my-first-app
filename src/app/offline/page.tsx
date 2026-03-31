import { WifiOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function OfflinePage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Card className="max-w-sm w-full">
        <CardContent className="pt-6 text-center space-y-4">
          <WifiOff className="h-12 w-12 text-muted-foreground mx-auto" />
          <h1 className="text-xl font-semibold">Du bist offline</h1>
          <p className="text-muted-foreground">
            Bitte stelle eine Internetverbindung her, um deinen Stundenplan zu
            sehen.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
