
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function updateLeadProgress(userId: string, step: string, value: string) {
  if (!userId) {
    console.error('User ID is missing.');
    return;
  }

  try {
    const leadRef = doc(db, 'leads', userId);
    await setDoc(leadRef, {
      [step]: value,
      submittedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error updating lead progress: ', error);
  }
}
