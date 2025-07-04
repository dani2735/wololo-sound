import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppStore } from "@/stores/useAppStore";
import { CampañaPrensa } from "@/types";
import { Plus, Edit, Trash2, Receipt } from "lucide-react";

export default function Campanas() {
  const { campañas, clientes, deleteCampaña } = useAppStore();
  const [selectedCampaña, setSelectedCampaña] = useState<CampañaPrensa | null>(null);

  const getClienteName = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || "Cliente no encontrado";
  };

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "TERMINADO":
        return "default";
      case "EN CURSO":
        return "secondary";
      case "PENDIENTE":
        return "outline";
      default:
        return "outline";
    }
  };

  const getCobroBadgeVariant = (estado: string) => {
    return estado === "Cobrado" ? "default" : "destructive";
  };

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

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres borrar esta campaña?")) {
      deleteCampaña(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campañas de Prensa</h1>
          <p className="text-muted-foreground">
            Gestión completa de todas las campañas de prensa
          </p>
        </div>
        
        <Button className="bg-gradient-primary shadow-elegant hover:shadow-hover">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Campaña
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Campañas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campañas.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">En Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {campañas.filter(c => c.estado === "EN CURSO").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {campañas.filter(c => c.estado === "PENDIENTE").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle>Lista de Campañas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Acciones</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Tipo Cobro</TableHead>
                  <TableHead>Estado Cobro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campañas.map((campaña) => (
                  <TableRow key={campaña.id} className="hover:bg-accent/50">
                    <TableCell>
                      {new Date(campaña.fechaCreacion).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {getClienteName(campaña.clienteId)}
                    </TableCell>
                    <TableCell className="max-w-48">
                      <div className="truncate" title={formatAcciones(campaña.acciones)}>
                        {formatAcciones(campaña.acciones)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {campaña.precio.toLocaleString('es-ES', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getEstadoBadgeVariant(campaña.estado)}>
                        {campaña.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>{campaña.tipoCobro}</TableCell>
                    <TableCell>
                      <Badge variant={getCobroBadgeVariant(campaña.estadoCobro)}>
                        {campaña.estadoCobro}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {campaña.tipoCobro.includes("Factura") && campaña.estadoFacturacion === "Sin facturar" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Receipt className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(campaña.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {campañas.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No hay campañas registradas. ¡Crea tu primera campaña!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}