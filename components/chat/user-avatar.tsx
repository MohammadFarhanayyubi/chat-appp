"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  avatarLink?: string;
  isOnline?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({
  name,
  avatarLink,
  isOnline,
  size = "md",
  className,
}: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  const indicatorSizes = {
    sm: "h-2 w-2 right-0 bottom-0",
    md: "h-2.5 w-2.5 right-0 bottom-0",
    lg: "h-3 w-3 right-0.5 bottom-0.5",
  };

  return (
    <div className={cn("relative", className)}>
      <Avatar className={cn(sizeClasses[size], "border-2 border-background")}>
        <AvatarImage src={avatarLink || "/placeholder.svg"} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      {isOnline !== undefined && (
        <span
          className={cn(
            "absolute rounded-full border-2 border-background",
            indicatorSizes[size],
            isOnline ? "bg-online" : "bg-muted-foreground"
          )}
        />
      )}
    </div>
  );
}
