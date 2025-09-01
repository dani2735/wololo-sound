import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, Plus, Euro, TrendingUp, Calendar, Clock } from "lucide-react";
import { usePagosAna } from "@/hooks/usePagosAna";
import { PagoAnaForm } from "@/components/forms/PagoAnaForm";

export default function Colaboradores() {
  const { campanasPendientesPago, pagosAna, loading, asociarCampanasAPago } = usePagosAna();
  const [showForm, setShowForm] = useState(false);
  const [selectedCampanas, setSelectedCampanas] = useState<string[]>([]);

  const totalPendiente = campanasPendientesPago.reduce((sum, campana) => sum + (campana.cobro_ana || 0), 0);
  const totalPagado = pagosAna.reduce((sum, pago) => sum + (pago.importe || 0), 0);
  const campanasConPagoPendiente = campanasPendientesPago.filter(c => c.estado_pago_ana === 'Pendiente').length;

  const handleAsociarCampanas = async (pagoId: string) => {
    if (selectedCampanas.length === 0) return;
    await asociarCampanasAPago(pagoId, selectedCampanas);
    setSelectedCampanas([]);
  };

  const toggleCampanaSelection = (campanaId: string) => {
    setSelectedCampanas(prev => 
      prev.includes(campanaId) 
        ? prev.filter(id => id !== campanaId)
        : [...prev, campanaId]
    );
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return <Badge variant="destructive">{estado}</Badge>;
      case 'Pagado':
        return <Badge variant="default">{estado}</Badge>;
      case 'N/A':
        return <Badge variant="secondary">{estado}</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">Cargando datos de colaboradores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pagos a Ana</h1>
          <p className="text-muted-foreground">
            Gestión de pagos a colaboradores por campañas
          </p>
        </div>
        
        <Button 
          className="bg-gradient-primary shadow-elegant hover:shadow-hover"
          onClick={() => setShowForm(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Registrar Pago
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Pendiente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {totalPendiente.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Pagado</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {totalPagado.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Campañas Pendientes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {campanasConPagoPendiente}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pagos Realizados</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {pagosAna.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="campanas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campanas">Campañas Pendientes</TabsTrigger>
          <TabsTrigger value="pagos">Historial de Pagos</TabsTrigger>
          <TabsTrigger value="asociar">Asociar Campañas</TabsTrigger>
        </TabsList>

        <TabsContent value="campanas" className="space-y-4">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle>Campañas con Pago Pendiente a Ana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Precio Total</TableHead>
                      <TableHead>Cobro Ana</TableHead>
                      <TableHead>Estado Pago</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campanasPendientesPago.map((campana) => (
                      <TableRow key={campana.id}>
                        <TableCell>
                          {campana.fecha ? new Date(campana.fecha).toLocaleDateString('es-ES') : '-'}
                        </TableCell>
                        <TableCell className="font-medium">{campana.id_cliente}</TableCell>
                        <TableCell className="font-bold">
                          {(campana.precio || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </TableCell>
                        <TableCell className="font-bold text-primary">
                          {(campana.cobro_ana || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </TableCell>
                        <TableCell>
                          {getEstadoBadge(campana.estado_pago_ana || 'N/A')}
                        </TableCell>
                        <TableCell>{campana.acciones}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {campanasPendientesPago.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay campañas con pagos pendientes a Ana
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagos" className="space-y-4">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle>Historial de Pagos a Ana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Importe</TableHead>
                      <TableHead>Referencia</TableHead>
                      <TableHead>Modalidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagosAna.map((pago) => (
                      <TableRow key={pago.id}>
                        <TableCell>
                          {pago.fecha ? new Date(pago.fecha).toLocaleDateString('es-ES') : '-'}
                        </TableCell>
                        <TableCell className="font-bold text-primary">
                          {(pago.importe || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </TableCell>
                        <TableCell>{pago.referencia}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{pago.modalidad}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {pagosAna.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay pagos registrados
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="asociar" className="space-y-4">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle>Asociar Campañas a Pagos</CardTitle>
              <p className="text-sm text-muted-foreground">
                Selecciona las campañas y el pago para asociarlas
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Campañas Disponibles</h4>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {campanasPendientesPago.map((campana) => (
                      <div key={campana.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`campana-${campana.id}`}
                          checked={selectedCampanas.includes(campana.id)}
                          onChange={() => toggleCampanaSelection(campana.id)}
                          className="rounded"
                        />
                        <label htmlFor={`campana-${campana.id}`} className="text-sm">
                          {campana.id_cliente} - {(campana.cobro_ana || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedCampanas.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Pagos Disponibles</h4>
                    <div className="space-y-2">
                      {pagosAna.map((pago) => (
                        <Button
                          key={pago.id}
                          variant="outline"
                          onClick={() => handleAsociarCampanas(pago.id)}
                          className="w-full justify-start"
                        >
                          {pago.fecha ? new Date(pago.fecha).toLocaleDateString('es-ES') : 'Sin fecha'} - 
                          {(pago.importe || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PagoAnaForm 
        isOpen={showForm}
        onClose={() => setShowForm(false)}
      />
    </div>
  );
}