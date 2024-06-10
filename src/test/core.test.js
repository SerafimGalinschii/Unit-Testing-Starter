import {
  describe,
  test,
  it,
  expect,
  createExpect,
  beforeEach,
  expectTypeOf,
} from "vitest";
import {
  calculateDiscount,
  getCoupons,
  isPriceInRange,
  validateUserInput,
  isValidUsername,
  canDrive,
  fetchData,
  Stack,
  createProduct,
  isStrongPassword,
} from "../core";

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

describe("validateUserInput", () => {
  it("should return succes if given a valid input ", () => {
    expect(validateUserInput("SERAFIM", 23)).toMatch(/successful/i);
  });
  it("should return invalid if given not string ", () => {
    expect(validateUserInput(23, 23)).toMatch(/invalid/i);
  });
  it("should return invalid if given a username length < 3 ", () => {
    expect(validateUserInput("GS", 23)).toMatch(/invalid/i);
  });
  it("should return invalid if given a username length > 40 ", () => {
    expect(validateUserInput("GS".repeat(41), 23)).toMatch(/invalid/i);
  });
  it("should return invalid if given age > 110", () => {
    expect(validateUserInput("GSS", 111)).toMatch(/invalid/i);
  });
  it("should return invalid if given both.username and age invalid", () => {
    expect(validateUserInput("", 0)).toMatch(/invalid username/i);
    expect(validateUserInput("", 0)).toMatch(/invalid age/i);
  });
  it("should return invalid if given a string for age or given an age < 18 ", () => {
    expect(validateUserInput("GSSS", "23")).toMatch(/invalid/i);
    expect(validateUserInput("GSSS", 17)).toMatch(/invalid/i);
  });
});

describe("isPriceInRange", () => {
  it.each([
    {
      scenario: "price is less than min",
      price: 0,
      min: 66,
      max: 70,
      result: false,
    },
    {
      scenario: "price is equal to min",
      price: 66,
      min: 66,
      max: 70,
      result: true,
    },
    {
      scenario: "price is between the range",
      price: 67,
      min: 66,
      max: 70,
      result: true,
    },
    {
      scenario: "price is equal to max",
      price: 70,
      min: 66,
      max: 70,
      result: true,
    },
    {
      scenario: "peice is greater than max",
      price: 76,
      min: 66,
      max: 70,
      result: false,
    },
  ])("should return $result for $scenario", ({ result, price, min, max }) => {
    expect(isPriceInRange(price, min, max)).toBe(result);
  });
});

describe("isValidUsername", () => {
  it("should return true if username.length is less or equal with 15", () => {
    expect(isValidUsername("Serafim")).toBe(true);
    expect(isValidUsername("SerafimGalinsch")).toBe(true);
  });
  it("should return true if username.length is greater or equal with 5", () => {
    expect(isValidUsername("Serafim")).toBe(true);
    expect(isValidUsername("Seraf")).toBe(true);
  });
  it("should return false if username.length is less than 5 or greater than 15", () => {
    expect(isValidUsername("SerafimGalinschii")).toBe(false);
    expect(isValidUsername("Se")).toBe(false);
  });
});

describe("canDrive", () => {
  it("should return an error if given am inexistent countryCode", () => {
    expect(canDrive(18, "Ul")).toMatch(/invalid/i);
  });
  it("should return an error if given an underage value", () => {
    expect(canDrive(15, "UK")).toBe(false);
  });
  it("should return an true for min age", () => {
    expect(canDrive(16, "US")).toBe(true);
  });
  it("should return an true for eligible", () => {
    expect(canDrive(17, "UK")).toBe(true);
  });
});

describe("fetchData", () => {
  it("should return an array of numbers", () => {
    fetchData().then((result) => {
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});

describe("Stack", () => {
  let stack;

  beforeEach(() => {
    stack = new Stack();
  });

  it("push should add an element to the stack", () => {
    stack.push(1);

    expect(stack.size()).toBe(1);
  });
  it("pop should remove the last element from the stack", () => {
    stack.push(1);
    stack.push(2);
    const popedItem = stack.pop();

    expect(popedItem).toBe(2);
    expect(stack.size()).toBe(1);
  });
  it("pop should throw an error if stack is empty", () => {
    expect(() => stack.pop()).toThrow(/empty/i);
  });
  it("peek should show the last element from the stack", () => {
    stack.push(1);
    stack.push(2);
    const result = stack.peek();

    expect(result).toBe(2);
    expect(stack.size()).toBe(2);
  });
  it("peek should throw an error if the stack is empty", () => {
    expect(() => stack.peek()).toThrow(/empty/i);
  });
  it("isEmpty should return true if stack is empty", () => {
    expect(stack.isEmpty()).toBe(true);
  });
  it("isEmpty should return false if stack is not empty", () => {
    stack.push(1);
    expect(stack.isEmpty()).toBe(false);
  });
  it("size method should return the size of the stack", () => {
    expect(stack.size()).toBe(0);

    stack.push(1);
    expect(stack.size()).toBe(1);
  });
  it("clear should remove all itens from the stack", () => {
    stack.push(1);
    stack.push(2);

    stack.clear();

    expect(stack.size()).toBe(0);
  });
});

describe("createProduct", () => {
  it("should return error if a name doesn't exist", () => {
    const product = { price: 10 };
    expect(createProduct(product)).toEqual({
      success: false,
      error: { code: "invalid_name", message: "Name is missing" },
    });
  });
  it("should return error if a price is less than 0", () => {
    let product = { name: "LAA", price: 0 };
    expect(createProduct(product)).toEqual({
      success: false,
      error: { code: "invalid_price", message: "Price is missing" },
    });
  });
  it("should return error if a price doesn't exist", () => {
    let product = { name: "LAA" };
    expect(createProduct(product)).toEqual({
      success: false,
      error: { code: "invalid_price", message: "Price is missing" },
    });
  });
  it("should return succes if passed all the valid parameters", () => {
    let product = { name: "LAA", price: 10 };
    expect(createProduct(product)).toEqual({
      success: true,
      message: "Product was successfully published",
    });
  });
});

describe("isStrongPassword", () => {
  it("should return false if the password is less than 8 characters", () => {
    expect(isStrongPassword("sgf")).toBe(false);
  });
  it("should return false if the password doesn't contain at list one Uppercase", () => {
    expect(isStrongPassword("sgffffffff1")).toBe(false);
  });
  it("should return false if the password doesn't contain at list one Lowercase", () => {
    expect(isStrongPassword("FFFFFFFFFFFFFFFFF1")).toBe(false);
  });
  it("should return false if the password doesn't contain at list one digital", () => {
    expect(isStrongPassword("hdjdhdjhdF")).toBe(false);
  });
  it("should return false if all the criteria are matched", () => {
    expect(isStrongPassword("Serafim1gs")).toBe(true);
  });
});
