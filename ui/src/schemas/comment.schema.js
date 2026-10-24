import { z } from 'zod';

export const createCommentSchema = z.object({
  message: z.string().min(1, 'Comment tidak boleh kosong').max(1000, 'Comment maksimal 1000 karakter'),
});
