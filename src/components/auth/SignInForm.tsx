"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, LockKeyhole, Mail, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SignInFormProps = {
  callbackUrl?: string;
  googleEnabled: boolean;
};

export function SignInForm({ callbackUrl = "/dashboard", googleEnabled }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("demo@localseo.com");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Unable to sign in. Use any email with password demo123.");
      return;
    }

    router.push(result?.url ?? callbackUrl);
    router.refresh();
  }

  async function handleGoogleSignIn() {
    if (!googleEnabled) {
      return;
    }

    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
  }

  return (
    <Card className="border-slate-200 shadow-2xl shadow-slate-200/60">
      <CardHeader className="space-y-6 pb-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
          <Store className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl text-slate-950">Sign in to Local SEO HQ</CardTitle>
          <CardDescription className="text-base text-slate-500">
            Manage rankings, reviews, citations, and Google Business Profile performance from one place.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="pl-9" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sign In
          </Button>
        </form>

        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Demo credentials: any email + <span className="font-semibold">demo123</span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-center gap-2 border-slate-200"
          disabled={!googleEnabled || googleLoading}
          onClick={handleGoogleSignIn}
        >
          {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
          {googleEnabled ? "Continue with Google" : "Google OAuth unavailable"}
        </Button>
      </CardContent>
    </Card>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.2c1.9-1.7 3.1-4.3 3.1-7.5Z"/>
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.6c-.9.6-2 .9-3.5.9-2.7 0-5-1.8-5.8-4.2H3v2.7A10 10 0 0 0 12 22Z"/>
      <path fill="#FBBC05" d="M6.2 13.7A6 6 0 0 1 5.9 12c0-.6.1-1.2.3-1.7V7.6H3A10 10 0 0 0 2 12c0 1.6.4 3.1 1 4.4l3.2-2.7Z"/>
      <path fill="#EA4335" d="M12 6.1c1.5 0 2.9.5 3.9 1.5l2.9-2.9A10 10 0 0 0 3 7.6l3.2 2.7C7 8 9.3 6.1 12 6.1Z"/>
    </svg>
  );
}
