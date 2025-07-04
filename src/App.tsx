import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Campanas from "./pages/Campanas";
import Contabilidad from "./pages/Contabilidad";
import Facturacion from "./pages/Facturacion";
import Clientes from "./pages/Clientes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/campanas" element={<Campanas />} />
            <Route path="/contabilidad" element={<Contabilidad />} />
            <Route path="/contabilidad/cuenta-sl" element={<Contabilidad />} />
            <Route path="/contabilidad/cuenta-paypal" element={<Contabilidad />} />
            <Route path="/facturacion" element={<Facturacion />} />
            <Route path="/clientes" element={<Clientes />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
