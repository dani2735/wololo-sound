import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePagosAna } from '@/hooks/usePagosAna';

type PagoAna = {
  id: string;
  fecha: string | null;
  importe: number | null;
  referencia: string | null;
  modalidad: string | null;
};

const pagoAnaSchema = z.object({
  fecha: z.string().min(1, "La fecha es requerida"),
  importe: z.number().min(0.01, "El importe debe ser mayor a 0"),
  referencia: z.string().optional(),
  modalidad: z.string().min(1, "La modalidad es requerida"),
});

type PagoAnaFormData = z.infer<typeof pagoAnaSchema>;

interface PagoAnaFormProps {
  isOpen: boolean;
  onClose: () => void;
  pago?: PagoAna;
}

export function PagoAnaForm({ isOpen, onClose, pago }: PagoAnaFormProps) {
  const { createPagoAna, updatePagoAna } = usePagosAna();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PagoAnaFormData>({
    resolver: zodResolver(pagoAnaSchema),
    defaultValues: {
      fecha: '',
      importe: 0,
      referencia: '',
      modalidad: '',
    },
  });

  useEffect(() => {
    if (pago) {
      form.reset({
        fecha: pago.fecha || '',
        importe: pago.importe || 0,
        referencia: pago.referencia || '',
        modalidad: pago.modalidad || '',
      });
    } else {
      form.reset({
        fecha: new Date().toISOString().split('T')[0],
        importe: 0,
        referencia: '',
        modalidad: '',
      });
    }
  }, [pago, form]);

  const onSubmit = async (data: PagoAnaFormData) => {
    setIsSubmitting(true);
    try {
      let result;
      if (pago) {
        result = await updatePagoAna(pago.id, data);
      } else {
        result = await createPagoAna({
          fecha: data.fecha,
          importe: data.importe,
          referencia: data.referencia ?? '',
          modalidad: data.modalidad,
        });
      }

      if (result.error) {
        throw result.error;
      }

      onClose();
      form.reset();
    } catch (error: any) {
      console.error('Error submitting pago ana:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-card border-0 shadow-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {pago ? 'Editar Pago a Ana' : 'Registrar Pago a Ana'}
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
                    <Input
                      type="date"
                      {...field}
                      className="bg-background border-border"
                    />
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
                      step="0.01"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className="bg-background border-border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="referencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referencia</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Número de transferencia, referencia..."
                      className="bg-background border-border"
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
                  <FormLabel>Modalidad de Pago</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Seleccionar modalidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Transferencia">Transferencia</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Efectivo">Efectivo</SelectItem>
                      <SelectItem value="Bizum">Bizum</SelectItem>
                      <SelectItem value="Otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-primary shadow-elegant hover:shadow-hover"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : (pago ? 'Actualizar' : 'Registrar')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}