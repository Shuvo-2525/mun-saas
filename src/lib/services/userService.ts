import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: string;
  photoURL?: string;
  institution?: string;
  bio?: string;
  phoneNumber?: string;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
