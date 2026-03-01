import { test, expect } from '@playwright/test';
import { characterFrequency } from '../task2/stringFrequency';

/**
 * Task 2: String Character Frequency — Unit Tests
 * @tag @task2
 */
test.describe('characterFrequency @task2', () => {

  test.describe('core behaviour', () => {
    test('matches the required example: "hello world"', () => {
      expect(characterFrequency('hello world')).toBe('h:1, e:1, l:3, o:2,  :1, w:1, r:1, d:1');
    });

    test('preserves first-appearance order', () => {
      expect(characterFrequency('abca')).toBe('a:2, b:1, c:1');
    });

    test('counts a single character', () => {
      expect(characterFrequency('a')).toBe('a:1');
    });

    test('counts repeated characters', () => {
      expect(characterFrequency('aaa')).toBe('a:3');
    });
  });

  test.describe('case sensitivity', () => {
    test('treats uppercase and lowercase as distinct characters', () => {
      expect(characterFrequency('aAbB')).toBe('a:1, A:1, b:1, B:1');
    });
  });

  test.describe('whitespace handling', () => {
    test('counts space characters', () => {
      expect(characterFrequency('a b')).toBe('a:1,  :1, b:1');
    });

    test('counts multiple spaces', () => {
      expect(characterFrequency('a  b')).toBe('a:1,  :2, b:1');
    });
  });

  test.describe('special characters', () => {
    test('counts special characters', () => {
      expect(characterFrequency('!!!')).toBe('!:3');
    });

    test('counts mixed alphanumeric and special characters', () => {
      expect(characterFrequency('a1!')).toBe('a:1, 1:1, !:1');
    });
  });

  test.describe('edge cases', () => {
    test('returns empty string for empty input', () => {
      expect(characterFrequency('')).toBe('');
    });

    test('handles all unique characters', () => {
      expect(characterFrequency('abc')).toBe('a:1, b:1, c:1');
    });

    test('handles Unicode characters', () => {
      expect(characterFrequency('café')).toBe('c:1, a:1, f:1, é:1');
    });
  });
});