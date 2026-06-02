import { useState } from "react";
import { tokens } from "../tokens";

// ─── ICONS ───────────────────────────────────────────────────
export const SearchIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
export const TriangleAlertIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
export const EyeIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
export const BanIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);
export const CheckIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── BADGE ───────────────────────────────────────────────────
export function Badge({
  variant = "gray", dot = true, children,
}: {
  variant?: "green" | "amber" | "red" | "gray"; dot?: boolean; children: React.ReactNode;
}) {
  const styles: Record<string, React.CSSProperties> = {
    green: { background: tokens.greenDim, color: tokens.green, borderColor: tokens.greenBorder },
    amber: { background: tokens.amberDim, color: tokens.amber, borderColor: tokens.amberBorder },
    red:   { background: tokens.errorDim, color: tokens.error, borderColor: tokens.errorBorder },
    gray:  { background: "rgba(255,255,255,0.05)", color: tokens.text3, borderColor: tokens.border },
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px", borderRadius: 20,
      fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500,
      letterSpacing: ".5px", border: "1px solid transparent",
      ...styles[variant],
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />}
      {children}
    </span>
  );
}

// ─── BTN ─────────────────────────────────────────────────────
export function Btn({
  variant = "default", style: extraStyle, onClick, children, title,
}: {
  variant?: string; style?: React.CSSProperties; onClick?: () => void; children: React.ReactNode; title?: string;
}) {
  const base: React.CSSProperties = {
    padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600,
    cursor: "pointer", fontFamily: "'Outfit', sans-serif",
    border: `1px solid ${tokens.border}`, background: tokens.surfaceAlt, color: tokens.text2,
    letterSpacing: ".3px", whiteSpace: "nowrap", transition: "all 0.22s",
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: tokens.green, color: "#0A0A0A", borderColor: tokens.green, fontWeight: 700 },
    danger:  { background: tokens.errorDim, color: tokens.error, borderColor: tokens.errorBorder },
    amber:   { background: tokens.amberDim, color: tokens.amber, borderColor: tokens.amberBorder },
    green:   { color: tokens.green, borderColor: tokens.greenBorder },
  };
  return (
    <button title={title} onClick={onClick} style={{ ...base, ...(variants[variant] || {}), ...extraStyle }}>
      {children}
    </button>
  );
}

// ─── ICON BTN ────────────────────────────────────────────────
export function IconBtn({
  variant, title, onClick, children,
}: {
  variant?: string; title?: string; onClick?: () => void; children: React.ReactNode;
}) {
  const hoverColors: Record<string, React.CSSProperties> = {
    red:   { borderColor: tokens.errorBorder, color: tokens.error, background: tokens.errorDim },
    green: { borderColor: tokens.greenBorder, color: tokens.green, background: tokens.greenDim },
    amber: { borderColor: tokens.amberBorder, color: tokens.amber, background: tokens.amberDim },
  };
  const [hovered, setHovered] = useState(false);
  const hover = hoverColors[variant!] || { borderColor: tokens.borderStrong, color: tokens.text, background: tokens.surfaceHover };
  return (
    <button
      title={title} onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        width: 28, height: 28, borderRadius: 6,
        border: `1px solid ${hovered ? hover.borderColor : tokens.border}`,
        background: hovered ? hover.background : tokens.surfaceAlt,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        color: hovered ? hover.color : tokens.text3, transition: "all 0.22s",
      }}
    >
      {children}
    </button>
  );
}

