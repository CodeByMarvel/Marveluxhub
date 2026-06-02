import { useState } from "react";
import { tokens } from "../tokens";
import { Badge, Btn, IconBtn, Card, PageHeader, ScrollArea, FilterBar, Avatar, Rating, AlertBanner, EyeIcon, BanIcon, CheckIcon, thStyle, tdStyle } from "../components/ui";
import { useToast } from "../components/Toast";
import { MechanicModal, type Mechanic } from "../modals/MechanicModal";

const MECHANICS: (Mechanic & { spec: string; initials: string; color: string; bg: string })[] = [
  { name: "Kiptoo Mwangi", email: "kiptoo.m@mechanic.ke", phone: "+254 701 338822", location: "Nairobi", joined: "Dec 2024", rating: "4.1", jobs: "142", status: "Under Review", spec: "General Repair",    initials: "KM", color: tokens.error,  bg: "rgba(231,76,60,0.1)"  },
  { name: "Amina Oduya",   email: "a.oduya@mechanic.ke",  phone: "+254 755 229900", location: "Nairobi", joined: "Feb 2026", rating: "4.9", jobs:  "57", status: "Active",       spec: "Electrical",        initials: "AO", color: tokens.green, bg: "rgba(46,204,113,0.1)" },
  { name: "David Otieno",  email: "d.otieno@mechanic.ke", phone: "+254 722 556677", location: "Mombasa", joined: "Aug 2024", rating: "3.2", jobs:  "89", status: "Suspended",    spec: "Tyres & Suspension", initials: "DO", color: tokens.error,  bg: "rgba(231,76,60,0.08)" },
  { name: "Grace Waweru",  email: "g.waweru@mechanic.ke", phone: "+254 718 443311", location: "Nakuru",  joined: "Oct 2025", rating: "4.7", jobs:  "34", status: "Active",       spec: "Diagnostics",        initials: "GW", color: tokens.green, bg: "rgba(46,204,113,0.1)" },
];

export function MechanicsPanel() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [selectedMech, setSelectedMech] = useState<typeof MECHANICS[0] | null>(null);

  const filtered = MECHANICS.filter(m =>
    `${m.name} ${m.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", animation: "fadeUp .2s ease" }}>
      <PageHeader
        eyebrow="Users" title="MECHANICS"
        desc="218 active · 7 at risk · 3 suspended"
        actions={<Btn variant="primary" onClick={() => toast("Mechanic invite link copied", "success")}>+ Invite Mechanic</Btn>}
      />
      <ScrollArea>
        <AlertBanner>
          <span><strong>Action required</strong> — Mechanic Kiptoo Mwangi received 3 complaints in 24 hrs.</span>
          <Btn variant="danger" style={{ marginLeft: "auto", fontSize: 11, padding: "5px 12px" }} onClick={() => setSelectedMech(MECHANICS[0])}>Review Now</Btn>
        </AlertBanner>
        <FilterBar
          placeholder="Search mechanics…" onSearch={setSearch}
          selects={[["All Status", "Active", "Suspended", "Under Review"], ["All Ratings", "5 stars", "4+ stars", "Below 3"]]}
        />
        <Card title="All Mechanics" actions={<span style={{ fontSize: 11, color: tokens.text3, fontFamily: "'DM Mono', monospace" }}>218 total</span>}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Mechanic","Speciality","Rating","Jobs","Status","Joined","Actions"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map(m => {
                  const bv = m.status === "Active" ? "green" : m.status === "Suspended" ? "red" : "amber";
                  return (
                    <tr key={m.name}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar initials={m.initials} bg={m.bg} color={m.color} border={m.color} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text }}>{m.name}</div>
                            <div style={{ fontSize: 11, color: tokens.text3, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, fontSize: 12, color: tokens.text2 }}>{m.spec}</td>
                      <td style={tdStyle}><Rating value={parseFloat(m.rating)} /></td>
                      <td style={{ ...tdStyle, fontFamily: "'DM Mono', monospace", fontSize: 12, color: tokens.text2 }}>{m.jobs}</td>
                      <td style={tdStyle}><Badge variant={bv as any}>{m.status}</Badge></td>
                      <td style={{ ...tdStyle, fontFamily: "'DM Mono', monospace", fontSize: 11, color: tokens.text3 }}>{m.joined}</td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <IconBtn title="View profile" onClick={() => setSelectedMech(m)}><EyeIcon /></IconBtn>
                          <IconBtn variant="red" title="Suspend" onClick={() => toast(`Account suspended: ${m.name}`, "danger")}><BanIcon /></IconBtn>
                          <IconBtn variant="green" title="Reactivate" onClick={() => toast(`Reactivated: ${m.name}`, "success")}><CheckIcon /></IconBtn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </ScrollArea>
      <MechanicModal mechanic={selectedMech} open={!!selectedMech} onClose={() => setSelectedMech(null)} />
    </div>
  );
}
