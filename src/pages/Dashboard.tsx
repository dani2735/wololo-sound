import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/stores/useAppStore";
import { Euro, TrendingUp, TrendingDown, Calendar, FileText } from "lucide-react";

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function Dashboard() {
  const { 
    mesSeleccionado, 
    añoSeleccionado, 
    setMesSeleccionado, 
    setAñoSeleccionado, 
    getDashboardData,
    campañas 
  } = useAppStore();
  
  const dashboardData = getDashboardData();
  
  // Get available years and months
  const availableYears = [...new Set(campañas.map(c => new Date(c.fechaCreacion).getFullYear()))].sort((a, b) => b - a);
  const availableMonths = [...new Set(
    campañas
      .filter(c => new Date(c.fechaCreacion).getFullYear() === añoSeleccionado)
      .map(c => new Date(c.fechaCreacion).getMonth() + 1)
  )].sort((a, b) => a - b);

  const haberTotal = dashboardData.cuentaSL + dashboardData.cuentaPaypal;
  const totalCobradoMes = dashboardData.mesSeleccionado.totalCobradoSL + dashboardData.mesSeleccionado.totalCobradoPaypal;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen financiero y métricas del negocio
        </p>
      </div>

      {/* Financial Overview Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card className="bg-gradient-primary text-primary-foreground shadow-elegant border-0">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">
               Haber Total
             </CardTitle>
             <TrendingUp className="h-4 w-4" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">
               {haberTotal.toLocaleString('es-ES', { 
                 style: 'currency', 
                 currency: 'EUR' 
               })}
             </div>
           </CardContent>
         </Card>

         <Card className="bg-gradient-card shadow-card border-0">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Cuenta SL
             </CardTitle>
             <Euro className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-foreground">
               {dashboardData.cuentaSL.toLocaleString('es-ES', { 
                 style: 'currency', 
                 currency: 'EUR' 
               })}
             </div>
           </CardContent>
         </Card>

         <Card className="bg-gradient-card shadow-card border-0">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Cuenta Paypal
             </CardTitle>
             <Euro className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-foreground">
               {dashboardData.cuentaPaypal.toLocaleString('es-ES', { 
                 style: 'currency', 
                 currency: 'EUR' 
               })}
             </div>
           </CardContent>
         </Card>

         <Card className="bg-gradient-card shadow-card border-0">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Pendiente Cobro
             </CardTitle>
             <FileText className="h-4 w-4 text-warning" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-warning">
               {dashboardData.totalFacturadoPendiente.toLocaleString('es-ES', { 
                 style: 'currency', 
                 currency: 'EUR' 
               })}
             </div>
           </CardContent>
         </Card>
       </div>

       {/* Additional Overview Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card className="bg-gradient-card shadow-card border-0">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Pendiente Facturar
             </CardTitle>
             <FileText className="h-4 w-4 text-warning" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-warning">
               {dashboardData.totalPendienteFacturar.toLocaleString('es-ES', { 
                 style: 'currency', 
                 currency: 'EUR' 
               })}
             </div>
           </CardContent>
         </Card>

         <Card className="bg-gradient-card shadow-card border-0">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Total Facturado Histórico
             </CardTitle>
             <TrendingUp className="h-4 w-4 text-success" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-success">
               {dashboardData.totalFacturadoHistorico.toLocaleString('es-ES', { 
                 style: 'currency', 
                 currency: 'EUR' 
               })}
             </div>
           </CardContent>
         </Card>

         <Card className="bg-gradient-card shadow-card border-0">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Total Cobrado Histórico
             </CardTitle>
             <TrendingUp className="h-4 w-4 text-success" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-success">
               {dashboardData.totalCobradoHistorico.toLocaleString('es-ES', { 
                 style: 'currency', 
                 currency: 'EUR' 
               })}
             </div>
           </CardContent>
         </Card>

         <Card className="bg-gradient-card shadow-card border-0">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
               Total Pagado Mes
             </CardTitle>
             <TrendingDown className="h-4 w-4 text-destructive" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-destructive">
               {dashboardData.mesSeleccionado.totalPagadoMes.toLocaleString('es-ES', { 
                 style: 'currency', 
                 currency: 'EUR' 
               })}
             </div>
           </CardContent>
         </Card>
       </div>

      {/* Monthly Data Section */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl font-semibold">Datos Mensuales</CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select 
                value={añoSeleccionado.toString()} 
                onValueChange={(value) => setAñoSeleccionado(Number(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((año) => (
                    <SelectItem key={año} value={año.toString()}>
                      {año}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2">
                {meses.map((mes, index) => {
                  const mesNum = index + 1;
                  const isAvailable = availableMonths.includes(mesNum);
                  const isSelected = mesSeleccionado === mesNum;
                  
                  return (
                    <Button
                      key={mes}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      disabled={!isAvailable}
                      onClick={() => setMesSeleccionado(mesNum)}
                      className={isSelected ? "bg-gradient-primary shadow-elegant" : ""}
                    >
                      {mes.slice(0, 3)}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardHeader>
        
         <CardContent>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
             <div className="text-center p-4 rounded-lg bg-accent/30">
               <div className="text-2xl font-bold text-foreground">
                 {dashboardData.mesSeleccionado.totalFacturado.toLocaleString('es-ES', { 
                   style: 'currency', 
                   currency: 'EUR' 
                 })}
               </div>
               <div className="text-sm text-muted-foreground mt-1">Total Facturado</div>
             </div>
             
             <div className="text-center p-4 rounded-lg bg-accent/30">
               <div className="text-2xl font-bold text-foreground">
                 {totalCobradoMes.toLocaleString('es-ES', { 
                   style: 'currency', 
                   currency: 'EUR' 
                 })}
               </div>
               <div className="text-sm text-muted-foreground mt-1">Total Cobrado</div>
             </div>
             
             <div className="text-center p-4 rounded-lg bg-accent/30">
               <div className="text-2xl font-bold text-foreground">
                 {dashboardData.mesSeleccionado.totalPagadoMes.toLocaleString('es-ES', { 
                   style: 'currency', 
                   currency: 'EUR' 
                 })}
               </div>
               <div className="text-sm text-muted-foreground mt-1">Total Pagado</div>
             </div>
             
             <div className="text-center p-4 rounded-lg bg-accent/30">
               <div className="text-2xl font-bold text-foreground">
                 {dashboardData.mesSeleccionado.numeroFacturas}
               </div>
               <div className="text-sm text-muted-foreground mt-1">Número Facturas</div>
             </div>
             
             <div className="text-center p-4 rounded-lg bg-accent/30">
               <div className="text-2xl font-bold text-foreground">
                 {dashboardData.mesSeleccionado.numeroAcciones}
               </div>
               <div className="text-sm text-muted-foreground mt-1">Número de Acciones</div>
             </div>
           </div>
          
          <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="text-center">
              <div className="text-lg font-semibold text-primary">Total Cobrado en {meses[mesSeleccionado - 1]}</div>
              <div className="text-2xl font-bold text-primary mt-1">
                {totalCobradoMes.toLocaleString('es-ES', { 
                  style: 'currency', 
                  currency: 'EUR' 
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}