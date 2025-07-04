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
import { useAppStore } from "@/stores/useAppStore";
import { MovimientoContable, TipoMovimiento, CuentaMovimiento } from "@/types";

const formSchema = z.object({
  fecha: z.string().min(1, "La fecha es requerida"),
  tipo: z.enum(["cobro", "pago"]),
  pagador: z.string().min(1, "El pagador es requerido"),
  clienteId: z.string().min(1, "Debe seleccionar un cliente"),
  precio: z.number().min(0, "El precio debe ser mayor que 0"),
  cuenta: z.enum(["Paypal", "Cuenta SL"]),
  detalles: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface MovimientoFormProps {
  isOpen: boolean;
  onClose: () => void;
  tipo: TipoMovimiento;
  movimiento?: MovimientoContable;
}

export function MovimientoForm({ isOpen, onClose, tipo, movimiento }: MovimientoFormProps) {
  const { clientes, addMovimiento, updateMovimiento } = useAppStore();
  const isEditing = !!movimiento;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fecha: movimiento?.fecha || new Date().toISOString().split('T')[0],
      tipo: movimiento?.tipo || tipo,
      pagador: movimiento?.pagador || "",
      clienteId: movimiento?.clienteId || "",
      precio: movimiento?.precio || 0,
      cuenta: movimiento?.cuenta || "Paypal",
      detalles: movimiento?.detalles || "",
    },
  });

  const onSubmit = (data: FormData) => {
    if (isEditing && movimiento) {
      updateMovimiento(movimiento.id, data);
    } else {
      const newMovimiento: MovimientoContable = {
        id: `mov_${Date.now()}`,
        fecha: data.fecha,
        tipo: data.tipo,
        pagador: data.pagador,
        clienteId: data.clienteId,
        precio: data.precio,
        cuenta: data.cuenta,
        detalles: data.detalles,
      };
      addMovimiento(newMovimiento);
    }
    
    form.reset();
    onClose();
  };

  const tipoLabel = tipo === "cobro" ? "Cobro" : "Pago";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Editar ${tipoLabel}` : `Nuevo ${tipoLabel}`}
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
              name="pagador"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pagador</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del pagador" {...field} />
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

            <FormField
              control={form.control}
              name="cuenta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuenta</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Paypal">Paypal</SelectItem>
                      <SelectItem value="Cuenta SL">Cuenta SL</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Textarea 
                      placeholder="Detalles adicionales del movimiento..."
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
                {isEditing ? "Actualizar" : "Crear"} {tipoLabel}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}