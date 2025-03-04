"use client";

import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import { useState } from "react";
import { Pencil } from "lucide-react";
import EditProfileDialog from "./EditProfileDialog";

interface EditProfileButtonProps {
  user: UserData;
}

export default function EditProfileButton({ user }: EditProfileButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        className="bg-secondary text-secondary-foreground hover:bg-muted-foreground/30"
      >
        <Pencil /> Edit Profile
      </Button>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}
