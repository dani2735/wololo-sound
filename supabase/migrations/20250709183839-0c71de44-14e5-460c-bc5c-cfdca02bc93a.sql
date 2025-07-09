-- Enable Row Level Security on clientes table
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Create policies for clientes table
-- Since this is a business management app and users need to see all clients,
-- we'll create permissive policies for authenticated users

CREATE POLICY "Authenticated users can view all clientes" 
ON public.clientes 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert clientes" 
ON public.clientes 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update clientes" 
ON public.clientes 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete clientes" 
ON public.clientes 
FOR DELETE 
TO authenticated 
USING (true);