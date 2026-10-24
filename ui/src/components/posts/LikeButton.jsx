import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { likesApi } from '@/api/likes.api';
import { getApiErrorMessage } from '@/api/axios';
import { cn } from '@/lib/utils';

export function LikeButton({
  postId,
  initialLiked = false,
  size = 'default',
}) {
  const [optimisticLiked, setOptimisticLiked] = useState(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // Nilai liked diturunkan dari props, dengan fallback ke state optimistik lokal jika ada interaksi
  const liked = optimisticLiked !== null ? optimisticLiked : initialLiked;

  const handleClick = async (e) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);

    const nextLiked = !liked;
    setOptimisticLiked(nextLiked);

    try {
      if (nextLiked) {
        await likesApi.like(postId);
      } else {
        await likesApi.unlike(postId);
      }
      setOptimisticLiked(null);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    } catch (err) {
      setOptimisticLiked(null);
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-label={liked ? 'Unlike' : 'Like'}
      className="cursor-pointer disabled:opacity-50"
    >
      <Heart
        className={cn(size === 'lg' ? 'h-7 w-7' : 'h-6 w-6', 'transition-colors')}
        fill={liked ? '#f66b0e' : 'none'}
        stroke={liked ? '#f66b0e' : 'currentColor'}
      />
    </button>
  );
}
