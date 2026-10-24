import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ImagePlus, Users, Compass, UserPlus } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { useSuggestions, useToggleFollow } from '@/hooks/useFollow';
import { PostCard } from '@/components/posts/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { getInitials, cn } from '@/lib/utils';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('for-you'); // 'for-you' | 'following'
  const user = useAuthStore((state) => state.user);

  const postsParams = activeTab === 'following' ? { feed: 'following' } : undefined;
  const { data: posts, isLoading } = usePosts(postsParams);

  const { data: suggestions = [] } = useSuggestions(5);
  const toggleFollowMutation = useToggleFollow();

  return (
    <div className="mx-auto max-w-xl">
      {/* Tab Switcher: For You vs Following */}
      <div className="mb-4 flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('for-you')}
          className={cn(
            'flex-1 py-3 text-center text-sm font-semibold transition-colors border-b-2 cursor-pointer',
            activeTab === 'for-you'
              ? 'border-[var(--color-orange)] text-[var(--color-navy)]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          )}
        >
          For You
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('following')}
          className={cn(
            'flex-1 py-3 text-center text-sm font-semibold transition-colors border-b-2 cursor-pointer',
            activeTab === 'following'
              ? 'border-[var(--color-orange)] text-[var(--color-navy)]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          )}
        >
          Following
        </button>
      </div>

      {/* Quick composer */}
      <Link
        to="/create"
        className="mb-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <Avatar className="h-9 w-9">
          <AvatarImage src={undefined} alt={user?.username} />
          <AvatarFallback>{user ? getInitials(user.username) : '?'}</AvatarFallback>
        </Avatar>
        <span className="flex-1 text-sm text-gray-400">What's on your mind?</span>
        <ImagePlus className="h-5 w-5 text-[var(--color-orange)]" />
      </Link>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-6">
          {[1, 2].map((itemNumber) => (
            <div key={itemNumber} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="aspect-square w-full rounded-none" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State: Tab For You */}
      {!isLoading && activeTab === 'for-you' && posts?.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-400">
          Belum ada post. Jadi yang pertama share momen kamu! 📸
        </div>
      )}

      {/* Empty State: Tab Following dengan Rekomendasi Developer */}
      {!isLoading && activeTab === 'following' && posts?.length === 0 && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-[var(--color-orange)] mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--color-navy)]">
              Feed Following Masih Kosong
            </h3>
            <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
              Ikuti developer lain untuk melihat postingan dan update terbaru mereka di sini!
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveTab('for-you')}
              >
                Lihat Feed For You
              </Button>
              <Button size="sm" asChild>
                <Link to="/explore">
                  <Compass className="h-4 w-4 mr-1.5" /> Jelajahi Explore
                </Link>
              </Button>
            </div>
          </div>

          {/* Saran Akun untuk Diikuti */}
          {suggestions.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h4 className="text-sm font-bold text-[var(--color-navy)] mb-3">
                Rekomendasi Developer untuk Diikuti
              </h4>
              <div className="divide-y divide-gray-100">
                {suggestions.map((suggestedUser) => {
                  const profile = suggestedUser.Profile || {};
                  return (
                    <div
                      key={suggestedUser.id}
                      className="flex items-center justify-between py-3"
                    >
                      <Link
                        to={`/users/${suggestedUser.username}`}
                        className="flex items-center gap-3 hover:opacity-85 transition-opacity min-w-0"
                      >
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={profile.avatarUrl || undefined} alt={suggestedUser.username} />
                          <AvatarFallback>{getInitials(suggestedUser.username)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 truncate">
                          <p className="text-sm font-semibold text-[var(--color-navy)] truncate">
                            {suggestedUser.username}
                          </p>
                          {profile.fullName && (
                            <p className="text-xs text-gray-400 truncate">{profile.fullName}</p>
                          )}
                        </div>
                      </Link>

                      <Button
                        size="sm"
                        onClick={() => toggleFollowMutation.mutate(suggestedUser.id)}
                        disabled={toggleFollowMutation.isPending}
                        className="ml-3 shrink-0 h-8 text-xs"
                      >
                        <UserPlus className="h-3.5 w-3.5 mr-1" /> Follow
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Render Posts */}
      {!isLoading && posts && posts.length > 0 && (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
