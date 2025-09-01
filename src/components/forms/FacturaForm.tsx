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
import { useFacturas } from "@/hooks/useFacturas";
import { useClientes } from "@/hooks/useClientes";
import { Tables } from "@/integrations/supabase/types";
import { pdf } from "@react-pdf/renderer";
import { FacturaPDFTemplate } from "@/components/pdf/FacturaPDFTemplate";
import { Download } from "lucide-react";

type Factura = Tables<'facturas'>;
type Campana = Tables<'campanas'>;

const formSchema = z.object({
  fecha: z.string().min(1, "La fecha es requerida"),
  id_sociedad: z.string().min(1, "Debe seleccionar un cliente"),
  precio: z.number().min(0, "El precio debe ser mayor que 0"),
  iva: z.number().min(0),
  detalles: z.string().min(1, "Los detalles son requeridos"),
});

type FormData = z.infer<typeof formSchema>;

interface FacturaFormProps {
  isOpen: boolean;
  onClose: () => void;
  factura?: Factura;
  campaña?: Campana;
}

export function FacturaForm({ isOpen, onClose, factura, campaña }: FacturaFormProps) {
  const { clientes } = useClientes();
  const { facturas, createFactura, updateFactura } = useFacturas();
  const isEditing = !!factura;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: {
      fecha: factura?.fecha || new Date().toISOString().split('T')[0],
      id_sociedad: factura?.id_sociedad || "",
      precio: factura?.precio || campaña?.precio || 0,
      iva: factura?.iva || 0,
      detalles: factura?.detalles || "Servicios de promoción online",
    },
  });

  const precio = form.watch("precio");
  const ivaCalculado = precio * 0.21;

  const onSubmit = async (data: FormData) => {
    const facturaData = {
      fecha: data.fecha,
      id_sociedad: data.id_sociedad,
      precio: data.precio,
      iva: ivaCalculado,
      detalles: data.detalles,
      referencia: `${Date.now()}`,
      estado_cobro: "Sin cobrar",
    };
    
    if (isEditing && factura) {
      await updateFactura(factura.id, facturaData);
    } else {
      const newFactura = {
        id: crypto.randomUUID(),
        ...facturaData,
      };
      await createFactura(newFactura);
    }
    
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Factura" : "Nueva Factura"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="id_sociedad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detalles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalles</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-3 bg-accent/50 rounded-md">
              <div className="text-sm">
                <strong>Resumen:</strong>
              </div>
              <div className="text-sm mt-1">
                Base: {precio.toFixed(2)}€
              </div>
              <div className="text-sm">
                IVA (21%): {ivaCalculado.toFixed(2)}€
              </div>
              <div className="text-sm font-semibold">
                Total: {(precio + ivaCalculado).toFixed(2)}€
              </div>
            </div>

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