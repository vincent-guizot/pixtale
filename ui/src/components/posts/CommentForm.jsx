import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { createCommentSchema } from '@/schemas/comment.schema';
import { Button } from '@/components/ui/button';

export function CommentForm({ onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCommentSchema),
  });

  const submit = handleSubmit((values) => {
    onSubmit(values.message);
    reset();
  });

  return (
    <form onSubmit={submit} className="flex items-start gap-2 border-t border-gray-200 pt-3">
      <div className="flex-1">
        <input
          {...register('message')}
          placeholder="Add a comment..."
          className="w-full border-0 bg-transparent text-sm text-[var(--color-navy)] placeholder:text-gray-400 focus:outline-none"
        />
        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
      </div>
      <Button type="submit" variant="link" size="sm" disabled={isSubmitting} className="shrink-0">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
