import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";

export default function GmbPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="GMB Management" description="A foundational workspace is in place for this section." />
      <EmptyState
        title="GMB Management"
        description="Coming soon — this feature is under development."
      />
    </div>
  );
}
