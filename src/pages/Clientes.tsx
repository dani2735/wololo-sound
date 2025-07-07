import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppStore } from "@/stores/useAppStore";
import { Cliente } from "@/types";
import { Plus, Edit, Trash2, Users, CheckSquare, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { ClienteForm } from "@/components/forms/ClienteForm";
import { ClienteDetailsModal } from "@/components/modals/ClienteDetailsModal";

export default function Clientes() {
  const { clientes, campañas, deleteCliente } = useAppStore();
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const getCampaignCount = (clienteId: string) => {
    return campañas.filter(c => c.clienteId === clienteId).length;
  };

  const getTotalFacturado = (clienteId: string) => {
    return campañas
      .filter(c => c.clienteId === clienteId)
      .reduce((acc, c) => acc + c.precio, 0);
  };

  const handleDelete = (id: string) => {
    const campaignsCount = getCampaignCount(id);
    if (campaignsCount > 0) {
      alert(`No se puede borrar este cliente porque tiene ${campaignsCount} campañas asociadas.`);
      return;
    }
    
    if (confirm("¿Estás seguro de que quieres borrar este cliente?")) {
      deleteCliente(id);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCliente(null);
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
    if (selectedItems.length === clientes.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(clientes.map(c => c.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    
    const clientsWithCampaigns = selectedItems.filter(id => getCampaignCount(id) > 0);
    if (clientsWithCampaigns.length > 0) {
      alert(`No se pueden borrar algunos clientes porque tienen campañas asociadas.`);
      return;
    }
    
    if (confirm(`¿Estás seguro de que quieres borrar ${selectedItems.length} clientes?`)) {
      selectedItems.forEach(id => deleteCliente(id));
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

  const sortedClientes = clientes.sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue: any = a[sortField as keyof Cliente];
    let bValue: any = b[sortField as keyof Cliente];
    
    if (sortField === "totalFacturado") {
      aValue = getTotalFacturado(a.id);
      bValue = getTotalFacturado(b.id);
    } else if (sortField === "numCampañas") {
      aValue = getCampaignCount(a.id);
      bValue = getCampaignCount(b.id);
    }
    
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">
            Gestión de la base de datos de clientes
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
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Statistics Card */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total Clientes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{clientes.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Clientes registrados en el sistema
          </p>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {selectionMode && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedItems.length === clientes.length && clientes.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                  )}
                   <TableHead>
                     <Button 
                       variant="ghost" 
                       className="h-auto p-0 font-medium hover:bg-transparent"
                       onClick={() => handleSort("nombre")}
                     >
                       Cliente
                       {getSortIcon("nombre")}
                     </Button>
                   </TableHead>
                   <TableHead>
                     <Button 
                       variant="ghost" 
                       className="h-auto p-0 font-medium hover:bg-transparent"
                       onClick={() => handleSort("nombrePagador")}
                     >
                       Nombre Pagador
                       {getSortIcon("nombrePagador")}
                     </Button>
                   </TableHead>
                   <TableHead>
                     <Button 
                       variant="ghost" 
                       className="h-auto p-0 font-medium hover:bg-transparent"
                       onClick={() => handleSort("nif")}
                     >
                       NIF
                       {getSortIcon("nif")}
                     </Button>
                   </TableHead>
                   <TableHead>Dirección</TableHead>
                   <TableHead>
                     <Button 
                       variant="ghost" 
                       className="h-auto p-0 font-medium hover:bg-transparent"
                       onClick={() => handleSort("numCampañas")}
                     >
                       Campañas
                       {getSortIcon("numCampañas")}
                     </Button>
                   </TableHead>
                   <TableHead>
                     <Button 
                       variant="ghost" 
                       className="h-auto p-0 font-medium hover:bg-transparent"
                       onClick={() => handleSort("totalFacturado")}
                     >
                       Total Facturado
                       {getSortIcon("totalFacturado")}
                     </Button>
                   </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedClientes.map((cliente) => (
                  <TableRow 
                    key={cliente.id} 
                    className="hover:bg-accent/50 cursor-pointer"
                    onClick={(e) => {
                      if (selectionMode) {
                        e.stopPropagation();
                        handleSelectItem(cliente.id);
                      } else {
                        setSelectedCliente(cliente);
                      }
                    }}
                  >
                    {selectionMode && (
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(cliente.id)}
                          onCheckedChange={() => handleSelectItem(cliente.id)}
                        />
                      </TableCell>
                    )}
                    <TableCell className="font-medium">{cliente.nombre}</TableCell>
                    <TableCell>{cliente.nombrePagador}</TableCell>
                    <TableCell className="font-mono">{cliente.nif}</TableCell>
                    <TableCell className="max-w-48">
                      <div className="truncate" title={cliente.direccion}>
                        {cliente.direccion}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{getCampaignCount(cliente.id)}</span>
                        <span className="text-xs text-muted-foreground">campañas</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-primary">
                      {getTotalFacturado(cliente.id).toLocaleString('es-ES', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {clientes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No hay clientes registrados. ¡Agrega tu primer cliente!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedCliente && (
        <ClienteDetailsModal
          cliente={selectedCliente}
          onClose={() => setSelectedCliente(null)}
          onEdit={(cliente) => {
            setSelectedCliente(null);
            handleEdit(cliente);
          }}
          onDelete={(id) => {
            handleDelete(id);
            setSelectedCliente(null);
          }}
        />
      )}

      <ClienteForm 
        isOpen={showForm}
        onClose={handleCloseForm}
        cliente={editingCliente || undefined}
      />
    </div>
  );
}