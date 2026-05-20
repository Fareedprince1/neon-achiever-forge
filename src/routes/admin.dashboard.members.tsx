import { createFileRoute } from "@tanstack/react-router";
import { MembersPage } from "@/components/admin/MembersPage";

export const Route = createFileRoute("/admin/dashboard/members")({
  head: () => ({ meta: [{ title: "Members | Admin" }, { name: "robots", content: "noindex" }] }),
  component: MembersPage,
});
