import { tokens } from "../tokens";
import { Badge, Btn } from "../components/ui";
import { useToast } from "../components/Toast";
import { Modal, ProfileHero, InfoGrid } from "../components/Modal";

export interface Customer {
  name: string; email: string; phone: string; region: string;
  joined: string; bookings: number; status: string;
  initials: string; bg: string; color: string;
}

export function CustomerModal({
  customer, open, onClose,
}: {
  customer: Customer | null; open: boolean; onClose: () => void;
}) {
  const toast = useToast();
  if (!customer) return null;
  const { name, email, phone, region, joined, bookings, status, initials, bg, color } = customer;
  const badgeVariant = status === "Active" ? "green" : status === "Suspended" ? "red" : "amber";

  return (
    <Modal open={open} onClose={onClose} title={name} sub="CUSTOMER · PROFILE VIEW">
      <ProfileHero
        initials={initials} bg={bg} color={color} name={name} email={email}
        badge={<Badge variant={badgeVariant as any}>{status}</Badge>}
      />
      <InfoGrid fields={[
        { label: "Phone",          value: phone },
        { label: "Region",         value: region },
        { label: "Member Since",   value: joined },
        { label: "Total Bookings", value: `${bookings} bookings` },
      ]} />
      <div style={{ paddingTop: 14, borderTop: `1px solid ${tokens.border}`, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Btn onClick={() => { toast("Password reset sent", "success"); onClose(); }}>Reset Password</Btn>
        <Btn onClick={() => toast("Profile edit enabled", "info")}>Edit Profile</Btn>
        <Btn variant="danger" onClick={() => { toast("Account suspended", "danger"); onClose(); }}>Suspend Account</Btn>
        <Btn onClick={() => toast("History exported", "success")}>Export History</Btn>
      </div>
    </Modal>
  );
}
