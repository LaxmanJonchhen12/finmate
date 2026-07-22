import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, it, expect, vi } from "vitest";
import TransactionCard from "../TransectionCard";

const testTransaction = {
  id: "1",
  user_id: "10",
  amount: 1000,
  note: "momo",
  date: "2022-03-25",
  type: "EXPENSE",
  category_id: 10,
  created_at: "2022-03-25",
};

const mockEdit = vi.fn(() => 0);
const mockTransaction = {
  transaction: testTransaction,
  onEdit: mockEdit,
};

const renderTransactionCard = () => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <TransactionCard
        transaction={mockTransaction.transaction}
        onEdit={mockTransaction.onEdit}
      />
    </QueryClientProvider>,
  );
};

describe("TransactionCard", () => {
  beforeEach(() => {
    mockEdit.mockClear();
  });

  it("renders Edit button", () => {
    renderTransactionCard();

    const editButton = screen.getByRole("button", { name: /edit/i });
    expect(editButton).toBeInTheDocument();
  });

  it("renders transaction amount", () => {
    renderTransactionCard();

    // render the component with mockTransaction and a mock onEdit
    // assert that the amount appears on screen
    // 2. Query the DOM for the text value
    const element = screen.getByText("1000");

    // 3. Assert it is present
    expect(element).toBeInTheDocument();
  });

  it("renders transaction note", () => {
    renderTransactionCard();

    // render the component with mockTransaction and a mock onEdit
    // assert that the amount appears on screen
    // 2. Query the DOM for the text value
    const noteElement = screen.getByText("momo");

    // 3. Assert it is present
    expect(noteElement).toBeInTheDocument();
  });

  it("calls onEdit with correct transaction when edit button clicked", async () => {
    // create a mock function with vi.fn()
    // render component
    // click the edit button
    // assert the mock function was called with mockTransaction

    const user = userEvent.setup();
    renderTransactionCard();

    const editButton = screen.getByRole("button", { name: /Edit/i });
    await user.click(editButton);

    expect(mockEdit).toHaveBeenCalledWith(mockTransaction.transaction);
  });

  it("calls onEdit with the correct transaction data", async () => {
    // you already wrote this one
    // now write this new one:
    // assert that mockEdit was NOT called before the button is clicked

    const user = userEvent.setup();
    renderTransactionCard();

    const editButton = screen.getByRole("button", { name: /Edit/i });
    expect(mockEdit).not.toHaveBeenCalled();
    await user.click(editButton);

    expect(mockEdit).toHaveBeenCalledWith(mockTransaction.transaction);
    expect(mockEdit).toHaveBeenCalledTimes(1);
  });
});
