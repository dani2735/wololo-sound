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
import { useAppStore } from "@/stores/useAppStore";
import { Cliente } from "@/types";

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  nombrePagador: z.string().min(1, "El nombre del pagador es requerido"),
  nif: z.string().min(1, "El NIF es requerido"),
  direccion: z.string().min(1, "La dirección es requerida"),
});

type FormData = z.infer<typeof formSchema>;

interface ClienteFormProps {
  isOpen: boolean;
  onClose: () => void;
  cliente?: Cliente;
}

export function ClienteForm({ isOpen, onClose, cliente }: ClienteFormProps) {
  const { addCliente, updateCliente } = useAppStore();
  const isEditing = !!cliente;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: cliente?.nombre || "",
      nombrePagador: cliente?.nombrePagador || "",
      nif: cliente?.nif || "",
      direccion: cliente?.direccion || "",
    },
  });

  const onSubmit = (data: FormData) => {
    if (isEditing && cliente) {
      updateCliente(cliente.id, data);
    } else {
      const newCliente: Cliente = {
        id: `client_${Date.now()}`,
        nombre: data.nombre,
        nombrePagador: data.nombrePagador,
        nif: data.nif,
        direccion: data.direccion,
      };
      addCliente(newCliente);
    }
    
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
                    <Input placeholder="Nombre comercial o artístico" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombrePagador"
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
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-primary">
                {isEditing ? "Actualizar" : "Crear"} Cliente
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}