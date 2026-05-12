import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export interface Committee {
  name: string;
  countries: string[];
  capacity?: number;
}

export interface TicketingTier {
  name: string;
  price: number;
  capacity: number;
}

export interface ScheduleItem {
  title: string;
  startTime: string;
  endTime: string;
  type: "main" | "session" | "break" | "social";
  location: string;
  description?: string;
}

export interface EventData {
  id: string;
  title: string;
  date: string;
  location: string;
  format: string;
  description: string;
  committees: Committee[];
  coverUrl?: string;
  schedule?: ScheduleItem[];

  // Organizer specific fields
  organizerId?: string;
  status?: "draft" | "published";
  ticketingTiers?: TicketingTier[];
  totalCapacity?: number;
}

export async function getEventById(eventId: string): Promise<EventData | null> {
  try {
    const eventSnap = await getDoc(doc(db, "events", eventId));
    if (eventSnap.exists()) {
      return { id: eventSnap.id, ...eventSnap.data() } as EventData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export async function getAllEvents(): Promise<EventData[]> {
  try {
    const snap = await getDocs(collection(db, "events"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as EventData));
  } catch (error) {
    console.error("Error fetching all events:", error);
    return [];
  }
}

export async function createEvent(data: Omit<EventData, "id">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "events"), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export async function updateEvent(eventId: string, data: Partial<Omit<EventData, "id">>): Promise<void> {
  try {
    await updateDoc(doc(db, "events", eventId), { ...data, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}
