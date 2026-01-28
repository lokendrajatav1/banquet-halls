import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, MapPin, Calendar, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Banquet Halls</h1>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Your Perfect Venue Awaits</span>
          </div>

          <h2 className="text-5xl font-bold leading-tight">
            Book Premium Banquet Halls
            <br />
            <span className="text-primary">For Your Special Moments</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover and book the perfect banquet hall for weddings, corporate events, birthdays, and more. 
            Our platform makes it easy to find, compare, and reserve your ideal venue.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Link href="/customer/halls">
              <Button size="lg" className="gap-2">
                <span>Browse Halls</span>
                <MapPin className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t">
        <h3 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-xl font-semibold">Wide Selection</h4>
            <p className="text-muted-foreground">
              Choose from hundreds of premium banquet halls across multiple cities with various capacities
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-xl font-semibold">Easy Booking</h4>
            <p className="text-muted-foreground">
              Simple and intuitive booking process with real-time availability and instant confirmation
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-xl font-semibold">Expert Support</h4>
            <p className="text-muted-foreground">
              Our dedicated team is here to help you find the perfect venue and answer any questions
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-primary text-primary-foreground rounded-lg p-12 text-center space-y-6">
          <h3 className="text-3xl font-bold">Ready to Book Your Venue?</h3>
          <p className="text-lg opacity-90">
            Start exploring our collection of premium banquet halls today
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
