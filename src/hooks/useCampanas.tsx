import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import { Database } from '@/integrations/supabase/types';

export interface CampanaPrensa {
  id: string;
  fecha: string;
  id_cliente: string;
  acciones: string;
  detalles: string;
  precio: number;
  cobro_ana: number;
  cobro_wololo_sound: number;
  estado_campana: string;
  tipo_cobro: string;
  estado_facturacion: string;
  estado_cobro: string;
  importe_facturado: number;
  importe_pendiente_facturar: number;
  importe_cobrado: number;
  importe_pendiente_cobrar: number;
  estado_pago_ana: string;
  comentarios: string;
}
export type { Factura } from '@/hooks/useFacturas';

export const useCampanas = () => {
  const [campanas, setCampanas] = useState<CampanaPrensa[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampanas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campanas')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) {
        console.error('Error fetching campanas:', error);
        toast.error('Error al cargar las campañas');
        return;
      }

      setCampanas(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar las campañas');
    } finally {
      setLoading(false);
    }
  };

  const createCampana = async (campanaData: any) => {
    try {
      const { data, error } = await supabase
        .from('campanas')
        .insert(campanaData)
        .select()
        .single();

      if (error) {
        console.error('Error creating campana:', error);
        toast.error('Error al crear la campaña');
        return;
      }

      setCampanas(prev => [data, ...prev]);
      toast.success('Campaña creada exitosamente');
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear la campaña');
    }
  };

  const updateCampana = async (id: string, updates: Partial<CampanaPrensa>) => {
    try {
      const { data, error } = await supabase
        .from('campanas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating campana:', error);
        toast.error('Error al actualizar la campaña');
        return;
      }

      setCampanas(prev => 
        prev.map(campana => campana.id === id ? data : campana)
      );
      toast.success('Campaña actualizada exitosamente');
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar la campaña');
    }
  };

  const deleteCampana = async (id: string) => {
    try {
      const { error } = await supabase
        .from('campanas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting campana:', error);
        toast.error('Error al eliminar la campaña');
        return;
      }

      setCampanas(prev => prev.filter(campana => campana.id !== id));
      toast.success('Campaña eliminada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar la campaña');
    }
  };

  useEffect(() => {
    fetchCampanas();
  }, []);

  return {
    campanas,
    loading,
    createCampana,
    updateCampana,
    deleteCampana,
    refetch: fetchCampanas
  };
};