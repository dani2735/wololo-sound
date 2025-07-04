import { CampañaPrensa, Cliente, Factura, MovimientoContable } from "@/types";

export const sampleClientes: Cliente[] = [
  {
    id: "cliente-1",
    nombre: "Afterlife Records",
    nombrePagador: "Afterlife Music SL",
    nif: "B12345678",
    direccion: "Calle Ibiza 123, 08009 Barcelona, España"
  },
  {
    id: "cliente-2", 
    nombre: "Drumcode",
    nombrePagador: "Drumcode Ltd",
    nif: "GB123456789",
    direccion: "123 London Street, London, UK"
  },
  {
    id: "cliente-3",
    nombre: "Monstercat",
    nombrePagador: "Monstercat Inc",
    nif: "US123456789",
    direccion: "456 Vancouver Ave, Vancouver, Canada"
  }
];

export const sampleCampañas: CampañaPrensa[] = [
  {
    id: "campaña-1",
    fechaCreacion: "2024-12-01",
    clienteId: "cliente-1",
    acciones: {
      instagramPost: 3,
      instagramFlyer: 2,
      instagramVideo: 1,
      instagramVideoAna: 0,
      instagramAgendaMadrid: 1,
      instagramAgendaIbiza: 0,
      webArticulo: 1,
      webEntrevista: 0,
      webAgenda: 1,
      podcastMencion: 1,
      podcastEntrevista: 0,
      youtubeEntrevista: 0,
      otrasAcciones: ""
    },
    detalles: "Campaña lanzamiento nuevo EP - Tale Of Us",
    precio: 850,
    cobroAna: 0,
    comentarios: "Cliente premium, entrega antes del 15/12",
    estado: "EN CURSO",
    tipoCobro: "Factura Wololo Sound",
    estadoFacturacion: "Sin facturar",
    estadoCobro: "Sin cobrar"
  },
  {
    id: "campaña-2",
    fechaCreacion: "2024-11-15",
    clienteId: "cliente-2",
    acciones: {
      instagramPost: 2,
      instagramFlyer: 1,
      instagramVideo: 1,
      instagramVideoAna: 1,
      instagramAgendaMadrid: 0,
      instagramAgendaIbiza: 0,
      webArticulo: 1,
      webEntrevista: 1,
      webAgenda: 0,
      podcastMencion: 0,
      podcastEntrevista: 1,
      youtubeEntrevista: 0,
      otrasAcciones: "Newsletter especial"
    },
    detalles: "Promoción Adam Beyer - nuevo track",
    precio: 1200,
    cobroAna: 150,
    comentarios: "Incluye vídeo de Ana",
    estado: "TERMINADO",
    tipoCobro: "Factura Wololo Sound",
    fechaFacturacion: "2024-11-20",
    fechaCobro: "2024-11-28",
    referenciaFactura: "001.2024",
    estadoFacturacion: "Facturado",
    estadoCobro: "Cobrado",
    iva: 252,
    tipoIva: "España",
    nombrePagador: "Drumcode Ltd",
    nif: "GB123456789",
    direccion: "123 London Street, London, UK"
  },
  {
    id: "campaña-3",
    fechaCreacion: "2024-12-10",
    clienteId: "cliente-3",
    acciones: {
      instagramPost: 4,
      instagramFlyer: 2,
      instagramVideo: 0,
      instagramVideoAna: 0,
      instagramAgendaMadrid: 0,
      instagramAgendaIbiza: 0,
      webArticulo: 2,
      webEntrevista: 0,
      webAgenda: 1,
      podcastMencion: 2,
      podcastEntrevista: 0,
      youtubeEntrevista: 0,
      otrasAcciones: "Playlist Spotify"
    },
    detalles: "Campaña Navidad - Various Artists",
    precio: 650,
    cobroAna: 0,
    comentarios: "Campaña estacional",
    estado: "PENDIENTE",
    tipoCobro: "Paypal",
    estadoFacturacion: "Sin facturar",
    estadoCobro: "Sin cobrar"
  }
];

export const sampleFacturas: Factura[] = [
  {
    id: "factura-1",
    fecha: "2024-11-20",
    referencia: "001.2024",
    clienteId: "cliente-2",
    nombrePagador: "Drumcode Ltd",
    nif: "GB123456789",
    direccion: "123 London Street, London, UK",
    precio: 1200,
    iva: 252,
    tipoIva: "España",
    estadoCobro: "Cobrado",
    fechaCobro: "2024-11-28",
    datosAcciones: "Servicios de promoción online en Wololo Sound"
  }
];

export const sampleMovimientos: MovimientoContable[] = [
  {
    id: "mov-1",
    fecha: "2024-11-28",
    tipo: "cobro",
    pagador: "Drumcode Ltd",
    clienteId: "cliente-2",
    precio: 1452, // Precio + IVA
    cuenta: "Cuenta SL",
    detalles: "Cobro factura 001.2024",
    referenciaFactura: "001.2024",
    fechaFacturacion: "2024-11-20",
    fechaCreacion: "2024-11-15",
    iva: 252,
    nombrePagador: "Drumcode Ltd",
    nif: "GB123456789",
    direccion: "123 London Street, London, UK"
  },
  {
    id: "mov-2",
    fecha: "2024-11-28",
    tipo: "pago",
    pagador: "Ana Videógrafa",
    clienteId: "cliente-2",
    precio: 150,
    cuenta: "Cuenta SL",
    detalles: "Pago por vídeo Ana - campaña Drumcode",
    cobroAna: 150
  },
  {
    id: "mov-3",
    fecha: "2024-12-01",
    tipo: "pago",
    pagador: "Hosting Provider",
    clienteId: "cliente-1",
    precio: 89,
    cuenta: "Paypal",
    detalles: "Renovación hosting anual"
  }
];