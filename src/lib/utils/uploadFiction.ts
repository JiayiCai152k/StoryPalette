import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebase/config";

const MAX_CONTENT_SIZE = 5 * 1024 * 1024; // 5MB for text content

// Match the schema structure
type FictionContent = {
  content: string;
  metadata: {
    wordCount: number;
    updatedAt: string;
  };
}

export function validateFictionContent(content: string) {
  const contentSize = new Blob([content]).size;
  if (contentSize > MAX_CONTENT_SIZE) {
    throw new Error('Content size must be less than 5MB');
  }
  if (!content.trim()) {
    throw new Error('Content cannot be empty');
  }
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function uploadFiction(
  content: string,
  userId: string,
  onProgress?: (percent: number) => void
): Promise<{ url: string; wordCount: number }> {
  // Validate content size
  validateFictionContent(content);
  
  // Calculate word count once
  const wordCount = countWords(content);
  
  // Prepare the content object
  const fictionContent: FictionContent = {
    content,
    metadata: {
      wordCount,
      updatedAt: new Date().toISOString()
    }
  };
  
  // Convert to JSON and create a Blob
  const contentBlob = new Blob(
    [JSON.stringify(fictionContent)], 
    { type: 'application/json' }
  );
  
  // Generate a unique path that matches your schema's structure
  const path = `fictions/${userId}/${Date.now()}.json`;
  const fileRef = ref(storage, path);
  const task = uploadBytesResumable(fileRef, contentBlob);

  console.log('Uploading fiction to:', path);
  
  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => {
        if (onProgress) {
          const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
          onProgress(pct);
        }
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ url, wordCount });
        console.log('Fiction content available at', url);
      }
    );
  });
}

// Helper function to download and parse fiction content
export async function downloadFiction(url: string): Promise<FictionContent> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to download fiction content');
  }
  return response.json();
}

// Helper function to update existing fiction
export async function updateFiction(
  content: string,
  userId: string,
  onProgress?: (percent: number) => void
): Promise<{ url: string; wordCount: number }> {
  validateFictionContent(content);
  
  const wordCount = countWords(content);
  
  const fictionContent: FictionContent = {
    content,
    metadata: {
      wordCount,
      updatedAt: new Date().toISOString()
    }
  };
  
  const contentBlob = new Blob(
    [JSON.stringify(fictionContent)], 
    { type: 'application/json' }
  );
  
  const path = `fictions/${userId}/${Date.now()}.json`;
  const fileRef = ref(storage, path);
  const task = uploadBytesResumable(fileRef, contentBlob);

  console.log('Updating fiction at:', path);
  
  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => {
        if (onProgress) {
          const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
          onProgress(pct);
        }
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ url, wordCount });
        console.log('Updated fiction content available at', url);
      }
    );
  });
}
