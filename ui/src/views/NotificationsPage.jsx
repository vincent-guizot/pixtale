'use client';

import { useMemo, useState } from 'react';
import { useNotifications, useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from '@/hooks/useNotifications';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const [tab, setTab] = useState('all');

  const filtered = useMemo(() => {
    if (!notifications) return [];
    if (tab === 'all') return notifications;
    return notifications.filter((n) => n.type === tab);
  }, [notifications, tab]);

  const hasUnread = (notifications?.filter((n) => !n.isRead).length ?? 0) > 0;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Notifications</h1>
        {hasUnread && (
          <Button variant="ghost" size="sm" onClick={() => markAllAsRead.mutate()} disabled={markAllAsRead.isPending}>
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="like">Likes</TabsTrigger>
          <TabsTrigger value="comment">Comments</TabsTrigger>
          <TabsTrigger value="follow">Follows</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          {isLoading ? (
            <div className="space-y-3 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-11 w-11 rounded-full" />
                  <Skeleton className="h-4 w-56" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-400">
              Belum ada notifikasi.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={(id) => markAsRead.mutate(id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
