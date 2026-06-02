import { tokens } from "../tokens";
import { Btn } from "../components/ui";
import { useToast } from "../components/Toast";
import { Modal } from "../components/Modal";

export function AddCustomerModal({
  open, onClose,
}: {
  open: boolean; onClose: () => void;
}) {
  const toast = useToast();

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", background: tokens.surfaceAlt,
    border: `1px solid ${tokens.border}`, borderRadius: 6, color: tokens.text,
    fontFamily: "'Outfit', sans-serif", fontSize: 13, outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "'DM Mono', monospace", fontSize: 9,
    letterSpacing: "1.5px", color: tokens.text3, marginBottom: 5, textTransform: "uppercase",
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Customer" sub="MANUAL REGISTRATION">
      <div style={{ display: "grid", gap: 14 }}>
        {([
          ["Full Name",     "text",  "e.g. John Otieno"],
          ["Email Address", "email", "email@example.com"],
          ["Phone Number",  "text",  "+254 7XX XXX XXX"],
        ] as const).map(([lbl, type, ph]) => (
          <div key={lbl}>
            <label style={labelStyle}>{lbl}</label>
            <input type={type} placeholder={ph} style={inputStyle} />
          </div>
        ))}
        <div>
          <label style={labelStyle}>Region</label>
          <select style={{ ...inputStyle, cursor: "pointer" }}>
            {["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
        <Btn variant="primary" onClick={() => { toast("Customer added successfully", "success"); onClose(); }}>Save Customer</Btn>
        <Btn onClick={onClose}>Cancel</Btn>
      </div>
    </Modal>
  );
}
