import { useState } from "react";
import { tokens } from "../tokens";
import { Avatar } from "./ui";

const NAV_ITEMS = [
  { group: "Overview",   items: [{ id: "dashboard",  label: "Dashboard",   icon: "grid" }] },
  { group: "Users",      items: [{ id: "customers",  label: "Customers",   icon: "user" }, { id: "mechanics", label: "Mechanics", icon: "wrench" }] },
  { group: "Operations", items: [{ id: "approvals", label: "Approvals", icon: "approve", badge: 5 }, { id: "complaints", label: "Complaints", icon: "alert", badge: 4 }, { id: "activity", label: "Activity Log", icon: "activity" }] },
  { group: "Insights",   items: [{ id: "analytics",  label: "Analytics",   icon: "bar" }] },
  { group: "System",     items: [{ id: "settings",   label: "Settings",    icon: "settings" }] },
];

function NavIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid:     <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
    user:     <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
    wrench:   <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    alert:    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    approve:  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    activity: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    bar:      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    settings: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  };
  return <>{icons[type] ?? null}</>;
}

export function Sidebar({
  activePanel, onNavigate,
}: {
  activePanel: string; onNavigate: (id: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside style={{
      width: collapsed ? 60 : 220, minHeight: "100vh",
      background: tokens.surface, borderRight: `1px solid ${tokens.border}`,
      display: "flex", flexDirection: "column", flexShrink: 0,
      transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
      overflow: "hidden", position: "relative", zIndex: 50,
    }}>
      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)} style={{
        position: "absolute", top: 18, right: -12, width: 24, height: 24,
        background: tokens.surfaceAlt, border: `1px solid ${tokens.borderStrong}`,
        borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", zIndex: 60, color: tokens.text3,
        transform: collapsed ? "rotate(180deg)" : "none", transition: "all 0.22s",
      }}>
        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Logo */}
      <div style={{ height: 60, display: "flex", alignItems: "center", gap: 12, padding: "0 14px", borderBottom: `1px solid ${tokens.border}`, flexShrink: 0, overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ width: 32, height: 32, background: tokens.green, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: "#0A0A0A" }}>F</div>
        <div style={{ opacity: collapsed ? 0 : 1, transition: "opacity 0.22s", pointerEvents: collapsed ? "none" : "auto" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: "1.5px", color: tokens.text, lineHeight: 1 }}>FUNDI-X</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: tokens.green, letterSpacing: 2, textTransform: "uppercase" }}>Admin Console</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto", overflowX: "hidden" }}>
        {NAV_ITEMS.map(({ group, items }) => (
          <div key={group} style={{ marginBottom: 4 }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "1.8px",
              textTransform: "uppercase", color: tokens.text3, padding: "10px 20px 4px",
              whiteSpace: "nowrap", opacity: collapsed ? 0 : 1, transition: "opacity 0.22s",
            }}>{group}</div>
            {items.map(({ id, label, icon, badge }) => {
              const active = activePanel === id;
              return (
                <div key={id} onClick={() => onNavigate(id)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "0 14px", height: 40,
                  cursor: "pointer", borderLeft: `2px solid ${active ? tokens.green : "transparent"}`,
                  background: active ? tokens.greenDim : "transparent",
                  color: active ? tokens.green : tokens.text3, whiteSpace: "nowrap",
                  transition: "all 0.22s", userSelect: "none",
                }}>
                  <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <NavIcon type={icon} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, opacity: collapsed ? 0 : 1, transition: "opacity 0.22s", flex: 1 }}>{label}</span>
                  {badge && !collapsed && (
                    <span style={{ background: tokens.error, color: "#fff", borderRadius: 20, padding: "1px 6px", fontSize: 10, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{badge}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: "12px 14px", borderTop: `1px solid ${tokens.border}`, display: "flex", alignItems: "center", gap: 10, overflow: "hidden", whiteSpace: "nowrap", flexShrink: 0 }}>
        <Avatar initials="AO" bg={tokens.greenDim} color={tokens.green} border={tokens.greenBorder} />
        <div style={{ opacity: collapsed ? 0 : 1, transition: "opacity 0.22s" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text }}>Admin Ops</div>
          <div style={{ fontSize: 10, color: tokens.green, fontFamily: "'DM Mono', monospace", letterSpacing: ".5px" }}>SUPERADMIN</div>
        </div>
      </div>
    </aside>
  );
}
