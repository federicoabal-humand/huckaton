"use client";

import { Bug, Settings, Globe, CheckCircle, AlertCircle, HelpCircle, ExternalLink, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/hureport/language-context";
import { t, getClassificationLabel } from "@/lib/hureport/translations";
import type { AIClassificationResult } from "@/lib/hureport/types";
import { cn } from "@/lib/utils";

interface AIResultProps {
  result: AIClassificationResult;
  onReportAnother: () => void;
}

const classificationConfig = {
  bug_confirmed: {
    icon: Bug,
    bgColor: "bg-red-500/10",
    textColor: "text-red-600",
    borderColor: "border-red-500/20",
  },
  configuration_error: {
    icon: Settings,
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600",
    borderColor: "border-amber-500/20",
  },
  cache_browser: {
    icon: Globe,
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600",
    borderColor: "border-blue-500/20",
  },
  expected_behavior: {
    icon: CheckCircle,
    bgColor: "bg-gray-500/10",
    textColor: "text-gray-600",
    borderColor: "border-gray-500/20",
  },
  needs_more_info: {
    icon: HelpCircle,
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-600",
    borderColor: "border-orange-500/20",
  },
};

export function AIResult({ result, onReportAnother }: AIResultProps) {
  const { language } = useLanguage();
  const config = classificationConfig[result.classification];
  const Icon = config.icon;

  return (
    <div className="space-y-4">
      {/* Classification Badge */}
      <div className={cn("rounded-xl border p-4", config.bgColor, config.borderColor)}>
        <div className="flex items-center gap-3">
          <div className={cn("rounded-full p-2", config.bgColor)}>
            <Icon className={cn("h-5 w-5", config.textColor)} />
          </div>
          <Badge variant="secondary" className={cn("text-sm font-semibold", config.bgColor, config.textColor)}>
            {getClassificationLabel(result.classification, language)}
          </Badge>
        </div>
      </div>

      {/* Explanation */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="leading-relaxed text-foreground">{result.explanation}</p>
      </div>

      {/* Bug Confirmed - Ticket Created */}
      {result.classification === "bug_confirmed" && result.ticketNumber && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
            <div>
              <p className="font-medium text-green-700">{t("ticketCreated", language)}</p>
              <p className="mt-2 font-semibold text-green-800">
                {t("ticketPrefix", language)}-{result.ticketNumber}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions (Configuration Error or Cache/Browser) */}
      {result.instructions && result.instructions.length > 0 && (
        <div className="rounded-xl border border-border bg-muted/50 p-4">
          <ol className="space-y-2">
            {result.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="text-foreground">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Questions (Needs More Info) */}
      {result.questions && result.questions.length > 0 && (
        <div className="space-y-3">
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
              <ul className="space-y-2">
                {result.questions.map((question, index) => (
                  <li key={index} className="text-foreground">
                    • {question}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Button className="w-full bg-orange-500 hover:bg-orange-600">
            {t("submitAdditionalInfo", language)}
          </Button>
        </div>
      )}

      {/* Expected Behavior - Feedback Option */}
      {result.classification === "expected_behavior" && (
        <div className="space-y-3">
          <Button variant="outline" className="w-full gap-2">
            <ExternalLink className="h-4 w-4" />
            {t("viewDocs", language)}
          </Button>
          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <p className="mb-3 text-sm text-foreground">{t("feedbackQuestion", language)}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 gap-2">
                <ThumbsUp className="h-4 w-4" />
                {t("submitFeedback", language)}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Another Issue Button */}
      <Button
        onClick={onReportAnother}
        variant="outline"
        className="w-full"
      >
        {t("reportAnother", language)}
      </Button>
    </div>
  );
}
