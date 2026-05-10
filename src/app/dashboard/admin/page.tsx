"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  ShieldAlert, 
  TrendingUp, 
  MoreVertical,
  Search,
  Settings,
  Activity,
  Globe2
} from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppAdminDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    applications: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGlobalStats() {
      // For a real production app, these should be cached or pre-aggregated
      // but for this MVP we'll fetch collections
      try {
        const [usersSnap, eventsSnap, appsSnap] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "events")),
          getDocs(collection(db, "applications"))
        ]);

        setStats({
          users: usersSnap.size,
          events: eventsSnap.size,
          applications: appsSnap.size,
          revenue: appsSnap.docs.filter(d => d.data().status === "approved").length * 50
        });
      } catch (error) {
        console.error("Error fetching global stats:", error);
      } finally {
        setLoading(false);
      }
    }

    if (profile?.role === "App Admin" || profile?.isAdmin) {
      fetchGlobalStats();
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <Skeleton className="h-[500px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10">System Administrator</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Global Oversight</h1>
          <p className="text-muted-foreground mt-1">
            Monitor platform activity, manage global settings, and oversee all conferences.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" /> System Settings
          </Button>
          <Button className="gap-2">
            <ShieldAlert className="w-4 h-4" /> Audit Logs
          </Button>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Users</p>
                <p className="text-3xl font-bold mt-1">{stats.users}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Live Events</p>
                <p className="text-3xl font-bold mt-1">{stats.events}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Applications</p>
                <p className="text-3xl font-bold mt-1">{stats.applications}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center">
                <Globe2 className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Global Revenue</p>
                <p className="text-3xl font-bold mt-1">${stats.revenue}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="glass-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Recent Activity Feed</CardTitle>
              <CardDescription>Real-time updates from across the platform.</CardDescription>
            </div>
            <Activity className="w-5 h-5 text-muted-foreground animate-pulse" />
          </CardHeader>
          <CardContent>
             <div className="space-y-6 mt-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-secondary/5 border border-border/40">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New delegate application for <span className="text-primary">Global MUN 2026</span></p>
                      <p className="text-xs text-muted-foreground mt-1">2 minutes ago • User ID: ...4321</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="p-3 rounded-xl bg-secondary/30 flex items-center justify-between">
                  <span className="text-sm font-medium">Flagged Comments</span>
                  <Badge variant="destructive">0</Badge>
               </div>
               <div className="p-3 rounded-xl bg-secondary/30 flex items-center justify-between">
                  <span className="text-sm font-medium">Pending Approvals</span>
                  <Badge variant="outline">12</Badge>
               </div>
               <div className="p-3 rounded-xl bg-secondary/30 flex items-center justify-between">
                  <span className="text-sm font-medium">System Health</span>
                  <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/10">Optimal</Badge>
               </div>
            </CardContent>
          </Card>

          <Card className="glass-card bg-primary text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
            <CardHeader>
              <CardTitle>Admin Support</CardTitle>
              <CardDescription className="text-primary-foreground/70">Contact the development team for technical issues.</CardDescription>
            </CardHeader>
            <CardContent>
               <Button variant="secondary" className="w-full">Open Support Ticket</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
