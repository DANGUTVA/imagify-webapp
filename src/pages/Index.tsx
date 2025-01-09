import { ExpenseProvider } from "@/context/ExpenseContext";
import { ExpenseMetrics } from "@/components/ExpenseMetrics";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Index = () => {
  return (
    <ExpenseProvider>
      <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-center mb-3 md:mb-4">
            Gastos Mensuales PROMED
          </h1>
          
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-base md:text-lg">Enero 2025</span>
            <Button variant="ghost" size="icon">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ExpenseMetrics />
        <ExpenseForm />
        <ExpenseList />
      </div>
    </ExpenseProvider>
  );
};

export default Index;