import avatarPlaceholder from "@/assests/group_icon.jpg";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
}

export default function GroupAvatar({
  avatarUrl,
  size,
  className,
}: UserAvatarProps) {
  return (
    <Image
      src={avatarUrl || avatarPlaceholder}
      alt="User avatar"
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square h-fit flex-none bg-secondary object-cover",
        className,
      )}
    />
  );
}
