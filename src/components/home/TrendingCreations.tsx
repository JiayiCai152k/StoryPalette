// src/components/home/TrendingCreations.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TrendingCreations() {
  // This will be replaced with real data later
  const trending = [
    { id: 1, title: "Sample Artwork", type: "artwork" },
    { id: 2, title: "Sample Story", type: "story" },
    // Add more placeholder items
  ];

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Trending Now</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {trending.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Placeholder for {item.type} preview</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
