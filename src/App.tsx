import { useState } from "react";
import { globalStyle, tokens } from "./tokens";
import { ToastProvider } from "./components/Toast";
import { Sidebar } from "./components/Sidebar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginPanel } from "./panels/LoginPanel";
import { DashboardPanel } from "./panels/DashboardPanel";
import { CustomersPanel } from "./panels/CustomersPanel";
import { MechanicsPanel } from "./panels/MechanicsPanel";
import { ComplaintsPanel } from "./panels/ComplaintsPanel";
import { ActivityPanel } from "./panels/ActivityPanel";
import { AnalyticsPanel } from "./panels/AnalyticsPanel";
import { SettingsPanel } from "./panels/SettingsPanel";
import { ApprovalsPanel } from "./panels/ApprovalsPanel";

type PanelId = "dashboard" | "customers" | "mechanics" | "approvals" | "complaints" | "activity" | "analytics" | "settings";

const PANELS: Record<PanelId, React.ReactNode> = {
  dashboard:  <DashboardPanel />,
  customers:  <CustomersPanel />,
  mechanics:  <MechanicsPanel />,
  approvals:  <ApprovalsPanel />,
  complaints: <ComplaintsPanel />,
  activity:   <ActivityPanel />,
  analytics:  <AnalyticsPanel />,
  settings:   <SettingsPanel />,
};

function Shell() {
  const { token, loading, logout } = useAuth();
  const [activePanel, setActivePanel] = useState<PanelId>("dashboard");

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: tokens.text3, fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
        LOADING…
      </div>
    );
  }

  if (!token) return <LoginPanel />;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#0A0A0A" }}>
      <Sidebar
        activePanel={activePanel}
        onNavigate={id => setActivePanel(id as PanelId)}
        onLogout={logout}
      />
      {PANELS[activePanel]}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <style>{globalStyle}</style>
        <Shell />
      </ToastProvider>
    </AuthProvider>
  );
}
