import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MealPlanProvider } from "./contexts/MealPlanContext";
import ModeSelection from "./pages/ModeSelection";
import IngredientSelection from "./pages/IngredientSelection";
import RecipeRecommendation from "./pages/RecipeRecommendation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MealPlanProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ModeSelection />} />
            <Route path="/ingredients" element={<IngredientSelection />} />
            <Route path="/recipes" element={<RecipeRecommendation />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MealPlanProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
