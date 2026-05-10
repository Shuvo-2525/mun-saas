"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEventById, EventData } from "@/lib/services/eventService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      if (eventId) {
        const data = await getEventById(eventId);
        setEvent(data);
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  if (loading || authLoading) {
    return (
      <div className="container mx-auto py-10 space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-8">The conference you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push("/events")}>Back to Events</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-5xl">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push("/events")} className="mb-4">
          &larr; Back to Events
        </Button>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{event.title}</h1>
        
        <div className="flex flex-wrap gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5" />
            <span>{event.location} ({event.format})</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {event.coverUrl ? (
            <div className="w-full h-[400px] rounded-2xl overflow-hidden bg-muted relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.coverUrl} alt={event.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full h-[300px] rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary/40 text-center p-6">{event.title}</span>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-4">About this Conference</h2>
            <div className="prose prose-invert max-w-none">
              <p>{event.description || "No description provided for this event."}</p>
            </div>
          </div>
          
          {event.committees && event.committees.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Committees</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.committees.map((com, idx) => (
                  <Card key={idx} className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-primary" />
                        {com.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {com.countries?.length || 0} Countries/Positions Available
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <Card className="sticky top-24 glass-card border-primary/20">
            <CardHeader>
              <CardTitle>Application Open</CardTitle>
              <CardDescription>Join as a Delegate or Observer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm font-medium mb-1">Status</p>
                <p className="text-green-500 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
                  Accepting Applications
                </p>
              </div>
              
              {!user ? (
                <div className="space-y-3 pt-2">
                  <p className="text-sm text-muted-foreground text-center">You must be logged in to apply.</p>
                  <Button className="w-full" onClick={() => router.push(`/login?redirect=/events/${eventId}`)}>
                    Log In to Apply
                  </Button>
                </div>
              ) : (
                <Link href={`/events/${eventId}/apply`} className="block pt-2">
                  <Button size="lg" className="w-full text-lg shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all">
                    Apply Now
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
