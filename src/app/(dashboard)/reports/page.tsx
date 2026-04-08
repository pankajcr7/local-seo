import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Reports" description="A foundational workspace is in place for this section." />
      <EmptyState
        title="Reports"
        description="Coming soon — this feature is under development."
      />
    </div>
  );
}
