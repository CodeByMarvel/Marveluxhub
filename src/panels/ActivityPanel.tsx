import { useState } from "react";
import { tokens } from "../tokens";
import { Card, PageHeader, ScrollArea, FilterBar, StatCard, LogItem } from "../components/ui";

const LOGS = [
  { dotColor: tokens.error,  tag: "FLAG",    tagColor: tokens.error,  text: "Mechanic <strong>Kiptoo Mwangi</strong> auto-flagged — 3 complaints in 24hrs",    time: "12 min ago" },
  { dotColor: tokens.green,  tag: "APPROVE", tagColor: tokens.green,  text: "Mechanic <strong>Amina Oduya</strong> approved and onboarded by Admin Ops",       time: "1 hr ago" },
  { dotColor: tokens.amber,  tag: "FLAG",    tagColor: tokens.amber,  text: "Customer <strong>James Kariuki</strong> flagged — suspected fraudulent activity",  time: "3 hrs ago" },
  { dotColor: tokens.green,  tag: "RESOLVE", tagColor: tokens.green,  text: "Profile edit for <strong>Wanjiku Njoroge</strong> approved and applied",           time: "5 hrs ago" },
  { dotColor: tokens.error,  tag: "SUSPEND", tagColor: tokens.error,  text: "Account for <strong>Brian Mutua</strong> suspended following review",              time: "8 hrs ago" },
  { dotColor: tokens.text3,  tag: "LOGIN",   tagColor: tokens.text3,  text: "Admin <strong>Admin Ops</strong> logged in from 41.212.45.12 (Nairobi)",           time: "9 hrs ago" },
  { dotColor: tokens.green,  tag: "EXPORT",  tagColor: tokens.green,  text: "Weekly report exported by <strong>Admin Ops</strong>",                            time: "10 hrs ago" },
  { dotColor: tokens.amber,  tag: "WARN",    tagColor: tokens.amber,  text: "Formal warning issued to mechanic <strong>David Otieno</strong>",                  time: "Yesterday" },
  { dotColor: tokens.green,  tag: "ONBOARD", tagColor: tokens.green,  text: "New mechanic <strong>Grace Waweru</strong> completed onboarding",                  time: "Yesterday" },
  { dotColor: tokens.text3,  tag: "SYSTEM",  tagColor: tokens.text3,  text: "Scheduled backup completed — 3.2 GB archived",                                   time: "2 days ago" },
  { dotColor: tokens.error,  tag: "ALERT",   tagColor: tokens.error,  text: "Payment gateway timeout detected — 4 transactions delayed",                      time: "2 days ago" },
  { dotColor: tokens.green,  tag: "RESOLVE", tagColor: tokens.green,  text: "Complaint <strong>CMP-005</strong> resolved and closed",                          time: "3 days ago" },
];

export function ActivityPanel() {
  const [search, setSearch] = useState("");

  const filtered = LOGS.filter(l =>
    l.text.toLowerCase().includes(search.toLowerCase()) || l.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", animation: "fadeUp .2s ease" }}>
      <PageHeader
        eyebrow="Operations" title="ACTIVITY LOG"
        desc="Full audit trail of admin actions and system events"
      />
      <ScrollArea>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
          <StatCard label="Events Today"  value="12" colorVariant="neutral" />
          <StatCard label="Flags Raised"  value="2"  colorVariant="red" />
          <StatCard label="Actions Taken" value="7"  colorVariant="green" />
          <StatCard label="System Alerts" value="1"  colorVariant="amber" />
        </div>
        <FilterBar
          placeholder="Search activity…" onSearch={setSearch}
          selects={[["All Types", "FLAG", "APPROVE", "SUSPEND", "RESOLVE", "SYSTEM"], ["All Time", "Today", "This Week", "This Month"]]}
        />
        <Card title="Event Timeline" subtitle="Most recent first">
          <div style={{ padding: "8px 20px 16px" }}>
            {filtered.map((l, i) => (
              <LogItem
                key={i}
                dotColor={l.dotColor} tag={l.tag} tagColor={l.tagColor}
                text={l.text} time={l.time}
                isLast={i === filtered.length - 1}
              />
            ))}
          </div>
        </Card>
      </ScrollArea>
    </div>
  );
}
