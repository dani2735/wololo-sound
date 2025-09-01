import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Colaboradores = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pagos a Colaboradores</h1>
          <p className="text-muted-foreground">Gestión de pagos a Ana y otros colaboradores</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campañas Pendientes de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Esta funcionalidad será implementada según el nuevo esquema de base de datos.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Colaboradores;