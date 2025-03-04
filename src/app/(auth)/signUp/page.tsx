import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import SignUp from "./SignUp";

export const metadata: Metadata = {
  title: "Sign Up",
};

function SignUpPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-96 overflow-hidden rounded-xl bg-card shadow-2xl">
        <div className="space-y-10 overflow-y-auto p-10">
          <div className="space-y-1 text-center">
            <h1 className="text-center text-3xl">Sign up to ThinkHub</h1>
            <p>A place for sharing interest in the University</p>
          </div>
          <SignUp />
          <div className="text-sm">
            Already have an account?{" "}
            <Link className="text-zinc-500 underline" href={"/signIn"}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SignUpPage;
