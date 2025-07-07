import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Download } from "lucide-react";
import { Factura, CuentaMovimiento } from "@/types";
import { useAppStore } from "@/stores/useAppStore";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { FacturaPDFTemplate } from "@/components/pdf/FacturaPDFTemplate";

interface FacturaDetailsModalProps {
  factura: Factura;
  onClose: () => void;
  onEdit: (factura: Factura) => void;
  onDelete: (id: string) => void;
}

export function FacturaDetailsModal({ factura, onClose, onEdit, onDelete }: FacturaDetailsModalProps) {
  const { clientes, marcarFacturaCobrada } = useAppStore();
  const [cuentaCobro, setCuentaCobro] = useState<CuentaMovimiento>("Cuenta SL");

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || "Cliente no encontrado";
  };

  const getEstadoBadgeVariant = (estado: string) => {
    return estado === "Cobrado" ? "default" : "destructive";
  };

  const downloadPDF = async () => {
    const clienteSeleccionado = clientes.find(c => c.id === factura.clienteId);
    const blob = await pdf(
      <FacturaPDFTemplate 
        factura={factura} 
        clienteNombre={clienteSeleccionado?.nombre || "Cliente"} 
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
                <p><strong>Cliente:</strong> {getClienteName(factura.clienteId)}</p>
                <p><strong>Pagador:</strong> {factura.nombrePagador}</p>
                <p><strong>NIF:</strong> <span className="font-mono">{factura.nif}</span></p>
                <p><strong>Dirección:</strong> {factura.direccion}</p>
                <p><strong>Estado Cobro:</strong> <Badge variant={getEstadoBadgeVariant(factura.estadoCobro)}>{factura.estadoCobro}</Badge></p>
                {factura.fechaCobro && (
                  <p><strong>Fecha Cobro:</strong> {new Date(factura.fechaCobro).toLocaleDateString('es-ES')}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Importes</h3>
              <div className="space-y-2">
                <p><strong>Precio:</strong> {factura.precio.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                <p><strong>IVA:</strong> {factura.iva.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                <p><strong>Total:</strong> <span className="font-bold text-lg">{(factura.precio + factura.iva).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></p>
              </div>
            </div>
          </div>

          {factura.datosAcciones && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Datos de Acciones</h3>
              <p className="text-sm text-muted-foreground">{factura.datosAcciones}</p>
            </div>
          )}

          {factura.estadoCobro === "Sin cobrar" && (
            <div className="mt-4 p-4 bg-accent/30 rounded-lg">
              <h3 className="font-semibold mb-3">Marcar como Cobrada</h3>
              <div className="flex items-center gap-3">
                <Select value={cuentaCobro} onValueChange={(value: CuentaMovimiento) => setCuentaCobro(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cuenta SL">Cuenta SL</SelectItem>
                    <SelectItem value="Paypal">Paypal</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="bg-gradient-primary"
                  onClick={() => {
                    marcarFacturaCobrada(factura.id, cuentaCobro);
                    onClose();
                  }}
                >
                  Marcar como Cobrada
                </Button>
              </div>
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