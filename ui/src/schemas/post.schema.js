import { z } from 'zod';

export const createPostSchema = z.object({
  caption: z.string().max(2200, 'Caption maksimal 2200 karakter').optional().or(z.literal('')),
  imageUrl: z
    .string()
    .url('URL gambar tidak valid')
    .optional()
    .or(z.literal('')),
  categoryId: z.number({ error: 'Pilih kategori' }).int().positive('Pilih kategori'),
});
