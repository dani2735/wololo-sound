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
import { useContabilidad } from "@/hooks/useContabilidad";
import { useClientes } from "@/hooks/useClientes";
import { Tables } from "@/integrations/supabase/types";

type Movimiento = Tables<'contabilidad'>;

const formSchema = z.object({
  fecha: z.string().min(1, "La fecha es requerida"),
  tipo: z.enum(["cobro", "pago"]),
  pagador: z.string().min(1, "El pagador es requerido"),
  clienteId: z.string().optional(),
  importe: z.number().min(0, "El importe debe ser mayor que 0"),
  modalidad: z.enum(["Paypal", "Cuenta SL"]),
  detalles: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface MovimientoFormProps {
  isOpen: boolean;
  onClose: () => void;
  tipo: "cobro" | "pago";
  movimiento?: Movimiento;
}

export function MovimientoForm({ isOpen, onClose, tipo, movimiento }: MovimientoFormProps) {
  const { clientes } = useClientes();
  const { createMovimiento, updateMovimiento } = useContabilidad();
  const isEditing = !!movimiento;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: {
      fecha: movimiento?.fecha || new Date().toISOString().split('T')[0],
      tipo: movimiento?.tipo as "cobro" | "pago" || tipo,
      pagador: movimiento?.pagador || "",
      clienteId: "",
      importe: movimiento?.importe || 0,
      modalidad: (movimiento?.modalidad || "Cuenta SL") as "Paypal" | "Cuenta SL",
      detalles: movimiento?.detalles || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (isEditing && movimiento) {
      const movimientoData = {
        fecha: data.fecha,
        tipo: data.tipo,
        pagador: data.pagador,
        importe: data.importe,
        modalidad: data.modalidad,
        detalles: data.detalles,
      };
      await updateMovimiento(movimiento.id, movimientoData);
    } else {
      const movimientoData = {
        id: crypto.randomUUID(),
        fecha: data.fecha,
        tipo: data.tipo,
        pagador: data.pagador,
        importe: data.importe,
        modalidad: data.modalidad,
        detalles: data.detalles,
      };
      await createMovimiento(movimientoData);
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
              name="importe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Importe (€)</FormLabel>
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
              name="modalidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modalidad</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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