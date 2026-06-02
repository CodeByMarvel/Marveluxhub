import { useEffect, useState } from "react";
import { tokens } from "../tokens";
import { Badge, Btn, IconBtn, Card, PageHeader, ScrollArea, FilterBar, StatCard, Avatar, EyeIcon, CheckIcon, BanIcon, thStyle, tdStyle } from "../components/ui";
import { useToast } from "../components/Toast";
import { ApproveMechanicModal, type PendingMechanic } from "../modals/ApproveMechanicModal";
import { getPendingMechanics, approveMechanic, rejectMechanic, type ApiMechanic } from "../services/api";

function mapToPending(m: ApiMechanic): PendingMechanic {
  return {
    id:         m.id,
    name:       m.profiles?.name ?? "Unknown",
    email:      "",
    phone:      m.profiles?.phone ?? "—",
    location:   "—",
    applied:    new Date(m.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    spec:       m.mechanic_type === "mobile" ? "Mobile Technician" : m.mechanic_type === "garage" ? "Garage Partner" : "—",
    experience: "—",
    docs: {
      national_id:       !!m.national_id_url,
      certificate:       !!m.certificate_url,
      photo:             !!m.photo_url,
      police_clearance:  !!m.police_clearance_url,
    },
  };
}

function docsComplete(docs: PendingMechanic["docs"]) {
  return Object.values(docs).every(Boolean);
}
function docCount(docs: PendingMechanic["docs"]) {
  return Object.values(docs).filter(Boolean).length;
}

export function ApprovalsPanel() {
  const toast = useToast();
  const [applicants, setApplicants] = useState<PendingMechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PendingMechanic | null>(null);

  function load() {
    setLoading(true);
    getPendingMechanics()
      .then(data => setApplicants(data.map(mapToPending)))
      .catch((e: Error) => toast(e.message, "danger"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const filtered = applicants.filter(a =>
    `${a.name} ${a.email} ${a.spec} ${a.location}`.toLowerCase().includes(search.toLowerCase())
  );

  async function handleApprove(id: string) {
    try {
      await approveMechanic(id, 1);
      setApplicants(prev => prev.filter(a => a.id !== id));
      toast("Mechanic approved and onboarded", "success");
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Failed to approve", "danger");
    }
  }

  async function handleReject(id: string) {
    try {
      await rejectMechanic(id);
      setApplicants(prev => prev.filter(a => a.id !== id));
      toast("Application rejected", "danger");
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Failed to reject", "danger");
    }
  }

  const readyCount   = applicants.filter(a => docsComplete(a.docs)).length;
  const pendingDocs  = applicants.filter(a => !docsComplete(a.docs)).length;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", animation: "fadeUp .2s ease" }}>
      <PageHeader
        eyebrow="Operations" title="APPROVALS"
        desc={loading ? "Loading…" : `${applicants.length} pending · ${readyCount} ready to approve · ${pendingDocs} awaiting documents`}
        actions={<Btn onClick={() => toast("Approval queue exported", "success")}>Export Queue</Btn>}
      />
      <ScrollArea>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
          <StatCard label="Pending Applications" value={loading ? "…" : String(applicants.length)} colorVariant="amber" />
          <StatCard label="Docs Complete"        value={loading ? "…" : String(readyCount)}         colorVariant="green" />
          <StatCard label="Awaiting Documents"   value={loading ? "…" : String(pendingDocs)}        colorVariant="red" />
        </div>

        <FilterBar
          placeholder="Search applicants…" onSearch={setSearch}
          selects={[["All Specialities", "Mobile Technician", "Garage Partner"], ["All Locations", "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"]]}
        />

        <Card title="Pending Applications" subtitle="New mechanic applicants awaiting verification">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Applicant", "Speciality", "Location", "Experience", "Documents", "Applied", "Actions"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={7} style={{ padding: "32px 16px", textAlign: "center", color: tokens.text3, fontSize: 13, fontFamily: "'DM Mono', monospace" }}>Loading…</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: "32px 16px", textAlign: "center", color: tokens.text3, fontSize: 13 }}>
                      No pending applications
                    </td>
                  </tr>
                )}
                {filtered.map(a => {
                  const verified  = docsComplete(a.docs);
                  const count     = docCount(a.docs);
                  const initials  = a.name.split(" ").map(w => w[0]).join("").slice(0, 2);
                  return (
                    <tr key={a.id}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar initials={initials} bg="rgba(245,166,35,0.1)" color={tokens.amber} border={tokens.amberBorder} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text }}>{a.name}</div>
                            <div style={{ fontSize: 11, color: tokens.text3, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{a.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, fontSize: 12, color: tokens.text2 }}>{a.spec}</td>
                      <td style={{ ...tdStyle, fontSize: 12, color: tokens.text2 }}>{a.location}</td>
                      <td style={{ ...tdStyle, fontFamily: "'DM Mono', monospace", fontSize: 12, color: tokens.text2 }}>{a.experience}</td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ display: "flex", gap: 3 }}>
                            {Object.values(a.docs).map((v, i) => (
                              <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: v ? tokens.green : tokens.border }} />
                            ))}
                          </div>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: verified ? tokens.green : tokens.amber }}>
                            {count}/4
                          </span>
                          <Badge variant={verified ? "green" : "amber"} dot={false}>{verified ? "Complete" : "Incomplete"}</Badge>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, fontFamily: "'DM Mono', monospace", fontSize: 11, color: tokens.text3, whiteSpace: "nowrap" }}>{a.applied}</td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <IconBtn title="Review application" onClick={() => setSelected(a)}><EyeIcon /></IconBtn>
                          <IconBtn
                            variant="green" title={verified ? "Approve" : "Docs incomplete"}
                            onClick={() => {
                              if (!verified) { toast("Complete document verification first", "warn"); return; }
                              handleApprove(a.id);
                            }}
                          ><CheckIcon /></IconBtn>
                          <IconBtn variant="red" title="Reject" onClick={() => handleReject(a.id)}><BanIcon /></IconBtn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 11, color: tokens.text3, fontFamily: "'DM Mono', monospace", marginTop: -8 }}>
          <span style={{ letterSpacing: 1 }}>DOCUMENT KEY:</span>
          {["National ID", "Certificate", "Photo", "Police Clearance"].map((label, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: tokens.green }} />
              {label}
            </span>
          ))}
        </div>
      </ScrollArea>

      <ApproveMechanicModal
        mechanic={selected} open={!!selected} onClose={() => setSelected(null)}
        onApprove={id => { handleApprove(id); setSelected(null); }}
        onReject={id => { handleReject(id); setSelected(null); }}
      />
    </div>
  );
}
