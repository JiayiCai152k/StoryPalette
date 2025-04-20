// src/components/home/FeatureHighlights.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeatureHighlights() {
  const features = [
    {
      title: "Rich Content Creation",
      description: "Share artwork or write stories",
      details: "Upload images in various formats or write stories with our rich-text editor"
    },
    {
      title: "Discover & Connect",
      description: "Find inspiration and fellow creators",
      details: "Browse by tags, categories, or follow your favorite creators"
    },
    {
      title: "Weekly Challenges",
      description: "Push your creative boundaries",
      details: "Participate in community prompts and themed challenges"
    },
    {
      title: "Portfolio Building",
      description: "Showcase your best work",
      details: "Create a beautiful portfolio to highlight your creations"
    }
  ];

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Platform Features</h2>
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
