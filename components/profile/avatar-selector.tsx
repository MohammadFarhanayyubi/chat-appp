"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatarLink: string) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Default avatars if API fails
const DEFAULT_AVATARS = [
  "https://i.imgur.com/qGsYvAK.png",
  "https://i.imgur.com/2yxwOt6.png",
  "https://i.imgur.com/fzB1ZPT.png",
  "https://i.imgur.com/IZYdi6A.png",
  "https://i.imgur.com/EBX70zu.png",
  "https://i.imgur.com/rUwDBuq.png",
];

export function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
  const [avatars, setAvatars] = useState<string[]>(DEFAULT_AVATARS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/avatar/all`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setAvatars(data.map((a: { link: string }) => a.link));
          }
        }
      } catch (error) {
        console.error("Error fetching avatars:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvatars();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {avatars.map((avatarLink, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(avatarLink)}
          className={cn(
            "relative rounded-lg p-1 transition-all",
            selectedAvatar === avatarLink
              ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
              : "hover:bg-muted"
          )}
        >
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarLink || "/placeholder.svg"} alt={`Avatar option ${index + 1}`} />
            <AvatarFallback>A{index + 1}</AvatarFallback>
          </Avatar>
          {selectedAvatar === avatarLink && (
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
