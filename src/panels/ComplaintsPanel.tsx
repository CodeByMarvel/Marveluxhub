import { useState } from "react";
import { tokens } from "../tokens";
import { Badge, Btn, IconBtn, Card, PageHeader, ScrollArea, FilterBar, StatCard, AlertBanner, EyeIcon, CheckIcon, TriangleAlertIcon, thStyle, tdStyle } from "../components/ui";
import { useToast } from "../components/Toast";

interface Complaint {
  id: string; customer: string; mechanic: string; issue: string;
  status: string; priority: string; date: string;
}

const COMPLAINTS: Complaint[] = [
  { id: "CMP-001", customer: "James Kariuki",  mechanic: "Kiptoo Mwangi", issue: "Missing items from vehicle after service", status: "Open",      priority: "High",   date: "Mar 19, 2026" },
  { id: "CMP-002", customer: "Aisha Omondi",   mechanic: "Kiptoo Mwangi", issue: "Job left incomplete, area not cleaned",    status: "Escalated",  priority: "High",   date: "Mar 17, 2026" },
  { id: "CMP-003", customer: "Brian Mutua",     mechanic: "David Otieno",  issue: "Mechanic arrived 3 hours late",           status: "Open",       priority: "Medium", date: "Mar 15, 2026" },
  { id: "CMP-004", customer: "Wanjiku Njoroge", mechanic: "Kiptoo Mwangi", issue: "Charged for parts not replaced",          status: "Open",       priority: "High",   date: "Mar 14, 2026" },
  { id: "CMP-005", customer: "Samuel Kimani",   mechanic: "Grace Waweru",  issue: "Communication was poor throughout job",   status: "Resolved",   priority: "Low",    date: "Mar 10, 2026" },
];

const statusVariant = (s: string) => s === "Resolved" ? "green" : s === "Escalated" ? "red" : "amber";
const priorityVariant = (p: string) => p === "High" ? "red" : p === "Medium" ? "amber" : "gray";

export function ComplaintsPanel() {
  const toast = useToast();
  const [search, setSearch] = useState("");

  const filtered = COMPLAINTS.filter(c =>
    `${c.customer} ${c.mechanic} ${c.issue} ${c.id}`.toLowerCase().includes(search.toLowerCase())
  );

  const open = COMPLAINTS.filter(c => c.status === "Open").length;
  const escalated = COMPLAINTS.filter(c => c.status === "Escalated").length;
  const resolved = COMPLAINTS.filter(c => c.status === "Resolved").length;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", animation: "fadeUp .2s ease" }}>
      <PageHeader
        eyebrow="Operations" title="COMPLAINTS"
        desc={`${open} open · ${escalated} escalated · ${resolved} resolved`}
        actions={<Btn onClick={() => toast("Complaints report exported", "success")}>Export Report</Btn>}
      />
      <ScrollArea>
        {escalated > 0 && (
          <AlertBanner>
            <span><strong>{escalated} complaint{escalated > 1 ? "s" : ""} escalated</strong> — immediate review required.</span>
          </AlertBanner>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
          <StatCard label="Open"      value={String(open)}      colorVariant="amber" />
          <StatCard label="Escalated" value={String(escalated)} colorVariant="red" />
          <StatCard label="Resolved"  value={String(resolved)}  colorVariant="green" />
        </div>
        <FilterBar
          placeholder="Search complaints…" onSearch={setSearch}
          selects={[["All Status", "Open", "Escalated", "Resolved"], ["All Priority", "High", "Medium", "Low"]]}
        />
        <Card title="All Complaints">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["ID","Customer","Mechanic","Issue","Priority","Status","Date","Actions"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ ...tdStyle, fontFamily: "'DM Mono', monospace", fontSize: 11, color: tokens.text3 }}>{c.id}</td>
                    <td style={{ ...tdStyle, fontSize: 13, fontWeight: 600, color: tokens.text }}>{c.customer}</td>
                    <td style={{ ...tdStyle, fontSize: 12, color: tokens.text2 }}>{c.mechanic}</td>
                    <td style={{ ...tdStyle, fontSize: 12, color: tokens.text2, maxWidth: 220 }}>{c.issue}</td>
                    <td style={tdStyle}><Badge variant={priorityVariant(c.priority) as any}>{c.priority}</Badge></td>
                    <td style={tdStyle}><Badge variant={statusVariant(c.status) as any}>{c.status}</Badge></td>
                    <td style={{ ...tdStyle, fontFamily: "'DM Mono', monospace", fontSize: 11, color: tokens.text3, whiteSpace: "nowrap" }}>{c.date}</td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <IconBtn title="View" onClick={() => toast(`Viewing ${c.id}`, "info")}><EyeIcon /></IconBtn>
                        <IconBtn variant="green" title="Resolve" onClick={() => toast(`${c.id} resolved`, "success")}><CheckIcon /></IconBtn>
                        <IconBtn variant="red" title="Escalate" onClick={() => toast(`${c.id} escalated`, "danger")}><TriangleAlertIcon /></IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </ScrollArea>
    </div>
  );
}
