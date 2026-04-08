import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Settings" description="A foundational workspace is in place for this section." />
      <EmptyState
        title="Settings"
        description="Coming soon — this feature is under development."
      />
    </div>
  );
}
