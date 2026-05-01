"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { transactionSchema } from "../schema/transactionSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  expenseCategoryOptions,
  incomeCategoryOptions,
  transactionOptions,
} from "../constants";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateTransaction } from "../hooks/useCreateTransaction";
import { useAuth } from "../../auth/hooks/useAuth";
import { Transaction } from "../types/transaction.types";
import { useEditTransaction } from "../hooks/useEditTransaction";

export type TransactionFormProps = {
  openTransactionForm?: boolean;
  setOpenTransactionForm?: (open: boolean) => void;
  transactionToEdit?: Transaction | null;
  setTransactionToEdit?: (transaction: Transaction | null) => void;
};

const defaultValues = {
  amount: 0,
  note: "",
  date: new Date(),
  type: "INCOME" as const,
  category: "",
};

export default function TransactionForm({
  openTransactionForm,
  setOpenTransactionForm,
  transactionToEdit,
  setTransactionToEdit,
}: TransactionFormProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });

  const type = useWatch({ control: form.control, name: "type" });
  const isExpense = type === "EXPENSE";

  const { mutate: createTransaction, isPending } = useCreateTransaction();
  const { mutate: editTransaction, isPending: isPendingEdit } =
    useEditTransaction();
  const { data: user } = useAuth();

  useEffect(() => {
    if (!openTransactionForm) {
      form.reset(defaultValues);
      return;
    }

    if (transactionToEdit) {
      form.reset({
        amount: transactionToEdit.amount,
        note: transactionToEdit.note,
        date: new Date(transactionToEdit.date),
        type: transactionToEdit.type,
        category: transactionToEdit.category,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [openTransactionForm, transactionToEdit]);

  const closeForm = () => {
    setOpenTransactionForm?.(false);
    setTransactionToEdit?.(null);
    setCalendarOpen(false);
    form.reset(defaultValues);
  };

  async function onSubmit(data: z.infer<typeof transactionSchema>) {
    try {
      if (!user?.id) {
        toast.error("User not authenticated");
        return;
      }

      const basePayload = {
        amount: data.amount,
        note: data.note || "",
        date: new Date(data.date).toISOString(),
        type: data.type,
        category: data.category,
      };

      if (transactionToEdit) {
        editTransaction(
          {
            id: transactionToEdit.id as string,
            updates: basePayload,
          },
          {
            onSuccess: () => {
              toast.success("Transaction updated successfully");
              closeForm();
            },
            onError: (error: Error) => {
              toast.error(error.message || "Something went wrong");
            },
          },
        );
        return;
      }

      createTransaction(
        {
          ...basePayload,
          user_id: user.id,
          created_at: new Date().toISOString(),
        },
        {
          onSuccess: () => {
            toast.success("Transaction created successfully");
            closeForm();
          },
          onError: (error: Error) => {
            toast.error(error.message || "Something went wrong");
          },
        },
      );
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  }

  function handleSheetOpenChange(open: boolean) {
    setOpenTransactionForm?.(open);

    if (!open) {
      setCalendarOpen(false);
      closeForm();
    }
  }

  const isSubmitButtonDisabled = isPending || isPendingEdit;

  return (
    <Sheet open={openTransactionForm} onOpenChange={handleSheetOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {transactionToEdit ? "Edit Transaction" : "Add Transaction"}
          </SheetTitle>
          <SheetDescription>
            {transactionToEdit
              ? "Update the transaction details."
              : "Fill in the details for the new transaction."}
          </SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
          >
            <div className="grid gap-3">
              <FieldGroup>
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="transaction-type">
                        Transaction Type
                      </FieldLabel>
                      <Select
                        id="transaction-type"
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("category", "");
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full max-w-48">
                          <SelectValue placeholder="Select a transaction type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Transaction Type</SelectLabel>
                            {transactionOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="amount"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="amount">Amount</FieldLabel>
                      <Input
                        {...field}
                        id="amount"
                        aria-invalid={fieldState.invalid}
                        placeholder="0.00"
                        type="number"
                        min={0}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? e.target.valueAsNumber : 0,
                          )
                        }
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="note"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="note">Description</FieldLabel>
                      <Textarea
                        {...field}
                        id="note"
                        rows={4}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter transaction description"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="date"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="date">Date</FieldLabel>
                      <Popover
                        open={calendarOpen}
                        onOpenChange={setCalendarOpen}
                      >
                        <PopoverTrigger
                          render={
                            <Button
                              id="date"
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                              type="button"
                            >
                              {field.value
                                ? new Date(field.value).toLocaleDateString(
                                    undefined,
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    },
                                  )
                                : "Select a date"}
                            </Button>
                          }
                        />
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            defaultMonth={
                              field.value ? new Date(field.value) : undefined
                            }
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              field.onChange(date);
                              setCalendarOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="category"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="category">Category</FieldLabel>
                      <Select
                        id="category"
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full max-w-48">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Category</SelectLabel>
                            {(isExpense
                              ? expenseCategoryOptions
                              : incomeCategoryOptions
                            ).map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>

            <SheetFooter>
              <Button type="submit" disabled={isSubmitButtonDisabled}>
                {isPending || isPendingEdit ? "Saving..." : "Save changes"}
              </Button>
              <SheetClose render={<Button variant="outline">Close</Button>} />
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
