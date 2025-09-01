export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      campanas: {
        Row: {
          acciones: string | null
          cobro_ana: number | null
          cobro_wololo_sound: number | null
          comentarios: string | null
          detalles: string | null
          estado_campana: string | null
          estado_cobro: string | null
          estado_facturacion: string | null
          estado_pago_ana: string | null
          fecha: string
          id: string
          id_cliente: string | null
          importe_cobrado: number | null
          importe_facturado: number | null
          importe_pendiente_cobrar: number | null
          importe_pendiente_facturar: number | null
          precio: number | null
          tipo_cobro: string | null
        }
        Insert: {
          acciones?: string | null
          cobro_ana?: number | null
          cobro_wololo_sound?: number | null
          comentarios?: string | null
          detalles?: string | null
          estado_campana?: string | null
          estado_cobro?: string | null
          estado_facturacion?: string | null
          estado_pago_ana?: string | null
          fecha: string
          id: string
          id_cliente?: string | null
          importe_cobrado?: number | null
          importe_facturado?: number | null
          importe_pendiente_cobrar?: number | null
          importe_pendiente_facturar?: number | null
          precio?: number | null
          tipo_cobro?: string | null
        }
        Update: {
          acciones?: string | null
          cobro_ana?: number | null
          cobro_wololo_sound?: number | null
          comentarios?: string | null
          detalles?: string | null
          estado_campana?: string | null
          estado_cobro?: string | null
          estado_facturacion?: string | null
          estado_pago_ana?: string | null
          fecha?: string
          id?: string
          id_cliente?: string | null
          importe_cobrado?: number | null
          importe_facturado?: number | null
          importe_pendiente_cobrar?: number | null
          importe_pendiente_facturar?: number | null
          precio?: number | null
          tipo_cobro?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campanas_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      campanas_legacy: {
        Row: {
          acciones: Json | null
          cliente_id: string
          cobro_ana: number
          comentarios: string | null
          created_at: string
          detalles: string | null
          estado: Database["public"]["Enums"]["estado_campaña"]
          estado_facturacion: string
          factura_id: string | null
          fecha_creacion: string
          id: string
          precio: number
          tipo_cobro: Database["public"]["Enums"]["tipo_cobro_campaña"]
        }
        Insert: {
          acciones?: Json | null
          cliente_id: string
          cobro_ana?: number
          comentarios?: string | null
          created_at?: string
          detalles?: string | null
          estado?: Database["public"]["Enums"]["estado_campaña"]
          estado_facturacion?: string
          factura_id?: string | null
          fecha_creacion?: string
          id?: string
          precio?: number
          tipo_cobro?: Database["public"]["Enums"]["tipo_cobro_campaña"]
        }
        Update: {
          acciones?: Json | null
          cliente_id?: string
          cobro_ana?: number
          comentarios?: string | null
          created_at?: string
          detalles?: string | null
          estado?: Database["public"]["Enums"]["estado_campaña"]
          estado_facturacion?: string
          factura_id?: string | null
          fecha_creacion?: string
          id?: string
          precio?: number
          tipo_cobro?: Database["public"]["Enums"]["tipo_cobro_campaña"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_campañas_cliente_id"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes_legacy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_campañas_factura_id"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "facturas_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          id: string
          nombre: string
        }
        Insert: {
          id: string
          nombre: string
        }
        Update: {
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      clientes_legacy: {
        Row: {
          created_at: string
          direccion: string | null
          id: string
          nif: string
          nombre_cliente: string
          nombre_pagador: string
        }
        Insert: {
          created_at?: string
          direccion?: string | null
          id?: string
          nif: string
          nombre_cliente: string
          nombre_pagador: string
        }
        Update: {
          created_at?: string
          direccion?: string | null
          id?: string
          nif?: string
          nombre_cliente?: string
          nombre_pagador?: string
        }
        Relationships: []
      }
      clientes_sociedades: {
        Row: {
          id_cliente: string
          id_sociedad: string
        }
        Insert: {
          id_cliente: string
          id_sociedad: string
        }
        Update: {
          id_cliente?: string
          id_sociedad?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_sociedades_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_sociedades_id_sociedad_fkey"
            columns: ["id_sociedad"]
            isOneToOne: false
            referencedRelation: "sociedades"
            referencedColumns: ["id"]
          },
        ]
      }
      contabilidad: {
        Row: {
          acciones: string | null
          comentarios: string | null
          detalles: string | null
          fecha: string
          id: string
          id_campana: string | null
          id_factura: string | null
          importe: number
          modalidad: string | null
          pagador: string | null
          saldo_paypal: number | null
          saldo_sl: number | null
          tipo: string | null
        }
        Insert: {
          acciones?: string | null
          comentarios?: string | null
          detalles?: string | null
          fecha: string
          id: string
          id_campana?: string | null
          id_factura?: string | null
          importe: number
          modalidad?: string | null
          pagador?: string | null
          saldo_paypal?: number | null
          saldo_sl?: number | null
          tipo?: string | null
        }
        Update: {
          acciones?: string | null
          comentarios?: string | null
          detalles?: string | null
          fecha?: string
          id?: string
          id_campana?: string | null
          id_factura?: string | null
          importe?: number
          modalidad?: string | null
          pagador?: string | null
          saldo_paypal?: number | null
          saldo_sl?: number | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contabilidad_id_campana_fkey"
            columns: ["id_campana"]
            isOneToOne: false
            referencedRelation: "campanas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contabilidad_id_factura_fkey"
            columns: ["id_factura"]
            isOneToOne: false
            referencedRelation: "facturas"
            referencedColumns: ["id"]
          },
        ]
      }
      facturas: {
        Row: {
          comentarios: string | null
          detalles: string | null
          estado_cobro: string | null
          fecha: string
          fecha_cobro: string | null
          id: string
          id_campana: string | null
          id_sociedad: string | null
          irpf: number | null
          iva: number | null
          pago_cliente: number | null
          precio: number | null
          referencia: string | null
        }
        Insert: {
          comentarios?: string | null
          detalles?: string | null
          estado_cobro?: string | null
          fecha: string
          fecha_cobro?: string | null
          id: string
          id_campana?: string | null
          id_sociedad?: string | null
          irpf?: number | null
          iva?: number | null
          pago_cliente?: number | null
          precio?: number | null
          referencia?: string | null
        }
        Update: {
          comentarios?: string | null
          detalles?: string | null
          estado_cobro?: string | null
          fecha?: string
          fecha_cobro?: string | null
          id?: string
          id_campana?: string | null
          id_sociedad?: string | null
          irpf?: number | null
          iva?: number | null
          pago_cliente?: number | null
          precio?: number | null
          referencia?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facturas_id_campana_fkey"
            columns: ["id_campana"]
            isOneToOne: false
            referencedRelation: "campanas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facturas_id_sociedad_fkey"
            columns: ["id_sociedad"]
            isOneToOne: false
            referencedRelation: "sociedades"
            referencedColumns: ["id"]
          },
        ]
      }
      facturas_legacy: {
        Row: {
          campaña_id: string | null
          cliente_id: string
          created_at: string
          datos_acciones: string | null
          estado_cobro: Database["public"]["Enums"]["estado_cobro_factura"]
          fecha_cobro: string | null
          fecha_facturacion: string
          id: string
          irpf_porcentaje: number
          iva_porcentaje: number
          iva_tipo: Database["public"]["Enums"]["iva_tipo_factura"]
          precio_base: number
          referencia_factura: string
          total_factura: number
        }
        Insert: {
          campaña_id?: string | null
          cliente_id: string
          created_at?: string
          datos_acciones?: string | null
          estado_cobro?: Database["public"]["Enums"]["estado_cobro_factura"]
          fecha_cobro?: string | null
          fecha_facturacion?: string
          id?: string
          irpf_porcentaje?: number
          iva_porcentaje?: number
          iva_tipo?: Database["public"]["Enums"]["iva_tipo_factura"]
          precio_base?: number
          referencia_factura: string
          total_factura?: number
        }
        Update: {
          campaña_id?: string | null
          cliente_id?: string
          created_at?: string
          datos_acciones?: string | null
          estado_cobro?: Database["public"]["Enums"]["estado_cobro_factura"]
          fecha_cobro?: string | null
          fecha_facturacion?: string
          id?: string
          irpf_porcentaje?: number
          iva_porcentaje?: number
          iva_tipo?: Database["public"]["Enums"]["iva_tipo_factura"]
          precio_base?: number
          referencia_factura?: string
          total_factura?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_facturas_campaña_id"
            columns: ["campaña_id"]
            isOneToOne: false
            referencedRelation: "campanas_legacy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_facturas_cliente_id"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      movimientos_legacy: {
        Row: {
          cantidad: number
          cliente_id: string | null
          concepto: string
          created_at: string
          cuenta: Database["public"]["Enums"]["cuenta_movimiento"]
          factura_id: string | null
          fecha: string
          id: string
          tipo: Database["public"]["Enums"]["tipo_movimiento"]
        }
        Insert: {
          cantidad: number
          cliente_id?: string | null
          concepto: string
          created_at?: string
          cuenta: Database["public"]["Enums"]["cuenta_movimiento"]
          factura_id?: string | null
          fecha?: string
          id?: string
          tipo: Database["public"]["Enums"]["tipo_movimiento"]
        }
        Update: {
          cantidad?: number
          cliente_id?: string | null
          concepto?: string
          created_at?: string
          cuenta?: Database["public"]["Enums"]["cuenta_movimiento"]
          factura_id?: string | null
          fecha?: string
          id?: string
          tipo?: Database["public"]["Enums"]["tipo_movimiento"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_movimientos_cliente_id"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes_legacy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_movimientos_factura_id"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "facturas_legacy"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos_ana: {
        Row: {
          fecha: string | null
          id: string
          importe: number | null
          modalidad: string | null
          referencia: string | null
        }
        Insert: {
          fecha?: string | null
          id: string
          importe?: number | null
          modalidad?: string | null
          referencia?: string | null
        }
        Update: {
          fecha?: string | null
          id?: string
          importe?: number | null
          modalidad?: string | null
          referencia?: string | null
        }
        Relationships: []
      }
      pagos_ana_detalle: {
        Row: {
          id_campana: string
          id_pago: string
        }
        Insert: {
          id_campana: string
          id_pago: string
        }
        Update: {
          id_campana?: string
          id_pago?: string
        }
        Relationships: [
          {
            foreignKeyName: "pagos_ana_detalle_id_campana_fkey"
            columns: ["id_campana"]
            isOneToOne: false
            referencedRelation: "campanas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_ana_detalle_id_pago_fkey"
            columns: ["id_pago"]
            isOneToOne: false
            referencedRelation: "pagos_ana"
            referencedColumns: ["id"]
          },
        ]
      }
      sociedades: {
        Row: {
          cif: string
          direccion_1: string | null
          direccion_2: string | null
          id: string
          nombre_fiscal: string
        }
        Insert: {
          cif: string
          direccion_1?: string | null
          direccion_2?: string | null
          id: string
          nombre_fiscal: string
        }
        Update: {
          cif?: string
          direccion_1?: string | null
          direccion_2?: string | null
          id?: string
          nombre_fiscal?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      recalculate_saldos: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      cuenta_movimiento: "Cuenta SL" | "Paypal"
      estado_campaña: "EN CURSO" | "TERMINADO" | "PENDIENTE"
      estado_cobro_factura: "Cobrado" | "Sin cobrar"
      iva_tipo_factura: "España" | "Canarias" | "Europa" | "EEUU"
      tipo_cobro_campaña:
        | "Paypal"
        | "Factura Wololo Sound"
        | "Factura Adrián Oller"
      tipo_movimiento: "cobro" | "pago"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cuenta_movimiento: ["Cuenta SL", "Paypal"],
      estado_campaña: ["EN CURSO", "TERMINADO", "PENDIENTE"],
      estado_cobro_factura: ["Cobrado", "Sin cobrar"],
      iva_tipo_factura: ["España", "Canarias", "Europa", "EEUU"],
      tipo_cobro_campaña: [
        "Paypal",
        "Factura Wololo Sound",
        "Factura Adrián Oller",
      ],
      tipo_movimiento: ["cobro", "pago"],
    },
  },
} as const
