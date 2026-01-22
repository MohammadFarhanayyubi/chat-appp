import React from "react"
import { ChatProvider } from "@/context/chat-context";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatProvider>{children}</ChatProvider>;
}
