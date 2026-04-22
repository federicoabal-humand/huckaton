import { HuReportWidget } from "@/components/hureport/hureport-widget";
import { DemoDashboard } from "@/components/demo-dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Demo Dashboard to show widget integration */}
      <DemoDashboard />
      
      {/* HuReport Widget - Floating button & slide-out panel */}
      <HuReportWidget />
    </div>
  );
}
