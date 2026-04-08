import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";

export default function CitationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Citations" description="A foundational workspace is in place for this section." />
      <EmptyState
        title="Citations"
        description="Coming soon — this feature is under development."
      />
    </div>
  );
}
