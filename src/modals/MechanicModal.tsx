import { tokens } from "../tokens";
import { Badge, Btn, SectionDivider } from "../components/ui";
import { useToast } from "../components/Toast";
import { Modal, ProfileHero, InfoGrid } from "../components/Modal";

export interface Mechanic {
  name: string; email: string; phone: string; location: string;
  joined: string; rating: string; jobs: string; status: string;
  spec?: string; initials?: string; color?: string; bg?: string;
}

export function MechanicModal({
  mechanic, open, onClose,
}: {
  mechanic: Mechanic | null; open: boolean; onClose: () => void;
}) {
  const toast = useToast();
  if (!mechanic) return null;
  const { name, email, phone, location, joined, rating, jobs, status } = mechanic;
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2);
  const badgeVariant = status === "Active" ? "green" : status === "Suspended" ? "red" : "amber";

  return (
    <Modal open={open} onClose={onClose} title={name} sub="MECHANIC · REVIEW MODE">
      <ProfileHero
        initials={initials} bg="rgba(245,166,35,0.1)" color={tokens.amber}
        name={name} email={email}
        badge={<Badge variant={badgeVariant as any}>{status}</Badge>}
      />
      <InfoGrid fields={[
        { label: "Phone",           value: phone },
        { label: "Location",        value: location },
        { label: "Member Since",    value: joined },
        { label: "Jobs Completed",  value: `${jobs} completed` },
        { label: "Rating",          value: `★ ${rating} / 5.0` },
        { label: "Open Complaints", value: "3", valueStyle: { color: tokens.error, fontWeight: 700 } },
      ]} />

      <SectionDivider>Recent Reviews</SectionDivider>
      {[
        { author: "James Kariuki", date: "Mar 19 2026", stars: 2, text: "Late by 2 hours, no communication. Items appeared missing from car after the job." },
        { author: "Aisha Omondi",  date: "Mar 17 2026", stars: 3, text: "Job done but area left messy, car not tested properly before mechanic left." },
      ].map(r => (
        <div key={r.author} style={{ background: tokens.surfaceAlt, border: `1px solid ${tokens.border}`, borderRadius: 6, padding: "11px 13px", marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text }}>{r.author}</span>
            <span style={{ fontSize: 10, color: tokens.text3, fontFamily: "'DM Mono', monospace" }}>{r.date}</span>
          </div>
          <div style={{ color: tokens.amber, fontSize: 12 }}>{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</div>
          <div style={{ fontSize: 12, color: tokens.text2, lineHeight: 1.55, marginTop: 5 }}>{r.text}</div>
        </div>
      ))}

      <div style={{ paddingTop: 14, borderTop: `1px solid ${tokens.border}`, display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
        <Btn variant="danger" onClick={() => { toast(`Account closed: ${name}`, "danger"); onClose(); }}>Close Account</Btn>
        <Btn variant="amber" onClick={() => { toast("Formal warning issued", "warn"); onClose(); }}>Issue Warning</Btn>
        <Btn variant="green" onClick={() => { toast("Mechanic cleared and reactivated", "success"); onClose(); }}>Clear & Reactivate</Btn>
        <Btn onClick={() => toast("Complaint history exported", "success")}>Export Complaints</Btn>
      </div>
    </Modal>
  );
}
