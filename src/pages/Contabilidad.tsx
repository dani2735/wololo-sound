import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppStore } from "@/stores/useAppStore";
import { MovimientoContable, TipoMovimiento } from "@/types";
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, CheckSquare, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { MovimientoForm } from "@/components/forms/MovimientoForm";
import { MovimientoDetailsModal } from "@/components/modals/MovimientoDetailsModal";

export default function Contabilidad() {
  const location = useLocation();
  const { movimientos, clientes, deleteMovimiento } = useAppStore();
  const [selectedMovimiento, setSelectedMovimiento] = useState<MovimientoContable | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMovimiento, setEditingMovimiento] = useState<MovimientoContable | null>(null);
  const [formTipo, setFormTipo] = useState<TipoMovimiento>("cobro");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filtroEstado, setFiltroEstado] = useState<string>("");

  // Determine which account to show based on route
  const isShowingAll = location.pathname === "/contabilidad";
  const isShowingSL = location.pathname === "/contabilidad/cuenta-sl";
  const isShowingPaypal = location.pathname === "/contabilidad/cuenta-paypal";

  const filteredMovimientos = movimientos.filter(movimiento => {
    if (isShowingSL) return movimiento.cuenta === "Cuenta SL";
    if (isShowingPaypal) return movimiento.cuenta === "Paypal";
    if (filtroEstado === "cobros") return movimiento.tipo === "cobro";
    if (filtroEstado === "pagos") return movimiento.tipo === "pago";
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

  const handleEdit = (movimiento: MovimientoContable) => {
    setEditingMovimiento(movimiento);
    setFormTipo(movimiento.tipo);
    setShowForm(true);
  };

  const handleNewMovimiento = (tipo: TipoMovimiento) => {
    setEditingMovimiento(null);
    setFormTipo(tipo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMovimiento(null);
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedItems([]);
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredMovimientos.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredMovimientos.map(m => m.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    
    if (confirm(`¿Estás seguro de que quieres borrar ${selectedItems.length} movimientos?`)) {
      selectedItems.forEach(id => deleteMovimiento(id));
      setSelectedItems([]);
      setSelectionMode(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const sortedMovimientos = filteredMovimientos.sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue: any = a[sortField as keyof MovimientoContable];
    let bValue: any = b[sortField as keyof MovimientoContable];
    
    if (sortField === "clienteId") {
      aValue = getClienteName(a.clienteId);
      bValue = getClienteName(b.clienteId);
    }
    
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Calculate totals (always from all movements, not filtered)
  const allMovimientos = movimientos.filter(movimiento => {
    if (isShowingSL) return movimiento.cuenta === "Cuenta SL";
    if (isShowingPaypal) return movimiento.cuenta === "Paypal";
    return true; // Show all for main contabilidad page
  });
  
  const totalCobros = allMovimientos
    .filter(m => m.tipo === "cobro")
    .reduce((acc, m) => acc + m.precio, 0);
    
  const totalPagos = allMovimientos
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
          <Button 
            variant="outline"
            className="shadow-card"
            onClick={toggleSelectionMode}
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            {selectionMode ? "Cancelar" : "Seleccionar"}
          </Button>
          
          {selectionMode && selectedItems.length > 0 && (
            <Button 
              variant="destructive"
              onClick={handleDeleteSelected}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Borrar ({selectedItems.length})
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="shadow-card"
            onClick={() => handleNewMovimiento("pago")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Pago
          </Button>
          <Button 
            className="bg-gradient-primary shadow-elegant hover:shadow-hover"
            onClick={() => handleNewMovimiento("cobro")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cobro
          </Button>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className={`shadow-elegant border-0 cursor-pointer transition-all hover:shadow-hover ${balance >= 0 ? 'bg-gradient-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'}`}
          onClick={() => setFiltroEstado("")}
        >
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

        <Card 
          className="bg-gradient-card shadow-card border-0 cursor-pointer transition-all hover:shadow-hover"
          onClick={() => setFiltroEstado("cobros")}
        >
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

        <Card 
          className="bg-gradient-card shadow-card border-0 cursor-pointer transition-all hover:shadow-hover"
          onClick={() => setFiltroEstado("pagos")}
        >
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
                  {selectionMode && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedItems.length === filteredMovimientos.length && filteredMovimientos.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                  )}
                   <TableHead>
                     <Button 
                       variant="ghost" 
                       className="h-auto p-0 font-medium hover:bg-transparent"
                       onClick={() => handleSort("fecha")}
                     >
                       Fecha
                       {getSortIcon("fecha")}
                     </Button>
                   </TableHead>
                   <TableHead>
                     <Button 
                       variant="ghost" 
                       className="h-auto p-0 font-medium hover:bg-transparent"
                       onClick={() => handleSort("tipo")}
                     >
                       Tipo
                       {getSortIcon("tipo")}
                     </Button>
                   </TableHead>
                   <TableHead>
                     <Button 
                       variant="ghost" 
                       className="h-auto p-0 font-medium hover:bg-transparent"
                       onClick={() => handleSort("pagador")}
                     >
                       Pagador
                       {getSortIcon("pagador")}
                     </Button>
                   </TableHead>
                   <TableHead>
                     <Button 
                       variant="ghost" 
                       className="h-auto p-0 font-medium hover:bg-transparent"
                       onClick={() => handleSort("clienteId")}
                     >
                       Cliente
                       {getSortIcon("clienteId")}
                     </Button>
                   </TableHead>
                   <TableHead>
                     <Button 
                       variant="ghost" 
                       className="h-auto p-0 font-medium hover:bg-transparent"
                       onClick={() => handleSort("precio")}
                     >
                       Precio
                       {getSortIcon("precio")}
                     </Button>
                   </TableHead>
                   {isShowingAll && (
                   <TableHead>
                      <Button 
                        variant="ghost" 
                        className="h-auto p-0 font-medium hover:bg-transparent"
                        onClick={() => handleSort("cuenta")}
                      >
                        Cuenta
                        {getSortIcon("cuenta")}
                      </Button>
                    </TableHead>
                  )}
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("detalles")}
                    >
                      Detalles
                      {getSortIcon("detalles")}
                    </Button>
                  </TableHead>
                   <TableHead>Tipo de Cobro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMovimientos.map((movimiento) => (
                  <TableRow 
                    key={movimiento.id} 
                    className="hover:bg-accent/50 cursor-pointer"
                    onClick={(e) => {
                      if (selectionMode) {
                        e.stopPropagation();
                        handleSelectItem(movimiento.id);
                      } else {
                        setSelectedMovimiento(movimiento);
                      }
                    }}
                  >
                    {selectionMode && (
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(movimiento.id)}
                          onCheckedChange={() => handleSelectItem(movimiento.id)}
                        />
                      </TableCell>
                    )}
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
                     <TableCell className="max-w-xs truncate">
                       {movimiento.detalles || '-'}
                     </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {(() => {
                            // Get tipo cobro from related campaña if available
                            const { campañas } = useAppStore.getState();
                            const relacionCampaña = campañas.find(c => c.referenciaFactura === movimiento.referenciaFactura);
                            return relacionCampaña?.tipoCobro || 'No especificado';
                          })()}
                        </Badge>
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {sortedMovimientos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No hay movimientos registrados en esta cuenta.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedMovimiento && (
        <MovimientoDetailsModal
          movimiento={selectedMovimiento}
          onClose={() => setSelectedMovimiento(null)}
          onEdit={(movimiento) => {
            setSelectedMovimiento(null);
            handleEdit(movimiento);
          }}
          onDelete={(id) => {
            handleDelete(id);
            setSelectedMovimiento(null);
          }}
        />
      )}

      <MovimientoForm 
        isOpen={showForm}
        onClose={handleCloseForm}
        tipo={formTipo}
        movimiento={editingMovimiento || undefined}
      />
    </div>
  );
}