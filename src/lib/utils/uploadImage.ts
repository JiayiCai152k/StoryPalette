// utils/uploadImage.ts
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebase/config";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export function validateImage(file: File) {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPG, PNG, or GIF.');
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be less than 10MB');
  }
}

export function uploadImage(
  file: File,
  userId: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  // Validate before upload
  validateImage(file);
  
  // generate a unique path
  const path = `artworks/${userId}/${Date.now()}-${file.name}`;
  const fileRef = ref(storage, path);
  const task = uploadBytesResumable(fileRef, file);

  //add console.log
  console.log('Uploading image to:', path);
  //add console log after the task is uploaded
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
        resolve(url);
        console.log('File available at',url);
      }
    );
  });
}

