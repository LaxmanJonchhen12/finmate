import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTransactions } from "@/lib/transactions";

const chainable = {
  from: vi.fn(),
  select: vi.fn(),
  order: vi.fn(),
  eq: vi.fn(),
};

chainable.from.mockReturnValue(chainable);
chainable.select.mockReturnValue(chainable);
chainable.order.mockReturnValue(chainable);
chainable.eq.mockResolvedValue({ data: [], error: null });

vi.mock("@/utils/supabase/client", () => ({
  createClient: () => chainable,
}));

describe("getTransactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    chainable.from.mockReturnValue(chainable);
    chainable.select.mockReturnValue(chainable);
    chainable.order.mockReturnValue(chainable);
    chainable.eq.mockResolvedValue({ data: [], error: null });
  });

  it("calls eq with INCOME when filter is INCOME", async () => {
    await getTransactions("INCOME");
    expect(chainable.eq).toHaveBeenCalledWith("type", "INCOME");
  });

  it("does not call eq when filter is empty", async () => {
    await getTransactions("");
    expect(chainable.eq).not.toHaveBeenCalled();
  });
});
