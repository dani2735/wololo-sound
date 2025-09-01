import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Factura } from '@/types';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 40,
    backgroundColor: '#000000',
    borderRadius: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 4,
  },
  companyInfo: {
    textAlign: 'center',
    marginBottom: 30,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  companyAddress: {
    fontSize: 10,
    color: '#666666',
    lineHeight: 1.3,
  },
  clientSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  clientInfo: {
    flex: 1,
  },
  dateInfo: {
    flex: 1,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000',
  },
  clientText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#333333',
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e88e5',
    color: '#ffffff',
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableColDescription: {
    flex: 3,
  },
  tableColQty: {
    flex: 1,
    textAlign: 'center',
  },
  tableColPrice: {
    flex: 1,
    textAlign: 'right',
  },
  tableColTotal: {
    flex: 1,
    textAlign: 'right',
  },
  tableText: {
    fontSize: 10,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    paddingVertical: 3,
  },
  totalLabel: {
    fontSize: 11,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 11,
    textAlign: 'right',
  },
  finalTotal: {
    fontSize: 12,
    fontWeight: 'bold',
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
  },
  footerText: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 1.3,
  },
});

interface FacturaPDFTemplateProps {
  factura: Factura;
  clienteNombre: string;
}

export const FacturaPDFTemplate = ({ factura, clienteNombre }: FacturaPDFTemplateProps) => {
  const fechaExpedicion = new Date(factura.fecha).toLocaleDateString('es-ES');
  const total = factura.precio + factura.iva;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={{ color: '#ffffff', fontSize: 20, textAlign: 'center', paddingTop: 8 }}>W</Text>
          </View>
          <Text style={styles.title}>FACTURA</Text>
        </View>

        {/* Company Info */}
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>WOLOLO SOUND, S.L.</Text>
          <Text style={styles.companyAddress}>
            PASEO DE ARROYOMOLINOS, 54, 6ºA{'\n'}
            28938, MÓSTOLES (MADRID){'\n'}
            NIF: B22542211
          </Text>
        </View>

        {/* Client and Date Info */}
        <View style={styles.clientSection}>
          <View style={styles.clientInfo}>
            <Text style={styles.sectionTitle}>PARA</Text>
            <Text style={styles.clientText}>
              {factura.nombrePagador}{'\n'}
              {factura.nif}{'\n'}
              {factura.direccion}
            </Text>
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.sectionTitle}>FECHA DE EXPEDICIÓN</Text>
            <Text style={styles.clientText}>{fechaExpedicion}</Text>
            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>NÚMERO DE EXPEDICIÓN</Text>
            <Text style={styles.clientText}>{factura.referencia}</Text>
          </View>
        </View>

        {/* Services Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.tableColDescription]}>DESCRIPCIÓN</Text>
            <Text style={[styles.tableHeaderText, styles.tableColQty]}>CANT.</Text>
            <Text style={[styles.tableHeaderText, styles.tableColPrice]}>PRECIO</Text>
            <Text style={[styles.tableHeaderText, styles.tableColTotal]}>TOTAL</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableText, styles.tableColDescription]}>
              {factura.datosAcciones}
            </Text>
            <Text style={[styles.tableText, styles.tableColQty]}>1</Text>
            <Text style={[styles.tableText, styles.tableColPrice]}>
              {factura.precio.toFixed(2)} €
            </Text>
            <Text style={[styles.tableText, styles.tableColTotal]}>
              {factura.precio.toFixed(2)} €
            </Text>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>BASE IMPONIBLE</Text>
            <Text style={styles.totalValue}>{factura.precio.toFixed(2)} €</Text>
          </View>
          {factura.iva > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IVA (+21%)</Text>
              <Text style={styles.totalValue}>{factura.iva.toFixed(2)} €</Text>
            </View>
          )}
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.totalLabel}>CANTIDAD A PAGAR</Text>
            <Text style={styles.totalValue}>{total.toFixed(2)} €</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            NOMBRE DE CUENTA{'\n'}
            WOLOLO SOUND, SL{'\n\n'}
            NÚMERO DE CUENTA{'\n'}
            ES23 0081 7125 9600 0192 7002 (SWIFT: BSABESBBXXX){'\n\n'}
            Wololo Sound, S.L. – NIF: B22542211 – Inscrita en el Registro Mercantil de Madrid,{'\n'}
            Hoja M-856191 IRUS: 1000451221650 Tomo electrónico Folio electrónico
          </Text>
        </View>
      </Page>
    </Document>
  );
};