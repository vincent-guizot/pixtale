import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePostModalStore } from '@/stores/postModalStore';
import { getInitials, timeAgo, cn } from '@/lib/utils';

export function NotificationItem({ notification, onRead }) {
  const navigate = useNavigate();
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
      navigate(`/users/${username}`);
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
        {username ? (
          <Link
            to={`/users/${username}`}
            onClick={handleClickUser}
            className="block hover:opacity-85 transition-opacity"
          >
            <Avatar className="h-11 w-11">
              <AvatarImage src={undefined} alt={username} />
              <AvatarFallback>{getInitials(username)}</AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Avatar className="h-11 w-11">
            <AvatarImage src={undefined} alt="User" />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
        )}
        <span
          className={cn(
            'absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white',
            isLike && 'bg-red-500',
            isComment && 'bg-blue-500',
            isFollow && 'bg-emerald-500'
          )}
        >
          {isLike && <Heart className="h-2.5 w-2.5 fill-white text-white" />}
          {isComment && <MessageCircle className="h-2.5 w-2.5 fill-white text-white" />}
          {isFollow && <UserPlus className="h-2.5 w-2.5 text-white" />}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--color-navy)]">
          {username ? (
            <Link
              to={`/users/${username}`}
              onClick={handleClickUser}
              className="font-semibold hover:underline"
            >
              {username}
            </Link>
          ) : (
            <span className="font-semibold">Someone</span>
          )}{' '}
          {isLike && 'liked your post.'}
          {isComment && 'commented on your post.'}
          {isFollow && 'started following you.'}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(notification.createdAt)} ago</p>
      </div>

      {!notification.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-orange)]" />}
    </div>
  );
}
