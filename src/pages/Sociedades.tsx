import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import { useSociedades } from "@/hooks/useSociedades";
import { SociedadForm } from "@/components/forms/SociedadForm";

type Sociedad = {
  id: string;
  nombre_fiscal: string;
  cif: string;
  direccion_1: string | null;
  direccion_2: string | null;
};

export default function Sociedades() {
  const { sociedades, loading, deleteSociedad } = useSociedades();
  const [showForm, setShowForm] = useState(false);
  const [editingSociedad, setEditingSociedad] = useState<Sociedad | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres borrar esta sociedad?")) {
      await deleteSociedad(id);
    }
  };

  const handleEdit = (sociedad: Sociedad) => {
    setEditingSociedad(sociedad);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSociedad(null);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">Cargando sociedades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sociedades</h1>
          <p className="text-muted-foreground">
            Gestión de sociedades y empresas
          </p>
        </div>
        
        <Button 
          className="bg-gradient-primary shadow-elegant hover:shadow-hover"
          onClick={() => setShowForm(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Sociedad
        </Button>
      </div>

      {/* Statistics Card */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total Sociedades</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{sociedades.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Sociedades registradas en el sistema
          </p>
        </CardContent>
      </Card>

      {/* Societies Table */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle>Lista de Sociedades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre Fiscal</TableHead>
                  <TableHead>CIF</TableHead>
                  <TableHead>Dirección Principal</TableHead>
                  <TableHead>Dirección Secundaria</TableHead>
                  <TableHead className="w-32">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sociedades.map((sociedad) => (
                  <TableRow key={sociedad.id} className="hover:bg-accent/50">
                    <TableCell className="font-medium">{sociedad.nombre_fiscal}</TableCell>
                    <TableCell className="font-mono">{sociedad.cif}</TableCell>
                    <TableCell className="max-w-48">
                      <div className="truncate" title={sociedad.direccion_1}>
                        {sociedad.direccion_1}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-48">
                      <div className="truncate" title={sociedad.direccion_2 || 'N/A'}>
                        {sociedad.direccion_2 || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(sociedad)}
                          className="hover:bg-primary/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(sociedad.id)}
                          className="hover:bg-destructive/20 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {sociedades.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No hay sociedades registradas. ¡Agrega tu primera sociedad!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <SociedadForm 
        isOpen={showForm}
        onClose={handleCloseForm}
        sociedad={editingSociedad || undefined}
      />
    </div>
  );
}