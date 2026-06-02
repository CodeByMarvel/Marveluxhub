import { useState } from "react";
import { globalStyle } from "./tokens";
import { ToastProvider } from "./components/Toast";
import { Sidebar } from "./components/Sidebar";
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

export default function App() {
  const [activePanel, setActivePanel] = useState<PanelId>("dashboard");

  return (
    <ToastProvider>
      <style>{globalStyle}</style>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#0A0A0A" }}>
        <Sidebar activePanel={activePanel} onNavigate={id => setActivePanel(id as PanelId)} />
        {PANELS[activePanel]}
      </div>
    </ToastProvider>
  );
}
