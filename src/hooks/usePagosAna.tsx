import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export type PagoAna = Tables<'pagos_ana'>;
export type PagoAnaInsert = TablesInsert<'pagos_ana'>;
export type PagoAnaUpdate = TablesUpdate<'pagos_ana'>;

export type PagoAnaDetalle = Tables<'pagos_ana_detalle'>;

// Hook para obtener todos los pagos a Ana
export const usePagosAna = () => {
  return useQuery({
    queryKey: ['pagos-ana'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pagos_ana')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) {
        console.error('Error fetching pagos Ana:', error);
        throw error;
      }

      return data || [];
    },
  });
};

// Hook para obtener campañas pendientes de pago a Ana
export const useCampanasPendientesPagoAna = () => {
  return useQuery({
    queryKey: ['campanas-pendientes-pago-ana'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campanas')
        .select(`
          *,
          clientes!inner(nombre)
        `)
        .gt('cobro_ana', 0)
        .in('estado_pago_ana', ['Pendiente', 'N/A'])
        .order('fecha', { ascending: false });

      if (error) {
        console.error('Error fetching campañas pendientes pago Ana:', error);
        throw error;
      }

      return data || [];
    },
  });
};

// Hook para crear un pago a Ana
export const useCreatePagoAna = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pago: PagoAnaInsert) => {
      const { data, error } = await supabase
        .from('pagos_ana')
        .insert([pago])
        .select()
        .single();

      if (error) {
        console.error('Error creating pago Ana:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagos-ana'] });
      queryClient.invalidateQueries({ queryKey: ['campanas-pendientes-pago-ana'] });
      queryClient.invalidateQueries({ queryKey: ['campanas'] });
      toast.success('Pago a Ana creado exitosamente');
    },
    onError: (error) => {
      console.error('Error creating pago Ana:', error);
      toast.error('Error al crear el pago a Ana');
    },
  });
};

// Hook para actualizar un pago a Ana
export const useUpdatePagoAna = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: PagoAnaUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('pagos_ana')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating pago Ana:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagos-ana'] });
      queryClient.invalidateQueries({ queryKey: ['campanas-pendientes-pago-ana'] });
      toast.success('Pago a Ana actualizado exitosamente');
    },
    onError: (error) => {
      console.error('Error updating pago Ana:', error);
      toast.error('Error al actualizar el pago a Ana');
    },
  });
};

// Hook para eliminar un pago a Ana
export const useDeletePagoAna = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pagos_ana')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting pago Ana:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagos-ana'] });
      queryClient.invalidateQueries({ queryKey: ['campanas-pendientes-pago-ana'] });
      toast.success('Pago a Ana eliminado exitosamente');
    },
    onError: (error) => {
      console.error('Error deleting pago Ana:', error);
      toast.error('Error al eliminar el pago a Ana');
    },
  });
};

// Hook para asociar campañas a un pago
export const useAsociarCampanasPago = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pagoId, campanasIds }: { pagoId: string; campanasIds: string[] }) => {
      // Primero eliminar asociaciones existentes
      await supabase
        .from('pagos_ana_detalle')
        .delete()
        .eq('id_pago', pagoId);

      // Luego crear las nuevas asociaciones
      const detalles = campanasIds.map(campaniaId => ({
        id_pago: pagoId,
        id_campana: campaniaId
      }));

      if (detalles.length > 0) {
        const { error } = await supabase
          .from('pagos_ana_detalle')
          .insert(detalles);

        if (error) {
          console.error('Error associating campanias to pago:', error);
          throw error;
        }
      }

      // Actualizar estado de pago en las campañas
      const { error: updateError } = await supabase
        .from('campanas')
        .update({ estado_pago_ana: 'Pagado' })
        .in('id', campanasIds);

      if (updateError) {
        console.error('Error updating campañas estado_pago_ana:', updateError);
        throw updateError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagos-ana'] });
      queryClient.invalidateQueries({ queryKey: ['campanas-pendientes-pago-ana'] });
      queryClient.invalidateQueries({ queryKey: ['campanas'] });
      toast.success('Campañas asociadas al pago exitosamente');
    },
    onError: (error) => {
      console.error('Error associating campanias to pago:', error);
      toast.error('Error al asociar campañas al pago');
    },
  });
};