import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, varchar, jsonb, integer, pgEnum, index, primaryKey, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from "./auth";

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
  imageUrl: text('image_url'),
  imageKey: text('image_key'),
  caption: text('caption'),
  content: text('content'),
  summary: text('summary'),
  wordCount: integer('word_count'),
  views: integer('views').default(0),
  metadata: jsonb('metadata'),
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

// Collection posts junction table
export const collectionPosts = pgTable("collection_posts", {
  collectionId: uuid('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  addedAt: timestamp('added_at').defaultNow().notNull(),
});

// Collections table
export const collections = pgTable("collections", {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  isPrivate: boolean('is_private').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Collections relations
export const collectionsRelations = relations(collections, ({ one, many }) => ({
  user: one(users, {
    fields: [collections.userId],
    references: [users.id],
  }),
  posts: many(collectionPosts),
}));

// Collection posts relations
export const collectionPostsRelations = relations(collectionPosts, ({ one }) => ({
  collection: one(collections, {
    fields: [collectionPosts.collectionId],
    references: [collections.id],
  }),
  post: one(posts, {
    fields: [collectionPosts.postId],
    references: [posts.id],
  }),
}));

// Likes table
export const likes = pgTable("likes", {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Comments table without parentId
export const comments = pgTable("comments", {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;

// Comments relations without parent/replies
export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));

// Posts relations
export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  postTags: many(postTags),
  likes: many(likes),
  comments: many(comments),
  collections: many(collectionPosts),
}));

// Tags relations
export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));

// Post tags relations
export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
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