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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { CampañaPrensa, CampañaPrensaBase, Acciones } from "@/types";

const accionesSchema = z.object({
  instagramPost: z.number().min(0),
  instagramFlyer: z.number().min(0),
  instagramVideo: z.number().min(0),
  instagramVideoAna: z.number().min(0),
  instagramAgendaMadrid: z.number().min(0),
  instagramAgendaIbiza: z.number().min(0),
  webArticulo: z.number().min(0),
  webEntrevista: z.number().min(0),
  webAgenda: z.number().min(0),
  podcastMencion: z.number().min(0),
  podcastEntrevista: z.number().min(0),
  youtubeEntrevista: z.number().min(0),
  otrasAcciones: z.string(),
});

const formSchema = z.object({
  clienteNombre: z.string().min(1, "El nombre del cliente es requerido"),
  acciones: accionesSchema,
  detalles: z.string(),
  precio: z.number().min(0, "El precio debe ser mayor que 0"),
  cobroAna: z.number().min(0),
  comentarios: z.string(),
  estado: z.enum(["TERMINADO", "EN CURSO", "PENDIENTE"]),
  tipoCobro: z.enum(["Paypal", "Factura Wololo Sound", "Factura Adrián Oller"]),
});

type FormData = z.infer<typeof formSchema>;

interface CampañaFormProps {
  isOpen: boolean;
  onClose: () => void;
  campaña?: CampañaPrensa;
}

export function CampañaForm({ isOpen, onClose, campaña }: CampañaFormProps) {
  const { clientes, addCampaña, updateCampaña } = useAppStore();
  const isEditing = !!campaña;

  const getClienteNombre = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || "";
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: {
      clienteNombre: campaña ? getClienteNombre(campaña.clienteId) : "",
      acciones: campaña?.acciones || {
        instagramPost: 0,
        instagramFlyer: 0,
        instagramVideo: 0,
        instagramVideoAna: 0,
        instagramAgendaMadrid: 0,
        instagramAgendaIbiza: 0,
        webArticulo: 0,
        webEntrevista: 0,
        webAgenda: 0,
        podcastMencion: 0,
        podcastEntrevista: 0,
        youtubeEntrevista: 0,
        otrasAcciones: "",
      },
      detalles: campaña?.detalles || "",
      precio: campaña?.precio || 0,
      cobroAna: campaña?.cobroAna || 0,
      comentarios: campaña?.comentarios || "",
      estado: campaña?.estado || "EN CURSO",
      tipoCobro: campaña?.tipoCobro || "Paypal",
    },
  });

  const accionesNames = {
    instagramPost: "IG Post",
    instagramFlyer: "IG Flyer", 
    instagramVideo: "IG Video",
    instagramVideoAna: "IG Video Ana",
    instagramAgendaMadrid: "IG Agenda Madrid",
    instagramAgendaIbiza: "IG Agenda Ibiza",
    webArticulo: "Web Artículo",
    webEntrevista: "Web Entrevista", 
    webAgenda: "Web Agenda",
    podcastMencion: "Podcast Mención",
    podcastEntrevista: "Podcast Entrevista",
    youtubeEntrevista: "YouTube Entrevista",
  };

  const accionesGrupos = {
    Instagram: ["instagramPost", "instagramFlyer", "instagramVideo", "instagramVideoAna", "instagramAgendaMadrid", "instagramAgendaIbiza"],
    Web: ["webArticulo", "webEntrevista", "webAgenda"],
    Podcast: ["podcastMencion", "podcastEntrevista"],
    YouTube: ["youtubeEntrevista"],
  };

  const updateAccionValue = (field: keyof Acciones, delta: number) => {
    const currentValue = form.getValues(`acciones.${field}`) as number;
    const newValue = Math.max(0, currentValue + delta);
    form.setValue(`acciones.${field}`, newValue);
  };

  const onSubmit = (data: FormData) => {
    const fechaCreacion = new Date().toISOString().split('T')[0];
    
    // Find or create client
    let clienteId = "";
    const existingCliente = clientes.find(c => c.nombre.toLowerCase() === data.clienteNombre.toLowerCase());
    
    if (existingCliente) {
      clienteId = existingCliente.id;
    } else {
      // Create a temporary client ID for campaigns without full client data
      clienteId = `temp_client_${Date.now()}`;
    }
    
    if (isEditing && campaña) {
      updateCampaña(campaña.id, {
        clienteId: clienteId,
        acciones: data.acciones as Acciones,
        detalles: data.detalles,
        precio: data.precio,
        cobroAna: data.cobroAna,
        comentarios: data.comentarios,
        estado: data.estado,
        tipoCobro: data.tipoCobro,
      });
    } else {
      const newCampaña: CampañaPrensa = {
        id: `camp_${Date.now()}`,
        fechaCreacion,
        clienteId: clienteId,
        acciones: data.acciones as Acciones,
        detalles: data.detalles,
        precio: data.precio,
        cobroAna: data.cobroAna,
        comentarios: data.comentarios,
        estado: data.estado,
        tipoCobro: data.tipoCobro,
        estadoFacturacion: "Sin facturar",
        estadoCobro: "Sin cobrar",
      };
      addCampaña(newCampaña);
    }
    
    onClose();
  };

  const cobroAnaValue = form.watch("acciones.instagramVideoAna");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Campaña" : "Nueva Campaña de Prensa"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Cliente y Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clienteNombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TERMINADO">TERMINADO</SelectItem>
                        <SelectItem value="EN CURSO">EN CURSO</SelectItem>
                        <SelectItem value="PENDIENTE">PENDIENTE</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Acciones */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(accionesGrupos).map(([grupo, campos]) => (
                  <div key={grupo}>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      {grupo}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {campos.map((campo) => (
                        <div key={campo} className="flex items-center justify-between p-2 border rounded-md">
                          <span className="text-sm">
                            {accionesNames[campo as keyof typeof accionesNames]?.replace(/^(IG|Web|Podcast|YouTube)\s/, '') || campo}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => updateAccionValue(campo as keyof Acciones, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {form.watch(`acciones.${campo as keyof Acciones}`)}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => updateAccionValue(campo as keyof Acciones, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <FormField
                  control={form.control}
                  name="acciones.otrasAcciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Otras acciones</FormLabel>
                      <FormControl>
                        <Input placeholder="Especificar otras acciones..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Detalles y Comentarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="detalles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detalles</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detalles adicionales de la campaña..." 
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
                name="comentarios"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comentarios</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Comentarios adicionales..." 
                        className="min-h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Precio y Cobro Ana */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                name="cobroAna"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Cobro Ana (€)
                      {cobroAnaValue > 0 && <Badge variant="secondary" className="ml-2">Activo</Badge>}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        disabled={cobroAnaValue === 0}
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
                name="tipoCobro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Cobro</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Paypal">Paypal</SelectItem>
                        <SelectItem value="Factura Wololo Sound">Factura Wololo Sound</SelectItem>
                        <SelectItem value="Factura Adrián Oller">Factura Adrián Oller</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-primary">
                {isEditing ? "Actualizar" : "Crear"} Campaña
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}