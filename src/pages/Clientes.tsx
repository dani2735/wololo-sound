import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppStore } from "@/stores/useAppStore";
import { Cliente } from "@/types";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { ClienteForm } from "@/components/forms/ClienteForm";
import { ClienteDetailsModal } from "@/components/modals/ClienteDetailsModal";

export default function Clientes() {
  const { clientes, campañas, deleteCliente } = useAppStore();
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

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
        
        <Button 
          className="bg-gradient-primary shadow-elegant hover:shadow-hover"
          onClick={() => setShowForm(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
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
                  <TableHead>Cliente</TableHead>
                  <TableHead>Nombre Pagador</TableHead>
                  <TableHead>NIF</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Campañas</TableHead>
                  <TableHead>Total Facturado</TableHead>
                  
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow 
                    key={cliente.id} 
                    className="hover:bg-accent/50 cursor-pointer"
                    onClick={() => setSelectedCliente(cliente)}
                  >
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