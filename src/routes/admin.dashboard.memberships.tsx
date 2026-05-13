import { createFileRoute } from "@tanstack/react-router";
import { LeadsTable } from "@/components/admin/LeadsTable";

export const Route = createFileRoute("/admin/dashboard/memberships")({
  head: () => ({ meta: [{ title: "Membership Inquiries | Admin" }, { name: "robots", content: "noindex" }] }),
  component: Memberships,
});

function Memberships() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-display text-3xl">Membership Inquiries</h1>
        <p className="text-sm text-muted-foreground">Inquiries about Basic, Pro and Elite plans.</p>
      </div>
      <LeadsTable
        table="membership_inquiries"
        csvName="memberships"
        columns={[
          { key: "name", label: "Name" },
          { key: "phone", label: "Phone" },
          { key: "plan", label: "Plan" },
          { key: "goal", label: "Goal" },
          { key: "batch", label: "Batch" },
        ]}
      />
    </div>
  );
}
