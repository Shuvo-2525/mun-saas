"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createEvent, EventData, Committee, TicketingTier, ScheduleItem } from "@/lib/services/eventService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Calendar, MapPin, Building, Info, DollarSign, Clock } from "lucide-react";

const SCHEDULE_TYPES = ["main", "session", "break", "social"] as const;

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const [basicInfo, setBasicInfo] = useState({
    title: "", date: "", location: "", format: "offline", description: "", coverUrl: "",
  });

  const [committees, setCommittees] = useState<Committee[]>([
    { name: "", countries: [], capacity: 0 },
  ]);

  const [ticketingTiers, setTicketingTiers] = useState<TicketingTier[]>([
    { name: "Regular", price: 0, capacity: 100 },
  ]);

  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  const handleBasicChange = (field: string, value: string) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCommittee = () => setCommittees([...committees, { name: "", countries: [], capacity: 0 }]);
  const handleRemoveCommittee = (i: number) => setCommittees(committees.filter((_, idx) => idx !== i));
  const handleUpdateCommittee = (index: number, field: string, value: any) => {
    const updated = [...committees];
    if (field === "capacity") updated[index].capacity = parseInt(value) || 0;
    else if (field === "countriesStr") updated[index].countries = value.split(",").map((c: string) => c.trim()).filter(Boolean);
    else (updated[index] as any)[field] = value;
    setCommittees(updated);
  };

  const handleAddTier = () => setTicketingTiers([...ticketingTiers, { name: "", price: 0, capacity: 0 }]);
  const handleRemoveTier = (i: number) => setTicketingTiers(ticketingTiers.filter((_, idx) => idx !== i));
  const handleUpdateTier = (index: number, field: string, value: any) => {
    const updated = [...ticketingTiers];
    if (field === "price" || field === "capacity") updated[index][field] = parseInt(value) || 0;
    else updated[index][field as "name"] = value;
    setTicketingTiers(updated);
  };

  const addScheduleItem = () =>
    setSchedule(prev => [...prev, { title: "", startTime: "", endTime: "", type: "session", location: "", description: "" }]);
  const removeScheduleItem = (i: number) => setSchedule(prev => prev.filter((_, idx) => idx !== i));
  const updateScheduleItem = (idx: number, field: keyof ScheduleItem, value: string) =>
    setSchedule(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));

  const handleSubmit = async (status: "draft" | "published") => {
    if (!user) return;
    setLoading(true);
    try {
      const totalCap = ticketingTiers.reduce((acc, tier) => acc + tier.capacity, 0);
      const eventData: Omit<EventData, "id"> = {
        ...basicInfo,
        committees,
        organizerId: user.uid,
        status,
        ticketingTiers,
        totalCapacity: totalCap,
        schedule,
      };
      await createEvent(eventData);
      router.push("/dashboard/organizer/events");
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
        <p className="text-muted-foreground mt-1">
          Set up a new Model UN conference, configure committees, schedule, and ticketing.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="basic" className="flex gap-2">
            <Info className="w-4 h-4" /> Basic Info
          </TabsTrigger>
          <TabsTrigger value="committees" className="flex gap-2">
            <Building className="w-4 h-4" /> Committees
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex gap-2">
            <Clock className="w-4 h-4" /> Schedule
          </TabsTrigger>
          <TabsTrigger value="financials" className="flex gap-2">
            <DollarSign className="w-4 h-4" /> Financials
          </TabsTrigger>
        </TabsList>

        {/* BASIC INFO */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>General details delegates will see.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" placeholder="e.g., Global MUN 2026" value={basicInfo.title} onChange={e => handleBasicChange("title", e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="date" type="date" className="pl-9" value={basicInfo.date} onChange={e => handleBasicChange("date", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <select
                    id="format"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={basicInfo.format}
                    onChange={e => handleBasicChange("format", e.target.value)}
                  >
                    <option value="offline">Offline / In-Person</option>
                    <option value="online">Online / Virtual</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="location" placeholder="Venue or Link" className="pl-9" value={basicInfo.location} onChange={e => handleBasicChange("location", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverUrl">Cover Image URL</Label>
                <Input id="coverUrl" placeholder="https://example.com/image.jpg" value={basicInfo.coverUrl} onChange={e => handleBasicChange("coverUrl", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your conference..." rows={5} value={basicInfo.description} onChange={e => handleBasicChange("description", e.target.value)} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => setActiveTab("committees")}>Next: Committees</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* COMMITTEES */}
        <TabsContent value="committees">
          <Card>
            <CardHeader>
              <CardTitle>Committees Setup</CardTitle>
              <CardDescription>Define committees, capacities, and available countries.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {committees.map((committee, index) => (
                <div key={index} className="p-4 border rounded-lg relative bg-card space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">Committee {index + 1}</h4>
                    {committees.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/90" onClick={() => handleRemoveCommittee(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Committee Name</Label>
                      <Input placeholder="e.g., UNSC, DISEC" value={committee.name} onChange={e => handleUpdateCommittee(index, "name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Capacity</Label>
                      <Input type="number" min="0" value={committee.capacity || ""} onChange={e => handleUpdateCommittee(index, "capacity", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Available Countries (comma-separated)</Label>
                    <Input placeholder="e.g., USA, UK, France, China" value={committee.countries.join(", ")} onChange={e => handleUpdateCommittee(index, "countriesStr", e.target.value)} />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full gap-2" onClick={handleAddCommittee}>
                <PlusCircle className="h-4 w-4" /> Add Another Committee
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setActiveTab("basic")}>Back</Button>
              <Button onClick={() => setActiveTab("schedule")}>Next: Schedule</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* SCHEDULE */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Conference Schedule</CardTitle>
              <CardDescription>Build the event timeline. Delegates will see this in their conference portal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {schedule.length === 0 && (
                <div className="py-10 text-center border-2 border-dashed border-border/40 rounded-xl text-muted-foreground text-sm">
                  No schedule items yet. Click "Add Item" below.
                </div>
              )}
              {schedule.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-border/40 bg-secondary/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Item {idx + 1}</span>
                    <button onClick={() => removeScheduleItem(idx)} className="text-destructive hover:text-destructive/80 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Title</Label>
                      <Input value={item.title} onChange={e => updateScheduleItem(idx, "title", e.target.value)} placeholder="e.g., Opening Ceremony" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Type</Label>
                      <Select value={item.type} onValueChange={val => updateScheduleItem(idx, "type", val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {SCHEDULE_TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Start Time</Label>
                      <Input value={item.startTime} onChange={e => updateScheduleItem(idx, "startTime", e.target.value)} placeholder="09:00 AM" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">End Time</Label>
                      <Input value={item.endTime} onChange={e => updateScheduleItem(idx, "endTime", e.target.value)} placeholder="10:30 AM" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Location</Label>
                      <Input value={item.location} onChange={e => updateScheduleItem(idx, "location", e.target.value)} placeholder="Main Hall" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Description (optional)</Label>
                      <Input value={item.description || ""} onChange={e => updateScheduleItem(idx, "description", e.target.value)} placeholder="Brief notes..." />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full gap-2" onClick={addScheduleItem}>
                <PlusCircle className="h-4 w-4" /> Add Schedule Item
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setActiveTab("committees")}>Back</Button>
              <Button onClick={() => setActiveTab("financials")}>Next: Financials</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* FINANCIALS */}
        <TabsContent value="financials">
          <Card>
            <CardHeader>
              <CardTitle>Financials & Ticketing</CardTitle>
              <CardDescription>Define ticket tiers. Payment Gateway integration in Phase 7.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {ticketingTiers.map((tier, index) => (
                <div key={index} className="p-4 border rounded-lg relative bg-card space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">Tier {index + 1}</h4>
                    {ticketingTiers.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/90" onClick={() => handleRemoveTier(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Tier Name</Label>
                      <Input placeholder="e.g., Early Bird" value={tier.name} onChange={e => handleUpdateTier(index, "name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (USD)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input type="number" min="0" className="pl-9" value={tier.price || ""} onChange={e => handleUpdateTier(index, "price", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Ticket Capacity</Label>
                      <Input type="number" min="0" value={tier.capacity || ""} onChange={e => handleUpdateTier(index, "capacity", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full gap-2" onClick={handleAddTier}>
                <PlusCircle className="h-4 w-4" /> Add Ticketing Tier
              </Button>
              <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground flex items-center gap-2">
                <Info className="w-5 h-5 text-primary shrink-0" />
                <p>Payment Gateway integrations (Stripe/PayPal) are disabled. Collecting payments activates in a future update.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="ghost" onClick={() => setActiveTab("schedule")} disabled={loading}>Back</Button>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={loading}>Save as Draft</Button>
                <Button onClick={() => handleSubmit("published")} disabled={loading}>
                  {loading ? "Publishing..." : "Publish Event"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
