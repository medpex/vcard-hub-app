import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import CardEditor from "./pages/CardEditor";
import QRCodes from "./pages/QRCodes";
import Employees from "./pages/Employees";
import Settings from "./pages/Settings";
import BusinessCardView from "./pages/BusinessCardView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin Dashboard Routes */}
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/cards" element={<Layout><CardEditor /></Layout>} />
          <Route path="/qr-codes" element={<Layout><QRCodes /></Layout>} />
          <Route path="/employees" element={<Layout><Employees /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          
          {/* Public Business Card View */}
          <Route path="/card/:id" element={<BusinessCardView />} />
          <Route path="/:id" element={<BusinessCardView />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
