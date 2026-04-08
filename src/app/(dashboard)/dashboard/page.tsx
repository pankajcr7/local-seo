import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="A foundational workspace is in place for this section." />
      <EmptyState
        title="Dashboard"
        description="Coming soon — this feature is under development."
      />
    </div>
  );
}
