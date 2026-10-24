import { MessageCircle, MoreHorizontal, Send, Trash2, Pencil } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LikeButton } from './LikeButton';
import { usePostModalStore } from '@/stores/postModalStore';
import { useAuthStore } from '@/stores/authStore';
import { useDeletePost } from '@/hooks/usePosts';
import { getInitials } from '@/lib/utils';

export function PostCard({ post }) {
  const openPost = usePostModalStore((s) => s.openPost);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const deletePost = useDeletePost();

  const isOwner = user?.id === post.userId;
  const isAdmin = user?.role === 'admin';

  const handleDelete = () => {
    if (confirm('Yakin mau hapus post ini?')) {
      deletePost.mutate(post.id);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/?post=${post.id}`);
    toast.success('Link post disalin ke clipboard');
  };

  return (
    <article className="mb-6 rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to={`/users/${post.User?.username}`} className="flex items-center gap-3 hover:opacity-85 transition-opacity">
          <Avatar className="h-10 w-10">
            <AvatarImage src={undefined} alt={post.User?.username} />
            <AvatarFallback>{post.User ? getInitials(post.User.username) : '?'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-[var(--color-navy)] leading-tight">{post.User?.username}</p>
            <p className="text-xs text-gray-400 leading-tight">@{post.User?.username}</p>
          </div>
        </Link>

        {(isOwner || isAdmin) && (
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer rounded-full p-1.5 hover:bg-gray-100">
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwner && (
                <DropdownMenuItem onClick={() => navigate(`/posts/${post.id}/edit`)}>
                  <Pencil className="h-4 w-4" /> Edit post
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleDelete} className="text-red-500">
                <Trash2 className="h-4 w-4" /> Delete post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {post.imageUrl && (
        <button onClick={() => openPost(post.id)} className="block w-full cursor-pointer">
          <img src={post.imageUrl} alt={post.caption ?? 'Post image'} className="aspect-square w-full object-cover" />
        </button>
      )}

      <div className="px-4 pt-3 pb-4">
        <div className="flex items-center gap-4">
          <LikeButton postId={post.id} initialLiked={Boolean(post.isLiked)} />
          <button onClick={() => openPost(post.id)} className="cursor-pointer">
            <MessageCircle className="h-6 w-6" />
          </button>
          <button onClick={handleShare} className="cursor-pointer">
            <Send className="h-6 w-6" />
          </button>
        </div>

        <p className="mt-2 text-sm font-semibold text-[var(--color-navy)]">{post.likesCount} likes</p>

        {post.caption && (
          <p className="mt-1 text-sm text-[var(--color-navy)]">
            <Link to={`/users/${post.User?.username}`} className="font-semibold mr-1 hover:underline">
              {post.User?.username}
            </Link>
            {post.caption}
          </p>
        )}

        <button onClick={() => openPost(post.id)} className="mt-1 block text-sm text-gray-400 cursor-pointer">
          Lihat semua komentar
        </button>
      </div>
    </article>
  );
}
