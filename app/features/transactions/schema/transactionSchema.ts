import * as z from "zod";
export const transactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be a positive number."),
  note: z.string().optional(),
  date: z.coerce.date(), // ✅ FIXED
  type: z.enum(["INCOME", "EXPENSE"], {
    errorMap: () => ({
      message: "Type must be either 'INCOME' or 'Expense'.",
    }),
  }),
  category_id: z.coerce.number().min(1, "Please select a category."),
});
