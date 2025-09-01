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
      const { data, error } = await (supabase as any)
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
  const createSociedad = async (sociedadData: { nombre_fiscal?: string; cif?: string; direccion_1?: string; direccion_2?: string; }) => {
    try {
      const dataWithId = {
        id: Date.now().toString(),
        nombre_fiscal: sociedadData.nombre_fiscal,
        cif: sociedadData.cif,
        direccion_1: sociedadData.direccion_1 ?? null,
        direccion_2: sociedadData.direccion_2 ?? null,
      };

      const { data, error } = await (supabase as any)
        .from('sociedades')
        .insert([dataWithId])
        .select()
        .single();

      if (error) throw error;
      
      setSociedades(prev => [...prev, data as Sociedad]);
      toast.success('Sociedad creada exitosamente');
      return { data, error: null } as const;
    } catch (error: any) {
      console.error('Error creating sociedad:', error);
      toast.error('Error al crear sociedad: ' + error.message);
      return { data: null, error } as const;
    }
  };

  // Update existing sociedad
  const updateSociedad = async (id: string, updates: { nombre_fiscal?: string; cif?: string; direccion_1?: string | null; direccion_2?: string | null; }) => {
    try {
      const payload = {
        ...updates,
        direccion_1: updates.direccion_1 ?? null,
        direccion_2: updates.direccion_2 ?? null,
      };

      const { data, error } = await (supabase as any)
        .from('sociedades')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setSociedades(prev => prev.map(sociedad => 
        sociedad.id === id ? (data as Sociedad) : sociedad
      ));
      toast.success('Sociedad actualizada exitosamente');
      return { data, error: null } as const;
    } catch (error: any) {
      console.error('Error updating sociedad:', error);
      toast.error('Error al actualizar sociedad: ' + error.message);
      return { data: null, error } as const;
    }
  };

  // Delete sociedad
  const deleteSociedad = async (id: string) => {
    try {
      const { error } = await (supabase as any)
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