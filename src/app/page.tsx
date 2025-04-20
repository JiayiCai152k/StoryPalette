// src/app/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import TrendingCreations from "@/components/home/TrendingCreations";
import NewCreations from "@/components/home/NewCreations";
import FeatureHighlights from "@/components/home/FeatureHighlights";

export default function Home() {
  return (
    <div className="container py-8">
      <section className="flex flex-col items-center text-center py-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Creative Community</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Share your artwork and fiction, connect with creators, and find inspiration
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/explore">Explore Creations</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/sign-up">Join Community</Link>
          </Button>
        </div>
      </section>

      <TrendingCreations />
      <NewCreations />
      
      <section className="py-12">
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
              <CardTitle>Weekly Challenges</CardTitle>
              <CardDescription>Find inspiration through prompts</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Participate in weekly art or writing challenges to push your creative boundaries.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href="/challenges">View Challenges</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
      
      <FeatureHighlights />
    </div>
  );
}