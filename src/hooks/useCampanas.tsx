import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Campana = Tables<'campanas'>;
type CampanaInsert = TablesInsert<'campanas'>;
type CampanaUpdate = TablesUpdate<'campanas'>;

export const useCampanas = () => {
  const [campanas, setCampanas] = useState<Campana[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all campanas
  const fetchCampanas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campanas')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) throw error;
      setCampanas(data || []);
    } catch (error: any) {
      console.error('Error fetching campanas:', error);
      toast.error('Error al cargar campañas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new campana
  const createCampana = async (campanaData: CampanaInsert) => {
    try {
      // Generate a UUID for the new campana
      const campanaWithId = {
        id: crypto.randomUUID(),
        ...campanaData
      };

      const { data, error } = await supabase
        .from('campanas')
        .insert(campanaWithId)
        .select()
        .single();

      if (error) throw error;
      
      setCampanas(prev => [data, ...prev]);
      toast.success('Campaña creada exitosamente');
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating campana:', error);
      toast.error('Error al crear campaña: ' + error.message);
      return { data: null, error };
    }
  };

  // Update existing campana
  const updateCampana = async (id: string, updates: CampanaUpdate) => {
    try {
      const { data, error } = await supabase
        .from('campanas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCampanas(prev => prev.map(campana => 
        campana.id === id ? data : campana
      ));
      toast.success('Campaña actualizada exitosamente');
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating campana:', error);
      toast.error('Error al actualizar campaña: ' + error.message);
      return { data: null, error };
    }
  };

  // Delete campana
  const deleteCampana = async (id: string) => {
    try {
      const { error } = await supabase
        .from('campanas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCampanas(prev => prev.filter(campana => campana.id !== id));
      toast.success('Campaña eliminada exitosamente');
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting campana:', error);
      toast.error('Error al eliminar campaña: ' + error.message);
      return { error };
    }
  };

  // Load campanas on hook initialization
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