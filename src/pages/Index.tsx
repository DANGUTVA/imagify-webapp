import { ExpenseProvider } from "@/context/ExpenseContext";
import { ExpenseMetrics } from "@/components/ExpenseMetrics";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { useMonthlyBudget } from "@/components/expense/hooks/useMonthlyBudget";

const Index = () => {
  const { budget, isLoading } = useMonthlyBudget();

  return (
    <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-center">
          Gastos Mensuales PROMED
        </h1>
      </div>

      <ExpenseProvider>
        <ExpenseMetrics />
        
        {!isLoading && budget !== null && (
          <>
            <ExpenseForm />
            <ExpenseList />
          </>
        )}
      </ExpenseProvider>
    </div>
  );
};

export default Index;