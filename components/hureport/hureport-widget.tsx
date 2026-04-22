"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { ReportForm } from "./report-form";
import { ReportsList } from "./reports-list";
import { LanguageProvider, useLanguage } from "@/lib/hureport/language-context";
import { t } from "@/lib/hureport/translations";
import { cn } from "@/lib/utils";

function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-muted p-0.5">
      <button
        onClick={() => setLanguage("en")}
        className={cn(
          "rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
          language === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("es")}
        className={cn(
          "rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
          language === "es"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        ES
      </button>
    </div>
  );
}

function WidgetContent({ onClose }: { onClose: () => void }) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("report");
  
  // For demo purposes, we'll use a mock community ID when viewing reports
  const mockCommunityId = "1";

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <SheetHeader className="flex-shrink-0 border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <AlertTriangle className="h-4 w-4 text-primary-foreground" />
            </div>
            {t("title", language)}
          </SheetTitle>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{t("close", language)}</span>
            </Button>
          </div>
        </div>
      </SheetHeader>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="mx-4 mt-3 grid w-auto grid-cols-2">
          <TabsTrigger value="report">{t("reportTab", language)}</TabsTrigger>
          <TabsTrigger value="my-reports">{t("myReportsTab", language)}</TabsTrigger>
        </TabsList>

        <TabsContent value="report" className="mt-0 flex-1 overflow-hidden">
          <ReportForm />
        </TabsContent>

        <TabsContent value="my-reports" className="mt-0 flex-1 overflow-hidden">
          <ReportsList communityId={mockCommunityId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function HuReportWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <LanguageProvider>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl",
          "before:absolute before:inset-0 before:animate-pulse before:rounded-full before:bg-primary/50 before:blur-md before:-z-10"
        )}
      >
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm">HuReport</span>
      </button>

      {/* Sheet Panel */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="right" 
          className="flex w-full flex-col p-0 sm:max-w-[480px]"
          showCloseButton={false}
        >
          <WidgetContent onClose={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
    </LanguageProvider>
  );
}
