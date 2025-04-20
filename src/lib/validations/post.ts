// src/lib/validations/post.ts
import { z } from 'zod';

export const postCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  content: z.string().optional(),
  type: z.enum(['artwork', 'fiction']),
  imageUrl: z.string().url("Invalid image URL").optional(),
  imageDimensions: z.string().optional(),
  medium: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type PostCreateInput = z.infer<typeof postCreateSchema>;

// src/lib/validations/user.ts
import { z } from 'zod';

export const userProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  links: z.object({
    twitter: z.string().url("Invalid Twitter URL").optional(),
    instagram: z.string().url("Invalid Instagram URL").optional(),
    website: z.string().url("Invalid website URL").optional(),
  }).optional(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;
