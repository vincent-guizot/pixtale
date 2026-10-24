'use client';

import { MessageCircle, MoreHorizontal, Send, Trash2, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
  const router = useRouter();
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
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/?post=${post.id}`);
      toast.success('Link post disalin ke clipboard');
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mb-6 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <Link href={`/users/${post.User?.username}`} className="flex items-center gap-3 hover:opacity-85 transition-opacity">
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
            <DropdownMenuTrigger className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer">
              <MoreHorizontal className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwner && (
                <DropdownMenuItem onClick={() => router.push(`/posts/${post.id}/edit`)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit post
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" /> Hapus post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div
        className="bg-black flex items-center justify-center cursor-pointer max-h-[500px] overflow-hidden group"
        onClick={() => openPost(post.id)}
      >
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="w-full object-cover max-h-[500px] transition-transform duration-300 group-hover:scale-[1.01]"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <LikeButton postId={post.id} initialLiked={post.isLiked} />
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => openPost(post.id)}
              className="text-[var(--color-navy)] hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="View comments"
            >
              <MessageCircle className="h-6 w-6" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleShare}
              className="text-[var(--color-navy)] hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Share post"
            >
              <Send className="h-6 w-6" />
            </motion.button>
          </div>

          {post.Category && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-blue)]/10 text-[var(--color-blue)]">
              {post.Category.name}
            </span>
          )}
        </div>

        <p className="text-sm font-semibold text-[var(--color-navy)] mb-1">
          {post.likesCount ?? post.likedBy?.length ?? 0} likes
        </p>

        {post.caption && (
          <p className="text-sm text-[var(--color-navy)]">
            <span className="font-semibold mr-1.5">{post.User?.username}</span>
            {post.caption}
          </p>
        )}

        <button
          onClick={() => openPost(post.id)}
          className="text-xs text-gray-400 hover:text-gray-600 mt-2 block cursor-pointer"
        >
          Lihat semua komentar
        </button>
      </div>
    </motion.article>
  );
}
