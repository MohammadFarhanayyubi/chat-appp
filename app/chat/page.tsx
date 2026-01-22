"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useChat } from "@/context/chat-context";
import { ContactsList } from "@/components/chat/contacts-list";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MessageInput } from "@/components/chat/message-input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { selectedUser } = useChat();
  const router = useRouter();
  const [showContacts, setShowContacts] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    // On mobile, hide contacts when a user is selected
    if (selectedUser) {
      setShowContacts(false);
    }
  }, [selectedUser]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Contacts sidebar */}
      <aside
        className={cn(
          "h-full w-full shrink-0 border-r border-border md:w-80",
          showContacts ? "block" : "hidden md:block"
        )}
      >
        <ContactsList />
      </aside>

      {/* Chat area */}
      <main
        className={cn(
          "flex h-full flex-1 flex-col",
          !showContacts || selectedUser ? "flex" : "hidden md:flex"
        )}
      >
        <ChatHeader
          showBackButton={!showContacts || !!selectedUser}
          onBack={() => setShowContacts(true)}
        />
        <ChatMessages />
        <MessageInput />
      </main>
    </div>
  );
}
