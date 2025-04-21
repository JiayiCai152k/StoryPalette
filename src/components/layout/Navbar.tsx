// src/components/layout/Navbar.tsx
import { UserButton } from "@daveyplate/better-auth-ui"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, Menu } from "lucide-react";

export const Navbar = function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/60 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Story Palette
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
              Explore
            </Link>
            <Link href="/challenges" className="text-muted-foreground hover:text-foreground transition-colors">
              Challenges
            </Link>
            <Link href="/creators" className="text-muted-foreground hover:text-foreground transition-colors">
              Creators
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          <Button asChild variant="ghost" size="icon" className="hidden md:flex">
            <Link href="/create">
              <PlusCircle className="h-5 w-5" />
              <span className="sr-only">Create</span>
            </Link>
          </Button>
          
          <UserButton />
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
