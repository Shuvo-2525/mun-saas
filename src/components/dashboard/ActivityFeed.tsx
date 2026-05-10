"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

// Dummy data for the feed
const ACTIVITIES = [
  {
    id: "1",
    user: { name: "Sarah Jenkins", role: "Chair", avatar: "" },
    action: "published a new study guide for",
    target: "UNSC Committee",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    type: "document",
  },
  {
    id: "2",
    user: { name: "Harvard MUN", role: "Organizer", avatar: "" },
    action: "opened early bird registrations for",
    target: "HMUN 2026",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    type: "event",
  },
  {
    id: "3",
    user: { name: "David Chen", role: "Delegate", avatar: "" },
    action: "was awarded Best Delegate at",
    target: "Oxford MUN",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    type: "award",
  },
];

export function ActivityFeed() {
  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      {ACTIVITIES.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex gap-x-4"
        >
          <div className="relative flex flex-col items-center">
            {index !== ACTIVITIES.length - 1 && (
              <div className="absolute top-10 bottom-[-1.5rem] w-px bg-border/50" />
            )}
            <Avatar className="h-10 w-10 ring-2 ring-background z-10 shadow-sm shadow-black/20">
              <AvatarImage src={activity.user.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary font-medium">
                {getInitials(activity.user.name)}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="glass-card flex-1 rounded-2xl p-4 sm:p-5 mb-2 hover:border-primary/20 transition-colors">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
              <div>
                <span className="font-semibold text-foreground mr-1">{activity.user.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/50 text-secondary-foreground border border-border/50 mr-2">
                  {activity.user.role}
                </span>
                <span className="text-muted-foreground mr-1">{activity.action}</span>
                <span className="font-medium text-foreground">{activity.target}</span>
              </div>
              <time className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </time>
            </div>
          </div>
        </motion.div>
      ))}
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-4"
      >
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View older activity
        </button>
      </motion.div>
    </div>
  );
}
