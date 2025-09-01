import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Download } from "lucide-react";
import { useClientes } from "@/hooks/useClientes";
import { Tables } from "@/integrations/supabase/types";
import { pdf } from "@react-pdf/renderer";
import { FacturaPDFTemplate } from "@/components/pdf/FacturaPDFTemplate";

type Factura = Tables<'facturas'>;

interface FacturaDetailsModalProps {
  factura: Factura;
  onClose: () => void;
  onEdit: (factura: Factura) => void;
  onDelete: (id: string) => void;
}

export function FacturaDetailsModal({ factura, onClose, onEdit, onDelete }: FacturaDetailsModalProps) {
  const { clientes } = useClientes();

  const getClienteName = (clienteId: string | null) => {
    if (!clienteId) return "Sin cliente";
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || "Cliente no encontrado";
  };

  const getEstadoBadgeVariant = (estado: string | null) => {
    return estado === "Cobrado" ? "default" : "destructive";
  };

  const downloadPDF = async () => {
    const blob = await pdf(
      <FacturaPDFTemplate 
        factura={factura} 
        clienteNombre={getClienteName(factura.id_sociedad)} 
      />
    ).toBlob();
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Factura_${factura.referencia}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-elegant max-w-4xl w-full max-h-[80vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Detalles de la Factura</h2>
            <Button variant="outline" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Información de Facturación</h3>
              <div className="space-y-2">
                <p><strong>Referencia:</strong> <span className="font-mono">{factura.referencia}</span></p>
                <p><strong>Fecha:</strong> {new Date(factura.fecha).toLocaleDateString('es-ES')}</p>
                <p><strong>Cliente:</strong> {getClienteName(factura.id_sociedad)}</p>
                {factura.detalles && <p><strong>Detalles:</strong> {factura.detalles}</p>}
                <p><strong>Estado Cobro:</strong> <Badge variant={getEstadoBadgeVariant(factura.estado_cobro)}>{factura.estado_cobro || "Sin cobrar"}</Badge></p>
                {factura.fecha_cobro && (
                  <p><strong>Fecha Cobro:</strong> {new Date(factura.fecha_cobro).toLocaleDateString('es-ES')}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Importes</h3>
              <div className="space-y-2">
                <p><strong>Precio:</strong> {(factura.precio || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                <p><strong>IVA:</strong> {(factura.iva || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                <p><strong>IRPF:</strong> {(factura.irpf || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                <p><strong>Total:</strong> <span className="font-bold text-lg">{((factura.precio || 0) + (factura.iva || 0) - (factura.irpf || 0)).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></p>
                <p><strong>Pago Cliente:</strong> {(factura.pago_cliente || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
              </div>
            </div>
          </div>

          {factura.comentarios && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Comentarios</h3>
              <p className="text-sm text-muted-foreground">{factura.comentarios}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={downloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
            <Button variant="outline" onClick={() => onEdit(factura)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onDelete(factura.id)}
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