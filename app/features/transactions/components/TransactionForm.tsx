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
  SheetTrigger,
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

export default function TransactionForm() {
  // ✅ Controlled so we can close programmatically on success
  const [sheetOpen, setSheetOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      note: "",
      date: new Date(),
      type: "INCOME",
      category: "",
    },
  });

  const type = useWatch({ control: form.control, name: "type" });
  const isExpense = type === "EXPENSE";

  const { mutate, isPending } = useCreateTransaction();
  const { data: user } = useAuth();

  async function onSubmit(data: z.infer<typeof transactionSchema>) {
    try {
      if (!user?.id) {
        toast.error("User not authenticated");
        return;
      }

      const payload = {
        ...data,
        user_id: user.id,
        created_at: new Date().toISOString(),
        date: new Date(data.date).toISOString(),
        note: data.note || "",
      };

      mutate(payload, {
        onSuccess: () => {
          toast.success("Transaction created successfully");
          form.reset();
          setSheetOpen(false); // ✅ close sheet on success
        },
        onError: (error: Error) => {
          toast.error(error.message || "Something went wrong");
        },
      });
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  }

  useEffect(() => {
    form.setValue("category", "");
  }, [type, form]);

  // ✅ Resets everything when sheet closes (via X, Escape, or success)
  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      form.reset();
      setCalendarOpen(false);
    }
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger
        render={<Button variant="outline">Add Transaction</Button>}
      />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Transaction</SheetTitle>
          <SheetDescription>
            Fill in the details for the new transaction.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <form
            onSubmit={(e) => {
              e.stopPropagation(); // ✅ prevents Sheet from swallowing the submit event
              form.handleSubmit(onSubmit)(e);
            }}
          >
            <div className="grid gap-3">
              <FieldGroup>
                {/* Transaction Type */}
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="transaction-type">
                        Transaction Type
                      </FieldLabel>
                      <Select
                        items={transactionOptions}
                        id="transaction-type"
                        onValueChange={field.onChange}
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

                {/* Amount */}
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
                        // ✅ number inputs return strings — coerce to number for Zod
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Note */}
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

                {/* Date */}
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

                {/* Category */}
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="category">Category</FieldLabel>
                      <Select
                        items={
                          isExpense
                            ? expenseCategoryOptions
                            : incomeCategoryOptions
                        }
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
                            {isExpense
                              ? expenseCategoryOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))
                              : incomeCategoryOptions.map((opt) => (
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
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save changes"}
              </Button>
              <SheetClose render={<Button variant="outline">Close</Button>} />
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
