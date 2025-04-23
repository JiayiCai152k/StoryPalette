import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";
import { v4 as uuidv4 } from "uuid";

export const uploadFile = async (file, folderPath = 'uploads') => {
  try {
    // Create a unique filename
    const uniqueFileName = `${uuidv4()}-${file.name}`;
    const fullPath = `${folderPath}/${uniqueFileName}`;
    
    // Create a storage reference
    const storageRef = ref(storage, fullPath);
    
    // Upload the file
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Return a promise that resolves with the download URL when upload completes
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optional: Handle upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        },
        (error) => reject(error),
        async () => {
          // Upload completed successfully, get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadURL,
            fullPath: fullPath
          });
        }
      );
    });
  } catch (error) {
    console.error("Error in uploadFile:", error);
    throw error;
  }
};

export const deleteFile = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
