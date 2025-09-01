import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Movimiento = Tables<'contabilidad'>;
type MovimientoInsert = TablesInsert<'contabilidad'>;
type MovimientoUpdate = TablesUpdate<'contabilidad'>;

export const useContabilidad = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all movimientos
  const fetchMovimientos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contabilidad')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) throw error;
      setMovimientos(data || []);
    } catch (error: any) {
      console.error('Error fetching movimientos:', error);
      toast.error('Error al cargar movimientos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new movimiento
  const createMovimiento = async (movimientoData: Omit<MovimientoInsert, 'saldo_paypal' | 'saldo_sl'>) => {
    try {
      // Generate a UUID for the new movimiento
      const movimientoWithId = {
        id: crypto.randomUUID(),
        ...movimientoData
      };

      const { data, error } = await supabase
        .from('contabilidad')
        .insert(movimientoWithId)
        .select()
        .single();

      if (error) throw error;
      
      setMovimientos(prev => [data, ...prev]);
      toast.success('Movimiento creado exitosamente');
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating movimiento:', error);
      toast.error('Error al crear movimiento: ' + error.message);
      return { data: null, error };
    }
  };

  // Update existing movimiento
  const updateMovimiento = async (id: string, updates: MovimientoUpdate) => {
    try {
      const { data, error } = await supabase
        .from('contabilidad')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setMovimientos(prev => prev.map(movimiento => 
        movimiento.id === id ? data : movimiento
      ));
      toast.success('Movimiento actualizado exitosamente');
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating movimiento:', error);
      toast.error('Error al actualizar movimiento: ' + error.message);
      return { data: null, error };
    }
  };

  // Delete movimiento
  const deleteMovimiento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contabilidad')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMovimientos(prev => prev.filter(movimiento => movimiento.id !== id));
      toast.success('Movimiento eliminado exitosamente');
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting movimiento:', error);
      toast.error('Error al eliminar movimiento: ' + error.message);
      return { error };
    }
  };

  // Get current balances
  const getCurrentBalances = () => {
    if (movimientos.length === 0) return { paypal: 0, sl: 0 };
    
    const latest = movimientos.reduce((latest, current) => 
      new Date(current.fecha!) > new Date(latest.fecha!) ? current : latest
    );
    
    return {
      paypal: latest.saldo_paypal || 0,
      sl: latest.saldo_sl || 0
    };
  };

  // Load movimientos on hook initialization
  useEffect(() => {
    fetchMovimientos();
  }, []);

  return {
    movimientos,
    loading,
    createMovimiento,
    updateMovimiento,
    deleteMovimiento,
    getCurrentBalances,
    refetch: fetchMovimientos
  };
};