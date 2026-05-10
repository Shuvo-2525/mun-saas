"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getEventById, EventData } from "@/lib/services/eventService";
import { getApplicationsByEvent, updateApplication, ApplicationData } from "@/lib/services/applicationService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Settings, 
  Globe2, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  Mail,
  Filter,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrganizerEventManagementPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { user, profile } = useAuth();
  const router = useRouter();

  const [event, setEvent] = useState<EventData | null>(null);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function loadData() {
      if (!user || !eventId) return;

      const [eventData, apps] = await Promise.all([
        getEventById(eventId),
        getApplicationsByEvent(eventId)
      ]);

      if (!eventData || eventData.organizerId !== user.uid) {
        // Not the organizer or event doesn't exist
        router.push("/dashboard/organizer/events");
        return;
      }

      setEvent(eventData);
      setApplications(apps);
      setLoading(false);
    }

    loadData();
  }, [user, eventId, router]);

  const handleStatusChange = async (appId: string, status: "approved" | "rejected" | "pending") => {
    const { success } = await updateApplication(appId, { status });
    if (success) {
      setApplications(prev => prev.map(app => 
        (app as any).id === appId ? { ...app, status } : app
      ));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  if (!event) return null;

  const stats = {
    total: applications.length,
    approved: applications.filter(a => a.status === "approved").length,
    pending: applications.filter(a => a.status === "pending").length,
    revenue: applications.filter(a => a.status === "approved").length * 50, // Placeholder price
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Organizer Portal</Badge>
            <Badge variant={event.status === "published" ? "default" : "secondary"}>
              {event.status === "published" ? "Live" : "Draft"}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{event.title}</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Clock className="w-4 h-4" /> {event.date} • {event.location}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" /> Edit Event
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Mail className="w-4 h-4" /> Broadcast Email
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applicants</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-3xl font-bold mt-1 text-green-500">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold mt-1 text-yellow-500">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Est. Revenue</p>
                <p className="text-3xl font-bold mt-1">${stats.revenue}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-background/50 backdrop-blur-md border border-border/50 p-1 rounded-2xl h-auto mb-8">
          <TabsTrigger value="overview" className="rounded-xl py-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Overview
          </TabsTrigger>
          <TabsTrigger value="applications" className="rounded-xl py-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Applications
          </TabsTrigger>
          <TabsTrigger value="assignments" className="rounded-xl py-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Assignments
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="overview" className="mt-0 outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="glass-card lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates from your conference delegates.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {applications.slice(0, 5).map((app, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/5 border border-border/40">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                              {app.role[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium">New {app.role} Application</p>
                              <p className="text-xs text-muted-foreground">{app.choices.primary.committee} • {app.choices.primary.country}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{app.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Committee Capacity</CardTitle>
                    <CardDescription>Delegate distribution per committee.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.committees.map((committee, i) => {
                      const count = applications.filter(a => a.assignedCommittee === committee.name || a.choices.primary.committee === committee.name).length;
                      const progress = Math.min((count / (committee.capacity || 100)) * 100, 100);
                      return (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span>{committee.name}</span>
                            <span>{count} / {committee.capacity || 100}</span>
                          </div>
                          <div className="h-2 w-full bg-secondary/30 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-500" 
                              style={{ width: `${progress}%` }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="applications" className="mt-0 outline-none">
              <Card className="glass-card overflow-hidden">
                <div className="p-4 border-b border-border/50 bg-secondary/5 flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="w-3.5 h-3.5" /> Filter
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-3.5 h-3.5" /> Export CSV
                    </Button>
                  </div>
                  <div className="relative">
                    <input 
                      className="h-9 w-full md:w-64 rounded-lg border border-border/50 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Search delegates..."
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-secondary/10 text-xs uppercase tracking-wider font-semibold text-muted-foreground border-b border-border/50">
                      <tr>
                        <th className="px-6 py-4">Delegate</th>
                        <th className="px-6 py-4">Committee (Choice 1)</th>
                        <th className="px-6 py-4">Country (Choice 1)</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {applications.map((app) => (
                        <tr key={(app as any).id} className="hover:bg-secondary/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                                {app.userId.slice(0, 2)}
                              </div>
                              <span className="font-medium">{app.role}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">{app.choices.primary.committee}</td>
                          <td className="px-6 py-4 text-sm">{app.choices.primary.country}</td>
                          <td className="px-6 py-4">
                            <Badge 
                              variant={
                                app.status === "approved" ? "default" : 
                                app.status === "rejected" ? "destructive" : "secondary"
                              }
                              className="capitalize"
                            >
                              {app.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                              <MoreVertical className="w-4 h-4" />
                            </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Manage Application</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-green-500 focus:text-green-500"
                                  onClick={() => handleStatusChange((app as any).id, "approved")}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleStatusChange((app as any).id, "rejected")}
                                >
                                  <XCircle className="w-4 h-4 mr-2" /> Reject
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange((app as any).id, "pending")}>
                                  <Clock className="w-4 h-4 mr-2" /> Move to Pending
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>View Experience</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="assignments" className="mt-0 outline-none">
              <div className="grid grid-cols-1 gap-6">
                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Country Assignments</CardTitle>
                      <CardDescription>Assign specific countries to approved delegates.</CardDescription>
                    </div>
                    <Button className="gap-2">
                      <Globe2 className="w-4 h-4" /> Run AI Suggestion
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="p-12 text-center border-2 border-dashed border-border/50 rounded-2xl bg-secondary/5">
                      <Globe2 className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold">Ready for Assignments?</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mt-2 mb-6">
                        Once you've approved delegates, you can assign them their specific countries here. Use the AI mode to match experience with country difficulty.
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button variant="outline">Manual Assignment</Button>
                        <Button variant="outline">Import Sheet</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
