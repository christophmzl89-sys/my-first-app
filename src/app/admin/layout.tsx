import { requireAdmin } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import Image from "next/image";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-svh flex flex-col">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="flex h-14 items-center justify-between px-4 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Law Loops" width={32} height={32} />
            <h1 className="font-semibold text-lg">Admin-Dashboard</h1>
          </div>
          <LogoutButton />
        </div>
        <nav className="px-4 max-w-6xl mx-auto w-full">
          <div className="flex gap-6 -mb-px">
            <AdminNavLink href="/admin">Gruppen</AdminNavLink>
            <AdminNavLink href="/admin/schedule">Stundenplan</AdminNavLink>
          </div>
        </nav>
      </header>
      <main className="flex-1 px-4 py-6 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

function AdminNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-primary transition-colors"
    >
      {children}
    </Link>
  );
}
