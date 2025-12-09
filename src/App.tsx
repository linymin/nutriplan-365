import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MealPlanProvider } from "./contexts/MealPlanContext";
import Auth from "./pages/Auth";
import ProfileSetup from "./pages/ProfileSetup";
import ModeSelection from "./pages/ModeSelection";
import IngredientSelection from "./pages/IngredientSelection";
import RecipeRecommendation from "./pages/RecipeRecommendation";
import GroceryList from "./pages/GroceryList";
import DietTracking from "./pages/DietTracking";
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
            <Route path="/" element={<Auth />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/mode" element={<ModeSelection />} />
            <Route path="/ingredients" element={<IngredientSelection />} />
            <Route path="/recipes" element={<RecipeRecommendation />} />
            <Route path="/grocery" element={<GroceryList />} />
            <Route path="/tracking" element={<DietTracking />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MealPlanProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
