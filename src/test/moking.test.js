import { vi, it, expect, describe } from "vitest";
import {
  getPriceInCurrency,
  getShippingInfo,
  renderPage,
  signUp,
  submitOrder,
} from "../mocking";
import { getExchangeRate } from "../libs/currency";
import { getShippingQuote } from "../libs/shipping";
import { trackPageView } from "../libs/analytics";
import { charge } from "../libs/payment";
import { isValidEmail, sendEmail } from "../libs/email";

vi.mock("../libs/currency.js");
vi.mock("../libs/shipping.js");
vi.mock("../libs/analytics.js");
vi.mock("../libs/payment.js");
vi.mock("../libs/email.js", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    sendEmail: vi.fn(),
  };
});

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

describe("renderPage", () => {
  it("should return corect content", async () => {
    const result = await renderPage();

    expect(result).toMatch(/content/i);
  });

  it("should check if inner function is executed", async () => {
    await trackPageView();

    expect(trackPageView).toBeCalledWith("/home");
  });
});

describe("submitOrder", () => {
  const order = { totalAmount: 10 };
  const creditCard = { creditCardNumber: "124" };
  it("should charge the customer", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });

    await submitOrder(order, creditCard);

    expect(charge).toBeCalledWith(creditCard, order.totalAmount);
  });
  it("should return succes if response is succesful", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: true });
  });
  it("should return error if response is unsuccesful", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "failed" });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: false, error: "payment_error" });
  });
});

describe("signUp", () => {
  const email = "name@domain.com";
  it("should return false if the email is invalid", async () => {
    const result = await signUp("a");

    expect(result).toBe(false);
  });

  it("should return true if the email is valid", async () => {
    vi.mocked(sendEmail).mockResolvedValue(true);

    const result = await sendEmail(email);
    const args = vi.mocked(sendEmail).mock.calls[0];

    expect(result).toBe(true);
    expect(args[0]).toBe(email);
    expect(sendEmail).toHaveBeenCalled();
  });
});
