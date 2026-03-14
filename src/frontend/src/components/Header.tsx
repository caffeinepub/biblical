import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { BookOpen, LogOut, User } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function Header() {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity;
  const principal = identity?.getPrincipal().toString();

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          data-ocid="nav.link"
          className="flex items-center gap-2 group"
        >
          <BookOpen className="w-5 h-5 text-accent" strokeWidth={1.5} />
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Biblical
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          {isInitializing ? (
            <div className="w-20 h-8 rounded-md bg-muted animate-pulse" />
          ) : isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="nav.dropdown_menu"
                  className="gap-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">My Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile/$principal"
                    params={{ principal: principal! }}
                    data-ocid="nav.profile.link"
                    className="cursor-pointer"
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Stories
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={clear}
                  data-ocid="nav.logout.button"
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="nav.login.button"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isLoggingIn ? "Connecting..." : "Sign In"}
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
