import { requireAuth } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import Image from "next/image";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="min-h-svh flex flex-col">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="flex h-14 items-center justify-between px-4 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Law Loops" width={32} height={32} />
            <h1 className="font-semibold text-lg">Mein Stundenplan</h1>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
