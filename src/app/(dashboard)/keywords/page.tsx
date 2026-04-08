import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";

export default function KeywordsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Keywords" description="A foundational workspace is in place for this section." />
      <EmptyState
        title="Keywords"
        description="Coming soon — this feature is under development."
      />
    </div>
  );
}
