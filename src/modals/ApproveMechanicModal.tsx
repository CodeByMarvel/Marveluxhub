import { useState } from "react";
import { tokens } from "../tokens";
import { Badge, Btn, SectionDivider, Avatar } from "../components/ui";
import { useToast } from "../components/Toast";
import { Modal, InfoGrid } from "../components/Modal";

export interface PendingMechanic {
  id: string;
  name: string; email: string; phone: string; location: string;
  applied: string; spec: string; experience: string;
  docs: { national_id: boolean; certificate: boolean; photo: boolean; police_clearance: boolean };
}

function DocRow({ label, verified, onToggle }: { label: string; verified: boolean; onToggle: () => void }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 0", borderBottom: `1px solid ${tokens.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 20, height: 20, borderRadius: 4, flexShrink: 0,
          border: `1px solid ${verified ? tokens.greenBorder : tokens.border}`,
          background: verified ? tokens.greenDim : tokens.surfaceAlt,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.2s",
        }} onClick={onToggle}>
          {verified && <span style={{ color: tokens.green, fontSize: 12, fontWeight: 700 }}>✓</span>}
        </div>
        <span style={{ fontSize: 13, color: verified ? tokens.text : tokens.text2 }}>{label}</span>
      </div>
      <Badge variant={verified ? "green" : "gray"} dot={false}>{verified ? "Verified" : "Pending"}</Badge>
    </div>
  );
}

export function ApproveMechanicModal({
  mechanic, open, onClose, onApprove, onReject,
}: {
  mechanic: PendingMechanic | null;
  open: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const toast = useToast();
  const [docs, setDocs] = useState<PendingMechanic["docs"] | null>(null);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const activeDocs = docs ?? mechanic?.docs;
  const allVerified = activeDocs
    ? Object.values(activeDocs).every(Boolean)
    : false;

  const toggle = (key: keyof PendingMechanic["docs"]) => {
    setDocs(prev => {
      const base = prev ?? mechanic!.docs;
      return { ...base, [key]: !base[key] };
    });
  };

  const handleClose = () => {
    setDocs(null);
    setRejectMode(false);
    setRejectReason("");
    onClose();
  };

  if (!mechanic) return null;
  const initials = mechanic.name.split(" ").map(w => w[0]).join("").slice(0, 2);

  return (
    <Modal open={open} onClose={handleClose} title={mechanic.name} sub="MECHANIC · VERIFICATION REVIEW">
      {/* Profile row */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 16, marginBottom: 16, borderBottom: `1px solid ${tokens.border}` }}>
        <Avatar initials={initials} bg="rgba(245,166,35,0.1)" color={tokens.amber} border={tokens.amberBorder} size={52} fontSize={16} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: tokens.text }}>{mechanic.name}</div>
          <div style={{ fontSize: 12, color: tokens.text3, fontFamily: "'DM Mono', monospace", marginTop: 3 }}>{mechanic.email}</div>
        </div>
        <Badge variant="amber">Pending Review</Badge>
      </div>

      <InfoGrid fields={[
        { label: "Phone",       value: mechanic.phone },
        { label: "Location",    value: mechanic.location },
        { label: "Speciality",  value: mechanic.spec },
        { label: "Experience",  value: mechanic.experience },
        { label: "Applied",     value: mechanic.applied },
        { label: "Application", value: mechanic.id, valueStyle: { fontFamily: "'DM Mono', monospace", fontSize: 11, color: tokens.text3 } },
      ]} />

      <SectionDivider>Document Verification</SectionDivider>
      <div style={{ marginBottom: 18 }}>
        <DocRow label="National ID / Passport"     verified={activeDocs!.national_id}       onToggle={() => toggle("national_id")} />
        <DocRow label="Mechanic Certificate"        verified={activeDocs!.certificate}       onToggle={() => toggle("certificate")} />
        <DocRow label="Profile Photo"              verified={activeDocs!.photo}             onToggle={() => toggle("photo")} />
        <DocRow label="Police Clearance Certificate" verified={activeDocs!.police_clearance} onToggle={() => toggle("police_clearance")} />
      </div>

      {!allVerified && (
        <div style={{ background: tokens.amberDim, border: `1px solid ${tokens.amberBorder}`, borderRadius: 6, padding: "9px 14px", fontSize: 12, color: tokens.amber, marginBottom: 16 }}>
          ⚠ Verify all documents before approving.
        </div>
      )}

      {rejectMode ? (
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "1.5px", textTransform: "uppercase", color: tokens.text3, marginBottom: 6 }}>
            Rejection Reason
          </label>
          <textarea
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder="Explain why this application is being rejected…"
            rows={3}
            style={{
              width: "100%", padding: "9px 12px", background: tokens.surfaceAlt,
              border: `1px solid ${tokens.errorBorder}`, borderRadius: 6,
              color: tokens.text, fontFamily: "'Outfit', sans-serif", fontSize: 13,
              resize: "vertical", outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <Btn variant="danger" onClick={() => {
              if (!rejectReason.trim()) { toast("Please provide a rejection reason", "warn"); return; }
              toast(`Application rejected: ${mechanic.name}`, "danger");
              onReject(mechanic.id);
              handleClose();
            }}>Confirm Rejection</Btn>
            <Btn onClick={() => setRejectMode(false)}>Cancel</Btn>
          </div>
        </div>
      ) : (
        <div style={{ paddingTop: 14, borderTop: `1px solid ${tokens.border}`, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn
            variant="primary"
            onClick={() => {
              if (!allVerified) { toast("Verify all documents first", "warn"); return; }
              toast(`${mechanic.name} approved and onboarded`, "success");
              onApprove(mechanic.id);
              handleClose();
            }}
          >
            ✓ Approve &amp; Onboard
          </Btn>
          <Btn variant="danger" onClick={() => setRejectMode(true)}>✕ Reject Application</Btn>
          <Btn onClick={() => { toast("Document request sent to applicant", "info"); handleClose(); }}>Request Docs</Btn>
        </div>
      )}
    </Modal>
  );
}
