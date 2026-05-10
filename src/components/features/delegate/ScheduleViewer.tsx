"use client";

import { motion } from "framer-motion";
import { EventData } from "@/lib/services/eventService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Coffee, Users, Mic2, PartyPopper } from "lucide-react";

interface ScheduleViewerProps {
  event: EventData;
}

// Mock schedule data for the UI
const MOCK_SCHEDULE = [
  { time: "08:00 AM", title: "Registration & Breakfast", type: "break", location: "Main Hall", icon: Coffee },
  { time: "09:30 AM", title: "Opening Ceremony", type: "main", location: "Auditorium", icon: Mic2 },
  { time: "11:00 AM", title: "Committee Session I", type: "session", location: "Committee Rooms", icon: Users },
  { time: "01:00 PM", title: "Lunch Break", type: "break", location: "Dining Area", icon: Coffee },
  { time: "02:00 PM", title: "Committee Session II", type: "session", location: "Committee Rooms", icon: Users },
  { time: "05:30 PM", title: "Networking & Socials", type: "social", location: "Lounge", icon: PartyPopper },
];

export function ScheduleViewer({ event }: ScheduleViewerProps) {
  return (
    <Card className="glass-card shadow-2xl border-primary/10">
      <CardHeader className="bg-secondary/10 border-b border-border/50 pb-6">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Clock className="w-6 h-6 text-primary" />
          Conference Schedule
        </CardTitle>
        <CardDescription className="text-base">
          Real-time timeline and locations for {event.title}.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-8">
        <div className="relative border-l-2 border-primary/20 ml-4 md:ml-8 space-y-8 pb-4">
          {MOCK_SCHEDULE.map((item, index) => {
            const Icon = item.icon;
            
            let colorClass = "bg-primary text-primary-foreground";
            if (item.type === "break") colorClass = "bg-orange-500 text-white";
            if (item.type === "session") colorClass = "bg-blue-500 text-white";
            if (item.type === "social") colorClass = "bg-purple-500 text-white";

            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative pl-8 md:pl-12"
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full flex items-center justify-center border-4 border-background ${colorClass} shadow-lg shadow-primary/20`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                
                <div className="bg-secondary/5 border border-border/50 rounded-2xl p-5 hover:bg-secondary/10 transition-colors hover:border-primary/30 group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{item.title}</h4>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5" /> {item.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
