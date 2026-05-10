"use client";

import { useState } from "react";
import { ChatSidebar } from "@/components/dashboard/ChatSidebar";
import { ChatWindow } from "@/components/dashboard/ChatWindow";
import { motion } from "framer-motion";

export default function MessagesPage() {
  const [selectedChatId, setSelectedChatId] = useState<string>("2"); // Pre-select a chat for demo

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-[calc(100vh-10rem)] w-full max-w-6xl mx-auto glass-card rounded-3xl overflow-hidden flex border border-border/50 shadow-2xl"
    >
      {/* Sidebar - Hidden on very small screens if a chat is selected, but for now we'll do a simple flex layout */}
      <div className="hidden md:block h-full shrink-0">
        <ChatSidebar selectedId={selectedChatId} onSelect={setSelectedChatId} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 h-full min-w-0">
        <ChatWindow conversationId={selectedChatId} />
      </div>
    </motion.div>
  );
}
