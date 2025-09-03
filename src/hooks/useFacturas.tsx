import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import { Database } from '@/integrations/supabase/types';

export interface Factura {
  id: string;
  factura: string;
  fecha: string;
  pagador: string;
  cliente: string;
  precio: number;
  iva: number;
  irpf: number;
  pago_cliente: number;
  fecha_cobro?: string;
  detalles?: string;
  estado_cobro?: string;
  comentarios?: string;
  referencia?: string;
  id_campana?: string;
  id_sociedad?: string;
}

export const useFacturas = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFacturas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('facturas')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) {
        console.error('Error fetching facturas:', error);
        toast.error('Error al cargar las facturas');
        return;
      }

      setFacturas(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar las facturas');
    } finally {
      setLoading(false);
    }
  };

  const createFactura = async (facturaData: any) => {
    try {
      const { data, error } = await supabase
        .from('facturas')
        .insert(facturaData)
        .select()
        .single();

      if (error) {
        console.error('Error creating factura:', error);
        toast.error('Error al crear la factura');
        return;
      }

      setFacturas(prev => [data, ...prev]);
      toast.success('Factura creada exitosamente');
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear la factura');
    }
  };

  const updateFactura = async (id: string, updates: Partial<Factura>) => {
    try {
      const { data, error } = await supabase
        .from('facturas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating factura:', error);
        toast.error('Error al actualizar la factura');
        return;
      }

      setFacturas(prev => 
        prev.map(factura => factura.id === id ? data : factura)
      );
      toast.success('Factura actualizada exitosamente');
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar la factura');
    }
  };

  const deleteFactura = async (id: string) => {
    try {
      const { error } = await supabase
        .from('facturas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting factura:', error);
        toast.error('Error al eliminar la factura');
        return;
      }

      setFacturas(prev => prev.filter(factura => factura.id !== id));
      toast.success('Factura eliminada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar la factura');
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, []);

  return {
    facturas,
    loading,
    createFactura,
    updateFactura,
    deleteFactura,
    refetch: fetchFacturas
  };
};