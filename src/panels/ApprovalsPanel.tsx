import { useState } from "react";
import { tokens } from "../tokens";
import { Badge, Btn, IconBtn, Card, PageHeader, ScrollArea, FilterBar, StatCard, Avatar, EyeIcon, CheckIcon, BanIcon, thStyle, tdStyle } from "../components/ui";
import { useToast } from "../components/Toast";
import { ApproveMechanicModal, type PendingMechanic } from "../modals/ApproveMechanicModal";

const INITIAL_APPLICANTS: PendingMechanic[] = [
  {
    id: "APP-001", name: "Moses Odhiambo", email: "m.odhiambo@gmail.com",  phone: "+254 712 334455",
    location: "Nairobi", applied: "Mar 18, 2026", spec: "General Repair",    experience: "6 years",
    docs: { national_id: true,  certificate: true,  photo: true,  police_clearance: false },
  },
  {
    id: "APP-002", name: "Faith Chebet",   email: "f.chebet@yahoo.com",     phone: "+254 733 667788",
    location: "Eldoret", applied: "Mar 17, 2026", spec: "Diagnostics",       experience: "3 years",
    docs: { national_id: true,  certificate: false, photo: true,  police_clearance: false },
  },
  {
    id: "APP-003", name: "Samuel Njoroge", email: "s.njoroge@hotmail.com",  phone: "+254 722 998877",
    location: "Nakuru",  applied: "Mar 16, 2026", spec: "Electrical",        experience: "9 years",
    docs: { national_id: true,  certificate: true,  photo: true,  police_clearance: true  },
  },
  {
    id: "APP-004", name: "Lydia Kamau",    email: "l.kamau@gmail.com",      phone: "+254 700 112233",
    location: "Mombasa", applied: "Mar 15, 2026", spec: "Tyres & Suspension", experience: "4 years",
    docs: { national_id: false, certificate: false, photo: false, police_clearance: false },
  },
  {
    id: "APP-005", name: "Peter Wekesa",   email: "p.wekesa@gmail.com",     phone: "+254 755 443322",
    location: "Kisumu",  applied: "Mar 14, 2026", spec: "Brakes & Clutch",   experience: "7 years",
    docs: { national_id: true,  certificate: true,  photo: true,  police_clearance: true  },
  },
];

function docsComplete(docs: PendingMechanic["docs"]) {
  return Object.values(docs).every(Boolean);
}

function docCount(docs: PendingMechanic["docs"]) {
  return Object.values(docs).filter(Boolean).length;
}

export function ApprovalsPanel() {
  const toast = useToast();
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PendingMechanic | null>(null);

  const filtered = applicants.filter(a =>
    `${a.name} ${a.email} ${a.spec} ${a.location}`.toLowerCase().includes(search.toLowerCase())
  );

  const approve = (id: string) =>
    setApplicants(prev => prev.filter(a => a.id !== id));

  const reject = (id: string) =>
    setApplicants(prev => prev.filter(a => a.id !== id));

  const readyCount = applicants.filter(a => docsComplete(a.docs)).length;
  const pendingDocs = applicants.filter(a => !docsComplete(a.docs)).length;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", animation: "fadeUp .2s ease" }}>
      <PageHeader
        eyebrow="Operations" title="APPROVALS"
        desc={`${applicants.length} pending · ${readyCount} ready to approve · ${pendingDocs} awaiting documents`}
        actions={<Btn onClick={() => toast("Approval queue exported", "success")}>Export Queue</Btn>}
      />
      <ScrollArea>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
          <StatCard label="Pending Applications" value={String(applicants.length)}  colorVariant="amber" />
          <StatCard label="Docs Complete"         value={String(readyCount)}         colorVariant="green" />
          <StatCard label="Awaiting Documents"    value={String(pendingDocs)}        colorVariant="red" />
        </div>

        <FilterBar
          placeholder="Search applicants…" onSearch={setSearch}
          selects={[["All Specialities", "General Repair", "Electrical", "Diagnostics", "Tyres & Suspension", "Brakes & Clutch"], ["All Locations", "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"]]}
        />

        <Card title="Pending Applications" subtitle="New mechanic applicants awaiting verification">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Applicant","Speciality","Location","Experience","Documents","Applied","Actions"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: "32px 16px", textAlign: "center", color: tokens.text3, fontSize: 13 }}>
                      No pending applications
                    </td>
                  </tr>
                )}
                {filtered.map(a => {
                  const verified = docsComplete(a.docs);
                  const count = docCount(a.docs);
                  const initials = a.name.split(" ").map(w => w[0]).join("").slice(0, 2);
                  return (
                    <tr key={a.id}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar
                            initials={initials}
                            bg="rgba(245,166,35,0.1)" color={tokens.amber} border={tokens.amberBorder}
                          />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text }}>{a.name}</div>
                            <div style={{ fontSize: 11, color: tokens.text3, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{a.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, fontSize: 12, color: tokens.text2 }}>{a.spec}</td>
                      <td style={{ ...tdStyle, fontSize: 12, color: tokens.text2 }}>{a.location}</td>
                      <td style={{ ...tdStyle, fontFamily: "'DM Mono', monospace", fontSize: 12, color: tokens.text2 }}>{a.experience}</td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {/* mini doc bar */}
                          <div style={{ display: "flex", gap: 3 }}>
                            {Object.values(a.docs).map((v, i) => (
                              <div key={i} style={{
                                width: 8, height: 8, borderRadius: 2,
                                background: v ? tokens.green : tokens.border,
                              }} />
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
                              toast(`${a.name} approved and onboarded`, "success");
                              approve(a.id);
                            }}
                          ><CheckIcon /></IconBtn>
                          <IconBtn variant="red" title="Reject" onClick={() => { toast(`Application rejected: ${a.name}`, "danger"); reject(a.id); }}><BanIcon /></IconBtn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Doc legend */}
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
        onApprove={id => { approve(id); setSelected(null); }}
        onReject={id => { reject(id); setSelected(null); }}
      />
    </div>
  );
}
