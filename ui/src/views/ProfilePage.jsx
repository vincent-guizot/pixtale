'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { useMyProfile } from '@/hooks/useProfile';
import { useUserProfile } from '@/hooks/useUserProfile';
import { usePosts } from '@/hooks/usePosts';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import { FollowListModal } from '@/components/profile/FollowListModal';
import { PostGridItem } from '@/components/posts/PostGridItem';
import { getInitials } from '@/lib/utils';

export default function ProfilePage() {
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const user = useAuthStore((state) => state.user);
  const { data: userProfile } = useUserProfile(user?.username);

  const [modalType, setModalType] = useState(null);

  const { data: myPosts = [], isLoading: postsLoading } = usePosts(
    user ? { userId: user.id } : undefined,
    { enabled: Boolean(user?.id) }
  );

  if (profileLoading || !profile) {
    return (
      <div className="mx-auto max-w-3xl flex gap-8">
        <Skeleton className="h-32 w-32 rounded-full shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
        <div className="rounded-full p-1 bg-gradient-to-tr from-[var(--color-orange)] to-pink-400 shrink-0">
          <Avatar className="h-28 w-28 border-4 border-white">
            <AvatarImage src={profile.avatarUrl ?? undefined} alt={profile.User?.username} />
            <AvatarFallback className="text-3xl">
              {profile.User ? getInitials(profile.User.username) : '?'}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <h1 className="text-xl font-bold text-[var(--color-navy)]">{profile.User?.username}</h1>
            <div className="flex items-center gap-2">
              <EditProfileDialog profile={profile} />
              <button className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 cursor-pointer">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-center sm:justify-start gap-6 mt-4 text-sm">
            <span>
              <span className="font-bold text-[var(--color-navy)]">{myPosts.length}</span>{' '}
              <span className="text-gray-400">posts</span>
            </span>

            <button
              type="button"
              onClick={() => setModalType('followers')}
              className="cursor-pointer hover:underline text-left"
            >
              <span className="font-bold text-[var(--color-navy)]">
                {userProfile?.followersCount || 0}
              </span>{' '}
              <span className="text-gray-400">followers</span>
            </button>

            <button
              type="button"
              onClick={() => setModalType('following')}
              className="cursor-pointer hover:underline text-left"
            >
              <span className="font-bold text-[var(--color-navy)]">
                {userProfile?.followingCount || 0}
              </span>{' '}
              <span className="text-gray-400">following</span>
            </button>
          </div>

          <div className="mt-4 text-sm text-[var(--color-navy)] space-y-0.5">
            {profile.fullName && <p className="font-semibold">{profile.fullName}</p>}
            {profile.bio && <p className="text-gray-500 whitespace-pre-line">{profile.bio}</p>}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">Posts</p>

        {postsLoading ? (
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        ) : myPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-400">
            Kamu belum membuat postingan.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {myPosts.map((post) => (
              <PostGridItem key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {user && (
        <FollowListModal
          open={Boolean(modalType)}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setModalType(null);
            }
          }}
          userId={user.id}
          type={modalType || 'followers'}
        />
      )}
    </div>
  );
}
