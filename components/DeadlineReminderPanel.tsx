"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bell, BellRing, CalendarClock, ExternalLink } from "lucide-react";
import { Opportunity, SavedOpportunity } from "@/types";

type Props = {
  opportunities: Opportunity[];
  saved: SavedOpportunity[];
};

function getDeadlineTime(deadline: string) {
  // Legacy date-only values are interpreted as the end of that local day.
  if (/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    const [year, month, day] = deadline.split("-").map(Number);
    return new Date(year, month - 1, day, 23, 59, 59).getTime();
  }
  return new Date(deadline).getTime();
}

export default function DeadlineReminderPanel({ opportunities, saved }: Props) {
  const [now, setNow] = useState(0);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 60_000);
    if ("Notification" in window) setPermission(Notification.permission);
    else setPermission("unsupported");
    return () => window.clearInterval(id);
  }, []);

  const tracked = useMemo(() => {
    if (!now) return [];
    const byId = new Map(opportunities.map((item) => [item.id, item]));
    return saved
      .filter((item) => item.application_status !== "Completed")
      .map((item) => byId.get(item.opportunity_id))
      .filter((item): item is Opportunity => Boolean(item))
      .map((item) => ({ ...item, remaining: getDeadlineTime(item.deadline) - now }))
      .filter((item) => item.remaining > 0)
      .sort((a, b) => a.remaining - b.remaining)
      .slice(0, 4);
  }, [now, opportunities, saved]);

  const requestNotifications = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  useEffect(() => {
    if (!now || permission !== "granted" || document.visibilityState !== "visible") return;
    const trackedIds = new Set(saved.filter((item) => item.application_status !== "Completed").map((item) => item.opportunity_id));
    const due = opportunities.filter((item) => {
      if (!trackedIds.has(item.id)) return false;
      const remaining = getDeadlineTime(item.deadline) - now;
      return remaining > 0 && remaining <= 48 * 60 * 60 * 1000;
    });

    for (const item of due) {
      const remaining = getDeadlineTime(item.deadline) - now;
      const reminderWindow = remaining <= 24 * 60 * 60 * 1000 ? "1-day" : "2-day";
      const key = `campussignal-reminder:${item.id}:${item.deadline}:${reminderWindow}`;
      if (window.localStorage.getItem(key)) continue;
      new Notification(`${reminderWindow === "1-day" ? "Deadline tomorrow" : "Deadline in 2 days"}: ${item.title}`, {
        body: `${item.organization} · ${new Date(item.deadline).toLocaleDateString("en-IN")}`,
        tag: key,
      });
      window.localStorage.setItem(key, "sent");
    }
  }, [now, opportunities, permission, saved]);

  return (
    <section className="mb-8 rounded-2xl border border-cyan-500/25 bg-gradient-to-r from-cyan-950/35 via-slate-900/70 to-blue-950/30 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-300"><CalendarClock className="h-5 w-5" /></div>
          <div>
            <h2 className="font-semibold text-white">Deadline reminders</h2>
            <p className="mt-1 text-xs text-slate-400">Saved opportunities are tracked automatically. Alerts appear 2 days and again 1 day before the deadline.</p>
          </div>
        </div>
        {permission === "default" && (
          <button onClick={requestNotifications} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/20">
            <BellRing className="h-4 w-4" /> Enable browser alerts
          </button>
        )}
        {permission === "granted" && <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300"><Bell className="h-4 w-4" /> Browser alerts enabled</span>}
        {permission === "denied" && <span className="text-xs text-slate-400">Browser alerts are blocked in browser settings.</span>}
      </div>

      {tracked.length > 0 ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {tracked.map((item) => {
            const hours = Math.ceil(item.remaining / (60 * 60 * 1000));
            const label = hours < 24 ? `${hours} hours left` : `${Math.ceil(hours / 24)} days left`;
            return (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/70 bg-slate-950/50 p-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-100">{item.title}</p>
                  <p className="mt-1 text-[11px] text-amber-300">{label} · {new Date(item.deadline).toLocaleDateString("en-IN")}</p>
                </div>
                <Link href="/radar" aria-label={`Open ${item.title} in opportunity radar`} className="shrink-0 text-cyan-300 hover:text-cyan-200"><ExternalLink className="h-4 w-4" /></Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-400">Mark an opportunity as Interested in the Radar and it will be added to your reminder list automatically.</p>
      )}
      <p className="mt-3 text-[10px] text-slate-500">In-app reminders stay on your dashboard. Browser alerts require permission and work while CampusSignal is open.</p>
    </section>
  );
}
