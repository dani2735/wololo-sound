import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  usePagosAna, 
  useCampanasPendientesPagoAna, 
  useAsociarCampanasPago, 
  useDeletePagoAna,
  type PagoAna 
} from "@/hooks/usePagosAna";
import { PagoAnaForm } from "@/components/forms/PagoAnaForm";
import { Edit, Trash2, DollarSign, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const Colaboradores = () => {
  const [selectedCampanas, setSelectedCampanas] = useState<string[]>([]);
  const [showAsociarDialog, setShowAsociarDialog] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<string>("");

  const { data: pagos = [], isLoading: loadingPagos } = usePagosAna();
  const { data: campanasPendientes = [], isLoading: loadingCampanas } = useCampanasPendientesPagoAna();
  const asociarCampanas = useAsociarCampanasPago();
  const deletePagoAna = useDeletePagoAna();

  const handleSelectCampana = (campaniaId: string, checked: boolean) => {
    setSelectedCampanas(prev => 
      checked 
        ? [...prev, campaniaId]
        : prev.filter(id => id !== campaniaId)
    );
  };

  const handleAsociarCampanas = async () => {
    if (!pagoSeleccionado || selectedCampanas.length === 0) {
      toast.error("Selecciona un pago y al menos una campaña");
      return;
    }

    try {
      await asociarCampanas.mutateAsync({
        pagoId: pagoSeleccionado,
        campanasIds: selectedCampanas
      });
      setShowAsociarDialog(false);
      setSelectedCampanas([]);
      setPagoSeleccionado("");
    } catch (error) {
      console.error("Error asociando campañas:", error);
    }
  };

  const handleDeletePago = async (pagoId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este pago?")) {
      try {
        await deletePagoAna.mutateAsync(pagoId);
      } catch (error) {
        console.error("Error eliminando pago:", error);
      }
    }
  };

  const totalPendientePago = campanasPendientes.reduce((sum, campana) => sum + (campana.cobro_ana || 0), 0);
  const totalPagado = pagos.reduce((sum, pago) => sum + (pago.importe || 0), 0);

  if (loadingPagos || loadingCampanas) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pagos a Ana</h1>
          <p className="text-muted-foreground">Gestión de pagos a colaboradores</p>
        </div>
        <div className="flex gap-4">
          <PagoAnaForm />
          <Button 
            onClick={() => setShowAsociarDialog(true)}
            disabled={campanasPendientes.length === 0}
          >
            Asociar Campañas a Pago
          </Button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente de Pago</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              €{totalPendientePago.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {campanasPendientes.length} campañas pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pagado</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              €{totalPagado.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {pagos.length} pagos realizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{(totalPendientePago + totalPagado).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total acumulado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campañas Pendientes */}
      <Card>
        <CardHeader>
          <CardTitle>Campañas Pendientes de Pago ({campanasPendientes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {campanasPendientes.length === 0 ? (
            <p className="text-muted-foreground">No hay campañas pendientes de pago a Ana.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Acciones</TableHead>
                  <TableHead>Cobro Ana</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campanasPendientes.map((campana) => (
                  <TableRow key={campana.id}>
                    <TableCell>{campana.fecha}</TableCell>
                    <TableCell>{(campana as any).clientes?.nombre || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={campana.acciones || ''}>
                        {campana.acciones || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        €{(campana.cobro_ana || 0).toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">
                        {campana.estado_pago_ana || 'Pendiente'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Historial de Pagos */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos ({pagos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pagos.length === 0 ? (
            <p className="text-muted-foreground">No hay pagos registrados aún.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Importe</TableHead>
                  <TableHead>Modalidad</TableHead>
                  <TableHead>Referencia</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagos.map((pago) => (
                  <TableRow key={pago.id}>
                    <TableCell>{pago.fecha}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        €{(pago.importe || 0).toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell>{pago.modalidad || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={pago.referencia || ''}>
                        {pago.referencia || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <PagoAnaForm pago={pago} />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePago(pago.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog para Asociar Campañas */}
      <Dialog open={showAsociarDialog} onOpenChange={setShowAsociarDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Asociar Campañas a Pago</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="pago-select">Seleccionar Pago</Label>
              <select 
                id="pago-select"
                className="w-full p-2 border rounded"
                value={pagoSeleccionado}
                onChange={(e) => setPagoSeleccionado(e.target.value)}
              >
                <option value="">Selecciona un pago...</option>
                {pagos.map((pago) => (
                  <option key={pago.id} value={pago.id}>
                    {pago.fecha} - €{(pago.importe || 0).toFixed(2)} ({pago.modalidad})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Seleccionar Campañas Pendientes</Label>
              <div className="max-h-60 overflow-y-auto border rounded p-2">
                {campanasPendientes.map((campana) => (
                  <div key={campana.id} className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id={campana.id}
                      checked={selectedCampanas.includes(campana.id)}
                      onCheckedChange={(checked) => 
                        handleSelectCampana(campana.id, checked as boolean)
                      }
                    />
                    <label htmlFor={campana.id} className="flex-1 cursor-pointer">
                      <div className="flex justify-between">
                        <span>{campana.fecha} - {(campana as any).clientes?.nombre}</span>
                        <span className="font-semibold">€{(campana.cobro_ana || 0).toFixed(2)}</span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAsociarDialog(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleAsociarCampanas}
                disabled={!pagoSeleccionado || selectedCampanas.length === 0 || asociarCampanas.isPending}
              >
                {asociarCampanas.isPending ? "Asociando..." : "Asociar Campañas"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Colaboradores;