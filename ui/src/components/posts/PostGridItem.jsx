'use client';

import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePostModalStore } from '@/stores/postModalStore';

export function PostGridItem({ post }) {
  const openPost = usePostModalStore((s) => s.openPost);

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={() => openPost(post.id)}
      className="group relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 cursor-pointer shadow-xs"
    >
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt={post.caption ?? 'Post'}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-3 text-center text-xs text-gray-400">
          {post.caption ?? 'No image'}
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
        <div className="flex items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white">
          <Play className="h-3.5 w-3.5 fill-white" /> {post.likesCount ?? 0} likes
        </div>
      </div>
    </motion.button>
  );
}
