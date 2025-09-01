import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, FileText } from "lucide-react";
import { useClientes } from "@/hooks/useClientes";
import { Tables } from "@/integrations/supabase/types";

type Campana = Tables<'campanas'>;

interface CampañaDetailsModalProps {
  campaña: Campana;
  onClose: () => void;
  onEdit: (campaña: Campana) => void;
  onDelete: (id: string) => void;
  onFacturar?: (campaña: Campana) => void;
}

export function CampañaDetailsModal({ campaña, onClose, onEdit, onDelete, onFacturar }: CampañaDetailsModalProps) {
  const { clientes } = useClientes();

  const getClienteName = (clienteId: string | null) => {
    if (!clienteId) return "Sin cliente";
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || "Cliente no encontrado";
  };

  const getEstadoBadgeVariant = (estado: string | null) => {
    switch (estado) {
      case "TERMINADO": return "default";
      case "EN CURSO": return "secondary";
      case "PENDIENTE": return "outline";
      default: return "outline";
    }
  };

  const parseAcciones = (accionesStr: string | null) => {
    if (!accionesStr) return {};
    try {
      return JSON.parse(accionesStr);
    } catch {
      return {};
    }
  };

  const getAccionesRealizadas = () => {
    const acciones = [];
    const accionesData = parseAcciones(campaña.acciones);
    
    const accionesNames = {
      instagramPost: "IG Post",
      instagramFlyer: "IG Flyer", 
      instagramVideo: "IG Video",
      instagramVideoAna: "IG Video Ana",
      instagramAgendaMadrid: "IG Agenda Madrid",
      instagramAgendaIbiza: "IG Agenda Ibiza",
      webArticulo: "Web Artículo",
      webEntrevista: "Web Entrevista", 
      webAgenda: "Web Agenda",
      podcastMencion: "Podcast Mención",
      podcastEntrevista: "Podcast Entrevista",
      youtubeEntrevista: "YouTube Entrevista",
    };

    for (const [key, value] of Object.entries(accionesData)) {
      if (key !== 'otrasAcciones' && typeof value === 'number' && value > 0) {
        acciones.push(`${accionesNames[key as keyof typeof accionesNames] || key}: ${value}`);
      }
    }

    if (accionesData.otrasAcciones) {
      acciones.push(`Otras: ${accionesData.otrasAcciones}`);
    }

    return acciones;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-elegant max-w-4xl w-full max-h-[80vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Detalles de la Campaña</h2>
            <Button variant="outline" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Información General</h3>
              <div className="space-y-2">
                <p><strong>Fecha:</strong> {new Date(campaña.fecha).toLocaleDateString('es-ES')}</p>
                <p><strong>Cliente:</strong> {getClienteName(campaña.id_cliente)}</p>
                {campaña.detalles && <p><strong>Detalles:</strong> {campaña.detalles}</p>}
                <p><strong>Estado:</strong> <Badge variant={getEstadoBadgeVariant(campaña.estado_campana)}>{campaña.estado_campana}</Badge></p>
                <p><strong>Tipo de Cobro:</strong> <Badge variant="outline">{campaña.tipo_cobro}</Badge></p>
                <p><strong>Estado Facturación:</strong> <Badge variant={campaña.estado_facturacion === "Facturado" ? "default" : "destructive"}>{campaña.estado_facturacion}</Badge></p>
                <p><strong>Estado Cobro:</strong> <Badge variant={campaña.estado_cobro === "Cobrado" ? "default" : "destructive"}>{campaña.estado_cobro}</Badge></p>
                {campaña.estado_pago_ana && (
                  <p><strong>Estado Pago Ana:</strong> <Badge variant={campaña.estado_pago_ana === "Pagado" ? "default" : "destructive"}>{campaña.estado_pago_ana}</Badge></p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Importes</h3>
              <div className="space-y-2">
                <p><strong>Precio:</strong> <span className="font-bold text-lg">{(campaña.precio || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></p>
                {(campaña.cobro_ana || 0) > 0 && (
                  <p><strong>Cobro Ana:</strong> {(campaña.cobro_ana || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                )}
                {(campaña.cobro_wololo_sound || 0) > 0 && (
                  <p><strong>Cobro Wololo Sound:</strong> {(campaña.cobro_wololo_sound || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                )}
                <p><strong>Importe Facturado:</strong> {(campaña.importe_facturado || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                <p><strong>Importe Cobrado:</strong> {(campaña.importe_cobrado || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                <p><strong>Pendiente Facturar:</strong> {(campaña.importe_pendiente_facturar || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                <p><strong>Pendiente Cobrar:</strong> {(campaña.importe_pendiente_cobrar || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Acciones</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {getAccionesRealizadas().length > 0 ? (
                getAccionesRealizadas().map((accion, index) => (
                  <div key={index} className="text-sm p-2 bg-accent/30 rounded">
                    {accion}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay acciones registradas</p>
              )}
            </div>
          </div>

          {campaña.comentarios && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Comentarios</h3>
              <p className="text-sm text-muted-foreground">{campaña.comentarios}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            {campaña.estado_facturacion === "Sin facturar" && campaña.tipo_cobro?.includes("Factura") && onFacturar && (
              <Button 
                className="bg-gradient-primary"
                onClick={() => onFacturar(campaña)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Facturar
              </Button>
            )}
            <Button variant="outline" onClick={() => onEdit(campaña)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onDelete(campaña.id)}
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