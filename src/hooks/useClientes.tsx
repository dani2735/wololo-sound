import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Cliente = any;
type ClienteInsert = any;
type ClienteUpdate = any;

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all clientes with their sociedades
  const fetchClientes = async () => {
    try {
      setLoading(true);
      
      // Get clientes with their sociedades
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes')
        .select(`
          *,
          clientes_sociedades!inner(
            sociedades!inner(*)
          )
        `)
        .order('nombre', { ascending: true });

      if (clientesError) throw clientesError;

      // Transform the data to include sociedad info directly
      const transformedClientes = clientesData?.map((cliente: any) => ({
        ...cliente,
        sociedad: cliente.clientes_sociedades?.[0]?.sociedades || null
      })) || [];

      setClientes(transformedClientes as any);
    } catch (error: any) {
      console.error('Error fetching clientes:', error);
      toast.error('Error al cargar clientes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

// Create new cliente
const createCliente = async (clienteData: { nombre: string }) => {
  try {
    const payload = {
      id: crypto.randomUUID(),
      nombre: clienteData.nombre,
    };

    const { data, error } = await supabase
      .from('clientes')
      .insert([payload as any])
      .select()
      .single();

    if (error) throw error;
    
    setClientes(prev => [...prev, data]);
    toast.success('Cliente creado exitosamente');
    return { data, error: null } as const;
  } catch (error: any) {
    console.error('Error creating cliente:', error);
    toast.error('Error al crear cliente: ' + error.message);
    return { data: null, error } as const;
  }
};

  // Update existing cliente
  const updateCliente = async (id: string, updates: ClienteUpdate) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setClientes(prev => prev.map(cliente => 
        cliente.id === id ? data : cliente
      ));
      toast.success('Cliente actualizado exitosamente');
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating cliente:', error);
      toast.error('Error al actualizar cliente: ' + error.message);
      return { data: null, error };
    }
  };

  // Delete cliente
  const deleteCliente = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setClientes(prev => prev.filter(cliente => cliente.id !== id));
      toast.success('Cliente eliminado exitosamente');
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting cliente:', error);
      toast.error('Error al eliminar cliente: ' + error.message);
      return { error };
    }
  };

  // Load clientes on hook initialization
  useEffect(() => {
    fetchClientes();
  }, []);

  return {
    clientes,
    loading,
    createCliente,
    updateCliente,
    deleteCliente,
    refetch: fetchClientes
  };
};