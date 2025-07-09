import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CampañaPrensa, Cliente, Factura, MovimientoContable, DashboardData, EstadoCobro } from '@/types';
import { sampleClientes, sampleCampañas, sampleFacturas, sampleMovimientos } from '@/data/sampleData';

interface AppStore {
  // Data
  campañas: CampañaPrensa[];
  clientes: Cliente[];
  facturas: Factura[];
  movimientos: MovimientoContable[];
  
  // Dashboard state
  mesSeleccionado: number;
  añoSeleccionado: number;
  
  // Actions - Campañas
  addCampaña: (campaña: CampañaPrensa) => void;
  updateCampaña: (id: string, campaña: Partial<CampañaPrensa>) => void;
  deleteCampaña: (id: string) => void;
  
  // Actions - Clientes
  addCliente: (cliente: Cliente) => void;
  updateCliente: (id: string, cliente: Partial<Cliente>) => void;
  deleteCliente: (id: string) => void;
  
  // Actions - Facturas
  addFactura: (factura: Factura) => void;
  updateFactura: (id: string, factura: Partial<Factura>) => void;
  deleteFactura: (id: string) => void;
  marcarFacturaCobrada: (facturaId: string, cuentaCobro: 'Paypal' | 'Cuenta SL') => void;
  
  // Actions - Movimientos
  addMovimiento: (movimiento: MovimientoContable) => void;
  updateMovimiento: (id: string, movimiento: Partial<MovimientoContable>) => void;
  deleteMovimiento: (id: string) => void;
  
  // Dashboard actions
  setMesSeleccionado: (mes: number) => void;
  setAñoSeleccionado: (año: number) => void;
  getDashboardData: () => DashboardData;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state with sample data
      campañas: sampleCampañas,
      clientes: sampleClientes,
      facturas: sampleFacturas,
      movimientos: sampleMovimientos,
      mesSeleccionado: new Date().getMonth() + 1,
      añoSeleccionado: new Date().getFullYear(),
      
