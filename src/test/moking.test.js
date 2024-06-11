import { vi, it, expect, describe } from "vitest";
import { getPriceInCurrency } from "../mocking";
import { getExchangeRate } from "../libs/currency";

vi.mock("../libs/currency.js");

describe("test suite", () => {
  it("tste case 1", () => {
    const sendText = vi.fn();
    sendText.mockReturnValue("okay");

    sendText("message");

    expect(sendText).toHaveBeenCalled();
    expect(sendText("okay")).toBe("okay");
  });
});

describe("getPriceInCurrency", () => {
  it("should return the value of exchanged money", () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);

    const price = getPriceInCurrency(10, "USD");

    expect(price).toBe(15);
  });
});
