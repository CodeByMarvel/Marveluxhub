import { useEffect, useState } from "react";
import { tokens } from "../tokens";
import { Badge, Btn, IconBtn, Card, PageHeader, ScrollArea, FilterBar, Avatar, Rating, AlertBanner, EyeIcon, BanIcon, CheckIcon, thStyle, tdStyle } from "../components/ui";
import { useToast } from "../components/Toast";
import { MechanicModal, type Mechanic } from "../modals/MechanicModal";
import { getMechanics, deactivateMechanic, type ApiMechanic } from "../services/api";

type UiMechanic = Mechanic & { id: string; spec: string; initials: string; color: string; bg: string };

function getInitials(name: string | null | undefined): string {
  if (!name) return "??";
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function mapMechanic(m: ApiMechanic): UiMechanic {
  const name = m.profiles?.name ?? "Unknown";
  const isActive = m.application_status === "approved" && m.is_active;
  const status = isActive ? "Active"
    : m.application_status === "pending" ? "Under Review" : "Suspended";
  const color = status === "Active" ? tokens.green : status === "Under Review" ? tokens.amber : tokens.error;
  const bg    = status === "Active" ? "rgba(46,204,113,0.1)"
    : status === "Under Review" ? "rgba(245,166,35,0.1)" : "rgba(231,76,60,0.1)";
  return {
    id:       m.id,
    name,
    email:    "",
    phone:    m.profiles?.phone ?? "—",
    location: "—",
    joined:   new Date(m.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
    rating:   m.rating != null ? m.rating.toFixed(1) : "—",
    jobs:     String(m.job_count ?? 0),
    status,
    spec:     m.mechanic_type === "mobile" ? "Mobile Technician" : m.mechanic_type === "garage" ? "Garage Partner" : "—",
    initials: getInitials(name),
    color,
    bg,
  };
}

export function MechanicsPanel() {
  const toast = useToast();
  const [mechanics, setMechanics] = useState<UiMechanic[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMech, setSelectedMech] = useState<UiMechanic | null>(null);

  function load() {
    setLoading(true);
    getMechanics({ limit: 100 })
      .then(({ data, total: t }) => {
        setMechanics(data.map(mapMechanic));
        setTotal(t ?? data.length);
      })
      .catch((e: Error) => toast(e.message, "danger"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const filtered = mechanics.filter(m =>
    `${m.name} ${m.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  const atRisk = mechanics.filter(m => m.status === "Under Review").length;
  const suspended = mechanics.filter(m => m.status === "Suspended").length;

  async function handleSuspend(m: UiMechanic) {
    try {
      await deactivateMechanic(m.id);
      toast(`Account suspended: ${m.name}`, "danger");
      setMechanics(prev => prev.map(x => x.id === m.id ? { ...x, status: "Suspended", color: tokens.error, bg: "rgba(231,76,60,0.1)" } : x));
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Failed to suspend", "danger");
    }
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", animation: "fadeUp .2s ease" }}>
      <PageHeader
        eyebrow="Users" title="MECHANICS"
        desc={loading ? "Loading…" : `${total} total · ${atRisk} at risk · ${suspended} suspended`}
        actions={<Btn variant="primary" onClick={() => toast("Mechanic invite link copied", "success")}>+ Invite Mechanic</Btn>}
      />
      <ScrollArea>
        {!loading && mechanics.some(m => m.status === "Under Review") && (
          <AlertBanner>
            <span><strong>Action required</strong> — {atRisk} mechanic{atRisk !== 1 ? "s" : ""} pending review.</span>
          </AlertBanner>
        )}
        <FilterBar
          placeholder="Search mechanics…" onSearch={setSearch}
          selects={[["All Status", "Active", "Suspended", "Under Review"], ["All Ratings", "5 stars", "4+ stars", "Below 3"]]}
        />
        <Card title="All Mechanics" actions={<span style={{ fontSize: 11, color: tokens.text3, fontFamily: "'DM Mono', monospace" }}>{loading ? "…" : `${total} total`}</span>}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Mechanic", "Speciality", "Rating", "Jobs", "Status", "Joined", "Actions"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={7} style={{ padding: "32px 16px", textAlign: "center", color: tokens.text3, fontSize: 13, fontFamily: "'DM Mono', monospace" }}>Loading…</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: "32px 16px", textAlign: "center", color: tokens.text3, fontSize: 13 }}>No mechanics found</td></tr>
                )}
                {filtered.map(m => {
                  const bv = m.status === "Active" ? "green" : m.status === "Suspended" ? "red" : "amber";
                  return (
                    <tr key={m.id}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar initials={m.initials} bg={m.bg} color={m.color} border={m.color} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text }}>{m.name}</div>
                            <div style={{ fontSize: 11, color: tokens.text3, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{m.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, fontSize: 12, color: tokens.text2 }}>{m.spec}</td>
                      <td style={tdStyle}><Rating value={parseFloat(m.rating) || 0} /></td>
                      <td style={{ ...tdStyle, fontFamily: "'DM Mono', monospace", fontSize: 12, color: tokens.text2 }}>{m.jobs}</td>
                      <td style={tdStyle}><Badge variant={bv as any}>{m.status}</Badge></td>
                      <td style={{ ...tdStyle, fontFamily: "'DM Mono', monospace", fontSize: 11, color: tokens.text3 }}>{m.joined}</td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <IconBtn title="View profile" onClick={() => setSelectedMech(m)}><EyeIcon /></IconBtn>
                          <IconBtn variant="red" title="Suspend" onClick={() => handleSuspend(m)}><BanIcon /></IconBtn>
                          <IconBtn variant="green" title="Reactivate" onClick={() => toast("Contact support to reactivate", "info")}><CheckIcon /></IconBtn>
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
