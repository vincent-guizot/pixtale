import { describe, it, expect } from 'vitest';
import { cn, timeAgo, getInitials } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn (Tailwind class merger)', () => {
    it('should merge class names cleanly', () => {
      const result = cn('px-4 py-2', 'bg-blue-500', { 'text-white': true, 'opacity-50': false });
      expect(result).toBe('px-4 py-2 bg-blue-500 text-white');
    });

    it('should resolve conflicting Tailwind classes by prioritizing later classes', () => {
      const result = cn('p-4', 'p-6', 'text-red-500', 'text-blue-500');
      expect(result).toBe('p-6 text-blue-500');
    });
  });

  describe('getInitials', () => {
    it('should extract first letter and capitalize it', () => {
      expect(getInitials('vincent')).toBe('V');
      expect(getInitials('johnDoe')).toBe('J');
    });

    it('should handle whitespace and empty inputs gracefully', () => {
      expect(getInitials('   alice')).toBe('A');
      expect(getInitials('')).toBe('');
      expect(getInitials(null)).toBe('');
      expect(getInitials(undefined)).toBe('');
    });
  });

  describe('timeAgo', () => {
    it('should return just now for recent timestamps', () => {
      const now = new Date().toISOString();
      expect(timeAgo(now)).toBe('just now');
    });

    it('should format hours correctly', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000).toISOString();
      expect(timeAgo(twoHoursAgo)).toBe('2h');
    });

    it('should format days correctly', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 86400 * 1000).toISOString();
      expect(timeAgo(threeDaysAgo)).toBe('3d');
    });
  });
});
