import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Campanas from "./pages/Campanas";
import Contabilidad from "./pages/Contabilidad";
import Facturacion from "./pages/Facturacion";
import Clientes from "./pages/Clientes";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/campanas" element={<Campanas />} />
                    <Route path="/contabilidad" element={<Contabilidad />} />
                    <Route path="/contabilidad/cuenta-sl" element={<Contabilidad />} />
                    <Route path="/contabilidad/cuenta-paypal" element={<Contabilidad />} />
                    <Route path="/facturacion" element={<Facturacion />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
