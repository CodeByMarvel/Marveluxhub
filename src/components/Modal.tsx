import { useEffect } from "react";
import { tokens } from "../tokens";
import { Avatar, Badge } from "./ui";

// ─── MODAL ────────────────────────────────────────────────────
export function Modal({
  title, sub, open, onClose, children,
}: {
  title: string; sub?: string; open: boolean; onClose?: () => void; children: React.ReactNode;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
        zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(2px)",
      }}
    >
      <div style={{
        background: tokens.surface, border: `1px solid ${tokens.borderStrong}`,
        borderRadius: 14, width: 500, maxHeight: "85vh", overflowY: "auto",
        animation: "modalIn .2s ease",
      }}>
        <div style={{
          padding: "20px 22px 16px", borderBottom: `1px solid ${tokens.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          position: "sticky", top: 0, background: tokens.surface, zIndex: 5,
        }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "1.5px", color: tokens.text }}>{title}</div>
            {sub && <div style={{ fontSize: 11, color: tokens.text3, fontFamily: "'DM Mono', monospace", marginTop: 3 }}>{sub}</div>}
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 6, border: `1px solid ${tokens.border}`,
            background: tokens.surfaceAlt, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", color: tokens.text3, fontSize: 18,
          }}>×</button>
        </div>
        <div style={{ padding: "18px 22px 22px" }}>{children}</div>
      </div>
    </div>
  );
}

// ─── PROFILE HERO ─────────────────────────────────────────────
export function ProfileHero({
  initials, bg, color, name, email, badge,
}: {
  initials: string; bg: string; color: string; name: string; email: string; badge?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 16, marginBottom: 16, borderBottom: `1px solid ${tokens.border}` }}>
      <Avatar initials={initials} bg={bg} color={color} border={color} size={52} fontSize={16} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: tokens.text }}>{name}</div>
        <div style={{ fontSize: 12, color: tokens.text3, fontFamily: "'DM Mono', monospace", marginTop: 3 }}>{email}</div>
      </div>
      {badge}
    </div>
  );
}

// ─── INFO GRID ────────────────────────────────────────────────
export function InfoGrid({
  fields,
}: {
  fields: { label: string; value: string; valueStyle?: React.CSSProperties }[];
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
      {fields.map(({ label, value, valueStyle }) => (
        <div key={label}>
          <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "1.5px", textTransform: "uppercase", color: tokens.text3, marginBottom: 4 }}>{label}</label>
          <span style={{ fontSize: 13, color: tokens.text, fontWeight: 500, ...valueStyle }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

// re-export Badge so modal files can use it without an extra import
export { Badge };
