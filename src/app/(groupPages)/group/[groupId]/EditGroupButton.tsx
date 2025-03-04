"use client";

import { Button } from "@/components/ui/button";
import { GroupData } from "@/lib/types";
import { useState } from "react";
import { Pencil } from "lucide-react";
import EditGroupProfileDialog from "./EditGroupProfileDialog";

interface EditGroupButtonProps {
  group: GroupData;
}

export default function EditGroupButton({ group }: EditGroupButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        className="bg-secondary text-secondary-foreground hover:bg-muted-foreground/30"
      >
        <Pencil /> Edit Group
      </Button>
      <EditGroupProfileDialog
        group={group}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}
