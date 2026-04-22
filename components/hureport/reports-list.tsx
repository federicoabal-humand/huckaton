"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "./file-upload";
import { ChevronDown, ChevronUp, Layers, FileText, Image, Film, MessageSquarePlus } from "lucide-react";
import { useLanguage } from "@/lib/hureport/language-context";
import { t, getModuleLabel, getStatusLabel, getClassificationLabel } from "@/lib/hureport/translations";
import { getReportsByCommunity } from "@/lib/hureport/mock-data";
import type { TicketStatus } from "@/lib/hureport/types";
import { cn } from "@/lib/utils";

interface ReportsListProps {
  communityId: string;
}

const statusConfig: Record<TicketStatus, { color: string; bg: string }> = {
  reported: { color: "text-[#374151]", bg: "bg-[#F3F4F6]" },
  under_review: { color: "text-[#1D4ED8]", bg: "bg-[#DBEAFE]" },
  developing_fix: { color: "text-[#92400E]", bg: "bg-[#FEF3C7]" },
  resolved: { color: "text-[#065F46]", bg: "bg-[#D1FAE5]" },
};

export function ReportsList({ communityId }: ReportsListProps) {
  const { language } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddInfo, setShowAddInfo] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);

  const reports = getReportsByCommunity(communityId);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    setShowAddInfo(null);
  };

  const handleAddInfo = (reportId: string) => {
    if (showAddInfo === reportId) {
      setShowAddInfo(null);
    } else {
      setShowAddInfo(reportId);
      setAdditionalInfo("");
      setAdditionalFiles([]);
    }
  };

  const submitAdditionalInfo = (reportId: string) => {
    console.log("Submitting additional info for report:", reportId, {
      text: additionalInfo,
      files: additionalFiles,
    });
    setShowAddInfo(null);
    setAdditionalInfo("");
    setAdditionalFiles([]);
  };

  if (reports.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <FileText className="mb-4 h-12 w-12 text-[#D1D5DB]" />
        <p className="text-[#6B7280]">{t("noReports", language)}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="rounded-lg border border-[#E5E7EB] bg-white transition-shadow duration-150 ease-out hover:shadow-sm"
          >
            {/* Report Header Row */}
            <button
              onClick={() => toggleExpand(report.id)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div className="flex flex-1 items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#111827]">
                    {t("ticketPrefix", language)}-{report.ticketNumber}
                  </span>
                  <span className="text-xs text-[#6B7280]">
                    {report.createdAt.toLocaleDateString()}
                  </span>
                </div>
                
                <div className="hidden flex-1 sm:block">
                  <p className="truncate text-sm text-[#374151]">
                    {report.summary || report.description.slice(0, 50) + "..."}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {getModuleLabel(report.module, language)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs font-medium",
                    statusConfig[report.status].bg,
                    statusConfig[report.status].color
                  )}
                >
                  {getStatusLabel(report.status, language)}
                </Badge>
                {expandedId === report.id ? (
                  <ChevronUp className="h-4 w-4 text-[#6B7280]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[#6B7280]" />
                )}
              </div>
            </button>

            {/* Expanded Content */}
            {expandedId === report.id && (
              <div className="border-t border-[#E5E7EB] px-4 pb-4 pt-3">
                {/* Mobile-only module info */}
                <div className="mb-3 sm:hidden">
                  <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <Layers className="h-3 w-3" />
                    {getModuleLabel(report.module, language)}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-sm leading-relaxed text-[#374151]">{report.description}</p>
                </div>

                {/* Classification */}
                {report.classification && (
                  <div className="mb-4">
                    <Badge variant="outline" className="mb-2 border-[#E5E7EB] text-[#374151]">
                      {getClassificationLabel(report.classification, language)}
                    </Badge>
                    {report.aiExplanation && (
                      <p className="text-sm text-[#6B7280]">{report.aiExplanation}</p>
                    )}
                  </div>
                )}

                {/* Evidence Thumbnails */}
                {report.evidence.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                      {t("evidence", language)}
                    </p>
                    <div className="flex gap-2">
                      {report.evidence.map((file) => (
                        <div
                          key={file.id}
                          className="flex h-16 w-16 items-center justify-center rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]"
                        >
                          {file.type === "image" ? (
                            <Image className="h-6 w-6 text-[#9CA3AF]" />
                          ) : (
                            <Film className="h-6 w-6 text-[#9CA3AF]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add More Information */}
                {showAddInfo === report.id ? (
                  <div className="space-y-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                    <Textarea
                      placeholder={language === "en" ? "Add more details..." : "Agrega mas detalles..."}
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      rows={3}
                      className="border-[#E5E7EB] bg-white focus-visible:ring-[#2563EB]/20"
                    />
                    <FileUpload files={additionalFiles} onChange={setAdditionalFiles} />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => submitAdditionalInfo(report.id)}
                        disabled={!additionalInfo.trim() && additionalFiles.length === 0}
                        className="bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                      >
                        {t("submitAdditionalInfo", language)}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setShowAddInfo(null)}
                        className="border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]"
                      >
                        {language === "en" ? "Cancel" : "Cancelar"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddInfo(report.id)}
                    className="gap-2 border-[#2563EB] text-[#2563EB] hover:bg-[#DBEAFE]"
                  >
                    <MessageSquarePlus className="h-4 w-4" />
                    {t("addMoreInfo", language)}
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
