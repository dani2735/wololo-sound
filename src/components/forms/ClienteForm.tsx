import { useState } from "react";
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
import { useClientes } from "@/hooks/useClientes";
import { Tables } from "@/integrations/supabase/types";

type Cliente = Tables<'clientes'>;

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
});

type FormData = z.infer<typeof formSchema>;

interface ClienteFormProps {
  isOpen: boolean;
  onClose: () => void;
  cliente?: Cliente;
}

export function ClienteForm({ isOpen, onClose, cliente }: ClienteFormProps) {
  const { createCliente, updateCliente } = useClientes();
  const isEditing = !!cliente;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: {
      nombre: cliente?.nombre || "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    const clienteData = {
      nombre: data.nombre!,
    };
    
    if (isEditing && cliente) {
      await updateCliente(cliente.id, clienteData);
    } else {
      await createCliente(clienteData);
    }
    
    setIsSubmitting(false);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-primary" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"} Cliente
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}