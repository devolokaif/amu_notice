
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Bell, LogOut, User, UserPlus, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

export function Header() {
  const { currentUser, logout } = useAuth();
  const isMobile = useIsMobile();
  
  return (
    <header className="border-b sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Notice App</span>
          </Link>
        </div>
        
        {currentUser ? (
          <>
            {isMobile ? (
              <MobileNav />
            ) : (
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                  Dashboard
                </Link>
                {currentUser.role === "ADMIN" && (
                  <Link to="/admin" className="text-sm font-medium transition-colors hover:text-primary">
                    Admin Panel
                  </Link>
                )}
                <UserDropdown />
                <ThemeToggle />
              </nav>
            )}
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
            <ThemeToggle />
          </div>
        )}
      </div>
    </header>
  );
}

function MobileNav() {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Menu</span>
          <SheetClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </div>
        <nav className="flex flex-col gap-4 mt-8">
          <SheetClose asChild>
            <Link to="/" className="flex items-center gap-2 py-2 text-sm font-medium">
              <Bell className="h-5 w-5" />
              Dashboard
            </Link>
          </SheetClose>
          
          {currentUser?.role === "admin" && (
            <SheetClose asChild>
              <Link to="/admin" className="flex items-center gap-2 py-2 text-sm font-medium">
                <Users className="h-5 w-5" />
                Admin Panel
              </Link>
            </SheetClose>
          )}
          
          <div className="flex flex-col gap-2 py-2">
            <p className="text-sm font-medium text-muted-foreground">
              Signed in as {currentUser?.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentUser?.email}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              Role: {currentUser?.role}
            </p>
          </div>
          
          <SheetClose asChild>
            <Button 
              variant="outline"
              className="w-full mt-2 gap-2"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </SheetClose>
          
          <div className="mt-auto flex justify-end">
            <ThemeToggle />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function UserDropdown() {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <span className="hidden sm:inline">{currentUser.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="flex flex-col items-start">
          <span className="text-sm">{currentUser.email}</span>
          <span className="text-xs text-muted-foreground capitalize">
            Role: {currentUser.role}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
