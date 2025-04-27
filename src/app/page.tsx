// src/app/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import TrendingCreations from "@/components/home/TrendingCreations";
import NewCreations from "@/components/home/NewCreations";
import FeatureHighlights from "@/components/home/FeatureHighlights";

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <section className="flex flex-col items-center text-center py-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Story Palette</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Share your artwork and fiction, connect with creators, and find inspiration
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/explore">Explore Creations</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/creators">Explore Creators</Link>
          </Button>
        </div>
      </section>

      <TrendingCreations />
      <NewCreations />
      
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-6">Community Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Share Your Work</CardTitle>
              <CardDescription>Upload artwork or post your fiction stories</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Publish your creative works and receive feedback from a supportive community of fellow creators.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href="/create">Start Creating</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Connect with Creators</CardTitle>
              <CardDescription>Follow, comment, and collaborate</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Build meaningful connections with other artists and writers who share your passions.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href="/creators">Discover Creators</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Discover Creations</CardTitle>
              <CardDescription>Explore community artworks and fiction</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Discover a world of creations—from stunning visual artworks to captivating fictions.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href="/explore">Discover Creations</Link>
              </Button>
            </CardFooter>
          </Card>

        </div>
      </section>
      
      <FeatureHighlights />
    </div>
  );
}