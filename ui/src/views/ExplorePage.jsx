'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import { CategoryFilter } from '@/components/posts/CategoryFilter';
import { PostGridItem } from '@/components/posts/PostGridItem';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');

  // Filter berbasis query di backend (tidak lagi in-memory di client)
  const { data: posts, isLoading: postsLoading } = usePosts({
    categoryId: activeCategory === 'all' ? undefined : activeCategory,
    search: query.trim() || undefined,
  });
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-navy)] mb-4">Explore</h1>

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts by caption..."
          className="rounded-full bg-gray-100 border-transparent pl-11 focus-visible:bg-white"
        />
      </div>

      {categoriesLoading ? (
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      ) : (
        <div className="mb-6">
          <CategoryFilter categories={categories ?? []} activeId={activeCategory} onChange={setActiveCategory} />
        </div>
      )}

      {postsLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      ) : !posts || posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-400">
          {query.trim() ? `Tidak ada hasil untuk "${query.trim()}".` : 'Belum ada post di kategori ini.'}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {posts.map((post) => (
            <PostGridItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
