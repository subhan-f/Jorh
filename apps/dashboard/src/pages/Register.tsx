import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUpWithEmail, signInWithGoogle, updateUserProfile } from "@jorh/firebase/auth";
import { Button, Input } from "@jorh/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterInput = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(RegisterSchema) });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const { user } = await signUpWithEmail(data.email, data.password);
      await updateUserProfile(user, { displayName: data.name });
      navigate("/");
    } catch {
      toast.error("Failed to create account. Email may already be in use.");
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch {
      toast.error("Google sign-up failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
            Jorh
          </span>
          <h1 className="mt-2 text-xl font-semibold">Create your free account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <Button type="button" variant="outline" className="mb-4 w-full" loading={googleLoading} onClick={handleGoogle}>
            Continue with Google
          </Button>

          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Input placeholder="Full name" error={errors.name?.message} {...register("name")} />
            <Input type="email" placeholder="Email address" error={errors.email?.message} {...register("email")} />
            <Input type="password" placeholder="Password (8+ characters)" error={errors.password?.message} {...register("password")} />
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Create account
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By signing up you agree to our{" "}
          <a href="https://jorh.net/terms" className="underline underline-offset-4">Terms</a>{" "}
          and{" "}
          <a href="https://jorh.net/privacy" className="underline underline-offset-4">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
