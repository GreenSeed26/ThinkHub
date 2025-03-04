import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import LoginForm from "./SignIn";

export const metadata: Metadata = {
  title: "Sign Up",
};

function LoginPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-96 overflow-hidden rounded-xl bg-card shadow-2xl">
        <div className="space-y-10 overflow-y-auto p-10">
          <div className="space-y-1 text-center">
            <h1 className="text-center text-3xl">Welcome to ThinkHub</h1>
          </div>

          <LoginForm />
          <div className="text-sm">
            Don&apos;t have an account?{" "}
            <Link className="text-zinc-500 underline" href={"/signUp"}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
