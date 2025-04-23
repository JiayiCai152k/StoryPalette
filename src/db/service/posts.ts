import { db } from '@/db';
import { posts } from '@/db/schema/content';
import { uploadImage } from '@/lib/utils/uploadImage';
import { eq } from 'drizzle-orm';

export async function uploadPostImage(userId: string, postId: string, file: File, onProgress?: (percent: number) => void) {
  try {
    // Upload to Firebase Storage
    const imageUrl = await uploadImage(file, userId, onProgress);
    
    // Update the post record with the new URL
    await db.update(posts)
      .set({ 
        imageUrl,
        imageKey: `artworks/${userId}/${Date.now()}-${file.name}` // Store the Firebase path
      })
      .where(eq(posts.id, postId));
    
    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}