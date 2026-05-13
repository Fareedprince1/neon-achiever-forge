import { createFileRoute } from "@tanstack/react-router";
import { LeadsTable } from "@/components/admin/LeadsTable";

export const Route = createFileRoute("/admin/dashboard/free-trials")({
  head: () => ({ meta: [{ title: "Free Trials | Admin" }, { name: "robots", content: "noindex" }] }),
  component: FreeTrials,
});

function FreeTrials() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-display text-3xl">Free Trial Requests</h1>
        <p className="text-sm text-muted-foreground">3-day trial signups from the homepage.</p>
      </div>
      <LeadsTable
        table="free_trial_requests"
        csvName="free-trials"
        columns={[
          { key: "name", label: "Name" },
          { key: "phone", label: "Phone" },
          { key: "goal", label: "Goal" },
          { key: "batch", label: "Batch" },
        ]}
      />
    </div>
  );
}
