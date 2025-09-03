import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Cliente = Tables<'clientes'>;
type ClienteInsert = TablesInsert<'clientes'>;
type ClienteUpdate = TablesUpdate<'clientes'>;

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all clientes
  const fetchClientes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;
      setClientes(data || []);
    } catch (error: any) {
      console.error('Error fetching clientes:', error);
      toast.error('Error al cargar clientes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new cliente
  const createCliente = async (clienteData: Omit<ClienteInsert, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert([clienteData])
        .select()
        .single();

      if (error) throw error;
      
      setClientes(prev => [...prev, data]);
      toast.success('Cliente creado exitosamente');
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating cliente:', error);
      toast.error('Error al crear cliente: ' + error.message);
      return { data: null, error };
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