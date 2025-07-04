import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/stores/useAppStore";
import { Factura } from "@/types";
import { Plus, Edit, Trash2, FileText, Euro } from "lucide-react";

export default function Facturacion() {
  const { facturas, clientes, deleteFactura } = useAppStore();
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>("todas");

  const filteredFacturas = facturas.filter(factura => {
    if (filtroEstado === "cobradas") return factura.estadoCobro === "Cobrado";
    if (filtroEstado === "pendientes") return factura.estadoCobro === "Sin cobrar";
    return true;
  });

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || "Cliente no encontrado";
  };

  const getEstadoBadgeVariant = (estado: string) => {
    return estado === "Cobrado" ? "default" : "destructive";
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres borrar esta factura?")) {
      deleteFactura(id);
    }
  };

  // Calculate totals
  const totalFacturado = filteredFacturas.reduce((acc, f) => acc + f.precio + f.iva, 0);
  const totalCobrado = filteredFacturas
    .filter(f => f.estadoCobro === "Cobrado")
    .reduce((acc, f) => acc + f.precio + f.iva, 0);
  const totalPendiente = filteredFacturas
    .filter(f => f.estadoCobro === "Sin cobrar")
    .reduce((acc, f) => acc + f.precio + f.iva, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Facturación</h1>
          <p className="text-muted-foreground">
            Gestión y seguimiento de todas las facturas
          </p>
        </div>
        
        <Button className="bg-gradient-primary shadow-elegant hover:shadow-hover">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Factura
        </Button>
      </div>

      {/* Filter and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-foreground">Filtrar por estado:</label>
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="cobradas">Cobradas</SelectItem>
              <SelectItem value="pendientes">Pendientes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Facturado</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {totalFacturado.toLocaleString('es-ES', { 
                style: 'currency', 
                currency: 'EUR' 
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredFacturas.length} facturas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-primary text-primary-foreground shadow-elegant border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cobrado</CardTitle>
            <Euro className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCobrado.toLocaleString('es-ES', { 
                style: 'currency', 
                currency: 'EUR' 
              })}
            </div>
            <p className="text-xs mt-1">
              {filteredFacturas.filter(f => f.estadoCobro === "Cobrado").length} facturas cobradas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pendiente de Cobro</CardTitle>
            <Euro className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {totalPendiente.toLocaleString('es-ES', { 
                style: 'currency', 
                currency: 'EUR' 
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredFacturas.filter(f => f.estadoCobro === "Sin cobrar").length} facturas pendientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle>Lista de Facturas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha Facturación</TableHead>
                  <TableHead>Referencia</TableHead>
                  <TableHead>Pagador</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Detalles</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>IVA</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado Cobro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFacturas.map((factura) => (
                  <TableRow 
                    key={factura.id} 
                    className="hover:bg-accent/50 cursor-pointer"
                    onClick={() => setSelectedFactura(factura)}
                  >
                    <TableCell>
                      {new Date(factura.fecha).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell className="font-mono font-medium">
                      {factura.referencia}
                    </TableCell>
                    <TableCell>{factura.nombrePagador}</TableCell>
                    <TableCell>{getClienteName(factura.clienteId)}</TableCell>
                    <TableCell className="max-w-32">
                      <div className="truncate" title={factura.datosAcciones}>
                        {factura.datosAcciones}
                      </div>
                    </TableCell>
                    <TableCell>
                      {factura.precio.toLocaleString('es-ES', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </TableCell>
                    <TableCell>
                      {factura.iva.toLocaleString('es-ES', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </TableCell>
                    <TableCell className="font-bold">
                      {(factura.precio + factura.iva).toLocaleString('es-ES', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getEstadoBadgeVariant(factura.estadoCobro)}>
                        {factura.estadoCobro}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {factura.estadoCobro === "Sin cobrar" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Open cobro modal
                            }}
                          >
                            Cobrar
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Open edit modal
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(factura.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredFacturas.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {filtroEstado === "todas" 
                  ? "No hay facturas registradas." 
                  : `No hay facturas ${filtroEstado === "cobradas" ? "cobradas" : "pendientes"}.`
                }
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}