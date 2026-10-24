import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().max(100, 'Nama maksimal 100 karakter').optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio maksimal 500 karakter').optional().or(z.literal('')),
  avatarUrl: z.string().url('URL avatar tidak valid').optional().or(z.literal('')),
});