// ─── CARD ─────────────────────────────────────────────────────
export function Card({
  title, subtitle, actions, children, style: extraStyle,
}: {
  title?: string; subtitle?: string; actions?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div style={{
      background: tokens.surface, border: `1px solid ${tokens.border}`,
      borderRadius: 10, overflow: "hidden", marginBottom: 18,
      transition: "border-color 0.22s", ...extraStyle,
    }}>
      {title && (
        <div style={{
          padding: "16px 20px", borderBottom: `1px solid ${tokens.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: "1.5px", color: tokens.text }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: tokens.text3, marginTop: 1 }}>{subtitle}</div>}
          </div>
          {actions && <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── PAGE HEADER ──────────────────────────────────────────────
export function PageHeader({
  eyebrow, title, desc, actions,
}: {
  eyebrow: string; title: string; desc: string; actions?: React.ReactNode;
}) {
  return (
    <div style={{ padding: "28px 32px 0", flexShrink: 0 }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, color: tokens.green, textTransform: "uppercase", marginBottom: 4 }}>{eyebrow}</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 2, color: tokens.text, lineHeight: 1 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingBottom: 20, borderBottom: `1px solid ${tokens.border}` }}>
        <div style={{ fontSize: 13, color: tokens.text3 }}>{desc}</div>
        {actions && <div style={{ display: "flex", gap: 10 }}>{actions}</div>}
      </div>
    </div>
  );
}

// ─── SCROLL AREA ──────────────────────────────────────────────
export function ScrollArea({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px 32px" }}>
      {children}
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────
export function StatCard({
  label, value, delta, deltaType = "up", colorVariant = "neutral",
}: {
  label: string; value: string; delta?: string; deltaType?: string; colorVariant?: string;
}) {
  const colors: Record<string, { accent: string; value: string }> = {
    green:   { accent: tokens.green,         value: tokens.green },
    amber:   { accent: tokens.amber,         value: tokens.amber },
    red:     { accent: tokens.error,         value: tokens.error },
    neutral: { accent: tokens.borderStrong,  value: tokens.text },
  };
  const c = colors[colorVariant] ?? colors.neutral;
  const deltaColor: Record<string, string> = { up: tokens.green, down: tokens.error, warn: tokens.amber };
  return (
    <div style={{
      background: tokens.surface, border: `1px solid ${tokens.border}`,
      borderRadius: 10, padding: "18px 20px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, borderRadius: "10px 10px 0 0", background: c.accent }} />
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "1.2px", textTransform: "uppercase", color: tokens.text3, marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 1, lineHeight: 1, marginBottom: 8, color: c.value }}>{value}</div>
      {delta && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: deltaColor[deltaType] }}>{delta}</div>}
    </div>
  );
}

// ─── MINI BAR ─────────────────────────────────────────────────
export function MiniBar({
  label, pct, value, color = tokens.green, opacity = 1,
}: {
  label: string; pct: number; value: string; color?: string; opacity?: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
      <div style={{ width: 100, fontSize: 12, color: tokens.text2, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, background: tokens.surfaceAlt, borderRadius: 3, height: 6, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 3, width: `${pct}%`, background: color, opacity, transition: "width .6s ease" }} />
      </div>
      <div style={{ width: 40, textAlign: "right", fontSize: 11, color: tokens.text3, fontFamily: "'DM Mono', monospace" }}>{value}</div>
    </div>
  );
}

// ─── FILTER BAR ───────────────────────────────────────────────
export function FilterBar({
  placeholder, onSearch, selects = [],
}: {
  placeholder: string; onSearch?: (v: string) => void; selects?: string[][];
}) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
        <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: tokens.text3, pointerEvents: "none" }}>
          <SearchIcon />
        </span>
        <input
          type="text" placeholder={placeholder}
          onChange={e => onSearch?.(e.target.value)}
          style={{
            width: "100%", padding: "8px 12px 8px 36px",
            background: tokens.surface, border: `1px solid ${tokens.border}`,
            borderRadius: 6, color: tokens.text, fontSize: 13,
            fontFamily: "'Outfit', sans-serif",
          }}
        />
      </div>
      {selects.map((s, i) => (
        <select key={i}>
          {s.map(opt => <option key={opt}>{opt}</option>)}
        </select>
      ))}
    </div>
  );
}

// ─── ALERT BANNER ─────────────────────────────────────────────
export function AlertBanner({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: tokens.errorDim, border: `1px solid ${tokens.errorBorder}`,
      borderRadius: 6, padding: "11px 16px",
      display: "flex", alignItems: "center", gap: 12,
      marginBottom: 18, fontSize: 12, color: tokens.error,
    }}>
      <TriangleAlertIcon />
      {children}
    </div>
  );
}

// ─── SECTION DIVIDER ──────────────────────────────────────────
export function SectionDivider({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2,
      textTransform: "uppercase", color: tokens.text3,
      margin: "20px 0 12px", display: "flex", alignItems: "center", gap: 10,
    }}>
      {children}
      <span style={{ flex: 1, height: 1, background: tokens.border }} />
    </div>
  );
}

// ─── AVATAR ───────────────────────────────────────────────────
export function Avatar({
  initials, bg, color, border, size = 32, fontSize = 11,
}: {
  initials: string; bg: string; color: string; border?: string; size?: number; fontSize?: number;
}) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize, fontWeight: 700, fontFamily: "'DM Mono', monospace",
      flexShrink: 0, border: `1px solid ${border || "transparent"}`,
      background: bg, color,
    }}>
      {initials}
    </div>
  );
}

// ─── LOG ITEM ─────────────────────────────────────────────────
export function LogItem({
  dotColor, tag, tagColor, text, time, isLast = false,
}: {
  dotColor: string; tag: string; tagColor: string; text: string; time: string; isLast?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: isLast ? "none" : `1px solid rgba(255,255,255,0.04)` }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 5 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: dotColor }} />
        {!isLast && <div style={{ width: 1, flex: 1, background: tokens.border, marginTop: 5 }} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: tokens.text2, lineHeight: 1.5 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "1.5px", textTransform: "uppercase", marginRight: 6, color: tagColor }}>[{tag}]</span>
          <span dangerouslySetInnerHTML={{ __html: text }} />
        </div>
        <div style={{ fontSize: 10, color: tokens.text3, fontFamily: "'DM Mono', monospace", marginTop: 3 }}>{time}</div>
      </div>
    </div>
  );
}

// ─── DONUT ────────────────────────────────────────────────────
export function Donut({
  pct, color, label, value, sub,
}: {
  pct: number; color: string; label: string; value: string; sub: string;
}) {
  const r = 32, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 10, padding: "18px 20px", textAlign: "center" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "1.2px", color: tokens.text3, marginBottom: 12, textTransform: "uppercase" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="40" cy="40" r={r} fill="none" stroke={tokens.surfaceAlt} strokeWidth="9" />
          <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`} />
        </svg>
      </div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, letterSpacing: 1, lineHeight: 1, color }}>{value}</div>
      <div style={{ fontSize: 11, color: tokens.text3, marginTop: 6 }}>{sub}</div>
    </div>
  );
}

// ─── RATING ───────────────────────────────────────────────────
export function Rating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      {Array.from({ length: Math.round(value) }).map((_, i) => (
        <span key={i} style={{ color: tokens.amber }}>★</span>
      ))}
      {Array.from({ length: max - Math.round(value) }).map((_, i) => (
        <span key={i} style={{ color: tokens.text3 }}>★</span>
      ))}
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: tokens.text2 }}>{value}</span>
    </div>
  );
}

