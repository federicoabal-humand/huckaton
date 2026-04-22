"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { CommunitySearch } from "./community-search";
import { FileUpload } from "./file-upload";
import { AIChat } from "./ai-chat";
import { useLanguage } from "@/lib/hureport/language-context";
import { t, getModuleLabel, getPlatformLabel, getAllModules, getAllPlatforms } from "@/lib/hureport/translations";
import { getClientById } from "@/lib/hureport/mock-data";
import type { Module, Platform } from "@/lib/hureport/types";
import { cn } from "@/lib/utils";

interface SimplifiedFormData {
  communityId: string;
  module: Module | "";
  platforms: Platform[];
  evidence: File[];
}

const initialFormData: SimplifiedFormData = {
  communityId: "",
  module: "",
  platforms: [],
  evidence: [],
};

export function ReportForm() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<SimplifiedFormData>(initialFormData);
  const [step, setStep] = useState<"form" | "chat">("form");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const togglePlatform = (platform: Platform) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransitioning(true);
    
    // Brief delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 200));
    setStep("chat");
    setIsTransitioning(false);
  };

  const handleEdit = () => {
    setStep("form");
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setStep("form");
  };

  const isFormValid = 
    formData.communityId &&
    formData.module &&
    formData.platforms.length > 0 &&
    formData.evidence.length > 0;

  // Get community name for summary
  const client = formData.communityId ? getClientById(formData.communityId) : null;

  if (step === "chat" && formData.module) {
    return (
      <AIChat
        formSummary={{
          communityName: client?.name || "Unknown",
          module: formData.module as Module,
          platforms: formData.platforms,
          fileCount: formData.evidence.length,
        }}
        onEdit={handleEdit}
        onReset={handleReset}
      />
    );
  }

  return (
    <ScrollArea className="h-full">
      <form onSubmit={handleContinue} className="space-y-5 p-4">
        {/* Community */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#374151]">
            {t("community", language)}
          </Label>
          <CommunitySearch
            value={formData.communityId}
            onChange={(id) => setFormData((prev) => ({ ...prev, communityId: id }))}
          />
        </div>

        {/* Module */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#374151]">
            {t("module", language)}
          </Label>
          <Select
            value={formData.module}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, module: value as Module }))}
          >
            <SelectTrigger className="border-[#E5E7EB] bg-white focus:ring-[#2563EB]/20">
              <SelectValue placeholder={t("modulePlaceholder", language)} />
            </SelectTrigger>
            <SelectContent>
              {getAllModules().map((module) => (
                <SelectItem key={module} value={module}>
                  {getModuleLabel(module, language)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Platform */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#374151]">
            {t("platform", language)}
          </Label>
          <div className="flex flex-wrap gap-2">
            {getAllPlatforms().map((platform) => (
              <Badge
                key={platform}
                variant="outline"
                className={cn(
                  "cursor-pointer border px-3 py-1.5 text-sm font-medium transition-colors duration-150 ease-out",
                  formData.platforms.includes(platform)
                    ? "border-[#2563EB] bg-[#DBEAFE] text-[#1D4ED8]"
                    : "border-[#E5E7EB] bg-white text-[#374151] hover:border-[#D1D5DB] hover:bg-[#F9FAFB]"
                )}
                onClick={() => togglePlatform(platform)}
              >
                {getPlatformLabel(platform, language)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Evidence Upload */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#374151]">
            {t("evidence", language)}{" "}
            <span className="text-[#DC2626]">{t("evidenceRequired", language)}</span>
          </Label>
          <FileUpload
            files={formData.evidence}
            onChange={(files) => setFormData((prev) => ({ ...prev, evidence: files }))}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isFormValid || isTransitioning}
          className="w-full bg-[#2563EB] text-white hover:bg-[#1D4ED8] disabled:bg-[#93C5FD] transition-colors duration-150 ease-out"
          size="lg"
        >
          {isTransitioning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {language === "es" ? "Cargando..." : "Loading..."}
            </>
          ) : (
            language === "es" ? "Continuar con IA" : "Continue with AI"
          )}
        </Button>
      </form>
    </ScrollArea>
  );
}
