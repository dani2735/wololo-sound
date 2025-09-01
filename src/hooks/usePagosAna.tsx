import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type PagoAna = {
  id: string;
  fecha: string | null;
  importe: number | null;
  referencia: string | null;
  modalidad: string | null;
};

type Campana = {
  id: string;
  fecha: string | null;
  precio: number | null;
  cobro_ana: number | null;
  estado_pago_ana: string | null;
  id_cliente: string | null;
  acciones: string | null;
};

export const usePagosAna = () => {
  const [pagosAna, setPagosAna] = useState<PagoAna[]>([]);
  const [campanasPendientesPago, setCampanasPendientesPago] = useState<Campana[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPagosAna = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('pagos_ana')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) throw error;
      setPagosAna((data || []) as PagoAna[]);
    } catch (error: any) {
      console.error('Error fetching pagos ana:', error);
      toast.error('Error al cargar pagos: ' + error.message);
    }
  };

  const fetchCampanasPendientesPago = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('campanas')
        .select('*')
        .gt('cobro_ana', 0)
        .in('estado_pago_ana', ['Pendiente', 'N/A'])
        .order('fecha', { ascending: false });

      if (error) throw error;
      setCampanasPendientesPago((data || []) as Campana[]);
    } catch (error: any) {
      console.error('Error fetching campañas pendientes pago:', error);
      toast.error('Error al cargar campañas pendientes: ' + error.message);
    }
  };

  const createPagoAna = async (pagoData: { fecha: string; importe: number; referencia?: string | null; modalidad: string; }) => {
    try {
      const dataWithId = {
        id: Date.now().toString(),
        fecha: pagoData.fecha,
        importe: pagoData.importe,
        referencia: pagoData.referencia ?? '',
        modalidad: pagoData.modalidad,
      };

      const { data, error } = await (supabase as any)
        .from('pagos_ana')
        .insert([dataWithId])
        .select()
        .single();

      if (error) throw error;
      
      setPagosAna((prev) => [data as PagoAna, ...prev]);
      toast.success('Pago registrado exitosamente');
      return { data, error: null } as const;
    } catch (error: any) {
      console.error('Error creating pago ana:', error);
      toast.error('Error al registrar pago: ' + error.message);
      return { data: null, error } as const;
    }
  };

  const updatePagoAna = async (id: string, updates: Partial<PagoAna>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('pagos_ana')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setPagosAna((prev) => prev.map((pago) => (pago.id === id ? (data as PagoAna) : pago)));
      toast.success('Pago actualizado exitosamente');
      return { data, error: null } as const;
    } catch (error: any) {
      console.error('Error updating pago ana:', error);
      toast.error('Error al actualizar pago: ' + error.message);
      return { data: null, error } as const;
    }
  };

  const deletePagoAna = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('pagos_ana')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPagosAna((prev) => prev.filter((pago) => pago.id !== id));
      toast.success('Pago eliminado exitosamente');
      return { error: null } as const;
    } catch (error: any) {
      console.error('Error deleting pago ana:', error);
      toast.error('Error al eliminar pago: ' + error.message);
      return { error } as const;
    }
  };

  const asociarCampanasAPago = async (pagoId: string, campanaIds: string[]) => {
    try {
      const detalleData = campanaIds.map((campanaId) => ({
        id_pago: pagoId,
        id_campana: campanaId,
      }));

      const { error: detalleError } = await (supabase as any)
        .from('pagos_ana_detalle')
        .insert(detalleData);

      if (detalleError) throw detalleError;

      const { error: campanaError } = await (supabase as any)
        .from('campanas')
        .update({ estado_pago_ana: 'Pagado' })
        .in('id', campanaIds);

      if (campanaError) throw campanaError;

      await Promise.all([fetchCampanasPendientesPago(), fetchPagosAna()]);
      
      toast.success(`${campanaIds.length} campañas asociadas al pago exitosamente`);
      return { error: null } as const;
    } catch (error: any) {
      console.error('Error associating campañas to pago:', error);
      toast.error('Error al asociar campañas: ' + error.message);
      return { error } as const;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPagosAna(), fetchCampanasPendientesPago()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  return {
    pagosAna,
    campanasPendientesPago,
    loading,
    createPagoAna,
    updatePagoAna,
    deletePagoAna,
    asociarCampanasAPago,
    refetch: () => Promise.all([fetchPagosAna(), fetchCampanasPendientesPago()])
  };
};