import { vi, it, expect, describe } from "vitest";
import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  renderPage,
  signUp,
  submitOrder,
} from "../mocking";
import { getExchangeRate } from "../libs/currency";
import { getShippingQuote } from "../libs/shipping";
import { trackPageView } from "../libs/analytics";
import { charge } from "../libs/payment";
import { isValidEmail, sendEmail } from "../libs/email";
import { security } from "../libs/security";

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
    const result = await signUp(email);

    expect(sendEmail).toHaveBeenCalled();
    const args = vi.mocked(sendEmail).mock.calls[0];
    expect(args[0]).toBe(email);
    expect(args[1]).toMatch(/welcome/i);
  });
});

describe("isOnline", () => {
  it("should return false if curent hour if is between 8 && 20", () => {
    vi.setSystemTime("2024-01-01 07:59");
    expect(isOnline()).toBe(false);

    vi.setSystemTime("2024-01-01 20:01");
    expect(isOnline()).toBe(false);
  });
  it("shouldreturn true if current hour is within opening hours", () => {
    vi.setSystemTime("2024-01-01 08:00");
    expect(isOnline()).toBe(true);

    vi.setSystemTime("2024-01-01 13:00");
    expect(isOnline()).toBe(true);

    vi.setSystemTime("2024-01-01 19:59");
    expect(isOnline()).toBe(true);
  });
});

describe("getDiscount", () => {
  it("should return no discount if is not Christmas day", () => {
    vi.setSystemTime("2024-01-01 13:00");
    expect(getDiscount()).toBe(0);
  });

  it("should return discount if today is Christmas day", () => {
    vi.setSystemTime("2024-12-25 00:01");
    expect(getDiscount()).toBe(0.2);

    vi.setSystemTime("2024-12-25 23:59");
    expect(getDiscount()).toBe(0.2);
  });
});
