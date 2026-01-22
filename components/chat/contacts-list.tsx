"use client";

import { useEffect, useState } from "react";
import { useChat } from "@/context/chat-context";
import { useAuth } from "@/context/auth-context";
import { UserAvatar } from "./user-avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, MessageCircle, Users } from "lucide-react";

export function ContactsList() {
  const { onlineUsers, allUsers, selectedUser, setSelectedUser, fetchAllUsers } = useChat();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"online" | "all">("online");

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const filteredUsers =
    activeTab === "online"
      ? onlineUsers.filter(
          (u) =>
            u.userId !== user?._id &&
            u.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : allUsers.filter(
          (u) =>
            u.userId !== user?._id &&
            u.username.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const isUserOnline = (userId: string) =>
    onlineUsers.some((u) => u.userId === userId);

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="border-b border-sidebar-border p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <MessageCircle className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-foreground">SwiftChat</h1>
            <p className="text-xs text-sidebar-foreground/60">
              {onlineUsers.length - 1} online
            </p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-foreground/40" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 border-sidebar-border bg-sidebar-accent pl-9 text-sidebar-foreground placeholder:text-sidebar-foreground/40"
          />
        </div>
      </div>

      <div className="flex gap-1 border-b border-sidebar-border p-2">
        <Button
          variant={activeTab === "online" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("online")}
          className={cn(
            "flex-1 gap-1.5",
            activeTab === "online"
              ? "bg-sidebar-accent text-sidebar-foreground"
              : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          )}
        >
          <span className="h-2 w-2 rounded-full bg-online" />
          Online
        </Button>
        <Button
          variant={activeTab === "all" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("all")}
          className={cn(
            "flex-1 gap-1.5",
            activeTab === "all"
              ? "bg-sidebar-accent text-sidebar-foreground"
              : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          )}
        >
          <Users className="h-3.5 w-3.5" />
          All
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-2 rounded-full bg-sidebar-accent p-3">
                <Users className="h-5 w-5 text-sidebar-foreground/40" />
              </div>
              <p className="text-sm text-sidebar-foreground/60">
                {searchQuery
                  ? "No users found"
                  : activeTab === "online"
                    ? "No one else is online"
                    : "No users available"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredUsers.map((contact) => (
                <button
                  key={contact.userId}
                  onClick={() => setSelectedUser(contact)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors",
                    selectedUser?.userId === contact.userId
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <UserAvatar
                    name={contact.username}
                    avatarLink={contact.avatarLink}
                    isOnline={isUserOnline(contact.userId)}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{contact.username}</p>
                    <p
                      className={cn(
                        "text-xs",
                        selectedUser?.userId === contact.userId
                          ? "text-sidebar-primary-foreground/70"
                          : "text-sidebar-foreground/60"
                      )}
                    >
                      {isUserOnline(contact.userId) ? "Online" : "Offline"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