      // Campañas actions
      addCampaña: (campaña) => set(state => ({ 
        campañas: [...state.campañas, campaña] 
      })),
      updateCampaña: (id, updates) => set(state => ({
        campañas: state.campañas.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteCampaña: (id) => set(state => ({
        campañas: state.campañas.filter(c => c.id !== id)
      })),
      
      // Clientes actions
      addCliente: (cliente) => set(state => ({ 
        clientes: [...state.clientes, cliente] 
      })),
      updateCliente: (id, updates) => set(state => ({
        clientes: state.clientes.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteCliente: (id) => set(state => ({
        clientes: state.clientes.filter(c => c.id !== id)
      })),
      
      // Facturas actions
      addFactura: (factura) => set(state => ({ 
        facturas: [...state.facturas, factura] 
      })),
      updateFactura: (id, updates) => set(state => ({
        facturas: state.facturas.map(f => f.id === id ? { ...f, ...updates } : f)
      })),
      deleteFactura: (id) => set(state => ({
        facturas: state.facturas.filter(f => f.id !== id)
      })),
      marcarFacturaCobrada: (facturaId, cuentaCobro) => set(state => {
        const factura = state.facturas.find(f => f.id === facturaId);
        if (!factura) return state;

        const cliente = state.clientes.find(c => c.id === factura.clienteId);
        const fechaCobro = new Date().toISOString().split('T')[0];

        // Crear movimiento de cobro
        const nuevoMovimiento: MovimientoContable = {
          id: `mov_${Date.now()}`,
          fecha: fechaCobro,
          tipo: 'cobro',
          pagador: factura.nombrePagador,
          clienteId: factura.clienteId,
          precio: factura.precio + factura.iva,
          cuenta: cuentaCobro,
          referenciaFactura: factura.referencia,
          detalles: `Cobro de factura ${factura.referencia}`,
        };

        // Actualizar factura
        const facturasActualizadas = state.facturas.map(f => 
          f.id === facturaId 
            ? { ...f, estadoCobro: 'Cobrado' as EstadoCobro, fechaCobro }
            : f
        );

        // Actualizar campaña si existe una asociada
        const campañasActualizadas = state.campañas.map(c => {
          if (c.referenciaFactura === factura.referencia) {
            return { ...c, estadoCobro: 'Cobrado' as EstadoCobro, fechaCobro };
          }
          return c;
        });

        return {
          ...state,
          facturas: facturasActualizadas,
          movimientos: [...state.movimientos, nuevoMovimiento],
          campañas: campañasActualizadas,
        };
      }),
      
      // Movimientos actions
      addMovimiento: (movimiento) => set(state => ({ 
        movimientos: [...state.movimientos, movimiento] 
      })),
      updateMovimiento: (id, updates) => set(state => ({
        movimientos: state.movimientos.map(m => m.id === id ? { ...m, ...updates } : m)
      })),
      deleteMovimiento: (id) => set(state => ({
        movimientos: state.movimientos.filter(m => m.id !== id)
      })),
      
      // Dashboard actions
      setMesSeleccionado: (mes) => set({ mesSeleccionado: mes }),
      setAñoSeleccionado: (año) => set({ añoSeleccionado: año }),
      
      getDashboardData: () => {
        const state = get();
        const { movimientos, facturas, mesSeleccionado, añoSeleccionado } = state;
        
        // Calculate account balances
        const cuentaSL = movimientos
          .filter(m => m.cuenta === 'Cuenta SL')
          .reduce((acc, m) => acc + (m.tipo === 'cobro' ? m.precio : -m.precio), 0);
          
        const cuentaPaypal = movimientos
          .filter(m => m.cuenta === 'Paypal')
          .reduce((acc, m) => acc + (m.tipo === 'cobro' ? m.precio : -m.precio), 0);
        
        // Calculate pending invoices
        const totalFacturadoPendiente = facturas
          .filter(f => f.estadoCobro === 'Sin cobrar')
          .reduce((acc, f) => acc + f.precio + f.iva, 0);
        
        // Calculate monthly data
        const monthlyFacturas = facturas.filter(f => {
          const date = new Date(f.fecha);
          return date.getMonth() + 1 === mesSeleccionado && date.getFullYear() === añoSeleccionado;
        });
        
        const monthlyMovimientos = movimientos.filter(m => {
          const date = new Date(m.fecha);
          return date.getMonth() + 1 === mesSeleccionado && date.getFullYear() === añoSeleccionado;
        });
        
        const totalFacturado = monthlyFacturas.reduce((acc, f) => acc + f.precio + f.iva, 0);
        const totalCobradoSL = monthlyMovimientos
          .filter(m => m.tipo === 'cobro' && m.cuenta === 'Cuenta SL')
          .reduce((acc, m) => acc + m.precio, 0);
        const totalCobradoPaypal = monthlyMovimientos
          .filter(m => m.tipo === 'cobro' && m.cuenta === 'Paypal')
          .reduce((acc, m) => acc + m.precio, 0);
        
        const numeroAcciones = state.campañas.filter(c => {
          const date = new Date(c.fechaCreacion);
          return date.getMonth() + 1 === mesSeleccionado && date.getFullYear() === añoSeleccionado;
        }).length;
        
        // Calculate additional metrics
        const totalPendienteFacturar = state.campañas
          .filter(c => !c.referenciaFactura)
          .reduce((acc, c) => acc + c.precio, 0);
          
        const totalFacturadoHistorico = facturas.reduce((acc, f) => acc + f.precio + f.iva, 0);
        const totalCobradoHistorico = movimientos
          .filter(m => m.tipo === 'cobro')
          .reduce((acc, m) => acc + m.precio, 0);
          
        const totalPagadoMes = monthlyMovimientos
          .filter(m => m.tipo === 'pago')
          .reduce((acc, m) => acc + m.precio, 0);
          
        const numeroFacturas = monthlyFacturas.length;

        return {
           cuentaSL,
           cuentaPaypal,
           totalFacturadoPendiente,
           totalPendienteFacturar,
           totalFacturadoHistorico,
           totalCobradoHistorico,
           mesSeleccionado: {
             totalFacturado,
             totalCobradoSL,
             totalCobradoPaypal,
             totalPagadoMes,
             numeroFacturas,
             numeroAcciones
           }
         };
      }
    }),
    {
      name: 'wololo-sound-accounting',
    }
  )
);