import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login - Banquet Hall Booking",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Banquet Halls</h1>
          <p className="text-muted-foreground mt-2">Book your perfect venue</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
