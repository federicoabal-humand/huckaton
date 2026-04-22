"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "./file-upload";
import { ChevronDown, ChevronUp, Calendar, Layers, FileText, Image, Film, MessageSquarePlus } from "lucide-react";
import { useLanguage } from "@/lib/hureport/language-context";
import { t, getModuleLabel, getStatusLabel, getClassificationLabel } from "@/lib/hureport/translations";
import { getReportsByCommunity } from "@/lib/hureport/mock-data";
import type { Report, TicketStatus } from "@/lib/hureport/types";
import { cn } from "@/lib/utils";

interface ReportsListProps {
  communityId: string;
}

const statusConfig: Record<TicketStatus, { color: string; bg: string }> = {
  reported: { color: "text-gray-700", bg: "bg-gray-100" },
  under_review: { color: "text-blue-700", bg: "bg-blue-100" },
  developing_fix: { color: "text-amber-700", bg: "bg-amber-100" },
  resolved: { color: "text-green-700", bg: "bg-green-100" },
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
    console.log("[v0] Submitting additional info for report:", reportId, {
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
        <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">{t("noReports", language)}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="rounded-xl border border-border bg-card transition-shadow hover:shadow-sm"
          >
            {/* Report Header Row */}
            <button
              onClick={() => toggleExpand(report.id)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div className="flex flex-1 items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {t("ticketPrefix", language)}-{report.ticketNumber}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {report.createdAt.toLocaleDateString()}
                  </span>
                </div>
                
                <div className="hidden flex-1 sm:block">
                  <p className="truncate text-sm text-foreground">
                    {report.summary || report.description.slice(0, 50) + "..."}
                  </p>
                  <p className="text-xs text-muted-foreground">
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
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Expanded Content */}
            {expandedId === report.id && (
              <div className="border-t border-border px-4 pb-4 pt-3">
                {/* Mobile-only module info */}
                <div className="mb-3 sm:hidden">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Layers className="h-3 w-3" />
                    {getModuleLabel(report.module, language)}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-sm leading-relaxed text-foreground">{report.description}</p>
                </div>

                {/* Classification */}
                {report.classification && (
                  <div className="mb-4">
                    <Badge variant="outline" className="mb-2">
                      {getClassificationLabel(report.classification, language)}
                    </Badge>
                    {report.aiExplanation && (
                      <p className="text-sm text-muted-foreground">{report.aiExplanation}</p>
                    )}
                  </div>
                )}

                {/* Evidence Thumbnails */}
                {report.evidence.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("evidence", language)}
                    </p>
                    <div className="flex gap-2">
                      {report.evidence.map((file) => (
                        <div
                          key={file.id}
                          className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-muted"
                        >
                          {file.type === "image" ? (
                            <Image className="h-6 w-6 text-muted-foreground" />
                          ) : (
                            <Film className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add More Information */}
                {showAddInfo === report.id ? (
                  <div className="space-y-3 rounded-lg border border-border bg-muted/50 p-3">
                    <Textarea
                      placeholder={language === "en" ? "Add more details..." : "Agrega más detalles..."}
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      rows={3}
                    />
                    <FileUpload files={additionalFiles} onChange={setAdditionalFiles} />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => submitAdditionalInfo(report.id)}
                        disabled={!additionalInfo.trim() && additionalFiles.length === 0}
                      >
                        {t("submitAdditionalInfo", language)}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowAddInfo(null)}>
                        {language === "en" ? "Cancel" : "Cancelar"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddInfo(report.id)}
                    className="gap-2"
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
