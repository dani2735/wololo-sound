import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppStore } from "@/stores/useAppStore";
import { MovimientoContable } from "@/types";
import { Plus, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Contabilidad() {
  const location = useLocation();
  const { movimientos, clientes, deleteMovimiento } = useAppStore();
  const [selectedMovimiento, setSelectedMovimiento] = useState<MovimientoContable | null>(null);

  // Determine which account to show based on route
  const isShowingAll = location.pathname === "/contabilidad";
  const isShowingSL = location.pathname === "/contabilidad/cuenta-sl";
  const isShowingPaypal = location.pathname === "/contabilidad/cuenta-paypal";

  const filteredMovimientos = movimientos.filter(movimiento => {
    if (isShowingSL) return movimiento.cuenta === "Cuenta SL";
    if (isShowingPaypal) return movimiento.cuenta === "Paypal";
    return true; // Show all for main contabilidad page
  });

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || "Cliente no encontrado";
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === "cobro" ? (
      <TrendingUp className="h-4 w-4 text-success" />
    ) : (
      <TrendingDown className="h-4 w-4 text-destructive" />
    );
  };

  const getTipoBadgeVariant = (tipo: string) => {
    return tipo === "cobro" ? "default" : "destructive";
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres borrar este movimiento?")) {
      deleteMovimiento(id);
    }
  };

  // Calculate totals
  const totalCobros = filteredMovimientos
    .filter(m => m.tipo === "cobro")
    .reduce((acc, m) => acc + m.precio, 0);
    
  const totalPagos = filteredMovimientos
    .filter(m => m.tipo === "pago")
    .reduce((acc, m) => acc + m.precio, 0);
    
  const balance = totalCobros - totalPagos;

  const getPageTitle = () => {
    if (isShowingSL) return "Cuenta SL";
    if (isShowingPaypal) return "Cuenta Paypal";
    return "Contabilidad General";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{getPageTitle()}</h1>
          <p className="text-muted-foreground">
            Gestión de movimientos contables y balances
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="shadow-card">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Pago
          </Button>
          <Button className="bg-gradient-primary shadow-elegant hover:shadow-hover">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cobro
          </Button>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Cobros</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {totalCobros.toLocaleString('es-ES', { 
                style: 'currency', 
                currency: 'EUR' 
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Pagos</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {totalPagos.toLocaleString('es-ES', { 
                style: 'currency', 
                currency: 'EUR' 
              })}
            </div>
          </CardContent>
        </Card>

        <Card className={`shadow-elegant border-0 ${balance >= 0 ? 'bg-gradient-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            {balance >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balance.toLocaleString('es-ES', { 
                style: 'currency', 
                currency: 'EUR' 
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Movements Table */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle>Movimientos Contables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Pagador</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Precio</TableHead>
                  {isShowingAll && <TableHead>Cuenta</TableHead>}
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovimientos.map((movimiento) => (
                  <TableRow 
                    key={movimiento.id} 
                    className="hover:bg-accent/50 cursor-pointer"
                    onClick={() => setSelectedMovimiento(movimiento)}
                  >
                    <TableCell>
                      {new Date(movimiento.fecha).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTipoIcon(movimiento.tipo)}
                        <Badge variant={getTipoBadgeVariant(movimiento.tipo)}>
                          {movimiento.tipo.charAt(0).toUpperCase() + movimiento.tipo.slice(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{movimiento.pagador}</TableCell>
                    <TableCell>{getClienteName(movimiento.clienteId)}</TableCell>
                    <TableCell className={`font-bold ${movimiento.tipo === 'cobro' ? 'text-success' : 'text-destructive'}`}>
                      {movimiento.tipo === 'cobro' ? '+' : '-'}
                      {movimiento.precio.toLocaleString('es-ES', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </TableCell>
                    {isShowingAll && (
                      <TableCell>
                        <Badge variant="outline">{movimiento.cuenta}</Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex space-x-2">
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
                            handleDelete(movimiento.id);
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
            
            {filteredMovimientos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No hay movimientos registrados en esta cuenta.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}