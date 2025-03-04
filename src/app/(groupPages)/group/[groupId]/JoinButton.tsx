import { Button } from "@/components/ui/button";
import React from "react";

export default function JoinButton({ isJoined }: { isJoined: boolean }) {
  return (
    <Button variant={isJoined ? "secondary" : "default"}>
      {isJoined ? "Joined" : "Join"}
    </Button>
  );
}
