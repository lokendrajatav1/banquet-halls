"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, LayoutDashboard, FileText, Users } from "lucide-react";
import { USER_ROLES } from "@/lib/constants";

interface AdminNavbarProps {
  user?: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
  };
}

export function AdminNavbar({ user }: AdminNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-2xl font-bold">
              Admin Panel
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/admin"
                className={`text-sm font-medium flex items-center gap-1 ${
                  isActive("/admin") ? "text-primary" : "hover:text-primary"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/admin/bookings"
                className={`text-sm font-medium flex items-center gap-1 ${
                  isActive("/admin/bookings") ? "text-primary" : "hover:text-primary"
                }`}
              >
                <FileText className="w-4 h-4" />
                Bookings
              </Link>
              {user?.role === USER_ROLES.SUPERADMIN && (
                <Link
                  href="/admin/users"
                  className={`text-sm font-medium flex items-center gap-1 ${
                    isActive("/admin/users") ? "text-primary" : "hover:text-primary"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Users
                </Link>
              )}
            </div>
          </div>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.firstName || user.email.split("@")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <div className="text-xs space-y-1">
                    <p>{user.email}</p>
                    <p className="text-muted-foreground">{user.role}</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
