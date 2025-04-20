// src/lib/search.ts
import Typesense from 'typesense';

export const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST,
      port: parseInt(process.env.TYPESENSE_PORT),
      protocol: process.env.TYPESENSE_PROTOCOL,
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 2,
});

export const postsSchema = {
  name: 'posts',
  fields: [
    { name: 'id', type: 'int32' },
    { name: 'title', type: 'string' },
    { name: 'description', type: 'string', optional: true },
    { name: 'content', type: 'string', optional: true },
    { name: 'type', type: 'string' },
    { name: 'author', type: 'string' },
    { name: 'tags', type: 'string[]', optional: true },
    { name: 'created_at', type: 'int64' },
  ],
  default_sorting_field: 'created_at',
};

// Initialize Typesense schema
export const initializeTypesense = async () => {
  try {
    await typesenseClient.collections('posts').retrieve();
    console.log('Posts collection already exists');
  } catch (err) {
    await typesenseClient.collections().create(postsSchema);
    console.log('Created posts collection');
  }
};