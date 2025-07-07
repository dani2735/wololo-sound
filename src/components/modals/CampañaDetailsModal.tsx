import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, FileText } from "lucide-react";
import { CampañaPrensa } from "@/types";
import { useAppStore } from "@/stores/useAppStore";

interface CampañaDetailsModalProps {
  campaña: CampañaPrensa;
  onClose: () => void;
  onEdit: (campaña: CampañaPrensa) => void;
  onDelete: (id: string) => void;
  onFacturar: (campaña: CampañaPrensa) => void;
}

export function CampañaDetailsModal({ campaña, onClose, onEdit, onDelete, onFacturar }: CampañaDetailsModalProps) {
  const { clientes } = useAppStore();

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || clienteId.startsWith('temp_') ? "Cliente temporal" : "Cliente no encontrado";
  };

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "TERMINADO": return "default";
      case "EN CURSO": return "secondary";
      case "PENDIENTE": return "outline";
      default: return "outline";
    }
  };

  const getAccionesRealizadas = () => {
    const acciones = [];
    
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

    for (const [key, value] of Object.entries(campaña.acciones)) {
      if (key !== 'otrasAcciones' && typeof value === 'number' && value > 0) {
        acciones.push(`${accionesNames[key as keyof typeof accionesNames]}: ${value}`);
      }
    }

    if (campaña.acciones.otrasAcciones) {
      acciones.push(`Otras: ${campaña.acciones.otrasAcciones}`);
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
                <p><strong>Fecha Creación:</strong> {new Date(campaña.fechaCreacion).toLocaleDateString('es-ES')}</p>
                <p><strong>Cliente:</strong> {getClienteName(campaña.clienteId)}</p>
                <p><strong>Estado:</strong> <Badge variant={getEstadoBadgeVariant(campaña.estado)}>{campaña.estado}</Badge></p>
                <p><strong>Tipo de Cobro:</strong> <Badge variant="outline">{campaña.tipoCobro}</Badge></p>
                <p><strong>Estado Facturación:</strong> <Badge variant={campaña.estadoFacturacion === "Facturado" ? "default" : "destructive"}>{campaña.estadoFacturacion}</Badge></p>
                <p><strong>Estado Cobro:</strong> <Badge variant={campaña.estadoCobro === "Cobrado" ? "default" : "destructive"}>{campaña.estadoCobro}</Badge></p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Importes</h3>
              <div className="space-y-2">
                <p><strong>Precio:</strong> <span className="font-bold text-lg">{campaña.precio.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span></p>
                {campaña.cobroAna > 0 && (
                  <p><strong>Cobro Ana:</strong> {campaña.cobroAna.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Acciones Realizadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {getAccionesRealizadas().map((accion, index) => (
                <div key={index} className="text-sm p-2 bg-accent/30 rounded">
                  {accion}
                </div>
              ))}
            </div>
          </div>

          {campaña.detalles && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Detalles</h3>
              <p className="text-sm text-muted-foreground">{campaña.detalles}</p>
            </div>
          )}

          {campaña.comentarios && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Comentarios</h3>
              <p className="text-sm text-muted-foreground">{campaña.comentarios}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            {campaña.estadoFacturacion === "Sin facturar" && (
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