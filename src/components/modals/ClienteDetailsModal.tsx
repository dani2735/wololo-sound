import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Users, FileText } from "lucide-react";
import { Cliente } from "@/types";
import { useAppStore } from "@/stores/useAppStore";

interface ClienteDetailsModalProps {
  cliente: Cliente;
  onClose: () => void;
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: string) => void;
}

export function ClienteDetailsModal({ cliente, onClose, onEdit, onDelete }: ClienteDetailsModalProps) {
  const { campañas } = useAppStore();

  const getCampaignCount = (clienteId: string) => {
    return campañas.filter(c => c.clienteId === clienteId).length;
  };

  const getTotalFacturado = (clienteId: string) => {
    return campañas
      .filter(c => c.clienteId === clienteId)
      .reduce((acc, c) => acc + c.precio, 0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-elegant max-w-4xl w-full max-h-[80vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Detalles del Cliente</h2>
            <Button variant="outline" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Información del Cliente</h3>
              <div className="space-y-2">
                <p><strong>Nombre:</strong> {cliente.nombre}</p>
                <p><strong>Nombre Pagador:</strong> {cliente.nombrePagador}</p>
                <p><strong>NIF:</strong> <span className="font-mono">{cliente.nif}</span></p>
                <p><strong>Dirección:</strong> {cliente.direccion}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Estadísticas</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{getCampaignCount(cliente.id)}</span>
                  <span className="text-sm text-muted-foreground">campañas</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold text-primary">
                    {getTotalFacturado(cliente.id).toLocaleString('es-ES', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </span>
                  <span className="text-sm text-muted-foreground">facturado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Campañas Asociadas</h3>
            <div className="space-y-2">
              {campañas
                .filter(c => c.clienteId === cliente.id)
                .map(campaña => (
                  <div key={campaña.id} className="flex justify-between items-center p-3 bg-accent/30 rounded-lg">
                    <div>
                      <p className="font-medium">
                        {new Date(campaña.fechaCreacion).toLocaleDateString('es-ES')}
                      </p>
                      <p className="text-sm text-muted-foreground">{campaña.detalles}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {campaña.precio.toLocaleString('es-ES', { 
                          style: 'currency', 
                          currency: 'EUR' 
                        })}
                      </p>
                      <Badge variant="outline">{campaña.estado}</Badge>
                    </div>
                  </div>
                ))}
              
              {getCampaignCount(cliente.id) === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No hay campañas asociadas a este cliente.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => onEdit(cliente)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onDelete(cliente.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Borrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}