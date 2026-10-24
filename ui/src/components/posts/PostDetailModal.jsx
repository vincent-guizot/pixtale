'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
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
              href={`/users/${post.User?.username}`}
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

            <div className="flex-1 overflow-y-auto">
              <div className="bg-black flex items-center justify-center max-h-[55vh]">
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="max-h-[55vh] w-auto object-contain"
                />
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <LikeButton postId={post.id} initialLiked={isLiked} />
                  </div>
                  <span className="text-xs text-gray-400">{timeAgo(post.createdAt)} ago</span>
                </div>

                <p className="text-xs font-semibold text-[var(--color-navy)]">
                  {post.likesCount ?? post.likedBy?.length ?? 0} likes
                </p>

                {post.caption && (
                  <p className="text-sm text-[var(--color-navy)]">
                    <span className="font-semibold mr-1.5">{post.User?.username}</span>
                    {post.caption}
                  </p>
                )}

                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs font-medium text-gray-400 mb-2">Komentar</p>
                  <div className="space-y-1">
                    {post.Comments && post.Comments.length > 0 ? (
                      post.Comments.map((comment) => (
                        <CommentItem
                          key={comment.id}
                          comment={comment}
                          onDelete={(id) => deleteComment.mutate(id)}
                        />
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 py-3 text-center">Belum ada komentar.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 p-3 bg-white">
              <CommentForm onSubmit={(msg) => createComment.mutate(msg)} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
