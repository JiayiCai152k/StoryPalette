// src/components/layout/Navbar.tsx
import { UserButton } from "@daveyplate/better-auth-ui"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet"

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
            <Link href="/creators" className="text-muted-foreground hover:text-foreground transition-colors">
              Creators
            </Link>
            <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
              Profile
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
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Check out new stories, creators, and more.
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col mt-6">
                <Link 
                  href="/explore" 
                  className="flex items-center h-12 px-4 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Explore
                </Link>
                <Link 
                  href="/creators" 
                  className="flex items-center h-12 px-4 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Creators
                </Link>
                <Link 
                  href="/profile" 
                  className="flex items-center h-12 px-4 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Profile
                </Link>
                <Link 
                  href="/create" 
                  className="flex items-center h-12 px-4 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create
                </Link>
                <Button 
                  variant="ghost" 
                  className="justify-start h-12 px-4 font-medium text-muted-foreground hover:text-accent-foreground"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
