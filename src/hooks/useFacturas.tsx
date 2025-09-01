import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Factura = Tables<'facturas'>;
type FacturaInsert = TablesInsert<'facturas'>;
type FacturaUpdate = TablesUpdate<'facturas'>;

export const useFacturas = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all facturas
  const fetchFacturas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('facturas')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) throw error;
      setFacturas(data || []);
    } catch (error: any) {
      console.error('Error fetching facturas:', error);
      toast.error('Error al cargar facturas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new factura
  const createFactura = async (facturaData: FacturaInsert) => {
    try {
      // Generate a UUID for the new factura
      const facturaWithId = {
        id: crypto.randomUUID(),
        ...facturaData
      };

      const { data, error } = await supabase
        .from('facturas')
        .insert(facturaWithId)
        .select()
        .single();

      if (error) throw error;
      
      setFacturas(prev => [data, ...prev]);
      toast.success('Factura creada exitosamente');
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating factura:', error);
      toast.error('Error al crear factura: ' + error.message);
      return { data: null, error };
    }
  };

  // Update existing factura
  const updateFactura = async (id: string, updates: FacturaUpdate) => {
    try {
      const { data, error } = await supabase
        .from('facturas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setFacturas(prev => prev.map(factura => 
        factura.id === id ? data : factura
      ));
      toast.success('Factura actualizada exitosamente');
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating factura:', error);
      toast.error('Error al actualizar factura: ' + error.message);
      return { data: null, error };
    }
  };

  // Delete factura
  const deleteFactura = async (id: string) => {
    try {
      const { error } = await supabase
        .from('facturas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setFacturas(prev => prev.filter(factura => factura.id !== id));
      toast.success('Factura eliminada exitosamente');
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting factura:', error);
      toast.error('Error al eliminar factura: ' + error.message);
      return { error };
    }
  };

  // Load facturas on hook initialization
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