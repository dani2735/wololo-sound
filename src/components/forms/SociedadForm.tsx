import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSociedades } from '@/hooks/useSociedades';

type Sociedad = {
  id: string;
  nombre_fiscal: string;
  cif: string;
  direccion_1: string | null;
  direccion_2: string | null;
};

const sociedadSchema = z.object({
  nombre_fiscal: z.string().min(1, "El nombre fiscal es requerido"),
  cif: z.string().min(1, "El CIF es requerido"),
  direccion_1: z.string().optional(),
  direccion_2: z.string().optional(),
});

type SociedadFormData = z.infer<typeof sociedadSchema>;

interface SociedadFormProps {
  isOpen: boolean;
  onClose: () => void;
  sociedad?: Sociedad;
}

export function SociedadForm({ isOpen, onClose, sociedad }: SociedadFormProps) {
  const { createSociedad, updateSociedad } = useSociedades();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SociedadFormData>({
    resolver: zodResolver(sociedadSchema),
    defaultValues: {
      nombre_fiscal: '',
      cif: '',
      direccion_1: '',
      direccion_2: '',
    },
  });

  useEffect(() => {
    if (sociedad) {
      form.reset({
        nombre_fiscal: sociedad.nombre_fiscal || '',
        cif: sociedad.cif || '',
        direccion_1: sociedad.direccion_1 || '',
        direccion_2: sociedad.direccion_2 || '',
      });
    } else {
      form.reset({
        nombre_fiscal: '',
        cif: '',
        direccion_1: '',
        direccion_2: '',
      });
    }
  }, [sociedad, form]);

  const onSubmit = async (data: SociedadFormData) => {
    setIsSubmitting(true);
    try {
      let result;
      if (sociedad) {
        result = await updateSociedad(sociedad.id, data);
      } else {
        result = await createSociedad(data);
      }

      if (result.error) {
        throw result.error;
      }

      onClose();
      form.reset();
    } catch (error: any) {
      console.error('Error submitting sociedad:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-card border-0 shadow-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {sociedad ? 'Editar Sociedad' : 'Nueva Sociedad'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre_fiscal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Fiscal</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Razón social de la empresa"
                      className="bg-background border-border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CIF</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="A12345678"
                      className="bg-background border-border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="direccion_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección Principal</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Calle, número, código postal, ciudad"
                      className="bg-background border-border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="direccion_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección Secundaria</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Dirección adicional (opcional)"
                      className="bg-background border-border"
                    />
                  </FormControl>
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
                {isSubmitting ? 'Guardando...' : (sociedad ? 'Actualizar' : 'Crear')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}