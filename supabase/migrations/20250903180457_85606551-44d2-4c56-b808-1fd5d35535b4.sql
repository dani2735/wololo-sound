-- Enable RLS on all tables
ALTER TABLE public.sociedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes_sociedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campanas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contabilidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos_ana ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos_ana_detalle ENABLE ROW LEVEL SECURITY;

-- Create policies for full access (since no authentication is implemented)
-- Sociedades policies
CREATE POLICY "Allow all operations on sociedades" ON public.sociedades
    FOR ALL USING (true) WITH CHECK (true);

-- Clientes policies
CREATE POLICY "Allow all operations on clientes" ON public.clientes
    FOR ALL USING (true) WITH CHECK (true);

-- Clientes_sociedades policies
CREATE POLICY "Allow all operations on clientes_sociedades" ON public.clientes_sociedades
    FOR ALL USING (true) WITH CHECK (true);

-- Campanas policies
CREATE POLICY "Allow all operations on campanas" ON public.campanas
    FOR ALL USING (true) WITH CHECK (true);

-- Facturas policies
CREATE POLICY "Allow all operations on facturas" ON public.facturas
    FOR ALL USING (true) WITH CHECK (true);

-- Contabilidad policies
CREATE POLICY "Allow all operations on contabilidad" ON public.contabilidad
    FOR ALL USING (true) WITH CHECK (true);

-- Pagos_ana policies
CREATE POLICY "Allow all operations on pagos_ana" ON public.pagos_ana
    FOR ALL USING (true) WITH CHECK (true);

-- Pagos_ana_detalle policies
CREATE POLICY "Allow all operations on pagos_ana_detalle" ON public.pagos_ana_detalle
    FOR ALL USING (true) WITH CHECK (true);