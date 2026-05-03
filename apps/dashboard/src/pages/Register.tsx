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
      // Update Firebase Auth profile before navigating so useAuthInit picks up
      // the correct displayName when it calls /auth/verify.
      await updateUserProfile(user, { displayName: data.name });
      await user.reload();
      navigate("/");
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/email-already-in-use") {
        toast.error("An account with this email already exists");
      } else {
        toast.error(`Sign-up failed: ${code || "unknown error"}`);
      }
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result) navigate("/");
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      if (code === "auth/popup-blocked") {
        toast.error("Popup blocked — allow popups for this site and try again");
      } else if (code === "auth/unauthorized-domain") {
        toast.error("This domain is not authorized in Firebase Auth settings");
      } else if (code === "auth/operation-not-allowed") {
        toast.error("Google sign-in is not enabled — enable it in Firebase Console");
      } else if (code === "auth/invalid-credential") {
        toast.error(
          "Invalid OAuth configuration. Check Firebase Google provider and web client settings"
        );
      } else {
        toast.error(`Google sign-up failed: ${code || "unknown error"}`);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="bg-background flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
            Jorh
          </span>
          <h1 className="mt-2 text-xl font-semibold">Create your free account</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>

        <div className="border-border bg-card rounded-2xl border p-6 shadow-sm">
          <Button
            type="button"
            variant="outline"
            className="mb-4 w-full"
            loading={googleLoading}
            onClick={handleGoogle}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="mb-4 flex items-center gap-3">
            <div className="bg-border h-px flex-1" />
            <span className="text-muted-foreground text-xs">or</span>
            <div className="bg-border h-px flex-1" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Input placeholder="Full name" error={errors.name?.message} {...register("name")} />
            <Input
              type="email"
              placeholder="Email address"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              type="password"
              placeholder="Password (8+ characters)"
              error={errors.password?.message}
              {...register("password")}
            />
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Create account
            </Button>
          </form>
        </div>

        <p className="text-muted-foreground mt-4 text-center text-xs">
          By signing up you agree to our{" "}
          <a href="https://jorh.net/terms" className="underline underline-offset-4">
            Terms
          </a>{" "}
          and{" "}
          <a href="https://jorh.net/privacy" className="underline underline-offset-4">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
