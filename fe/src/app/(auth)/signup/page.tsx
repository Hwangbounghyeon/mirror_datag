import Link from "next/link";
import SignForm from "@/components/auth/signupForm";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">SignUp</h2>
          <p className="mt-2 text-center text-sm 0">
            Already have an account?{" "}
            <Link
              className="font-bold hover:text-red-400 transition-colors"
              href="/login"
            >
              Login
            </Link>
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <SignForm />
        </Suspense>
      </div>
    </div>
  );
}
