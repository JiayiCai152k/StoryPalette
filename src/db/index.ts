import "dotenv/config"

import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { WebSocket } from 'ws';

// Import all tables and relations
import { 
  posts,
  postsRelations,
  tags,
  tagsRelations,
  postTags,
  postTagsRelations,
  likes,
  likesRelations,
  comments,
  commentsRelations,
  collections,
  collectionsRelations,
  collectionPosts,
  collectionPostsRelations
} from './schema/content';

import {
  users,
  usersRelations,
  sessions,
  accounts,
  verifications,
  userFollows,
  userFollowsRelations
} from './schema/auth';

const connectionString =
  process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : process.env.LOCAL_DATABASE_URL;

if (process.env.NODE_ENV === 'production') {
  neonConfig.webSocketConstructor = WebSocket;
  neonConfig.poolQueryViaFetch = true;
} else {
  neonConfig.wsProxy = (host) => `${host}:5433/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

const pool = new Pool({ connectionString });

// Create the db instance with schema and relations
export const db = drizzle(pool, { 
  schema: {
    posts,
    tags,
    postTags,
    likes,
    comments,
    collections,
    collectionPosts,
    users,
    sessions,
    accounts,
    verifications,
    userFollows
  }
});
