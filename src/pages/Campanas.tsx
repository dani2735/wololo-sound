import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppStore } from "@/stores/useAppStore";
import { CampañaPrensa } from "@/types";
import { Plus, Edit, Trash2, Receipt } from "lucide-react";
import { CampañaForm } from "@/components/forms/CampañaForm";
import { FacturaForm } from "@/components/forms/FacturaForm";

export default function Campanas() {
  const { campañas, clientes, deleteCampaña } = useAppStore();
  const [selectedCampaña, setSelectedCampaña] = useState<CampañaPrensa | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCampaña, setEditingCampaña] = useState<CampañaPrensa | null>(null);
  const [showFacturaForm, setShowFacturaForm] = useState(false);
  const [facturaTargetCampaña, setFacturaTargetCampaña] = useState<CampañaPrensa | null>(null);

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

  const handleEdit = (campaña: CampañaPrensa) => {
    setEditingCampaña(campaña);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCampaña(null);
  };

  const handleFacturar = (campaña: CampañaPrensa) => {
    setFacturaTargetCampaña(campaña);
    setShowFacturaForm(true);
  };

  const handleCloseFacturaForm = () => {
    setShowFacturaForm(false);
    setFacturaTargetCampaña(null);
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
        
        <Button 
          className="bg-gradient-primary shadow-elegant hover:shadow-hover"
          onClick={() => setShowForm(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Campaña
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            <CardTitle className="text-sm text-muted-foreground">Terminadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {campañas.filter(c => c.estado === "TERMINADO").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pendientes Facturar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {campañas.filter(c => c.tipoCobro.includes("Factura") && c.estadoFacturacion === "Sin facturar").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pendientes Cobrar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {campañas.filter(c => c.estadoCobro === "Sin cobrar").length}
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {campañas.map((campaña) => (
                  <TableRow 
                    key={campaña.id} 
                    className="hover:bg-accent/50 cursor-pointer"
                    onClick={() => setSelectedCampaña(campaña)}
                  >
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

      {/* Campaign Details Modal */}
      {selectedCampaña && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-elegant max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Detalles de la Campaña</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCampaña(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Información General</h3>
                  <div className="space-y-2">
                    <p><strong>Cliente:</strong> {getClienteName(selectedCampaña.clienteId)}</p>
                    <p><strong>Fecha Creación:</strong> {new Date(selectedCampaña.fechaCreacion).toLocaleDateString('es-ES')}</p>
                    <p><strong>Estado:</strong> <Badge variant={getEstadoBadgeVariant(selectedCampaña.estado)}>{selectedCampaña.estado}</Badge></p>
                    <p><strong>Precio:</strong> {selectedCampaña.precio.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                    <p><strong>Tipo Cobro:</strong> {selectedCampaña.tipoCobro}</p>
                    <p><strong>Estado Cobro:</strong> <Badge variant={getCobroBadgeVariant(selectedCampaña.estadoCobro)}>{selectedCampaña.estadoCobro}</Badge></p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Acciones</h3>
                  <p className="text-sm">{formatAcciones(selectedCampaña.acciones)}</p>
                </div>
              </div>

              {selectedCampaña.detalles && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Detalles</h3>
                  <p className="text-sm text-muted-foreground">{selectedCampaña.detalles}</p>
                </div>
              )}

              {selectedCampaña.comentarios && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Comentarios</h3>
                  <p className="text-sm text-muted-foreground">{selectedCampaña.comentarios}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                {selectedCampaña.tipoCobro.includes("Factura") && selectedCampaña.estadoFacturacion === "Sin facturar" && (
                  <Button
                    onClick={() => {
                      setSelectedCampaña(null);
                      handleFacturar(selectedCampaña);
                    }}
                    className="bg-gradient-primary"
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    Facturar
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCampaña(null);
                    handleEdit(selectedCampaña);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleDelete(selectedCampaña.id);
                    setSelectedCampaña(null);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Borrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CampañaForm 
        isOpen={showForm}
        onClose={handleCloseForm}
        campaña={editingCampaña || undefined}
      />

      <FacturaForm 
        isOpen={showFacturaForm}
        onClose={handleCloseFacturaForm}
        campaña={facturaTargetCampaña || undefined}
      />
    </div>
  );
}