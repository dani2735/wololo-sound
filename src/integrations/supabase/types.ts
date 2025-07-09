export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      campañas: {
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
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_campañas_factura_id"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "facturas"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
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
      facturas: {
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
            referencedRelation: "campañas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_facturas_cliente_id"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      movimientos: {
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
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_movimientos_factura_id"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "facturas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
