import { Toaster } from "@/components/ui/sonner";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { StoryDetail } from "./pages/StoryDetail";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-8 mt-16">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
      <Toaster richColors position="top-right" />
    </div>
  ),
  notFoundComponent: () => (
    <div className="container max-w-4xl mx-auto px-4 py-24 text-center">
      <h1 className="font-display text-4xl mb-4">Page not found</h1>
      <Link to="/" className="text-primary underline">
        Go home
      </Link>
    </div>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const storyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/story/$id",
  component: StoryDetail,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$principal",
  component: Profile,
});

const routeTree = rootRoute.addChildren([homeRoute, storyRoute, profileRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
