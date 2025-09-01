import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreatePagoAna, useUpdatePagoAna, type PagoAna } from "@/hooks/usePagosAna";
import { Plus, Edit } from "lucide-react";

const pagoAnaSchema = z.object({
  fecha: z.string().min(1, "La fecha es requerida"),
  importe: z.number().min(0, "El importe debe ser mayor a 0"),
  referencia: z.string().optional(),
  modalidad: z.string().optional(),
});

type PagoAnaFormData = z.infer<typeof pagoAnaSchema>;

interface PagoAnaFormProps {
  pago?: PagoAna;
  onSuccess?: () => void;
}

export function PagoAnaForm({ pago, onSuccess }: PagoAnaFormProps) {
  const [open, setOpen] = useState(false);
  const createPagoAna = useCreatePagoAna();
  const updatePagoAna = useUpdatePagoAna();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PagoAnaFormData>({
    resolver: zodResolver(pagoAnaSchema),
    defaultValues: pago ? {
      fecha: pago.fecha || "",
      importe: pago.importe || 0,
      referencia: pago.referencia || "",
      modalidad: pago.modalidad || "",
    } : {
      fecha: new Date().toISOString().split('T')[0],
      importe: 0,
      referencia: "",
      modalidad: "",
    },
  });

  const modalidad = watch("modalidad");

  const onSubmit = async (data: PagoAnaFormData) => {
    try {
      const pagoData = {
        ...data,
        id: pago?.id || `pago_${Date.now()}`,
      };

      if (pago?.id) {
        await updatePagoAna.mutateAsync({ id: pago.id, ...data });
      } else {
        await createPagoAna.mutateAsync(pagoData);
      }

      setOpen(false);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error saving pago Ana:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={pago ? "ghost" : "default"} size={pago ? "sm" : "default"}>
          {pago ? (
            <>
              <Edit className="h-4 w-4" />
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Pago a Ana
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {pago ? "Editar Pago a Ana" : "Nuevo Pago a Ana"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                {...register("fecha")}
              />
              {errors.fecha && (
                <p className="text-sm text-destructive">{errors.fecha.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="importe">Importe *</Label>
              <Input
                id="importe"
                type="number"
                step="0.01"
                {...register("importe", { valueAsNumber: true })}
              />
              {errors.importe && (
                <p className="text-sm text-destructive">{errors.importe.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="modalidad">Modalidad</Label>
            <Select value={modalidad} onValueChange={(value) => setValue("modalidad", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la modalidad de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Transferencia bancaria">Transferencia bancaria</SelectItem>
                <SelectItem value="PayPal">PayPal</SelectItem>
                <SelectItem value="Bizum">Bizum</SelectItem>
                <SelectItem value="Efectivo">Efectivo</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="referencia">Referencia</Label>
            <Textarea
              id="referencia"
              placeholder="Número de transferencia, referencia, etc."
              {...register("referencia")}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createPagoAna.isPending || updatePagoAna.isPending}
            >
              {createPagoAna.isPending || updatePagoAna.isPending 
                ? "Guardando..." 
                : pago ? "Actualizar" : "Crear Pago"
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}