// ─── SPARKLINE ────────────────────────────────────────────────
export function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 48, padding: "2px 0" }}>
      {data.map((v, i) => (
        <div key={i} title={`${v} bookings`} style={{
          flex: 1, borderRadius: "2px 2px 0 0",
          background: tokens.green, opacity: 0.5,
          minHeight: 4, height: `${Math.round((v / max) * 100)}%`,
          transition: "opacity .2s", cursor: "default",
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}
        />
      ))}
    </div>
  );
}

// ─── TOGGLE ───────────────────────────────────────────────────
export function Toggle({ checked: initial = false }: { checked?: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <div
      onClick={() => setOn(!on)}
      style={{
        width: 40, height: 22, borderRadius: 11, cursor: "pointer", position: "relative",
        background: on ? tokens.greenDim : tokens.surfaceAlt,
        border: `1px solid ${on ? tokens.greenBorder : tokens.border}`,
        transition: "all 0.22s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: 3,
        width: 14, height: 14, borderRadius: "50%",
        background: on ? tokens.green : tokens.text3,
        transform: on ? "translateX(18px)" : "translateX(0)",
        transition: "all 0.22s",
      }} />
    </div>
  );
}

// ─── SETTING ROW ──────────────────────────────────────────────
export function SettingRow({
  label, desc, control,
}: {
  label: string; desc?: string; control: React.ReactNode;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 0", borderBottom: `1px solid ${tokens.border}`, gap: 20,
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: tokens.text3, marginTop: 2 }}>{desc}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{control}</div>
    </div>
  );
}

// ─── TABLE HELPERS ────────────────────────────────────────────
export const thStyle: React.CSSProperties = {
  padding: "10px 16px", textAlign: "left",
  fontFamily: "'DM Mono', monospace", fontSize: 10,
  letterSpacing: "1.2px", textTransform: "uppercase",
  color: tokens.text3, borderBottom: `1px solid ${tokens.border}`,
  fontWeight: 400, whiteSpace: "nowrap",
};

export const tdStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderBottom: `1px solid rgba(255,255,255,0.04)`,
  verticalAlign: "middle",
};
