'use client';

import Link from 'next/link';
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
            <p className="py-8 text-center text-sm text-gray-500">
              Belum ada {title.toLowerCase()}.
            </p>
          ) : (
            <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
              {users.map((u) => {
                const isSelf = currentUser && currentUser.id === u.id;
                const isFollowingUser = Boolean(u.isFollowing);

                return (
                  <div key={u.id} className="flex items-center justify-between py-1">
                    <Link
                      href={`/users/${u.username}`}
                      onClick={() => onOpenChange(false)}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={undefined} alt={u.username} />
                        <AvatarFallback>{getInitials(u.username)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-navy)] leading-tight">
                          {u.username}
                        </p>
                        <p className="text-xs text-gray-400 leading-tight">@{u.username}</p>
                      </div>
                    </Link>

                    {!isSelf && currentUser && (
                      <Button
                        size="sm"
                        variant={isFollowingUser ? 'outline' : 'default'}
                        onClick={() => handleToggle(u.id)}
                        disabled={toggleFollowMutation.isPending}
                        className={
                          isFollowingUser
                            ? 'border-gray-300 text-gray-700 hover:bg-gray-50 h-8 px-3'
                            : 'bg-[var(--color-orange)] hover:bg-[var(--color-orange-hover)] text-white h-8 px-3'
                        }
                      >
                        {isFollowingUser ? (
                          <>
                            <UserCheck className="mr-1.5 h-3.5 w-3.5" /> Mengikuti
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Ikuti
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
