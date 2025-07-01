import "@/i18n";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import Index from "./pages/Index";
import Products from "./pages/Products";
import SerialLookup from "./pages/SerialLookup";
import NotFound from "./pages/NotFound";
import { useTranslation } from "react-i18next";

const queryClient = new QueryClient();

const AppInner = () => {
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* NAVBAR START */}
      <nav className="border-b bg-white/95 dark:bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/logo2.png"
                alt="DrillPro Logo"
                className="h-14 w-14"
              />
              {/* <span className="text-2xl font-bold text-primary ml-2">
                DrillPro
              </span> */}
            </div>
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className={
                  location.pathname === "/"
                    ? "text-primary font-bold border-b-2 border-accent pb-1"
                    : "text-foreground hover:text-primary transition-colors"
                }
              >
                Home
              </Link>
              <Link
                to="/products"
                className={
                  location.pathname.startsWith("/products")
                    ? "text-primary font-bold border-b-2 border-accent pb-1"
                    : "text-foreground hover:text-primary transition-colors"
                }
              >
                Products
              </Link>
              <Link
                to="/serial-lookup"
                className={
                  location.pathname.startsWith("/serial-lookup")
                    ? "text-primary font-bold border-b-2 border-accent pb-1"
                    : "text-foreground hover:text-primary transition-colors"
                }
              >
                Serial Lookup
              </Link>
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
      {/* NAVBAR END */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/serial-lookup" element={<SerialLookup />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
