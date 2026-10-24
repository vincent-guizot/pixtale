import { Link } from 'react-router-dom';
import { UserCheck, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useFollowers, useFollowing, useToggleFollow } from '@/hooks/useFollow';
import { useAuthStore } from '@/stores/authStore';
import { getInitials } from '@/lib/utils';

export function FollowListModal({ open, onOpenChange, userId, type }) {
  const currentUser = useAuthStore((state) => state.user);
  const toggleFollowMutation = useToggleFollow();

  const isFollowers = type === 'followers';
  const title = isFollowers ? 'Followers' : 'Following';

  const followersQuery = useFollowers(isFollowers ? userId : undefined);
  const followingQuery = useFollowing(!isFollowers ? userId : undefined);

  const activeQuery = isFollowers ? followersQuery : followingQuery;
  const users = activeQuery.data || [];
  const isLoading = activeQuery.isLoading;

  const handleToggle = (targetUserId) => {
    toggleFollowMutation.mutate(targetUserId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((indexNumber) => (
                <div key={indexNumber} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              {isFollowers ? 'Belum memiliki pengikut.' : 'Belum mengikuti siapa pun.'}
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto pr-1">
              {users.map((targetUser) => {
                const profile = targetUser.Profile || {};
                const isSelf = currentUser && currentUser.id === targetUser.id;

                return (
                  <div key={targetUser.id} className="flex items-center justify-between py-2.5">
                    <Link
                      to={`/users/${targetUser.username}`}
                      onClick={() => onOpenChange(false)}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity min-w-0"
                    >
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={profile.avatarUrl || undefined} alt={targetUser.username} />
                        <AvatarFallback>{getInitials(targetUser.username)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 truncate">
                        <p className="text-sm font-semibold text-[var(--color-navy)] truncate">
                          {targetUser.username}
                        </p>
                        {profile.fullName && (
                          <p className="text-xs text-gray-400 truncate">{profile.fullName}</p>
                        )}
                      </div>
                    </Link>

                    {!isSelf && (
                      <Button
                        size="sm"
                        variant={targetUser.isFollowing ? 'outline' : 'default'}
                        onClick={() => handleToggle(targetUser.id)}
                        disabled={toggleFollowMutation.isPending}
                        className="ml-2 shrink-0 h-8 text-xs"
                      >
                        {targetUser.isFollowing ? (
                          <>
                            <UserCheck className="h-3.5 w-3.5 mr-1" /> Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-3.5 w-3.5 mr-1" /> Follow
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
