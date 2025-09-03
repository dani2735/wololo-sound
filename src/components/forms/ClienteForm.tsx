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
import { supabase } from "@/integrations/supabase/client";

type Cliente = any;

const formSchema = z.object({
  nombre_cliente: z.string().min(1, "El nombre es requerido"),
  nombre_pagador: z.string().optional(),
  nif: z.string().optional(),
  direccion: z.string().optional(),
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
    nombre_cliente: cliente?.nombre || "",
    nombre_pagador: "",
    nif: "",
    direccion: "",
  },
});

  const [isSubmitting, setIsSubmitting] = useState(false);

const onSubmit = async (data: FormData) => {
  setIsSubmitting(true);

  try {
    let clienteId = cliente?.id;

    if (isEditing && cliente) {
      await updateCliente(cliente.id, { nombre: data.nombre_cliente } as any);
      clienteId = cliente.id;
    } else {
      const result = await createCliente({ nombre: data.nombre_cliente } as any);
      clienteId = result.data?.id;
    }

    // If fiscal data provided, create sociedad and link it
    if (clienteId && (data.nombre_pagador || data.nif || data.direccion)) {
      const sociedadId = crypto.randomUUID();
      const { data: sociedad, error: sociedadError } = await (supabase as any)
        .from('sociedades')
        .insert([
          {
            id: sociedadId,
            nombre_fiscal: data.nombre_pagador || data.nombre_cliente,
            cif: data.nif || '',
            direccion_1: data.direccion || null,
            direccion_2: null,
          }
        ])
        .select()
        .single();

      if (sociedadError) throw sociedadError;

      const { error: linkError } = await (supabase as any)
        .from('clientes_sociedades')
        .insert([{ id_cliente: clienteId, id_sociedad: sociedad.id }]);

      if (linkError) throw linkError;
    }
  } finally {
    setIsSubmitting(false);
    form.reset();
    onClose();
  }
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
              name="nombre_cliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre comercial o artístico" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombre_pagador"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Pagador</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre legal que aparece en facturas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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