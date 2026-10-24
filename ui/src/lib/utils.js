import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format ISO date string jadi "2h ago", "3d ago", dst (mirip desain notifikasi).
 */
export function timeAgo(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  const intervals = [
    [31536000, 'y'],
    [2592000, 'mo'],
    [604800, 'w'],
    [86400, 'd'],
    [3600, 'h'],
    [60, 'm'],
  ];

  for (const [secondsInUnit, label] of intervals) {
    const count = Math.floor(seconds / secondsInUnit);
    if (count >= 1) return `${count}${label}`;
  }
  return 'just now';
}

/**
 * Fallback avatar (initial huruf pertama username) kalau avatarUrl kosong.
 */
export function getInitials(name) {
  return (name || '').trim().charAt(0).toUpperCase();
}
