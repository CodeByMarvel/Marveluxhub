import { tokens } from "../tokens";
import { Badge, Btn, Card, PageHeader, ScrollArea, Toggle, SettingRow, Avatar } from "../components/ui";
import { useToast } from "../components/Toast";

export function SettingsPanel() {
  const toast = useToast();

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", background: tokens.surfaceAlt,
    border: `1px solid ${tokens.border}`, borderRadius: 6, color: tokens.text,
    fontFamily: "'Outfit', sans-serif", fontSize: 13,
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "'DM Mono', monospace", fontSize: 9,
    letterSpacing: "1.5px", textTransform: "uppercase", color: tokens.text3, marginBottom: 4,
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", animation: "fadeUp .2s ease" }}>
      <PageHeader
        eyebrow="System" title="SETTINGS"
        desc="Platform configuration and admin preferences"
        actions={<Btn variant="primary" onClick={() => toast("Settings saved", "success")}>Save Changes</Btn>}
      />
      <ScrollArea>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div>
            <Card title="Platform" subtitle="Core operational settings">
              <div style={{ padding: "4px 20px 16px" }}>
                <SettingRow label="Auto-flag mechanics"    desc="Flag after 3 complaints in 24 hours"  control={<Toggle checked={true} />} />
                <SettingRow label="Require ID verification" desc="For new mechanic onboarding"          control={<Toggle checked={true} />} />
                <SettingRow label="Allow self-registration" desc="Customers can register via app"       control={<Toggle checked={true} />} />
                <SettingRow label="Maintenance mode"       desc="Temporarily disable bookings"         control={<Toggle checked={false} />} />
                <SettingRow label="Two-factor auth (Admin)" desc="Enforce 2FA for admin accounts"      control={<Toggle checked={false} />} />
              </div>
            </Card>
            <Card title="Notifications" subtitle="Alert and digest preferences">
              <div style={{ padding: "4px 20px 16px" }}>
                <SettingRow label="Email alerts"        desc="Critical flags and escalations"    control={<Toggle checked={true} />} />
                <SettingRow label="SMS alerts"          desc="High-priority complaints"          control={<Toggle checked={false} />} />
                <SettingRow label="Daily digest"        desc="Summary report at 08:00 EAT"       control={<Toggle checked={true} />} />
                <SettingRow label="New mechanic alerts" desc="Notify on onboarding completion"   control={<Toggle checked={true} />} />
              </div>
            </Card>
          </div>
          <div>
            <Card title="Admin Account" subtitle="Your profile & credentials">
              <div style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0 16px", marginBottom: 16, borderBottom: `1px solid ${tokens.border}` }}>
                  <Avatar initials="AO" bg={tokens.greenDim} color={tokens.green} border={tokens.greenBorder} size={48} fontSize={14} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: tokens.text }}>Admin Ops</div>
                    <div style={{ fontSize: 12, color: tokens.text3, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>admin@fundi-x.ke</div>
                    <div style={{ marginTop: 5 }}><Badge variant="green" dot={false}>SUPERADMIN</Badge></div>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 12 }}>
                  {[
                    ["Display Name", "Admin Ops"],
                    ["Email",        "admin@fundi-x.ke"],
                    ["Phone",        "+254 700 000001"],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <label style={labelStyle}>{label}</label>
                      <input defaultValue={val} style={inputStyle} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <Btn variant="primary" onClick={() => toast("Profile updated", "success")}>Update Profile</Btn>
                  <Btn onClick={() => toast("Password reset email sent", "info")}>Change Password</Btn>
                </div>
              </div>
            </Card>
            <Card title="API & Integrations" subtitle="Keys and webhook configuration">
              <div style={{ padding: "4px 20px 16px" }}>
                <SettingRow label="Payment Gateway" desc="M-Pesa Daraja API · Connected"    control={<Badge variant="green">Active</Badge>} />
                <SettingRow label="SMS Provider"    desc="Africa's Talking · Connected"     control={<Badge variant="green">Active</Badge>} />
                <SettingRow label="Maps API"        desc="Google Maps Platform"             control={<Badge variant="green">Active</Badge>} />
                <SettingRow label="Push Notifications" desc="Firebase Cloud Messaging"     control={<Badge variant="amber">Review</Badge>} />
                <div style={{ marginTop: 16 }}>
                  <Btn onClick={() => toast("API keys copied to clipboard", "success")}>Copy API Keys</Btn>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Card title="Danger Zone" subtitle="Irreversible platform actions">
          <div style={{ padding: "4px 20px 16px" }}>
            <SettingRow label="Export all data"   desc="Download full platform data as CSV"         control={<Btn onClick={() => toast("Export started — check your email", "success")}>Export</Btn>} />
            <SettingRow label="Clear activity log" desc="Permanently delete audit trail"            control={<Btn variant="danger" onClick={() => toast("Action requires confirmation", "warn")}>Clear Log</Btn>} />
            <SettingRow label="Reset platform"    desc="Wipe all configuration to defaults"         control={<Btn variant="danger" onClick={() => toast("Action requires confirmation", "warn")}>Reset</Btn>} />
          </div>
        </Card>
      </ScrollArea>
    </div>
  );
}
