import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DailyCheckin from "./pages/DailyCheckin";
import AIInsights from "./pages/AIInsights";
import RiskPredictions from "./pages/RiskPredictions";
import Recommendations from "./pages/Recommendations";
import ProgressReport from "./pages/ProgressReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkin" element={<DailyCheckin />} />
          <Route path="/insights" element={<AIInsights />} />
          <Route path="/risk" element={<RiskPredictions />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/progress" element={<ProgressReport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;