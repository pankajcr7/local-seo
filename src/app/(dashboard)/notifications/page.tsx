import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Notifications" description="A foundational workspace is in place for this section." />
      <EmptyState
        title="Notifications"
        description="Coming soon — this feature is under development."
      />
    </div>
  );
}
