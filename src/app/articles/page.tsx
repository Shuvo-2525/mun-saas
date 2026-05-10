import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function ArticlesPage() {
  // Mock data for Phase 2
  const articles = [
    { id: "1", title: "How to Write a Winning Position Paper", author: "Jane Doe", date: "May 10, 2026", category: "Guide" },
    { id: "2", title: "Understanding the UN Security Council Dynamics", author: "John Smith", date: "May 8, 2026", category: "Analysis" },
    { id: "3", title: "Tips for First-Time Delegates", author: "Sarah Lee", date: "May 5, 2026", category: "Tips" },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Articles & Study Guides</h1>
          <p className="text-muted-foreground mt-2">Read insights, analysis, and preparation material for your next MUN.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{article.title}</CardTitle>
                  <CardDescription>By {article.author} • {article.date}</CardDescription>
                </div>
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  {article.category}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                This is a brief excerpt from the article that gives the reader a quick overview of what to expect before they click through to read the full content.
              </p>
              <Link href={`/articles/${article.id}`} className={buttonVariants({ variant: "outline" })}>
                Read More
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
