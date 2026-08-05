import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login | Raden Fadhil",
  description: "Secure login portal for Raden Fadhil precision portfolio management.",
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center px-4 py-12 bg-background">
      <LoginForm />
    </main>
  );
}
