// Types for the accounting and billing system

export interface Cliente {
  id: string;
  nombre: string;
  nombrePagador: string;
  nif: string;
  direccion: string;
}

export interface Acciones {
  // Instagram
  instagramPost: number;
  instagramFlyer: number;
  instagramVideo: number;
  instagramVideoAna: number;
  instagramAgendaMadrid: number;
  instagramAgendaIbiza: number;
  // Web
  webArticulo: number;
  webEntrevista: number;
  webAgenda: number;
  // Podcast
  podcastMencion: number;
  podcastEntrevista: number;
  // Youtube
  youtubeEntrevista: number;
  // Otras
  otrasAcciones: string;
}

export type EstadoCampaña = 'TERMINADO' | 'EN CURSO' | 'PENDIENTE';
export type TipoCobro = 'Paypal' | 'Factura Wololo Sound' | 'Factura Adrián Oller';
export type EstadoFacturacion = 'Facturado' | 'Sin facturar';
export type EstadoCobro = 'Cobrado' | 'Sin cobrar';
export type TipoIVA = 'España' | 'Canarias' | 'Europa' | 'EEUU';

export interface CampañaPrensaBase {
  fechaCreacion: string;
  clienteId: string;
  acciones: Acciones;
  detalles: string;
  precio: number;
  cobroAna: number;
  comentarios: string;
  estado: EstadoCampaña;
  tipoCobro: TipoCobro;
}

export interface CampañaPrensa extends CampañaPrensaBase {
  id: string;
  fechaFacturacion?: string;
  fechaCobro?: string;
  referenciaFactura?: string;
  estadoFacturacion: EstadoFacturacion;
  estadoCobro: EstadoCobro;
  iva?: number;
  tipoIva?: TipoIVA;
  nombrePagador?: string;
  nif?: string;
  direccion?: string;
}

export interface Factura {
  id: string;
  fecha: string;
  referencia: string;
  clienteId: string;
  nombrePagador: string;
  nif: string;
  direccion: string;
  precio: number;
  iva: number;
  tipoIva: TipoIVA;
  estadoCobro: EstadoCobro;
  fechaCobro?: string;
  campaña?: CampañaPrensa;
  datosAcciones: string;
}

export type TipoMovimiento = 'cobro' | 'pago';
export type CuentaMovimiento = 'Paypal' | 'Cuenta SL';

export interface MovimientoContable {
  id: string;
  fecha: string;
  tipo: TipoMovimiento;
  pagador: string;
  clienteId: string;
  precio: number;
  cuenta: CuentaMovimiento;
  acciones?: Acciones;
  detalles?: string;
  referenciaFactura?: string;
  cobroAna?: number;
  comentarios?: string;
  fechaFacturacion?: string;
  fechaCreacion?: string;
  iva?: number;
  nombrePagador?: string;
  nif?: string;
  direccion?: string;
}

export interface DashboardData {
  cuentaSL: number;
  cuentaPaypal: number;
  totalFacturadoPendiente: number;
  totalPendienteFacturar: number;
  totalFacturadoHistorico: number;
  totalCobradoHistorico: number;
  mesSeleccionado: {
    totalFacturado: number;
    totalCobradoSL: number;
    totalCobradoPaypal: number;
    totalPagadoMes: number;
    numeroFacturas: number;
    numeroAcciones: number;
  };
}