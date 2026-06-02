import { useEffect, useState } from "react";
import { tokens } from "../tokens";
import { Badge, Btn, IconBtn, Card, PageHeader, ScrollArea, FilterBar, Avatar, EyeIcon, BanIcon, CheckIcon, thStyle, tdStyle } from "../components/ui";
import { useToast } from "../components/Toast";
import { CustomerModal, type Customer } from "../modals/CustomerModal";
import { AddCustomerModal } from "../modals/AddCustomerModal";
import { getCustomers, banCustomer, unbanCustomer, type ApiCustomer } from "../services/api";

type UiCustomer = Customer & { id: string };

function getInitials(name: string | null | undefined): string {
  if (!name) return "??";
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function mapCustomer(c: ApiCustomer): UiCustomer {
  const banned   = c.is_banned;
  const color    = banned ? tokens.error : tokens.green;
  const bg       = banned ? "rgba(231,76,60,0.1)" : "rgba(46,204,113,0.1)";
  return {
    id:       c.id,
    name:     c.name ?? "Unknown",
    email:    "",
    phone:    c.phone ?? "—",
    region:   "—",
    joined:   new Date(c.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
    bookings: 0,
    status:   banned ? "Suspended" : "Active",
    initials: getInitials(c.name),
    bg,
    color,
  };
}

export function CustomersPanel() {
  const toast = useToast();
  const [customers, setCustomers] = useState<UiCustomer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<UiCustomer | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  function load() {
    setLoading(true);
    getCustomers({ limit: 100 })
      .then(({ data, total: t }) => {
        setCustomers(data.map(mapCustomer));
        setTotal(t ?? data.length);
      })
      .catch((e: Error) => toast(e.message, "danger"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const filtered = customers.filter(c =>
    `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  const flagged   = customers.filter(c => c.status === "Suspended").length;

  async function handleBan(c: UiCustomer) {
    const reason = window.prompt(`Ban reason for ${c.name}:`);
    if (!reason?.trim()) return;
    try {
      await banCustomer(c.id, reason.trim());
      toast(`Account banned: ${c.name}`, "danger");
      setCustomers(prev => prev.map(x => x.id === c.id
        ? { ...x, status: "Suspended", color: tokens.error, bg: "rgba(231,76,60,0.1)" }
        : x
      ));
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Failed to ban", "danger");
    }
  }

  async function handleUnban(c: UiCustomer) {
    try {
      await unbanCustomer(c.id);
      toast(`Account unbanned: ${c.name}`, "success");
      setCustomers(prev => prev.map(x => x.id === c.id
        ? { ...x, status: "Active", color: tokens.green, bg: "rgba(46,204,113,0.1)" }
        : x
      ));
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : "Failed to unban", "danger");
    }
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", animation: "fadeUp .2s ease" }}>
      <PageHeader
        eyebrow="Users" title="CUSTOMERS"
        desc={loading ? "Loading…" : `${total} registered · ${flagged} suspended`}
        actions={<Btn variant="primary" onClick={() => setAddOpen(true)}>+ Add Customer</Btn>}
      />
      <ScrollArea>
        <FilterBar
          placeholder="Search by name, phone…" onSearch={setSearch}
          selects={[["All Status", "Active", "Suspended"], ["All Regions", "Nairobi", "Mombasa", "Kisumu"]]}
        />
        <Card title="All Customers" actions={<span style={{ fontSize: 11, color: tokens.text3, fontFamily: "'DM Mono', monospace" }}>{loading ? "…" : `${total} total`}</span>}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Customer", "Phone", "Region", "Bookings", "Status", "Joined", "Actions"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={7} style={{ padding: "32px 16px", textAlign: "center", color: tokens.text3, fontSize: 13, fontFamily: "'DM Mono', monospace" }}>Loading…</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: "32px 16px", textAlign: "center", color: tokens.text3, fontSize: 13 }}>No customers found</td></tr>
                )}
                {filtered.map(c => {
                  const bv = c.status === "Active" ? "green" : c.status === "Suspended" ? "red" : "amber";
                  return (
                    <tr key={c.id}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar initials={c.initials} bg={c.bg} color={c.color} border={c.color} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text }}>{c.name}</div>
                            <div style={{ fontSize: 11, color: tokens.text3, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{c.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, fontFamily: "'DM Mono', monospace", fontSize: 12, color: tokens.text2 }}>{c.phone}</td>
                      <td style={{ ...tdStyle, color: tokens.text2 }}>{c.region}</td>
                      <td style={{ ...tdStyle, color: tokens.text2 }}>{c.bookings}</td>
                      <td style={tdStyle}><Badge variant={bv as any}>{c.status}</Badge></td>
                      <td style={{ ...tdStyle, fontFamily: "'DM Mono', monospace", fontSize: 11, color: tokens.text3 }}>{c.joined}</td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <IconBtn title="View profile" onClick={() => setSelectedCustomer(c)}><EyeIcon /></IconBtn>
                          <IconBtn variant="red" title="Ban" onClick={() => handleBan(c)}><BanIcon /></IconBtn>
                          <IconBtn variant="green" title="Unban" onClick={() => handleUnban(c)}><CheckIcon /></IconBtn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </ScrollArea>
      <CustomerModal customer={selectedCustomer} open={!!selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      <AddCustomerModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
