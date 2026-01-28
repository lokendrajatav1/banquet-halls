"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "@/components/admin/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BarChart3, FileText, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalBookings: number;
  pendingApprovals: number;
  approvedBookings: number;
  rejectedBookings: number;
}

interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingApprovals: 0,
    approvedBookings: 0,
    rejectedBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get session from cookie
        const response = await fetch("/api/auth/status");
        if (!response.ok) {
          router.push("/auth/login");
          return;
        }

        // For now, we'll set a placeholder user
        // In production, you'd fetch actual user data
        setUser({
          id: "1",
          email: "admin@example.com",
          role: "ADMIN1",
          firstName: "Admin",
        });

        // Fetch dashboard stats
        const statsResponse = await fetch("/api/admin/stats");
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminNavbar user={user || undefined} />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage bookings and approvals</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Total Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalBookings}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  Pending Approvals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingApprovals}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{stats.approvedBookings}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Rejected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">{stats.rejectedBookings}</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>My Pending Bookings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Review and process pending booking requests
                </p>
                <Link href="/admin/bookings">
                  <Button className="w-full">View Bookings</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Workflow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Understand the multi-level approval process
                </p>
                <div className="text-xs space-y-2 text-muted-foreground">
                  <p>• <span className="font-semibold">Admin1:</span> Document verification</p>
                  <p>• <span className="font-semibold">Admin2:</span> Availability & payment</p>
                  <p>• <span className="font-semibold">Admin3:</span> Final approval</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hall Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Manage available banquet halls
                </p>
                <Button className="w-full bg-transparent" variant="outline">Coming Soon</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
