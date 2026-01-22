"use client";

import { useChat } from "@/context/chat-context";
import { useAuth } from "@/context/auth-context";
import { UserAvatar } from "./user-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, MoreVertical, User, LogOut, Settings } from "lucide-react";
import Link from "next/link";

interface ChatHeaderProps {
  onBack?: () => void;
  showBackButton?: boolean;
}

export function ChatHeader({ onBack, showBackButton }: ChatHeaderProps) {
  const { selectedUser, onlineUsers, setSelectedUser } = useChat();
  const { user, logout } = useAuth();

  const isUserOnline = selectedUser
    ? onlineUsers.some((u) => u.userId === selectedUser.userId)
    : false;

  if (!selectedUser) {
    return (
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h2 className="font-semibold text-foreground">Messages</h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <UserAvatar
                name={`${user?.firstName} ${user?.lastName}`}
                avatarLink={user?.avatarLink}
                size="sm"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    );
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedUser(null);
              onBack?.();
            }}
            className="md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <UserAvatar
          name={selectedUser.username}
          avatarLink={selectedUser.avatarLink}
          isOnline={isUserOnline}
          size="md"
        />
        <div>
          <h2 className="font-semibold text-foreground">{selectedUser.username}</h2>
          <p className="text-xs text-muted-foreground">
            {isUserOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSelectedUser(null)}>
            Close conversation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
