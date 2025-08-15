
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "./contexts/ConfigContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Games from "./pages/Games";
import Stats from "./pages/Stats";
import NotFound from "./pages/NotFound";
import ParticleBackground from "./components/ParticleBackground";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider>
      <LanguageProvider>
        <TooltipProvider>
          <ParticleBackground />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/games" element={<Games />} />
              <Route path="/stats" element={<Stats />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ConfigProvider>
  </QueryClientProvider>
);

export default App;
