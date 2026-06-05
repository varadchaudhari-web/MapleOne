import { useState } from "react";
import { Bell, Search, X, CheckCheck } from "lucide-react";
import { useAppStore } from "@/stores/appStore";

interface DashboardHeaderProps {
  title?: string;
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useAppStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const unread = notifications.filter((n) => !n.isRead);

  const typeColors: Record<string, string> = {
    info: "bg-blue-100 text-blue-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    error: "bg-red-100 text-red-700",
  };

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-30">
      {/* Title */}
      <div>
        {title && (
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h1>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          {searchOpen ? (
            <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2 w-64 animate-fade-in">
              <Search size={16} className="text-muted-foreground" />
              <input
                autoFocus
                placeholder="Search..."
                className="bg-transparent text-sm outline-none flex-1"
              />
              <button onClick={() => setSearchOpen(false)}>
                <X size={14} className="text-muted-foreground" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <Search size={18} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <Bell size={18} className="text-muted-foreground" />
            {unread.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unread.length > 9 ? "9+" : unread.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl border border-border shadow-2xl z-50 animate-fade-in overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-bold text-base">Notifications</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllNotificationsRead}
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <CheckCheck size={12} />
                    Mark all read
                  </button>
                  <button
                    onClick={clearNotifications}
                    className="text-xs text-muted-foreground hover:text-red-500"
                  >
                    Clear all
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors ${
                        !n.isRead ? "bg-primary/5" : ""
                      }`}
                      onClick={() => markNotificationRead(n.id)}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 mt-0.5 ${typeColors[n.type]}`}>
                          {n.category}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${!n.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!n.isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        {currentUser && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-maple rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-none">{currentUser.name.split(" ")[0]}</p>
              <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
