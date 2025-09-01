import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Sociedad = {
  id: string;
  nombre_fiscal: string;
  cif: string;
  direccion_1: string | null;
  direccion_2: string | null;
};

export const useSociedades = () => {
  const [sociedades, setSociedades] = useState<Sociedad[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all sociedades
  const fetchSociedades = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sociedades')
        .select('*')
        .order('nombre_fiscal', { ascending: true });

      if (error) throw error;
      setSociedades(data || []);
    } catch (error: any) {
      console.error('Error fetching sociedades:', error);
      toast.error('Error al cargar sociedades: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new sociedad
  const createSociedad = async (sociedadData: Omit<Sociedad, 'id'>) => {
    try {
      const dataWithId = {
        ...sociedadData,
        id: Date.now().toString() // Generate simple ID
      };

      const { data, error } = await supabase
        .from('sociedades')
        .insert([dataWithId])
        .select()
        .single();

      if (error) throw error;
      
      setSociedades(prev => [...prev, data]);
      toast.success('Sociedad creada exitosamente');
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating sociedad:', error);
      toast.error('Error al crear sociedad: ' + error.message);
      return { data: null, error };
    }
  };

  // Update existing sociedad
  const updateSociedad = async (id: string, updates: Partial<Sociedad>) => {
    try {
      const { data, error } = await supabase
        .from('sociedades')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setSociedades(prev => prev.map(sociedad => 
        sociedad.id === id ? data : sociedad
      ));
      toast.success('Sociedad actualizada exitosamente');
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating sociedad:', error);
      toast.error('Error al actualizar sociedad: ' + error.message);
      return { data: null, error };
    }
  };

  // Delete sociedad
  const deleteSociedad = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sociedades')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSociedades(prev => prev.filter(sociedad => sociedad.id !== id));
      toast.success('Sociedad eliminada exitosamente');
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting sociedad:', error);
      toast.error('Error al eliminar sociedad: ' + error.message);
      return { error };
    }
  };

  // Load sociedades on hook initialization
  useEffect(() => {
    fetchSociedades();
  }, []);

  return {
    sociedades,
    loading,
    createSociedad,
    updateSociedad,
    deleteSociedad,
    refetch: fetchSociedades
  };
};