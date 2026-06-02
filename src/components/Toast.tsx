import { createContext, useContext, useState } from "react";
import { tokens } from "../tokens";

type ToastFn = (msg: string, type?: string) => void;

export const ToastContext = createContext<ToastFn>(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: string }[]>([]);

  const addToast: ToastFn = (msg, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const borderColors: Record<string, string> = {
    success: tokens.greenBorder, danger: tokens.errorBorder, warn: tokens.amberBorder, info: tokens.border,
  };
  const icons: Record<string, { icon: string; color: string }> = {
    success: { icon: "✓", color: tokens.green },
    danger:  { icon: "✕", color: tokens.error },
    warn:    { icon: "⚠", color: tokens.amber },
    info:    { icon: "ℹ", color: tokens.text3 },
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{ position: "fixed", bottom: 20, right: 24, zIndex: 300, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: tokens.surfaceAlt, border: `1px solid ${borderColors[t.type] ?? tokens.border}`,
            borderRadius: 6, padding: "10px 14px", fontSize: 12, color: tokens.text,
            display: "flex", alignItems: "center", gap: 8, maxWidth: 280,
            fontFamily: "'Outfit', sans-serif", animation: "toastIn .2s ease",
          }}>
            <span style={{ color: icons[t.type]?.color, fontSize: 13, fontWeight: 700 }}>{icons[t.type]?.icon}</span>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
