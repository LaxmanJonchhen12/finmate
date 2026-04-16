export const transactionOptions = [
  { label: "Income", value: "INCOME" },
  { label: "Expense", value: "EXPENSE" },
] as const;

export const expenseCategoryOptions = [
  { label: "Food", value: "FOOD" },
  { label: "Transport", value: "TRANSPORT" },
  { label: "Entertainment", value: "ENTERTAINMENT" },
  { label: "Utilities", value: "UTILITIES" },
  { label: "Healthcare", value: "HEALTHCARE" },
  { label: "Education", value: "EDUCATION" },
  { label: "Shopping", value: "SHOPPING" },
  { label: "Other", value: "OTHER" },
] as const;

export const incomeCategoryOptions = [
  { label: "Salary", value: "SALARY" },
  { label: "Business", value: "BUSINESS" },
  { label: "Investment", value: "INVESTMENT" },
  { label: "Gift", value: "GIFT" },
  { label: "Other", value: "OTHER" },
] as const;
