"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { CommunitySearch } from "./community-search";
import { FileUpload } from "./file-upload";
import { AIResult } from "./ai-result";
import { useLanguage } from "@/lib/hureport/language-context";
import { t, getModuleLabel, getPlatformLabel, getAllModules, getAllPlatforms } from "@/lib/hureport/translations";
import { simulateAIClassification } from "@/lib/hureport/mock-data";
import type { Module, Platform, ReportFormData, AIClassificationResult } from "@/lib/hureport/types";
import { cn } from "@/lib/utils";

const initialFormData: ReportFormData = {
  communityId: "",
  module: "",
  platforms: [],
  description: "",
  expectedBehavior: "",
  isCritical: false,
  affectedUsers: "1",
  evidence: [],
  url: "",
  affectedUserId: "",
};

export function ReportForm() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<ReportFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AIClassificationResult | null>(null);

  const togglePlatform = (platform: Platform) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const aiResult = await simulateAIClassification(language);
      setResult(aiResult);
    } catch (error) {
      console.error("[v0] Error submitting report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportAnother = () => {
    setFormData(initialFormData);
    setResult(null);
  };

  const isFormValid = 
    formData.communityId &&
    formData.module &&
    formData.platforms.length > 0 &&
    formData.description.trim() &&
    formData.evidence.length > 0;

  if (result) {
    return (
      <ScrollArea className="h-full">
        <div className="p-4">
          <AIResult result={result} onReportAnother={handleReportAnother} />
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full">
      <form onSubmit={handleSubmit} className="space-y-6 p-4">
        {/* Client Info Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("clientInfo", language)}
          </h3>
          <CommunitySearch
            value={formData.communityId}
            onChange={(id) => setFormData((prev) => ({ ...prev, communityId: id }))}
          />
        </div>

        <Separator />

        {/* Issue Details Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("issueDetails", language)}
          </h3>

          {/* Module */}
          <div className="space-y-2">
            <Label>{t("module", language)}</Label>
            <Select
              value={formData.module}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, module: value as Module }))}
            >
              <SelectTrigger>
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
            <Label>{t("platform", language)}</Label>
            <div className="flex flex-wrap gap-2">
              {getAllPlatforms().map((platform) => (
                <Badge
                  key={platform}
                  variant={formData.platforms.includes(platform) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-colors",
                    formData.platforms.includes(platform)
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "hover:bg-muted"
                  )}
                  onClick={() => togglePlatform(platform)}
                >
                  {getPlatformLabel(platform, language)}
                </Badge>
              ))}
            </div>
          </div>

          {/* What happened? */}
          <div className="space-y-2">
            <Label>{t("whatHappened", language)}</Label>
            <Textarea
              placeholder={t("whatHappenedPlaceholder", language)}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>

          {/* What did you expect? */}
          <div className="space-y-2">
            <Label>{t("whatExpected", language)}</Label>
            <Textarea
              placeholder={t("whatExpectedPlaceholder", language)}
              value={formData.expectedBehavior}
              onChange={(e) => setFormData((prev) => ({ ...prev, expectedBehavior: e.target.value }))}
              rows={2}
            />
          </div>

          {/* Critical Action Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
            <Label htmlFor="critical" className="cursor-pointer">
              {t("isCritical", language)}
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {formData.isCritical ? t("isCriticalYes", language) : t("isCriticalNo", language)}
              </span>
              <Switch
                id="critical"
                checked={formData.isCritical}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isCritical: checked }))}
              />
            </div>
          </div>

          {/* Affected Users */}
          <div className="space-y-2">
            <Label>{t("affectedUsers", language)}</Label>
            <RadioGroup
              value={formData.affectedUsers}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, affectedUsers: value as "1" | "more_than_1" }))}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="1" id="one" />
                <Label htmlFor="one" className="cursor-pointer font-normal">
                  {t("affectedUsersOne", language)}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="more_than_1" id="more" />
                <Label htmlFor="more" className="cursor-pointer font-normal">
                  {t("affectedUsersMore", language)}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Evidence Upload */}
          <div className="space-y-2">
            <Label>
              {t("evidence", language)}{" "}
              <span className="text-destructive">{t("evidenceRequired", language)}</span>
            </Label>
            <FileUpload
              files={formData.evidence}
              onChange={(files) => setFormData((prev) => ({ ...prev, evidence: files }))}
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label>{t("url", language)}</Label>
            <Input
              type="url"
              placeholder={t("urlPlaceholder", language)}
              value={formData.url}
              onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            />
          </div>

          {/* Affected User ID */}
          <div className="space-y-2">
            <Label>{t("affectedUserId", language)}</Label>
            <Input
              type="text"
              placeholder={t("affectedUserIdPlaceholder", language)}
              value={formData.affectedUserId}
              onChange={(e) => setFormData((prev) => ({ ...prev, affectedUserId: e.target.value }))}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("analyzing", language)}
            </>
          ) : (
            t("submit", language)
          )}
        </Button>
      </form>
    </ScrollArea>
  );
}
