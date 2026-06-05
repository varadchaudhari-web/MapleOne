import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAppStore } from "@/stores/appStore";
import { MessageSquare, Bell, BarChart2, Calendar, Heart, Share2, Plus, X, ChevronRight } from "lucide-react";

export default function ResidentCommunity() {
  const { announcements, polls, events, voteOnPoll, registerForEvent, addAnnouncement, currentUser } = useAppStore();
  const [tab, setTab] = useState<"feed" | "polls" | "events">("feed");

  return (
    <DashboardLayout title="Community Feed">
      <div className="space-y-6">
        <div className="flex gap-2 flex-wrap">
          {(["feed", "polls", "events"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? "bg-primary text-white" : "bg-white border border-border hover:border-primary"}`}>
              {t === "feed" ? "Announcements" : t}
            </button>
          ))}
        </div>

        {tab === "feed" && (
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div key={ann.id} className={`dashboard-card p-5 border-l-4 ${ann.priority === "urgent" ? "border-l-red-500" : ann.priority === "important" ? "border-l-amber-500" : "border-l-blue-400"}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold mr-2 ${ann.priority === "urgent" ? "bg-red-100 text-red-700" : ann.priority === "important" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{ann.priority}</span>
                    <span className="px-2.5 py-0.5 bg-muted rounded-full text-xs">{ann.category}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(ann.postedAt).toLocaleDateString()}</p>
                </div>
                <h3 className="font-bold text-lg mb-2">{ann.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{ann.content}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">By {ann.postedBy} · {ann.views} views</p>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><Heart size={14} /> Like</button>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><Share2 size={14} /> Share</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "polls" && (
          <div className="space-y-4">
            {polls.map((poll) => {
              const maxVotes = Math.max(...poll.options.map(o => o.votes));
              return (
                <div key={poll.id} className="dashboard-card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${poll.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{poll.status}</span>
                    <p className="text-xs text-muted-foreground">Expires: {new Date(poll.expiresAt).toLocaleDateString()}</p>
                  </div>
                  <h3 className="font-bold text-lg mb-4">{poll.question}</h3>
                  <div className="space-y-3">
                    {poll.options.map((opt) => {
                      const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                      const isVoted = poll.userVoted === opt.id;
                      return (
                        <div key={opt.id} onClick={() => !poll.userVoted && poll.status === "active" && voteOnPoll(poll.id, opt.id)}
                          className={`relative rounded-xl border-2 p-3 cursor-pointer transition-all overflow-hidden ${isVoted ? "border-primary" : "border-border hover:border-primary/50"}`}>
                          <div className="absolute inset-0 bg-primary/8 transition-all" style={{ width: `${pct}%` }} />
                          <div className="relative flex justify-between items-center">
                            <span className="font-medium text-sm">{opt.text}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{opt.votes} votes</span>
                              <span className="font-bold text-sm text-primary">{pct}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">{poll.totalVotes} total votes · By {poll.createdBy}</p>
                </div>
              );
            })}
          </div>
        )}

        {tab === "events" && (
          <div className="grid sm:grid-cols-2 gap-4">
            {events.map((event) => (
              <div key={event.id} className="dashboard-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 bg-accent/10 text-accent text-xs rounded-full font-medium">{event.category}</span>
                  <span className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">{event.description}</p>
                <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                  <p>📍 {event.venue} · ⏰ {event.time}</p>
                  <p>👤 Organizer: {event.organizer}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(event.registeredCount / event.maxAttendees) * 100}%` }} />
                    </div>
                    <span>{event.registeredCount}/{event.maxAttendees} registered</span>
                  </div>
                </div>
                <button
                  onClick={() => registerForEvent(event.id)}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${event.isUserRegistered ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600" : "btn-primary"}`}>
                  {event.isUserRegistered ? "✓ Registered (Click to Cancel)" : "Register Now →"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
