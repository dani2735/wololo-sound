import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/stores/useAppStore";
import { Factura, CampañaPrensa, TipoIVA } from "@/types";
import { useEffect } from "react";

const formSchema = z.object({
  fecha: z.string().min(1, "La fecha es requerida"),
  clienteId: z.string().min(1, "Debe seleccionar un cliente"),
  nombrePagador: z.string().min(1, "El nombre del pagador es requerido"),
  nif: z.string().min(1, "El NIF es requerido"),
  direccion: z.string().min(1, "La dirección es requerida"),
  precio: z.number().min(0, "El precio debe ser mayor que 0"),
  tipoIva: z.enum(["España", "Canarias", "Europa", "EEUU"]),
  datosAcciones: z.string().min(1, "Los datos de acciones son requeridos"),
});

type FormData = z.infer<typeof formSchema>;

interface FacturaFormProps {
  isOpen: boolean;
  onClose: () => void;
  factura?: Factura;
  campaña?: CampañaPrensa;
}

export function FacturaForm({ isOpen, onClose, factura, campaña }: FacturaFormProps) {
  const { clientes, facturas, addFactura, updateFactura } = useAppStore();
  const isEditing = !!factura;

  // Generate next invoice reference
  const getNextReference = () => {
    if (facturas.length === 0) return "001.2025";
    
    const currentYear = new Date().getFullYear();
    const yearFacturas = facturas
      .filter(f => f.referencia.includes(currentYear.toString()))
      .map(f => parseInt(f.referencia.split('.')[0]))
      .sort((a, b) => b - a);
    
    const nextNumber = yearFacturas.length > 0 ? yearFacturas[0] + 1 : 1;
    return `${nextNumber.toString().padStart(3, '0')}.${currentYear}`;
  };

  // Get client data if creating from campaign
  const clienteData = campaña ? clientes.find(c => c.id === campaña.clienteId) : null;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fecha: factura?.fecha || new Date().toISOString().split('T')[0],
      clienteId: factura?.clienteId || campaña?.clienteId || "",
      nombrePagador: factura?.nombrePagador || clienteData?.nombrePagador || "",
      nif: factura?.nif || clienteData?.nif || "",
      direccion: factura?.direccion || clienteData?.direccion || "",
      precio: factura?.precio || campaña?.precio || 0,
      tipoIva: factura?.tipoIva || "España",
      datosAcciones: factura?.datosAcciones || "Servicios de promoción online en Wololo Sound",
    },
  });

  // Watch for cliente changes to auto-fill data
  const selectedClienteId = form.watch("clienteId");
  const selectedCliente = clientes.find(c => c.id === selectedClienteId);

  // Update client data when cliente changes
  useEffect(() => {
    if (selectedCliente && !isEditing) {
      form.setValue("nombrePagador", selectedCliente.nombrePagador);
      form.setValue("nif", selectedCliente.nif);
      form.setValue("direccion", selectedCliente.direccion);
    }
  }, [selectedCliente, form, isEditing]);

  const tipoIva = form.watch("tipoIva");
  const precio = form.watch("precio");
  const iva = tipoIva === "España" ? precio * 0.21 : 0;

  const onSubmit = (data: FormData) => {
    const ivaCalculado = data.tipoIva === "España" ? data.precio * 0.21 : 0;
    
    if (isEditing && factura) {
      updateFactura(factura.id, {
        ...data,
        iva: ivaCalculado,
      });
    } else {
      const newFactura: Factura = {
        id: `fact_${Date.now()}`,
        fecha: data.fecha,
        referencia: getNextReference(),
        clienteId: data.clienteId,
        nombrePagador: data.nombrePagador,
        nif: data.nif,
        direccion: data.direccion,
        precio: data.precio,
        iva: ivaCalculado,
        tipoIva: data.tipoIva,
        estadoCobro: "Sin cobrar",
        datosAcciones: data.datosAcciones,
      };
      addFactura(newFactura);
    }
    
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Factura" : "Nueva Factura"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Facturación</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clienteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id}>
                            {cliente.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="nombrePagador"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Pagador</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre legal que aparece en la factura" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nif"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIF</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Dirección completa del cliente"
                      className="min-h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipoIva"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de IVA</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="España" id="espana" />
                        <Label htmlFor="espana">España (21%)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Canarias" id="canarias" />
                        <Label htmlFor="canarias">Canarias (0%)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Europa" id="europa" />
                        <Label htmlFor="europa">Europa (0%)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="EEUU" id="eeuu" />
                        <Label htmlFor="eeuu">EEUU (0%)</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {iva > 0 && (
              <div className="p-3 bg-accent/50 rounded-md">
                <div className="text-sm">
                  <strong>Resumen de facturación:</strong>
                </div>
                <div className="text-sm mt-1">
                  Base imponible: {precio.toFixed(2)}€
                </div>
                <div className="text-sm">
                  IVA (21%): {iva.toFixed(2)}€
                </div>
                <div className="text-sm font-semibold">
                  Total: {(precio + iva).toFixed(2)}€
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="datosAcciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Datos de Acciones</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descripción que aparecerá en la factura"
                      className="min-h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-primary">
                {isEditing ? "Actualizar" : "Crear"} Factura
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}