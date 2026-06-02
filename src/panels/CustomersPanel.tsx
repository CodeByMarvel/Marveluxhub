import { useState } from "react";
import { tokens } from "../tokens";
import { Badge, Btn, IconBtn, Card, PageHeader, ScrollArea, FilterBar, Avatar, EyeIcon, BanIcon, CheckIcon, thStyle, tdStyle } from "../components/ui";
import { useToast } from "../components/Toast";
import { CustomerModal, type Customer } from "../modals/CustomerModal";
import { AddCustomerModal } from "../modals/AddCustomerModal";

const CUSTOMERS: Customer[] = [
  { name: "James Kariuki",   email: "j.kariuki@gmail.com",  phone: "+254 722 001234", region: "Nairobi", joined: "Jan 2025", bookings: 14, status: "Flagged",   initials: "JK", bg: "rgba(46,204,113,0.1)",  color: tokens.green },
  { name: "Wanjiku Njoroge", email: "wanjiku.n@yahoo.com",  phone: "+254 733 445566", region: "Nairobi", joined: "Mar 2025", bookings:  8, status: "Active",    initials: "WN", bg: "rgba(245,166,35,0.1)", color: tokens.amber },
  { name: "Aisha Omondi",    email: "a.omondi@hotmail.com", phone: "+254 711 987654", region: "Mombasa", joined: "Jun 2024", bookings: 22, status: "Active",    initials: "AO", bg: "rgba(46,204,113,0.07)", color: tokens.green },
  { name: "Brian Mutua",     email: "b.mutua@gmail.com",    phone: "+254 700 123456", region: "Kisumu",  joined: "Sep 2024", bookings:  5, status: "Suspended", initials: "BM", bg: "rgba(231,76,60,0.1)",  color: tokens.error },
];

export function CustomersPanel() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = CUSTOMERS.filter(c =>
    `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", animation: "fadeUp .2s ease" }}>
      <PageHeader
        eyebrow="Users" title="CUSTOMERS"
        desc="3,624 registered · 12 flagged · 5 suspended"
        actions={<Btn variant="primary" onClick={() => setAddOpen(true)}>+ Add Customer</Btn>}
      />
      <ScrollArea>
        <FilterBar
          placeholder="Search by name, email, phone…" onSearch={setSearch}
          selects={[["All Status", "Active", "Suspended", "Flagged"], ["All Regions", "Nairobi", "Mombasa", "Kisumu"]]}
        />
        <Card title="All Customers" actions={<span style={{ fontSize: 11, color: tokens.text3, fontFamily: "'DM Mono', monospace" }}>3,624 total</span>}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Customer","Phone","Region","Bookings","Status","Joined","Actions"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const bv = c.status === "Active" ? "green" : c.status === "Suspended" ? "red" : "amber";
                  return (
                    <tr key={c.name}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar initials={c.initials} bg={c.bg} color={c.color} border={c.color} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text }}>{c.name}</div>
                            <div style={{ fontSize: 11, color: tokens.text3, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{c.email}</div>
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
                          <IconBtn variant="red" title="Suspend" onClick={() => toast(`Account suspended: ${c.name}`, "danger")}><BanIcon /></IconBtn>
                          <IconBtn variant="green" title="Clear flag" onClick={() => toast(`Account cleared: ${c.name}`, "success")}><CheckIcon /></IconBtn>
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
