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
import { Plus, Minus, Search } from "lucide-react";
import { useCampanas } from "@/hooks/useCampanas";
import { useClientes } from "@/hooks/useClientes";
import { Tables } from "@/integrations/supabase/types";

type Campana = Tables<'campanas'>;

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
  campaña?: Campana;
}

export function CampañaForm({ isOpen, onClose, campaña }: CampañaFormProps) {
  const { clientes } = useClientes();
  const { createCampana, updateCampana } = useCampanas();
  const isEditing = !!campaña;
  const [showClienteSearch, setShowClienteSearch] = useState(false);

  const getClienteNombre = (clienteId: string | null) => {
    if (!clienteId) return "";
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || "";
  };

  const parseAcciones = (accionesStr: string | null) => {
    if (!accionesStr) {
      return {
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
      };
    }

    try {
      return JSON.parse(accionesStr);
    } catch {
      return {
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
      };
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: {
      clienteNombre: campaña ? getClienteNombre(campaña.id_cliente) : "",
      acciones: campaña ? parseAcciones(campaña.acciones) : {
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
      cobroAna: campaña?.cobro_ana || 0,
      comentarios: campaña?.comentarios || "",
      estado: (campaña?.estado_campana || "EN CURSO") as "TERMINADO" | "EN CURSO" | "PENDIENTE",
      tipoCobro: (campaña?.tipo_cobro || "Factura Wololo Sound") as "Paypal" | "Factura Wololo Sound" | "Factura Adrián Oller",
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

  const updateAccionValue = (field: keyof typeof accionesNames, delta: number) => {
    const currentValue = form.getValues(`acciones.${field}`) as number;
    const newValue = Math.max(0, currentValue + delta);
    form.setValue(`acciones.${field}`, newValue);
  };

  const onSubmit = async (data: FormData) => {
    // Find or create client ID
    let clienteId = "";
    const existingCliente = clientes.find(c => c.nombre.toLowerCase() === data.clienteNombre.toLowerCase());
    
    if (existingCliente) {
      clienteId = existingCliente.id;
    } else {
      // For now, we'll require an existing client
      // TODO: Implement client creation
      alert("Cliente no encontrado. Por favor, selecciona un cliente existente.");
      return;
    }
    
    if (isEditing && campaña) {
      const campanaData = {
        fecha: new Date().toISOString().split('T')[0],
        id_cliente: clienteId,
        acciones: JSON.stringify(data.acciones),
        detalles: data.detalles,
        precio: data.precio,
        cobro_ana: data.cobroAna,
        comentarios: data.comentarios,
        estado_campana: data.estado,
        tipo_cobro: data.tipoCobro,
        estado_facturacion: "Sin facturar",
        estado_cobro: "Sin cobrar",
      };
      await updateCampana(campaña.id, campanaData);
    } else {
      const campanaData = {
        id: crypto.randomUUID(),
        fecha: new Date().toISOString().split('T')[0],
        id_cliente: clienteId,
        acciones: JSON.stringify(data.acciones),
        detalles: data.detalles,
        precio: data.precio,
        cobro_ana: data.cobroAna,
        comentarios: data.comentarios,
        estado_campana: data.estado,
        tipo_cobro: data.tipoCobro,
        estado_facturacion: "Sin facturar",
        estado_cobro: "Sin cobrar",
      };
      await createCampana(campanaData);
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
                      <div className="flex gap-2">
                        <Input placeholder="Nombre del cliente" {...field} />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const nombreCliente = field.value.toLowerCase();
                            if (nombreCliente) {
                              const clientesCoincidentes = clientes.filter(c => 
                                c.nombre.toLowerCase().includes(nombreCliente)
                              );
                              setShowClienteSearch(true);
                            } else {
                              setShowClienteSearch(!showClienteSearch);
                            }
                          }}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    {showClienteSearch && (
                      <div className="mt-2 p-2 border rounded-md bg-muted/30">
                        <p className="text-sm font-medium mb-2">
                          {field.value ? `Clientes que coinciden con "${field.value}":` : "Clientes existentes:"}
                        </p>
                        {(() => {
                          const clientesFiltrados = field.value 
                            ? clientes.filter(c => c.nombre.toLowerCase().includes(field.value.toLowerCase()))
                            : clientes;
                          
                          return clientesFiltrados.length > 0 ? (
                            <div className="space-y-1">
                              {clientesFiltrados.map(cliente => (
                                <div 
                                  key={cliente.id}
                                  className="text-sm p-1 hover:bg-accent rounded cursor-pointer"
                                  onClick={() => {
                                    field.onChange(cliente.nombre);
                                    setShowClienteSearch(false);
                                  }}
                                >
                                  {cliente.nombre}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {field.value ? "No se encontraron clientes similares" : "No hay clientes registrados"}
                            </p>
                          );
                        })()}
                      </div>
                    )}
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
                              onClick={() => updateAccionValue(campo as keyof typeof accionesNames, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {form.watch(`acciones.${campo as keyof typeof accionesNames}`)}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => updateAccionValue(campo as keyof typeof accionesNames, 1)}
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
                        onFocus={(e) => {
                          if (e.target.value === "0") {
                            e.target.select();
                          }
                        }}
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
                        onFocus={(e) => {
                          if (e.target.value === "0") {
                            e.target.select();
                          }
                        }}
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