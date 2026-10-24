'use client';

import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePostModalStore } from '@/stores/postModalStore';
import { getInitials, timeAgo, cn } from '@/lib/utils';

export function NotificationItem({ notification, onRead }) {
  const router = useRouter();
  const openPost = usePostModalStore((state) => state.openPost);

  const isLike = notification.type === 'like';
  const isComment = notification.type === 'comment';
  const isFollow = notification.type === 'follow';

  const username = notification.actor?.username;

  const handleClickItem = () => {
    if (!notification.isRead) {
      onRead(notification.id);
    }

    if (isFollow && username) {
      router.push(`/users/${username}`);
    } else if (notification.postId) {
      openPost(notification.postId);
    }
  };

  const handleClickUser = (event) => {
    event.stopPropagation();
    if (!notification.isRead) {
      onRead(notification.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClickItem}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleClickItem();
        }
      }}
      className={cn(
        'flex w-full items-center gap-3 px-2 py-3 text-left rounded-xl transition-colors cursor-pointer select-none',
        !notification.isRead ? 'bg-[var(--color-orange)]/5 hover:bg-[var(--color-orange)]/10' : 'hover:bg-gray-50'
      )}
    >
      <div className="relative shrink-0">
        <Link href={username ? `/users/${username}` : '#'} onClick={handleClickUser}>
          <Avatar className="h-11 w-11">
            <AvatarImage src={undefined} alt={username} />
            <AvatarFallback>{username ? getInitials(username) : '?'}</AvatarFallback>
          </Avatar>
        </Link>
        <span
          className={cn(
            'absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-white',
            isLike && 'bg-red-500',
            isComment && 'bg-blue-500',
            isFollow && 'bg-[var(--color-orange)]'
          )}
        >
          {isLike && <Heart className="h-3 w-3 fill-current" />}
          {isComment && <MessageCircle className="h-3 w-3 fill-current" />}
          {isFollow && <UserPlus className="h-3 w-3" />}
        </span>
      </div>

      <div className="flex-1 min-w-0 text-sm">
        <p className="text-[var(--color-navy)] leading-snug">
          <Link
            href={username ? `/users/${username}` : '#'}
            onClick={handleClickUser}
            className="font-semibold hover:underline mr-1"
          >
            {username || 'Seseorang'}
          </Link>
          {isLike && 'menyukai postingan Anda.'}
          {isComment && 'mengomentari postingan Anda.'}
          {isFollow && 'mulai mengikuti Anda.'}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(notification.createdAt)} yang lalu</p>
      </div>

      {notification.post?.imageUrl && !isFollow && (
        <img
          src={notification.post.imageUrl}
          alt="Post thumbnail"
          className="h-11 w-11 rounded-lg object-cover shrink-0 border border-gray-100"
        />
      )}

      {!notification.isRead && (
        <span className="h-2 w-2 rounded-full bg-[var(--color-orange)] shrink-0" />
      )}
    </div>
  );
}
