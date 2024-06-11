import { vi, it, expect, describe } from "vitest";
import { getPriceInCurrency, getShippingInfo } from "../mocking";
import { getExchangeRate } from "../libs/currency";
import { getShippingQuote } from "../libs/shipping";

vi.mock("../libs/currency.js");
vi.mock("../libs/shipping.js");

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

describe("getShippingInfo", () => {
  it("should return shipping unavailable", () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);

    expect(getShippingInfo("USA")).toMatch(/Unavailable/i);
  });
  it("should return shipping cost", () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 5 });

    expect(getShippingInfo("USA")).toMatch(/5 days/i);
    expect(getShippingInfo("USA")).toMatch("10");
  });
});
