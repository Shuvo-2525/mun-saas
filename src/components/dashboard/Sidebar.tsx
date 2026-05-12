"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, MessageSquare, Settings, LogOut, FileText, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Conferences", href: "/dashboard/conferences", icon: Users },
  { name: "My Articles", href: "/dashboard/articles", icon: FileText },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Achievements", href: "/dashboard/achievements", icon: Award },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, profile } = useAuth();
  const isOrganizerOrAdmin = profile?.role === "organizer" || profile?.role === "admin";

  return (
    <div className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 bg-background/60 backdrop-blur-xl border-r border-border/40">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20">
          M
        </div>
        <span className="font-bold text-xl tracking-tight">MUN Platform</span>
      </div>

      <div className="flex-1 px-4 space-y-2 overflow-y-auto mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="relative block">
              <motion.div
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors relative z-10",
                  isActive
                    ? "text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="active-sidebar-item"
                  className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/25 z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}

        {isOrganizerOrAdmin && (
          <div className="mt-8">
            <h4 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Organizer Tools
            </h4>
            <Link href="/dashboard/organizer/events" className="relative block">
              <motion.div
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors relative z-10",
                  pathname.includes("/dashboard/organizer/events")
                    ? "text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Manage Events</span>
              </motion.div>
              {pathname.includes("/dashboard/organizer/events") && (
                <motion.div
                  layoutId="active-sidebar-item"
                  className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/25 z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          </div>
        )}

        {(profile?.role === "admin" || profile?.isAdmin) && (
          <div className="mt-4">
            <h4 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Admin Tools
            </h4>
            <Link href="/dashboard/admin" className="relative block">
              <motion.div
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors relative z-10",
                  pathname.includes("/dashboard/admin")
                    ? "text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Admin Dashboard</span>
              </motion.div>
              {pathname.includes("/dashboard/admin") && (
                <motion.div
                  layoutId="active-sidebar-item"
                  className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/25 z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          </div>
        )}
      </div>

      <div className="p-4 mt-auto border-t border-border/40">
        <button
          onClick={logout}
          className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
