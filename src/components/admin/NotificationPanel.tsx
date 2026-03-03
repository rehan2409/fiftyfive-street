import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, CheckCheck, Trash2, ShoppingCart, AlertTriangle, Package } from 'lucide-react';
import { AdminNotification } from '@/hooks/useAdminNotifications';
import { formatDistanceToNow } from 'date-fns';

interface NotificationPanelProps {
  notifications: AdminNotification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

const getIcon = (type: AdminNotification['type']) => {
  switch (type) {
    case 'new_order': return <ShoppingCart className="h-4 w-4 text-green-600" />;
    case 'out_of_stock': return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case 'low_stock': return <Package className="h-4 w-4 text-amber-600" />;
  }
};

const getBg = (type: AdminNotification['type'], read: boolean) => {
  if (read) return 'bg-muted/30';
  switch (type) {
    case 'new_order': return 'bg-green-50 border-l-4 border-l-green-500';
    case 'out_of_stock': return 'bg-red-50 border-l-4 border-l-red-500';
    case 'low_stock': return 'bg-amber-50 border-l-4 border-l-amber-500';
  }
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="relative bg-white/50 border-blue-200 text-blue-700 hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-sm"
        >
          <Bell className="h-4 w-4 mr-2" />
          Notifications
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b bg-muted/50">
          <h3 className="font-semibold text-sm">
            Notifications {unreadCount > 0 && `(${unreadCount} new)`}
          </h3>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onMarkAllAsRead} className="text-xs h-7">
                <CheckCheck className="h-3 w-3 mr-1" />
                Read All
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearAll} className="text-xs h-7 text-red-600 hover:text-red-700">
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${getBg(notif.type, notif.read)}`}
                  onClick={() => !notif.read && onMarkAsRead(notif.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon(notif.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notif.read ? 'text-muted-foreground' : 'font-semibold text-foreground'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {notif.message}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPanel;
