import { collection, doc, getDoc, getDocs, query, where, addDoc } from "firebase/firestore";
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

export interface EventData {
  id: string;
  title: string;
  date: string;
  location: string;
  format: string;
  description: string;
  committees: Committee[];
  coverUrl?: string;
  
  // Organizer specific fields
  organizerId?: string;
  status?: "draft" | "published";
  ticketingTiers?: TicketingTier[];
  totalCapacity?: number;
}

export async function getEventById(eventId: string): Promise<EventData | null> {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);
    
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
    const eventsRef = collection(db, "events");
    const snapshot = await getDocs(eventsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventData));
  } catch (error) {
    console.error("Error fetching all events:", error);
    return [];
  }
}

export async function createEvent(data: Omit<EventData, "id">): Promise<string> {
  try {
    const eventsRef = collection(db, "events");
    const docRef = await addDoc(eventsRef, {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}
