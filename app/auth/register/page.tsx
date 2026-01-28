import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Register - Banquet Hall Booking",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Banquet Halls</h1>
          <p className="text-muted-foreground mt-2">Book your perfect venue</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
