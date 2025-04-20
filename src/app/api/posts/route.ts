// src/app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { posts, users } from '@/lib/db/schema';
import { typesenseClient } from '@/lib/search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const tag = searchParams.get('tag');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  try {
    let query = db.select().from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(desc(posts.createdAt));
    
    if (type) {
      query = query.where(eq(posts.type, type));
    }
    
    // Add tag filtering if needed
    
    const results = await query;
    
    return NextResponse.json({ 
      posts: results, 
      pagination: { page, limit, total: results.length } 
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const json = await request.json();
    
    // Validate input data
    
    const [post] = await db.insert(posts).values({
      title: json.title,
      slug: createSlug(json.title),
      description: json.description,
      content: json.content,
      type: json.type,
      imageUrl: json.imageUrl,
      imageDimensions: json.imageDimensions,
      medium: json.medium,
      authorId: session.user.id,
    }).returning();
    
    // Add to Typesense for search
    await typesenseClient.collections('posts').documents().create({
      id: post.id.toString(),
      title: post.title,
      description: post.description || '',
      content: post.content || '',
      type: post.type,
      author: session.user.name,
      created_at: new Date(post.createdAt).getTime(),
    });
    
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}