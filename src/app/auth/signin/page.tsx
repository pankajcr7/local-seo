import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth/SignInForm";
import { authOptions } from "@/lib/auth";

type SignInPageProps = {
  searchParams?: {
    callbackUrl?: string;
  };
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-12">
      <div className="w-full max-w-md">
        <SignInForm
          callbackUrl={searchParams?.callbackUrl ?? "/dashboard"}
          googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)}
        />
      </div>
    </div>
  );
}
