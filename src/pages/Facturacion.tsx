import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFacturas } from "@/hooks/useFacturas";
import { useClientes } from "@/hooks/useClientes";
import { Tables } from "@/integrations/supabase/types";
import { Plus, Edit, Trash2, FileText, Euro, CheckSquare, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
// TODO: Implement FacturaForm and FacturaDetailsModal for new schema

type Factura = Tables<'facturas'>;

export default function Facturacion() {
  const { facturas, loading, deleteFactura } = useFacturas();
  const { clientes } = useClientes();
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>("todas");
  const [showForm, setShowForm] = useState(false);
  const [editingFactura, setEditingFactura] = useState<Factura | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [baseFacturas] = useState(facturas); // Keep original list for stats
  
  const filteredFacturas = facturas.filter(factura => {
    if (filtroEstado === "cobradas") return factura.estado_cobro === "Cobrado";
    if (filtroEstado === "pendientes") return factura.estado_cobro === "Sin cobrar";
    return true;
  });

  const getClienteName = (clienteId: string | null) => {
    if (!clienteId) return "Sin cliente";
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || "Cliente no encontrado";
  };

  const getEstadoBadgeVariant = (estado: string | null) => {
    return estado === "Cobrado" ? "default" : "destructive";
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres borrar esta factura?")) {
      await deleteFactura(id);
    }
  };

  const handleEdit = (factura: Factura) => {
    setEditingFactura(factura);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingFactura(null);
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
    if (selectedItems.length === filteredFacturas.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFacturas.map(f => f.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    
    if (confirm(`¿Estás seguro de que quieres borrar ${selectedItems.length} facturas?`)) {
      for (const id of selectedItems) {
        await deleteFactura(id);
      }
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

  const sortedFacturas = filteredFacturas.sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue: any = a[sortField as keyof Factura];
    let bValue: any = b[sortField as keyof Factura];
    
    if (sortField === "id_campana") {
      aValue = ""; // TODO: Get client name from campaign
      bValue = ""; // TODO: Get client name from campaign 
    } else if (sortField === "total") {
      aValue = (a.precio || 0) + (a.iva || 0);
      bValue = (b.precio || 0) + (b.iva || 0);
    }
    
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Cálculos para las tarjetas de resumen (always use all invoices)
  const totalFacturado = baseFacturas.reduce((acc, factura) => acc + (factura.precio || 0) + (factura.iva || 0), 0);
  const totalCobrado = baseFacturas.filter(f => f.estado_cobro === "Cobrado").reduce((acc, factura) => acc + (factura.precio || 0) + (factura.iva || 0), 0);
  const pendienteCobro = baseFacturas.filter(f => f.estado_cobro === "Sin cobrar").reduce((acc, factura) => acc + (factura.precio || 0) + (factura.iva || 0), 0);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">Cargando facturas...</p>
        </div>
      </div>
    );
  }

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
        
        <div className="flex gap-2">
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
            className="bg-gradient-primary shadow-elegant hover:shadow-hover"
            onClick={() => setShowForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva Factura
          </Button>
        </div>
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
        <Card 
          className={`bg-gradient-card shadow-card border-2 border-primary cursor-pointer transition-all hover:shadow-hover ${filtroEstado === "todas" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setFiltroEstado("todas")}
        >
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
              {facturas.length} facturas
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`bg-gradient-card shadow-card border-2 border-success cursor-pointer transition-all hover:shadow-hover ${filtroEstado === "cobradas" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setFiltroEstado("cobradas")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Cobrado</CardTitle>
            <Euro className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {totalCobrado.toLocaleString('es-ES', { 
                style: 'currency', 
                currency: 'EUR' 
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {facturas.filter(f => f.estado_cobro === "Cobrado").length} facturas cobradas
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`bg-gradient-card shadow-card border-2 border-warning cursor-pointer transition-all hover:shadow-hover ${filtroEstado === "pendientes" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setFiltroEstado("pendientes")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pendiente de Cobro</CardTitle>
            <Euro className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {pendienteCobro.toLocaleString('es-ES', { 
                style: 'currency', 
                currency: 'EUR' 
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {facturas.filter(f => f.estado_cobro === "Sin cobrar").length} facturas pendientes
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
                  {selectionMode && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedItems.length === filteredFacturas.length && filteredFacturas.length > 0}
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
                       Fecha Facturación
                       {getSortIcon("fecha")}
                     </Button>
                   </TableHead>
                   <TableHead>
                     <Button 
                       variant="ghost" 
                       className="h-auto p-0 font-medium hover:bg-transparent"
                       onClick={() => handleSort("referencia")}
                     >
                       Referencia
                       {getSortIcon("referencia")}
                     </Button>
                   </TableHead>
                   <TableHead>Cliente</TableHead>
                   
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
                   <TableHead>
                     <Button 
                       variant="ghost" 
                       className="h-auto p-0 font-medium hover:bg-transparent"
                       onClick={() => handleSort("iva")}
                     >
                       IVA
                       {getSortIcon("iva")}
                     </Button>
                   </TableHead>
                   <TableHead>
                     <Button 
                       variant="ghost" 
                       className="h-auto p-0 font-medium hover:bg-transparent"
                       onClick={() => handleSort("total")}
                     >
                       Total
                       {getSortIcon("total")}
                     </Button>
                   </TableHead>
                   <TableHead>
                     <Button 
                       variant="ghost" 
                       className="h-auto p-0 font-medium hover:bg-transparent"
                       onClick={() => handleSort("estado_cobro")}
                     >
                       Estado Cobro
                       {getSortIcon("estado_cobro")}
                     </Button>
                   </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedFacturas.map((factura) => (
                  <TableRow 
                    key={factura.id} 
                    className="hover:bg-accent/50 cursor-pointer"
                    onClick={(e) => {
                      if (selectionMode) {
                        e.stopPropagation();
                        handleSelectItem(factura.id);
                      } else {
                        setSelectedFactura(factura);
                      }
                    }}
                  >
                    {selectionMode && (
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(factura.id)}
                          onCheckedChange={() => handleSelectItem(factura.id)}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      {factura.fecha ? new Date(factura.fecha).toLocaleDateString('es-ES') : 'Sin fecha'}
                    </TableCell>
                    <TableCell className="font-mono font-medium">
                      {factura.referencia || 'Sin referencia'}
                    </TableCell>
                    <TableCell>{getClienteName(factura.id_campana)}</TableCell>
                    <TableCell>
                      {(factura.precio || 0).toLocaleString('es-ES', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </TableCell>
                    <TableCell>
                      {(factura.iva || 0).toLocaleString('es-ES', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </TableCell>
                    <TableCell className="font-bold">
                      {((factura.precio || 0) + (factura.iva || 0)).toLocaleString('es-ES', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getEstadoBadgeVariant(factura.estado_cobro)}>
                        {factura.estado_cobro || "Sin estado"}
                      </Badge>
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

      {/* TODO: Implement FacturaDetailsModal and FacturaForm for new schema */}
      {selectedFactura && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-elegant max-w-md w-full p-6">
            <h3 className="font-semibold mb-4">Detalles de Factura</h3>
            <p className="mb-4">Referencia: {selectedFactura.referencia}</p>
            <Button onClick={() => setSelectedFactura(null)}>Cerrar</Button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-elegant max-w-md w-full p-6">
            <h3 className="font-semibold mb-4">Formulario de Factura</h3>
            <p className="mb-4">Funcionalidad pendiente de implementar</p>
            <Button onClick={handleCloseForm}>Cerrar</Button>
          </div>
        </div>
      )}
    </div>
  );
}