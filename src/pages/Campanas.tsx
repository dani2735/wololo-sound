import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortableTable } from "@/components/ui/sortable-table";
import { Checkbox } from "@/components/ui/checkbox";
import { useCampanas, CampanaPrensa } from "@/hooks/useCampanas";
import { useClientes } from "@/hooks/useClientes";
import { Plus, Edit, Trash2, Receipt, CheckSquare, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export default function Campanas() {
  const { campanas, loading: campanasLoading, deleteCampana } = useCampanas();
  const { clientes, loading: clientesLoading } = useClientes();
  const [selectedCampaña, setSelectedCampaña] = useState<CampanaPrensa | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCampaña, setEditingCampaña] = useState<CampanaPrensa | null>(null);
  const [showFacturaForm, setShowFacturaForm] = useState(false);
  const [facturandoCampaña, setFacturandoCampaña] = useState<CampanaPrensa | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [columnOrder, setColumnOrder] = useState<string[]>([
    'fecha', 'cliente', 'detalles', 'estado', 'tipoCobro', 'precio', 'estadoFacturacion'
  ]);
  const [filtroEstado, setFiltroEstado] = useState<string>("");

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || "Cliente no encontrado";
  };

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "TERMINADO":
        return "default";
      case "EN CURSO":
        return "secondary";
      case "PENDIENTE":
        return "outline";
      default:
        return "outline";
    }
  };

  const getCobroBadgeVariant = (estado: string) => {
    return estado === "Cobrado" ? "default" : "destructive";
  };

  const formatAcciones = (acciones: any) => {
    if (!acciones) return "";
    if (typeof acciones === 'string') return acciones;
    if (Array.isArray(acciones)) return acciones.join(', ');
    return JSON.stringify(acciones);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres borrar esta campaña?")) {
      deleteCampana(id);
    }
  };

  const handleEdit = (campaña: CampanaPrensa) => {
    setEditingCampaña(campaña);
    setShowForm(true);
  };

  const handleFacturar = (campaña: CampanaPrensa) => {
    setFacturandoCampaña(campaña);
    setShowFacturaForm(true);
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
    if (selectedItems.length === filteredAndSortedCampañas.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredAndSortedCampañas.map(c => c.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    
    if (confirm("¿Estás seguro de que quieres borrar las campañas seleccionadas?")) {
      selectedItems.forEach(id => deleteCampana(id));
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

  const filteredAndSortedCampañas = campanas
    .filter(campaña => {
      if (!filtroEstado) return true;
      return campaña.estado_campana === filtroEstado;
    })
    .sort((a, b) => {
      if (!sortField) return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      
      let aValue = a[sortField as keyof CampanaPrensa];
      let bValue = b[sortField as keyof CampanaPrensa];
      
      if (sortField === 'cliente') {
        aValue = getClienteName(a.id_cliente);
        bValue = getClienteName(b.id_cliente);
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  // Calcular estadísticas
  const totalCampañas = campanas.length;
  const enCurso = campanas.filter(c => c.estado_campana === "EN CURSO").length;
  const terminadas = campanas.filter(c => c.estado_campana === "TERMINADO").length;
  const pendienteFactura = campanas.filter(c => c.estado_facturacion === "Pendiente").length;
  const pendientePago = campanas.filter(c => c.estado_cobro === "Sin cobrar").length;

  if (campanasLoading || clientesLoading) {
    return <div>Cargando campañas...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campañas de Prensa</h1>
          <p className="text-muted-foreground">
            Gestión y seguimiento de todas las campañas de prensa
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
            Nueva Campaña
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalCampañas}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">En Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{enCurso}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Terminadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{terminadas}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pend. Factura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{pendienteFactura}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pend. Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{pendientePago}</div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle>Lista de Campañas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {selectionMode && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedItems.length === filteredAndSortedCampañas.length && filteredAndSortedCampañas.length > 0}
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
                      Fecha Creación
                      {getSortIcon("fecha")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("cliente")}
                    >
                      Cliente
                      {getSortIcon("cliente")}
                    </Button>
                  </TableHead>
                  <TableHead>Acciones</TableHead>
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
                  <TableHead>Estado</TableHead>
                  <TableHead>Tipo Cobro</TableHead>
                  <TableHead>Estado Facturación</TableHead>
                  <TableHead>Estado Cobro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedCampañas.map((campaña) => (
                  <TableRow 
                    key={campaña.id} 
                    className="hover:bg-accent/50 cursor-pointer"
                    onClick={(e) => {
                      if (selectionMode) {
                        e.stopPropagation();
                        handleSelectItem(campaña.id);
                      } else {
                        setSelectedCampaña(campaña);
                      }
                    }}
                  >
                    {selectionMode && (
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(campaña.id)}
                          onCheckedChange={() => handleSelectItem(campaña.id)}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      {new Date(campaña.fecha).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>{getClienteName(campaña.id_cliente)}</TableCell>
                    <TableCell>{formatAcciones(campaña.acciones)}</TableCell>
                    <TableCell>
                      {campaña.precio.toLocaleString('es-ES', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getEstadoBadgeVariant(campaña.estado_campana)}>
                        {campaña.estado_campana}
                      </Badge>
                    </TableCell>
                    <TableCell>{campaña.tipo_cobro}</TableCell>
                    <TableCell>
                      <Badge variant={campaña.estado_facturacion === "Facturado" ? "default" : "destructive"}>
                        {campaña.estado_facturacion}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getCobroBadgeVariant(campaña.estado_cobro)}>
                        {campaña.estado_cobro}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFacturar(campaña);
                          }}
                        >
                          <Receipt className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(campaña);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(campaña.id);
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
            
            {filteredAndSortedCampañas.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No hay campañas que coincidan con los filtros aplicados.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals temporalmente deshabilitados por conflictos de tipos */}
      {/* {selectedCampaña && <CampañaDetailsModal.../>} */}
      {/* <CampañaForm .../> */}
      {/* <FacturaForm .../> */}
    </div>
  );
}