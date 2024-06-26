import { describe, it, expect } from 'vitest';
import { fizzBuzz, max, calculateAverage, factorial } from '../intro.js';

describe('max', () => {
  it('should return the first argument if it is greater', () => {
    expect(max(2, 1)).toBe(2);
  });
  it('should return the second argument if it is greater', () => {
    expect(max(1, 2)).toBe(2);
  });
  it('should return the first argument if arguments are equal', () => {
    expect(max(2, 2)).toBe(2);
  });
});

describe('fizzBuzz', () => {
  it('should return "FizzBuzz" if the number is divisible by 3 and 5 ', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz');
  });
  it('should return "Fizz" if the number is divisible by 3', () => {
    expect(fizzBuzz(9)).toBe('Fizz');
  });
  it('should return "Buzz" if the number is divisible by 5', () => {
    expect(fizzBuzz(10)).toBe('Buzz');
  });
  it('should return a string if the number is not divisible', () => {
    expect(fizzBuzz(7)).toBe('7');
  });
});

describe('calculateAverage', () => {
  it('should return not a number', () => {
    expect(calculateAverage([])).toBe(NaN);
  });
  it('should return the sum of the array', () => {
    expect(calculateAverage([1])).toBe(1);
  });
  it('should return the average of the array', () => {
    expect(calculateAverage([1, 2])).toBe(1.5);
  });
});

describe('factorial', () => {
  it('should return 1 if given  0', () => {
    expect(factorial(0)).toBe(1);
  });
  it('should return 1 if given 1', () => {
    expect(factorial(1)).toBe(1);
  });
  it('should return 2 if given 2', () => {
    expect(factorial(2)).toBe(2);
  });
  it('should return 40320 if given 8', () => {
    expect(factorial(8)).toBe(40320);
  });
  it('should return 24 if given 4', () => {
    expect(factorial(4)).toBe(24);
  });
  it('should return undefined if given a negative number', () => {
    expect(factorial(-1)).toBe(undefined);
  });
});
