import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { useClientes } from "@/hooks/useClientes";
import { Tables } from "@/integrations/supabase/types";

type Movimiento = Tables<'contabilidad'>;

interface MovimientoDetailsModalProps {
  movimiento: Movimiento;
  onClose: () => void;
  onEdit: (movimiento: Movimiento) => void;
  onDelete: (id: string) => void;
}

export function MovimientoDetailsModal({ movimiento, onClose, onEdit, onDelete }: MovimientoDetailsModalProps) {
  const { clientes } = useClientes();

  const getTipoIcon = (tipo: string | null) => {
    return tipo === "cobro" ? (
      <TrendingUp className="h-4 w-4 text-success" />
    ) : (
      <TrendingDown className="h-4 w-4 text-destructive" />
    );
  };

  const getTipoBadgeVariant = (tipo: string | null) => {
    return tipo === "cobro" ? "default" : "destructive";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-elegant max-w-4xl w-full max-h-[80vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Detalles del Movimiento</h2>
            <Button variant="outline" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Información del Movimiento</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getTipoIcon(movimiento.tipo)}
                  <strong>Tipo:</strong> 
                  <Badge variant={getTipoBadgeVariant(movimiento.tipo)}>
                    {movimiento.tipo ? movimiento.tipo.charAt(0).toUpperCase() + movimiento.tipo.slice(1) : "Sin tipo"}
                  </Badge>
                </div>
                <p><strong>Fecha:</strong> {new Date(movimiento.fecha).toLocaleDateString('es-ES')}</p>
                <p><strong>Pagador:</strong> {movimiento.pagador || "Sin pagador"}</p>
                <p><strong>Modalidad:</strong> <Badge variant="outline">{movimiento.modalidad || "Sin modalidad"}</Badge></p>
                {movimiento.id_campana && (
                  <p><strong>ID Campaña:</strong> <span className="font-mono">{movimiento.id_campana}</span></p>
                )}
                {movimiento.id_factura && (
                  <p><strong>ID Factura:</strong> <span className="font-mono">{movimiento.id_factura}</span></p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Información Financiera</h3>
              <div className="space-y-2">
                <p className={`text-lg font-bold ${movimiento.tipo === 'cobro' ? 'text-success' : 'text-destructive'}`}>
                  <strong>Importe:</strong> {movimiento.tipo === 'cobro' ? '+' : '-'}
                  {(movimiento.importe || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </p>
                {(movimiento.saldo_paypal !== null) && (
                  <p><strong>Saldo PayPal:</strong> {movimiento.saldo_paypal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                )}
                {(movimiento.saldo_sl !== null) && (
                  <p><strong>Saldo SL:</strong> {movimiento.saldo_sl.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                )}
              </div>
            </div>
          </div>

          {movimiento.detalles && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Detalles</h3>
              <p className="text-sm text-muted-foreground">{movimiento.detalles}</p>
            </div>
          )}

          {movimiento.acciones && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Acciones</h3>
              <p className="text-sm text-muted-foreground">{movimiento.acciones}</p>
            </div>
          )}

          {movimiento.comentarios && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Comentarios</h3>
              <p className="text-sm text-muted-foreground">{movimiento.comentarios}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => onEdit(movimiento)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onDelete(movimiento.id)}
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