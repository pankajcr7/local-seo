import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";

export default function CompetitorsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Competitors" description="A foundational workspace is in place for this section." />
      <EmptyState
        title="Competitors"
        description="Coming soon — this feature is under development."
      />
    </div>
  );
}
