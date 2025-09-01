import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Tables } from '@/integrations/supabase/types';

type Factura = Tables<'facturas'>;
type Sociedad = Tables<'sociedades'>;

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
  invoiceInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  text: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#666666',
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#cccccc',
    marginTop: 20,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
  },
  tableColDescription: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#cccccc',
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    marginBottom: 5,
    fontSize: 10,
    textAlign: 'center',
  },
  tableCellLeft: {
    margin: 'auto',
    marginTop: 5,
    marginBottom: 5,
    fontSize: 10,
    textAlign: 'left',
    paddingLeft: 5,
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  summaryBox: {
    width: '40%',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderStyle: 'solid',
  },
  summaryRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    borderBottomStyle: 'solid',
    padding: 5,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
  },
  summaryValue: {
    flex: 1,
    fontSize: 10,
    textAlign: 'right',
  },
  totalRow: {
    backgroundColor: '#f0f0f0',
  },
  footer: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#999999',
  },
});

interface FacturaPDFTemplateProps {
  factura: Factura;
  clienteNombre: string;
  sociedad?: Sociedad;
}

export function FacturaPDFTemplate({ factura, clienteNombre, sociedad }: FacturaPDFTemplateProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES');
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} €`;
  };

  const total = (factura.precio || 0) + (factura.iva || 0) - (factura.irpf || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}></View>
          <Text style={styles.title}>FACTURA</Text>
        </View>

        {/* Company Info */}
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>WOLOLO SOUND S.L.</Text>
          <Text style={styles.companyAddress}>
            C/ Ejemplo 123, 28001 Madrid{'\n'}
            CIF: B12345678{'\n'}
            Tel: 600 000 000 | Email: info@wololosound.com
          </Text>
        </View>

        {/* Client and Invoice Info */}
        <View style={styles.clientSection}>
          <View style={styles.clientInfo}>
            <Text style={styles.sectionTitle}>FACTURAR A:</Text>
            <Text style={styles.text}>
              {sociedad?.nombre_fiscal || clienteNombre}{'\n'}
              {sociedad?.cif ? `CIF: ${sociedad.cif}` : ''}{'\n'}
              {sociedad?.direccion_1 || ''}{'\n'}
              {sociedad?.direccion_2 || ''}
            </Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.sectionTitle}>DATOS DE LA FACTURA:</Text>
            <Text style={styles.text}>
              Nº Factura: {factura.referencia || 'Sin referencia'}{'\n'}
              Fecha: {formatDate(factura.fecha)}{'\n'}
              {factura.fecha_cobro ? `Fecha Cobro: ${formatDate(factura.fecha_cobro)}` : 'Sin cobrar'}
            </Text>
          </View>
        </View>

        {/* Services Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableColDescription}>
              <Text style={styles.tableCell}>CONCEPTO</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>CANTIDAD</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>PRECIO</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>TOTAL</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColDescription}>
              <Text style={styles.tableCellLeft}>
                {factura.detalles || 'Servicios de comunicación y prensa'}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>1</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatCurrency(factura.precio || 0)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formatCurrency(factura.precio || 0)}</Text>
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Base Imponible:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(factura.precio || 0)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>IVA (21%):</Text>
              <Text style={styles.summaryValue}>{formatCurrency(factura.iva || 0)}</Text>
            </View>
            {(factura.irpf || 0) > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>IRPF:</Text>
                <Text style={styles.summaryValue}>-{formatCurrency(factura.irpf || 0)}</Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.summaryLabel}>TOTAL:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
            </View>
          </View>
        </View>

        {factura.comentarios && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>OBSERVACIONES:</Text>
            <Text style={styles.text}>{factura.comentarios}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Esta factura se ha generado electrónicamente y es válida sin necesidad de firma.
        </Text>
      </Page>
    </Document>
  );
}