import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

/**
 * Server Component logout button.
 *
 * Uses a `<form action={serverAction}>` pattern for zero-JS fallback —
 * the form submits natively even if JavaScript hasn't loaded yet.
 * No `"use client"` directive needed.
 */
export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className="gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </Button>
    </form>
  );
}
