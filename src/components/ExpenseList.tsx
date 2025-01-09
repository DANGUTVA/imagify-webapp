import { useExpenses } from "@/context/ExpenseContext";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Filter } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Expense } from "@/types/expense";
import { supabase } from "@/integrations/supabase/client";

export const ExpenseList = () => {
  const { expenses, deleteExpense, editExpense } = useExpenses();
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>("all");
  const costCenters = ["600-500-140", "600-600-300"];
  const { toast } = useToast();

  // Estado para el diálogo de edición
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Estado para el diálogo de visualización de imagen
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const filteredExpenses = selectedCostCenter === "all" 
    ? expenses 
    : expenses.filter((expense) => expense.costCenter === selectedCostCenter);

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;

    editExpense(editingExpense);
    setIsEditDialogOpen(false);
    setEditingExpense(null);
    toast({
      title: "Gasto actualizado",
      description: "El gasto ha sido actualizado exitosamente",
    });
  };

  const handleViewImage = async (expenseId: number) => {
    try {
      setIsLoadingImage(true);
      setSelectedImage(null); // Reset previous image

      const { data, error } = await supabase.storage
        .from('receipts')
        .createSignedUrl(`receipt-${expenseId}.jpg`, 60);

      if (error) {
        console.error('Error al obtener la imagen:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar la imagen del recibo",
          variant: "destructive",
        });
        return;
      }

      if (data?.signedUrl) {
        // Verificar que la imagen existe antes de mostrarla
        const response = await fetch(data.signedUrl);
        if (!response.ok) {
          throw new Error('Imagen no encontrada');
        }
        
        setSelectedImage(data.signedUrl);
        setIsImageDialogOpen(true);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No se encontró la imagen del recibo para este gasto",
        variant: "destructive",
      });
    } finally {
      setIsLoadingImage(false);
    }
  };

  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold">Lista de Gastos</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select
            value={selectedCostCenter}
            onValueChange={setSelectedCostCenter}
          >
            <SelectTrigger className="w-full sm:w-[240px] border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Seleccione un centro de costo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos los centros de costo</SelectItem>
                {costCenters.map((costCenter) => (
                  <SelectItem key={costCenter} value={costCenter}>
                    {costCenter}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>FECHA</TableHead>
              <TableHead>DESCRIPCIÓN</TableHead>
              <TableHead className="hidden md:table-cell">CENTRO DE COSTO</TableHead>
              <TableHead>CÓDIGO DDI</TableHead>
              <TableHead className="text-right">MONTO</TableHead>
              <TableHead className="text-right">ACCIONES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense, index) => (
              <TableRow key={expense.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {new Date(expense.date).toLocaleDateString("es-CR")}
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell className="hidden md:table-cell">{expense.costCenter}</TableCell>
                <TableCell>{expense.ddiCode}</TableCell>
                <TableCell className="text-right">
                  ₡
                  {expense.amount.toLocaleString("es-CR", {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 md:gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleViewImage(expense.id)}
                      disabled={isLoadingImage}
                    >
                      <Eye className="w-4 h-4 text-[#8E9196]" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEditClick(expense)}
                    >
                      <Pencil className="w-4 h-4 text-[#0FA0CE]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExpense(expense.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4 text-[#ea384c]" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Gasto</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Descripción"
                value={editingExpense?.description || ""}
                onChange={(e) =>
                  setEditingExpense(
                    editingExpense
                      ? { ...editingExpense, description: e.target.value }
                      : null
                  )
                }
              />
            </div>
            <div>
              <Select
                value={editingExpense?.costCenter}
                onValueChange={(value) =>
                  setEditingExpense(
                    editingExpense
                      ? { ...editingExpense, costCenter: value }
                      : null
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Centro de costo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {costCenters.map((center) => (
                      <SelectItem key={center} value={center}>
                        {center}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                type="number"
                placeholder="Monto"
                value={editingExpense?.amount || ""}
                onChange={(e) =>
                  setEditingExpense(
                    editingExpense
                      ? { ...editingExpense, amount: parseFloat(e.target.value) }
                      : null
                  )
                }
              />
            </div>
            <div>
              <Input
                type="date"
                value={editingExpense?.date || ""}
                onChange={(e) =>
                  setEditingExpense(
                    editingExpense
                      ? { ...editingExpense, date: e.target.value }
                      : null
                  )
                }
              />
            </div>
            <div>
              <Input
                placeholder="Código DDI"
                value={editingExpense?.ddiCode || ""}
                onChange={(e) =>
                  setEditingExpense(
                    editingExpense
                      ? { ...editingExpense, ddiCode: e.target.value }
                      : null
                  )
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Guardar Cambios
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo para mostrar la imagen */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Recibo del Gasto</DialogTitle>
          </DialogHeader>
          <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Recibo del gasto"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};