import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { MovimientoContable } from "@/types";
import { useAppStore } from "@/stores/useAppStore";

interface MovimientoDetailsModalProps {
  movimiento: MovimientoContable;
  onClose: () => void;
  onEdit: (movimiento: MovimientoContable) => void;
  onDelete: (id: string) => void;
}

export function MovimientoDetailsModal({ movimiento, onClose, onEdit, onDelete }: MovimientoDetailsModalProps) {
  const { clientes } = useAppStore();

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || "Cliente no encontrado";
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === "cobro" ? (
      <TrendingUp className="h-4 w-4 text-success" />
    ) : (
      <TrendingDown className="h-4 w-4 text-destructive" />
    );
  };

  const getTipoBadgeVariant = (tipo: string) => {
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
                    {movimiento.tipo.charAt(0).toUpperCase() + movimiento.tipo.slice(1)}
                  </Badge>
                </div>
                <p><strong>Fecha:</strong> {new Date(movimiento.fecha).toLocaleDateString('es-ES')}</p>
                <p><strong>Pagador:</strong> {movimiento.pagador}</p>
                <p><strong>Cliente:</strong> {getClienteName(movimiento.clienteId)}</p>
                <p><strong>Cuenta:</strong> <Badge variant="outline">{movimiento.cuenta}</Badge></p>
              </div>
            </div>

             <div>
               <h3 className="font-semibold mb-3">Información Financiera</h3>
               <div className="space-y-2">
                 {movimiento.referenciaFactura && (
                   <p><strong>Referencia Factura:</strong> <span className="font-mono">{movimiento.referenciaFactura}</span></p>
                 )}
                 <p><strong>Precio:</strong> {(() => {
                   // Get price from related campaña if available
                   const { campañas } = useAppStore.getState();
                   const relacionCampaña = campañas.find(c => c.referenciaFactura === movimiento.referenciaFactura);
                   const precioBase = relacionCampaña?.precio || movimiento.precio;
                   return precioBase.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
                 })()}</p>
                 <p><strong>IVA:</strong> {(() => {
                   const { campañas } = useAppStore.getState();
                   const relacionCampaña = campañas.find(c => c.referenciaFactura === movimiento.referenciaFactura);
                   const iva = relacionCampaña?.iva || 0;
                   return iva.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
                 })()}</p>
                 <p className={`text-lg font-bold ${movimiento.tipo === 'cobro' ? 'text-success' : 'text-destructive'}`}>
                   <strong>Total:</strong> {movimiento.tipo === 'cobro' ? '+' : '-'}
                   {(() => {
                     const { campañas } = useAppStore.getState();
                     const relacionCampaña = campañas.find(c => c.referenciaFactura === movimiento.referenciaFactura);
                     const precioBase = relacionCampaña?.precio || movimiento.precio;
                     const iva = relacionCampaña?.iva || 0;
                     return (precioBase + iva).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
                   })()}
                 </p>
               </div>
             </div>
          </div>

            {movimiento.detalles && (
             <div className="mt-4">
               <h3 className="font-semibold mb-2">Acciones</h3>
               <p className="text-sm text-muted-foreground">{movimiento.detalles}</p>
             </div>
           )}

           {movimiento.referenciaFactura && (
             <div className="mt-4">
               <h3 className="font-semibold mb-2">Acciones Realizadas</h3>
               <div className="text-sm text-muted-foreground">
                 {(() => {
                   const { campañas } = useAppStore.getState();
                   const relacionCampaña = campañas.find(c => c.referenciaFactura === movimiento.referenciaFactura);
                   if (!relacionCampaña) return "No hay acciones registradas";
                   
                   const formatAcciones = (acciones: any) => {
                     const accionesArray = [];
                     
                     if (acciones.instagramPost > 0) accionesArray.push(`IG Post: ${acciones.instagramPost}`);
                     if (acciones.instagramFlyer > 0) accionesArray.push(`IG Flyer: ${acciones.instagramFlyer}`);
                     if (acciones.instagramVideo > 0) accionesArray.push(`IG Video: ${acciones.instagramVideo}`);
                     if (acciones.instagramVideoAna > 0) accionesArray.push(`IG Video Ana: ${acciones.instagramVideoAna}`);
                     if (acciones.instagramAgendaMadrid > 0) accionesArray.push(`IG Agenda Madrid: ${acciones.instagramAgendaMadrid}`);
                     if (acciones.instagramAgendaIbiza > 0) accionesArray.push(`IG Agenda Ibiza: ${acciones.instagramAgendaIbiza}`);
                     if (acciones.webArticulo > 0) accionesArray.push(`Web Artículo: ${acciones.webArticulo}`);
                     if (acciones.webEntrevista > 0) accionesArray.push(`Web Entrevista: ${acciones.webEntrevista}`);
                     if (acciones.webAgenda > 0) accionesArray.push(`Web Agenda: ${acciones.webAgenda}`);
                     if (acciones.podcastMencion > 0) accionesArray.push(`Podcast Mención: ${acciones.podcastMencion}`);
                     if (acciones.podcastEntrevista > 0) accionesArray.push(`Podcast Entrevista: ${acciones.podcastEntrevista}`);
                     if (acciones.youtubeEntrevista > 0) accionesArray.push(`YouTube Entrevista: ${acciones.youtubeEntrevista}`);
                     if (acciones.otrasAcciones) accionesArray.push(`Otras: ${acciones.otrasAcciones}`);
                     
                     return accionesArray.length > 0 ? accionesArray.join(", ") : "Sin acciones";
                   };
                   
                   return formatAcciones(relacionCampaña.acciones);
                 })()}
               </div>
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