"use client";

import React from "react"

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/context/chat-context";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function MessageInput() {
  const [message, setMessage] = useState("");
  const { sendMessage, selectedUser, isConnected } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser || !isConnected) return;

    sendMessage(message.trim());
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!selectedUser) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-card p-4">
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isConnected
                ? `Message ${selectedUser.username}...`
                : "Connecting..."
            }
            disabled={!isConnected}
            rows={1}
            className="max-h-[120px] min-h-[44px] w-full resize-none rounded-xl border border-input bg-background px-4 py-3 pr-12 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || !isConnected}
          className="h-11 w-11 shrink-0 rounded-xl"
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
      {!isConnected && (
        <p className="mt-2 text-xs text-muted-foreground">
          Reconnecting to server...
        </p>
      )}
    </form>
  );
}
