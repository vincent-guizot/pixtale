'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { UserCheck, UserPlus, ArrowLeft } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { usePosts } from '@/hooks/usePosts';
import { useToggleFollow } from '@/hooks/useFollow';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import { FollowListModal } from '@/components/profile/FollowListModal';
import { PostGridItem } from '@/components/posts/PostGridItem';
import { getInitials } from '@/lib/utils';

export default function UserProfilePage() {
  const params = useParams();
  const username = params?.username;
  const currentUser = useAuthStore((state) => state.user);
  const toggleFollowMutation = useToggleFollow();

  const [modalType, setModalType] = useState(null);

  const { data: userProfile, isLoading: isProfileLoading, isError } = useUserProfile(username);

  const userId = userProfile ? userProfile.id : undefined;
  const { data: userPosts = [], isLoading: isPostsLoading } = usePosts(
    userId ? { userId: userId } : undefined,
    { enabled: Boolean(userId) }
  );

  const isOwnProfile = Boolean(
    currentUser && userProfile && currentUser.id === userProfile.id
  );

  const isFollowing = userProfile ? Boolean(userProfile.isFollowing) : false;

  const handleToggleFollow = () => {
    if (userProfile) {
      toggleFollowMutation.mutate(userProfile.id);
    }
  };

  if (isProfileLoading) {
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

  if (isError || !userProfile) {
    return (
      <div className="mx-auto max-w-xl text-center py-16 space-y-4">
        <p className="text-xl font-bold text-[var(--color-navy)]">Pengguna tidak ditemukan</p>
        <p className="text-sm text-gray-500">
          Akun dengan username "@{username}" mungkin telah dihapus atau belum pernah dibuat.
        </p>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Home
          </Link>
        </Button>
      </div>
    );
  }

  const profileData = userProfile.Profile || {};

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
        <div className="rounded-full p-1 bg-gradient-to-tr from-[var(--color-orange)] to-pink-400 shrink-0">
          <Avatar className="h-28 w-28 border-4 border-white">
            <AvatarImage src={profileData.avatarUrl || undefined} alt={userProfile.username} />
            <AvatarFallback className="text-3xl">
              {getInitials(userProfile.username)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <h1 className="text-xl font-bold text-[var(--color-navy)]">
              @{userProfile.username}
            </h1>

            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <EditProfileDialog profile={profileData} />
              ) : (
                <Button
                  onClick={handleToggleFollow}
                  disabled={toggleFollowMutation.isPending}
                  size="sm"
                  variant={isFollowing ? 'outline' : 'default'}
                  className="transition-colors"
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="h-4 w-4 mr-1.5" /> Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-1.5" /> Follow
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-center sm:justify-start gap-6 mt-4 text-sm">
            <span>
              <span className="font-bold text-[var(--color-navy)]">{userPosts.length}</span>{' '}
              <span className="text-gray-400">posts</span>
            </span>

            <button
              type="button"
              onClick={() => setModalType('followers')}
              className="cursor-pointer hover:underline text-left"
            >
              <span className="font-bold text-[var(--color-navy)]">
                {userProfile.followersCount || 0}
              </span>{' '}
              <span className="text-gray-400">followers</span>
            </button>

            <button
              type="button"
              onClick={() => setModalType('following')}
              className="cursor-pointer hover:underline text-left"
            >
              <span className="font-bold text-[var(--color-navy)]">
                {userProfile.followingCount || 0}
              </span>{' '}
              <span className="text-gray-400">following</span>
            </button>
          </div>

          <div className="mt-4 text-sm text-[var(--color-navy)] space-y-0.5">
            {profileData.fullName && (
              <p className="font-semibold">{profileData.fullName}</p>
            )}
            {profileData.bio && (
              <p className="text-gray-500 whitespace-pre-line">{profileData.bio}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">
          Posts
        </p>

        {isPostsLoading ? (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((itemNumber) => (
              <Skeleton key={itemNumber} className="aspect-square w-full" />
            ))}
          </div>
        ) : userPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-400">
            Pengguna ini belum membagikan postingan apa pun.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {userPosts.map((post) => (
              <PostGridItem key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      <FollowListModal
        open={Boolean(modalType)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setModalType(null);
          }
        }}
        userId={userProfile.id}
        type={modalType || 'followers'}
      />
    </div>
  );
}
