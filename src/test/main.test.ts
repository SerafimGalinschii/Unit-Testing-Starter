import { it, expect, describe } from 'vitest';
import { calculateDiscount } from '../libs/main';

describe('calculateDiscount', () => {
  it('should return price if given valid code', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9);
  });
  it('should return price if given valid code', () => {
    expect(calculateDiscount(10, 'SAVE20')).toBe(8);
  });
  it('should return an error for negative numbers', () => {
    expect(calculateDiscount(-10, 'SAVE10')).toMatch(/invalid/i);
  });
  it('should handle invalid discount code', () => {
    expect(calculateDiscount(10, 'SAVE11')).toBe(10);
  });
});
