import { HuReportWidget } from "@/components/hureport/hureport-widget";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Minimal demo text */}
      <div className="p-4">
        <p className="text-sm font-medium text-[#6B7280]">HuReport AI — Demo preview</p>
        <p className="text-xs text-[#9CA3AF]">Click the button in the top-right to open the widget.</p>
      </div>
      
      {/* HuReport Widget - Floating button & slide-out panel */}
      <HuReportWidget />
    </div>
  );
}
