import { createFileRoute } from "@tanstack/react-router";
import { LeadsTable } from "@/components/admin/LeadsTable";

export const Route = createFileRoute("/admin/dashboard/contact")({
  head: () => ({ meta: [{ title: "Contact Queries | Admin" }, { name: "robots", content: "noindex" }] }),
  component: ContactQueries,
});

function ContactQueries() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-display text-3xl">Contact Queries</h1>
        <p className="text-sm text-muted-foreground">Messages from the contact form.</p>
      </div>
      <LeadsTable
        table="contact_queries"
        csvName="contact-queries"
        statusVariant="contact"
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "message", label: "Message", render: (r) => (
            <span className="block max-w-[300px] truncate" title={r.message}>{r.message}</span>
          ) },
        ]}
      />
    </div>
  );
}
