import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Campanas from "./pages/Campanas";
import Contabilidad from "./pages/Contabilidad";
import Facturacion from "./pages/Facturacion";
import Clientes from "./pages/Clientes";
import Colaboradores from "./pages/Colaboradores";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/campanas" element={
              <ProtectedRoute>
                <Layout>
                  <Campanas />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/contabilidad" element={
              <ProtectedRoute>
                <Layout>
                  <Contabilidad />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/facturacion" element={
              <ProtectedRoute>
                <Layout>
                  <Facturacion />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/clientes" element={
              <ProtectedRoute>
                <Layout>
                  <Clientes />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/colaboradores" element={
              <ProtectedRoute>
                <Layout>
                  <Colaboradores />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
