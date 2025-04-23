import { pgTable, text, timestamp, uuid, varchar, jsonb, integer, pgEnum, index, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users, collections } from "./auth";

// Create a proper PostgreSQL enum
export const postTypeEnum = pgEnum('post_type', ['ARTWORK', 'FICTION']);

// Main posts table
export const posts = pgTable("posts", {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: postTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  // Type-specific fields
  imageUrl: text('image_url'), // For artwork
  imageKey: text('image_key'), // For artwork storage reference
  caption: text('caption'),    // For artwork
  content: text('content'),    // For fiction
  summary: text('summary'),    // For fiction
  wordCount: integer('word_count'), // For fiction
  // Metadata
  views: integer('views').default(0),
  metadata: jsonb('metadata'), // For flexible additional data
});

// Tags table
export const tags = pgTable("tags", {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  postCount: integer('post_count').default(0),
});

// Junction table for posts and tags
export const postTags = pgTable("post_tags", {
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
});

// Export collection posts junction table
export const collectionPosts = pgTable("collection_posts", {
  collectionId: uuid('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  addedAt: timestamp('added_at').defaultNow().notNull(),
});

// Likes table
export const likes = pgTable("likes", {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Comments table - define first without the self-reference
export const comments = pgTable("comments", {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  parentId: uuid('parent_id'),
});

export type Comment = typeof comments.$inferSelect;

// Relations
export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  tags: many(postTags),
  likes: many(likes),
  comments: many(comments),
  collections: many(collectionPosts),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(postTags),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments, { relationName: 'parent' }),
}));

// Add indexes for better performance
export const postsIndexes = {
  typeIndex: index('posts_type_idx').on(posts.type),
  userIndex: index('posts_user_id_idx').on(posts.userId),
  createdAtIndex: index('posts_created_at_idx').on(posts.createdAt),
};

export const likesIndexes = {
  userPostIndex: index('likes_user_post_idx').on(likes.userId, likes.postId),
};

export const commentsIndexes = {
  postIndex: index('comments_post_id_idx').on(comments.postId),
  userIndex: index('comments_user_id_idx').on(comments.userId),
};

export const tagsIndexes = {
  nameIndex: index('tags_name_idx').on(tags.name),
};