import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { usePostModalStore } from '@/stores/postModalStore';
import { usePost } from '@/hooks/usePosts';
import { useCreateComment, useDeleteComment } from '@/hooks/useComments';
import { useAuthStore } from '@/stores/authStore';
import { LikeButton } from './LikeButton';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { getInitials, timeAgo } from '@/lib/utils';

export function PostDetailModal() {
  const openPostId = usePostModalStore((s) => s.openPostId);
  const closePost = usePostModalStore((s) => s.closePost);
  const user = useAuthStore((s) => s.user);

  const { data: post, isLoading } = usePost(openPostId ?? undefined);
  const createComment = useCreateComment(openPostId ?? 0);
  const deleteComment = useDeleteComment(openPostId ?? 0);

  const isOpen = openPostId !== null;
  const isLiked = Boolean(
    post?.isLiked || (post?.likedBy && user && post.likedBy.some((u) => u.id === user.id))
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closePost()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        {isLoading || !post ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="aspect-square w-full" />
          </div>
        ) : (
          <div className="flex flex-col max-h-[85vh]">
            <Link
              to={`/users/${post.User?.username}`}
              onClick={closePost}
              className="flex items-center gap-3 px-5 pt-5 pb-3 hover:opacity-85 transition-opacity"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={undefined} alt={post.User?.username} />
                <AvatarFallback>{post.User ? getInitials(post.User.username) : '?'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-[var(--color-navy)]">{post.User?.username}</p>
                <p className="text-xs text-gray-400">{post.Category?.name}</p>
              </div>
            </Link>

            {post.imageUrl && (
              <img src={post.imageUrl} alt={post.caption ?? 'Post'} className="w-full max-h-[420px] object-cover" />
            )}

            <div className="flex items-center gap-4 px-5 pt-3">
              <LikeButton key={post.id} postId={post.id} initialLiked={isLiked} size="lg" />
            </div>

            <p className="px-5 pt-2 text-sm font-semibold text-[var(--color-navy)]">
              {post.likesCount} likes
              {post.likedBy && post.likedBy.length > 0 && (
                <span className="ml-1 font-normal text-gray-400">
                  · liked by {post.likedBy.map((u) => u.username).slice(0, 3).join(', ')}
                  {post.likedBy.length > 3 ? ` and ${post.likedBy.length - 3} others` : ''}
                </span>
              )}
            </p>

            {post.caption && (
              <p className="px-5 pt-2 text-sm text-[var(--color-navy)]">
                <Link
                  to={`/users/${post.User?.username}`}
                  onClick={closePost}
                  className="font-semibold mr-1 hover:underline"
                >
                  {post.User?.username}
                </Link>
                {post.caption}
              </p>
            )}
            <p className="px-5 pt-1 text-xs uppercase text-gray-400">{timeAgo(post.createdAt)} ago</p>

            <div className="mt-3 flex-1 overflow-y-auto px-5">
              <p className="text-sm font-semibold text-[var(--color-navy)] mb-1">
                Comments ({post.Comments?.length ?? 0})
              </p>
              {post.Comments && post.Comments.length > 0 ? (
                post.Comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} onDelete={(id) => deleteComment.mutate(id)} />
                ))
              ) : (
                <p className="py-4 text-center text-xs text-gray-400">Belum ada komentar. Jadilah yang pertama!</p>
              )}
            </div>

            <div className="px-5 pb-5">
              <CommentForm onSubmit={(msg) => createComment.mutate(msg)} isSubmitting={createComment.isPending} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
