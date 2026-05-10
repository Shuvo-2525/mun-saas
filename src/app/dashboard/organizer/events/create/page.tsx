"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createEvent, EventData, Committee, TicketingTier } from "@/lib/services/eventService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, Calendar, MapPin, Building, Info, DollarSign } from "lucide-react";

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Form State
  const [basicInfo, setBasicInfo] = useState({
    title: "",
    date: "",
    location: "",
    format: "offline",
    description: "",
    coverUrl: "",
  });

  const [committees, setCommittees] = useState<Committee[]>([
    { name: "", countries: [], capacity: 0 },
  ]);

  const [ticketingTiers, setTicketingTiers] = useState<TicketingTier[]>([
    { name: "Regular", price: 0, capacity: 100 },
  ]);

  // Handlers
  const handleBasicChange = (field: string, value: string) => {
    setBasicInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCommittee = () => {
    setCommittees([...committees, { name: "", countries: [], capacity: 0 }]);
  };

  const handleUpdateCommittee = (index: number, field: string, value: any) => {
    const updated = [...committees];
    if (field === "capacity") {
      updated[index].capacity = parseInt(value) || 0;
    } else if (field === "countriesStr") {
      // Temporary handler for comma separated string
      updated[index].countries = value.split(",").map((c: string) => c.trim()).filter(Boolean);
    } else {
      (updated[index] as any)[field] = value;
    }
    setCommittees(updated);
  };

  const handleRemoveCommittee = (index: number) => {
    setCommittees(committees.filter((_, i) => i !== index));
  };

  const handleAddTier = () => {
    setTicketingTiers([...ticketingTiers, { name: "", price: 0, capacity: 0 }]);
  };

  const handleUpdateTier = (index: number, field: string, value: any) => {
    const updated = [...ticketingTiers];
    if (field === "price" || field === "capacity") {
      updated[index][field] = parseInt(value) || 0;
    } else {
      updated[index][field as "name"] = value;
    }
    setTicketingTiers(updated);
  };

  const handleRemoveTier = (index: number) => {
    setTicketingTiers(ticketingTiers.filter((_, i) => i !== index));
  };

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
          Set up a new Model UN conference, configure committees, and define ticketing.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="basic" className="flex gap-2">
            <Info className="w-4 h-4" /> Basic Info
          </TabsTrigger>
          <TabsTrigger value="committees" className="flex gap-2">
            <Building className="w-4 h-4" /> Committees
          </TabsTrigger>
          <TabsTrigger value="financials" className="flex gap-2">
            <DollarSign className="w-4 h-4" /> Financials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                General details about the conference that delegates will see.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Global MUN 2026"
                  value={basicInfo.title}
                  onChange={(e) => handleBasicChange("title", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      className="pl-9"
                      value={basicInfo.date}
                      onChange={(e) => handleBasicChange("date", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <select
                    id="format"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={basicInfo.format}
                    onChange={(e) => handleBasicChange("format", e.target.value)}
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
                  <Input
                    id="location"
                    placeholder="Venue or Link"
                    className="pl-9"
                    value={basicInfo.location}
                    onChange={(e) => handleBasicChange("location", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverUrl">Cover Image URL</Label>
                <Input
                  id="coverUrl"
                  placeholder="https://example.com/image.jpg"
                  value={basicInfo.coverUrl}
                  onChange={(e) => handleBasicChange("coverUrl", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your conference..."
                  rows={5}
                  value={basicInfo.description}
                  onChange={(e) => handleBasicChange("description", e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => setActiveTab("committees")}>Next: Committees</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="committees">
          <Card>
            <CardHeader>
              <CardTitle>Committees Setup</CardTitle>
              <CardDescription>
                Define the committees, capacities, and available countries.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {committees.map((committee, index) => (
                <div key={index} className="p-4 border rounded-lg relative bg-card space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-sm">Committee {index + 1}</h4>
                    {committees.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                        onClick={() => handleRemoveCommittee(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Committee Name</Label>
                      <Input
                        placeholder="e.g., UNSC, DISEC"
                        value={committee.name}
                        onChange={(e) => handleUpdateCommittee(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Capacity (Number of Delegates)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={committee.capacity || ""}
                        onChange={(e) => handleUpdateCommittee(index, "capacity", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Available Countries (Comma separated)</Label>
                    <Input
                      placeholder="e.g., USA, UK, France, China, Russia"
                      value={committee.countries.join(", ")}
                      onChange={(e) => handleUpdateCommittee(index, "countriesStr", e.target.value)}
                    />
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full gap-2" onClick={handleAddCommittee}>
                <PlusCircle className="h-4 w-4" /> Add Another Committee
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setActiveTab("basic")}>Back</Button>
              <Button onClick={() => setActiveTab("financials")}>Next: Financials</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="financials">
          <Card>
            <CardHeader>
              <CardTitle>Financials & Ticketing</CardTitle>
              <CardDescription>
                Define ticket tiers. Payment Gateway integration will be added in Phase 7.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {ticketingTiers.map((tier, index) => (
                <div key={index} className="p-4 border rounded-lg relative bg-card space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-sm">Tier {index + 1}</h4>
                    {ticketingTiers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                        onClick={() => handleRemoveTier(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Tier Name</Label>
                      <Input
                        placeholder="e.g., Early Bird"
                        value={tier.name}
                        onChange={(e) => handleUpdateTier(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (USD)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          min="0"
                          className="pl-9"
                          value={tier.price || ""}
                          onChange={(e) => handleUpdateTier(index, "price", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Ticket Capacity</Label>
                      <Input
                        type="number"
                        min="0"
                        value={tier.capacity || ""}
                        onChange={(e) => handleUpdateTier(index, "capacity", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full gap-2" onClick={handleAddTier}>
                <PlusCircle className="h-4 w-4" /> Add Ticketing Tier
              </Button>
              
              <div className="bg-muted p-4 rounded-lg mt-6 text-sm text-muted-foreground flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                <p>Payment Gateway integrations (Stripe/PayPal) are currently disabled. Collecting payments will be activated in a future update.</p>
              </div>

            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="ghost" onClick={() => setActiveTab("committees")} disabled={loading}>
                Back
              </Button>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={loading}>
                  Save as Draft
                </Button>
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
