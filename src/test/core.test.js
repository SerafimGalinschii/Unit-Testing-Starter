import { describe, test, it, expect } from "vitest";
import { calculateDiscount, getCoupons } from "../core";

describe("getCoupons", () => {
  it("should return an array of coupons", () => {
    const coupons = getCoupons();
    expect(coupons.length).toBeGreaterThan(0);
    expect(Array.isArray(coupons)).toBe(true);
  });
  it("should return an array with valid cupons", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("code");
      expect(typeof coupon.code).toBe("string");
      expect(coupon.code).toBeTruthy();
    });
  });
  it("should return an array with valid discounts", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("discount");
      expect(typeof coupon.discount).toBe("number");
      expect(coupon.discount).toBeTruthy();
    });
  });
});
describe("calculateDiscount", () => {
  it("should return price if given valid code", () => {
    expect(calculateDiscount(10, "SAVE10")).toBe(9);
  });
  it("should return price if given valid code", () => {
    expect(calculateDiscount(10, "SAVE20")).toBe(8);
  });
  it("should return an error for negative numbers", () => {
    expect(calculateDiscount(-10, "SAVE10")).toMatch(/invalid/i);
  });
  it("should return a non-numeric price", () => {
    expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/i);
  });
  it("should return a non-numeric discount", () => {
    expect(calculateDiscount("10", 10)).toMatch(/invalid/i);
  });
  it("should handle invalid discount code", () => {
    expect(calculateDiscount(10, "SAVE11")).toBe(10);
  });
  it("should handle invalid discount code", () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
  });
});
