"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HTMLAttributes } from "react";

interface LinkButtonProps extends HTMLAttributes<HTMLButtonElement> {
  href: string;
  children?: React.ReactNode;
}
export default function LinkButton({
  href,
  children,
  className,
  ...props
}: LinkButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currHref = `/user/${href.trim()}`;

  return (
    <button
      className={cn(
        className,
        "border-b-2 transition-colors",
        pathname === currHref
          ? "border-primary text-primary"
          : "border-card hover:bg-muted-foreground/30",
      )}
      {...props}
      onClick={() => router.push(href)}
    >
      <Link className="w-max" href={href}>
        {children}
      </Link>
    </button>
  );
}
