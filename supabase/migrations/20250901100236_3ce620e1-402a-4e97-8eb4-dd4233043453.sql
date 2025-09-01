-- Rename legacy tables to preserve data if they exist
DO $$
BEGIN
  IF to_regclass('public.clientes') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.clientes RENAME TO clientes_legacy';
  END IF;
  IF to_regclass('public.movimientos') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.movimientos RENAME TO movimientos_legacy';
  END IF;
  IF to_regclass('public.facturas') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.facturas RENAME TO facturas_legacy';
  END IF;
  IF to_regclass('public."campañas"') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public."campañas" RENAME TO campanas_legacy';
  END IF;
END
$$;

-- Create new schema tables per provided design (snake_case, ascii-safe)
CREATE TABLE IF NOT EXISTS public.clientes (
  id VARCHAR(20) PRIMARY KEY,
  nombre TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sociedades (
  id VARCHAR(20) PRIMARY KEY,
  nombre_fiscal TEXT NOT NULL,
  cif TEXT NOT NULL UNIQUE,
  direccion_1 TEXT,
  direccion_2 TEXT
);

CREATE TABLE IF NOT EXISTS public.campanas (
  id VARCHAR(20) PRIMARY KEY,
  fecha DATE NOT NULL,
  id_cliente VARCHAR(20) REFERENCES public.clientes(id) ON DELETE SET NULL,
  acciones TEXT,
  detalles TEXT,
  precio DECIMAL(10, 2) DEFAULT 0.00,
  cobro_ana DECIMAL(10, 2) DEFAULT 0.00,
  cobro_wololo_sound DECIMAL(10, 2) DEFAULT 0.00,
  estado_campana VARCHAR(50) CHECK (estado_campana IN ('EN CURSO', 'TERMINADO')),
  tipo_cobro VARCHAR(100),
  estado_facturacion VARCHAR(50) CHECK (estado_facturacion IN ('Facturado', 'Pendiente', 'N/A', 'Parcial')),
  estado_cobro VARCHAR(50) CHECK (estado_cobro IN ('Cobrado', 'Parcial', 'Pendiente')),
  importe_facturado DECIMAL(10, 2) DEFAULT 0.00,
  importe_pendiente_facturar DECIMAL(10, 2) DEFAULT 0.00,
  importe_cobrado DECIMAL(10, 2) DEFAULT 0.00,
  importe_pendiente_cobrar DECIMAL(10, 2) DEFAULT 0.00,
  estado_pago_ana VARCHAR(50) CHECK (estado_pago_ana IN ('Pagado', 'Pendiente', 'N/A')),
  comentarios TEXT
);

CREATE TABLE IF NOT EXISTS public.facturas (
  id VARCHAR(20) PRIMARY KEY,
  fecha DATE NOT NULL,
  referencia VARCHAR(50),
  id_campana VARCHAR(20) REFERENCES public.campanas(id) ON DELETE SET NULL,
  id_sociedad VARCHAR(20) REFERENCES public.sociedades(id) ON DELETE RESTRICT,
  detalles TEXT,
  precio DECIMAL(10, 2) DEFAULT 0.00,
  iva DECIMAL(10, 2) DEFAULT 0.00,
  irpf DECIMAL(10, 2) DEFAULT 0.00,
  pago_cliente DECIMAL(10, 2) DEFAULT 0.00,
  estado_cobro VARCHAR(50) CHECK (estado_cobro IN ('Cobrado', 'Pendiente')),
  fecha_cobro DATE,
  comentarios TEXT
);

CREATE TABLE IF NOT EXISTS public.pagos_ana (
  id VARCHAR(20) PRIMARY KEY,
  fecha DATE,
  referencia TEXT,
  importe DECIMAL(10, 2),
  modalidad VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS public.contabilidad (
  id VARCHAR(20) PRIMARY KEY,
  fecha DATE NOT NULL,
  tipo VARCHAR(50) CHECK (tipo IN ('Cobro', 'Pago')),
  acciones TEXT,
  pagador TEXT,
  detalles TEXT,
  importe DECIMAL(10, 2) NOT NULL,
  modalidad VARCHAR(100),
  comentarios TEXT,
  id_campana VARCHAR(20) REFERENCES public.campanas(id) ON DELETE SET NULL,
  id_factura VARCHAR(20) REFERENCES public.facturas(id) ON DELETE SET NULL,
  saldo_paypal DECIMAL(10, 2),
  saldo_sl DECIMAL(10, 2)
);

CREATE TABLE IF NOT EXISTS public.clientes_sociedades (
  id_cliente VARCHAR(20) NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  id_sociedad VARCHAR(20) NOT NULL REFERENCES public.sociedades(id) ON DELETE CASCADE,
  PRIMARY KEY (id_cliente, id_sociedad)
);

CREATE TABLE IF NOT EXISTS public.pagos_ana_detalle (
  id_pago VARCHAR(20) NOT NULL REFERENCES public.pagos_ana(id) ON DELETE CASCADE,
  id_campana VARCHAR(20) NOT NULL REFERENCES public.campanas(id) ON DELETE CASCADE,
  PRIMARY KEY (id_pago, id_campana)
);

-- Business rule: estado_pago_ana autopopulate based on cobro_ana
CREATE OR REPLACE FUNCTION public.set_estado_pago_ana()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.cobro_ana IS NULL OR NEW.cobro_ana <= 0 THEN
    NEW.estado_pago_ana := 'N/A';
  ELSE
    IF NEW.estado_pago_ana IS NULL OR NEW.estado_pago_ana = '' THEN
      NEW.estado_pago_ana := 'Pendiente';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_estado_pago_ana ON public.campanas;
CREATE TRIGGER trg_set_estado_pago_ana
BEFORE INSERT OR UPDATE ON public.campanas
FOR EACH ROW
EXECUTE FUNCTION public.set_estado_pago_ana();

-- Backend computation: sequential balances for contabilidad
CREATE OR REPLACE FUNCTION public.recalculate_saldos()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  r RECORD;
  running_paypal numeric := 0;
  running_sl numeric := 0;
  m text;
BEGIN
  UPDATE public.contabilidad SET saldo_paypal = 0, saldo_sl = 0;

  FOR r IN
    SELECT id, fecha, modalidad, tipo, importe
    FROM public.contabilidad
    ORDER BY fecha, id
  LOOP
    m := lower(coalesce(r.modalidad, ''));
    IF position('paypal' in m) > 0 THEN
      IF r.tipo = 'Cobro' THEN
        running_paypal := running_paypal + coalesce(r.importe,0);
      ELSE
        running_paypal := running_paypal - coalesce(r.importe,0);
      END IF;
    ELSIF position('sl' in m) > 0 OR position('cuenta sl' in m) > 0 THEN
      IF r.tipo = 'Cobro' THEN
        running_sl := running_sl + coalesce(r.importe,0);
      ELSE
        running_sl := running_sl - coalesce(r.importe,0);
      END IF;
    END IF;

    UPDATE public.contabilidad
    SET saldo_paypal = running_paypal,
        saldo_sl = running_sl
    WHERE id = r.id;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.recalculate_saldos_trigger()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.recalculate_saldos();
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_recalculate_saldos_aiud ON public.contabilidad;
CREATE TRIGGER trg_recalculate_saldos_aiud
AFTER INSERT OR UPDATE OR DELETE ON public.contabilidad
FOR EACH STATEMENT
EXECUTE FUNCTION public.recalculate_saldos_trigger();