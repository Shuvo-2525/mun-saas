"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
  type: "direct" | "group";
}

// Dummy data
const CONVERSATIONS: Conversation[] = [
  { id: "1", name: "UNSC Committee Group", avatar: "", lastMessage: "Chair: Please submit your papers by 5PM.", time: "10:30 AM", unread: 3, isOnline: false, type: "group" },
  { id: "2", name: "Sarah Jenkins", avatar: "", lastMessage: "Are we still meeting before the session?", time: "Yesterday", unread: 0, isOnline: true, type: "direct" },
  { id: "3", name: "Harvard MUN Announcements", avatar: "", lastMessage: "Welcome to HMUN 2026! Registration is...", time: "Mon", unread: 12, isOnline: false, type: "group" },
  { id: "4", name: "David Chen", avatar: "", lastMessage: "Thanks for the motion.", time: "Oct 12", unread: 0, isOnline: false, type: "direct" },
];

interface ChatSidebarProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ChatSidebar({ selectedId, onSelect }: ChatSidebarProps) {
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full w-full max-w-sm border-r border-border/40 bg-background/40 backdrop-blur-md">
      <div className="p-4 border-b border-border/40">
        <h2 className="text-xl font-bold tracking-tight mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search conversations..." 
            className="pl-9 bg-white/5 border-white/10 focus-visible:ring-primary/20"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {CONVERSATIONS.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={cn(
              "w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-secondary/50 border-b border-border/20",
              selectedId === chat.id ? "bg-secondary/50 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
            )}
          >
            <div className="relative">
              <Avatar className="w-12 h-12 border border-border/50">
                <AvatarImage src={chat.avatar} />
                <AvatarFallback className={chat.type === 'group' ? 'bg-indigo-500/20 text-indigo-500' : 'bg-primary/20 text-primary'}>
                  {getInitials(chat.name)}
                </AvatarFallback>
              </Avatar>
              {chat.isOnline && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full"></span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold text-sm text-foreground truncate pr-2">{chat.name}</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground truncate pr-2">{chat.lastMessage}</p>
                {chat.unread > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
