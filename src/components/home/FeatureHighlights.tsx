// src/components/home/FeatureHighlights.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeatureHighlights() {
  const features = [
    {
      "title": "Rich Content Creation",
      "description": "Share artwork or write stories",
      "details": "Share the sparks of your imagination—whether it’s a vivid illustration, a heartfelt poem, or a scene from your favorite story—and inspire others with your creative vision."
    },
    {
      "title": "Discover & Explore",
      "description": "Find new inspiration",
      "details": "Browse creations by tags to uncover works that spark your creativity."
    },
    {
      "title": "Connect & Engage",
      "description": "Interact with fellow creators",
      "details": "Like and save your favorite works, leave thoughtful comments, and build connections with artists and writers you admire."
    },
    {
      "title": "Portfolio Building",
      "description": "Showcase your best work",
      "details": "Create a beautiful portfolio page to highlight your favorite images and stories."
    }
  ];

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-6">Platform Features</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{feature.details}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
