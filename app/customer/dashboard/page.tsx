import { CustomerNavbar } from "@/components/customer/navbar";
import { Card } from "@/components/ui/card";

export default function CustomerDashboardPage() {
  return (
    <>
      <CustomerNavbar />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
              <p className="text-sm text-muted-foreground mt-2">You have no upcoming bookings.</p>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold">Saved Halls</h2>
              <p className="text-sm text-muted-foreground mt-2">You haven't saved any halls yet.</p>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold">Account</h2>
              <p className="text-sm text-muted-foreground mt-2">Manage your profile and settings.</p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
