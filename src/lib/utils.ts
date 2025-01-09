import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const timeZone = "America/Costa_Rica";
  const dateObject = typeof date === "string" ? new Date(date) : date;
  
  return format(dateObject, "dd/MM/yyyy", {
    locale: es,
  });
}