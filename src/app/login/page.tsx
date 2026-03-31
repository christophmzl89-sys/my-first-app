import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        <Image
          src="/logo.png"
          alt="Law Loops"
          width={160}
          height={160}
          priority
        />
        <LoginForm />
      </div>
    </main>
  );
}
