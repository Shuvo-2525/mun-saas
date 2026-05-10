"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical, Phone, Video, Send, Paperclip, Smile } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface ChatWindowProps {
  conversationId: string | null;
}

// Dummy messages
const MESSAGES: Message[] = [
  { id: "1", senderId: "other", text: "Hello! Have you reviewed the position paper guidelines?", timestamp: "10:30 AM" },
  { id: "2", senderId: "me", text: "Hi! Yes, I just read through them. I'll start drafting mine tonight.", timestamp: "10:35 AM" },
  { id: "3", senderId: "other", text: "Great. Let me know if you want to collaborate on the operative clauses.", timestamp: "10:36 AM" },
  { id: "4", senderId: "me", text: "Will do. Thanks for offering!", timestamp: "10:40 AM" },
];

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const { user } = useAuth();
  // In a real app, user.uid would be 'me'

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background/20 backdrop-blur-sm">
        <div className="text-center text-muted-foreground">
          <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <p className="text-lg font-medium">Select a conversation</p>
          <p className="text-sm">Choose a chat from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-background/20 backdrop-blur-sm relative">
      {/* Chat Header */}
      <div className="h-16 border-b border-border/40 px-6 flex items-center justify-between bg-background/40 backdrop-blur-xl shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-border/50">
            <AvatarFallback className="bg-primary/20 text-primary">SJ</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-foreground">Sarah Jenkins</h2>
            <p className="text-xs text-green-500 font-medium">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:flex">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:flex">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="text-center">
          <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-border/50">
            Today
          </span>
        </div>
        
        {MESSAGES.map((msg, index) => {
          const isMe = msg.senderId === "me";
          return (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[75%] ${isMe ? "flex-row-reverse" : "flex-row"} items-end gap-2`}>
                {!isMe && (
                  <Avatar className="w-8 h-8 shrink-0 mb-1 border border-border/50">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">SJ</AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div 
                    className={`px-4 py-2.5 rounded-2xl ${
                      isMe 
                        ? "bg-primary text-primary-foreground rounded-br-sm shadow-md shadow-primary/20" 
                        : "bg-secondary text-secondary-foreground rounded-bl-sm border border-border/50"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 mx-1">{msg.timestamp}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Message Input Area */}
      <div className="p-4 border-t border-border/40 bg-background/40 backdrop-blur-xl shrink-0">
        <div className="flex items-end gap-2 bg-secondary/30 border border-border/50 rounded-2xl p-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
          <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground rounded-xl">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input 
            placeholder="Type your message..." 
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 shadow-none"
          />
          <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground rounded-xl hidden sm:flex">
            <Smile className="w-5 h-5" />
          </Button>
          <Button size="icon" className="shrink-0 rounded-xl shadow-lg shadow-primary/20">
            <Send className="w-4 h-4 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
