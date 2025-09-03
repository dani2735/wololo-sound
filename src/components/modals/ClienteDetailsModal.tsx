import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Users, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Cliente = any;

interface ClienteDetailsModalProps {
  cliente: Cliente;
  onClose: () => void;
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: string) => void;
}

export function ClienteDetailsModal({ cliente, onClose, onEdit, onDelete }: ClienteDetailsModalProps) {
  const [campanasData, setCampanasData] = useState<any[]>([]);

  useEffect(() => {
    const loadCampanasData = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('campanas')
          .select('*')
          .eq('id_cliente', cliente.id);
        
        if (error) throw error;
        setCampanasData(data || []);
      } catch (error) {
        console.error('Error loading campaigns:', error);
      }
    };

    loadCampanasData();
  }, [cliente.id]);

  const getCampaignCount = (clienteId: string) => {
    return campanasData.length;
  };

  const getTotalFacturado = (clienteId: string) => {
    return campanasData.reduce((total, c) => total + (c.importe_facturado || 0), 0);
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
<p><strong>Nombre Pagador:</strong> {cliente.sociedad?.nombre_fiscal || 'No especificado'}</p>
<p><strong>NIF:</strong> <span className="font-mono">{cliente.sociedad?.cif || 'No especificado'}</span></p>
<p><strong>Dirección:</strong> {cliente.sociedad?.direccion_1 || 'No especificada'}</p>
{cliente.sociedad?.direccion_2 && <p><strong>Dirección 2:</strong> {cliente.sociedad.direccion_2}</p>}
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
            <h3 className="font-semibold mb-2">Campañas Asociadas ({campanasData.length})</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {campanasData.length > 0 ? (
                campanasData.map((campana: any) => (
                  <div key={campana.id} className="flex justify-between items-center p-2 bg-muted rounded">
                    <div>
                      <p className="font-medium text-sm">{campana.detalles}</p>
                      <p className="text-xs text-muted-foreground">{campana.fecha} - {campana.estado_campana}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{campana.precio?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                      <Badge variant={campana.estado_cobro === 'Cobrado' ? 'default' : 'secondary'} className="text-xs">
                        {campana.estado_cobro}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
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