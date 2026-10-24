import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/authStore';
import { usePostModalStore } from '@/stores/postModalStore';
import { getInitials, timeAgo } from '@/lib/utils';

export function CommentItem({ comment, onDelete }) {
  const user = useAuthStore((s) => s.user);
  const closePost = usePostModalStore((s) => s.closePost);
  const isOwner = user?.id === comment.userId;
  const username = comment.User?.username;

  return (
    <div className="flex items-start gap-3 py-2 group">
      <Link
        to={username ? `/users/${username}` : '#'}
        onClick={() => {
          if (username) closePost();
        }}
        className="hover:opacity-85 transition-opacity shrink-0"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={undefined} alt={username} />
          <AvatarFallback className="text-xs">{username ? getInitials(username) : '?'}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--color-navy)]">
          <Link
            to={username ? `/users/${username}` : '#'}
            onClick={() => {
              if (username) closePost();
            }}
            className="font-semibold mr-1 hover:underline"
          >
            {username}
          </Link>
          {comment.message}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(comment.createdAt)} ago</p>
      </div>
      {isOwner && (
        <button
          onClick={() => onDelete(comment.id)}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 cursor-pointer transition-opacity"
          aria-label="Delete comment"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
