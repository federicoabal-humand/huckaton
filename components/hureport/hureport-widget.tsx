"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";
import { ReportForm } from "./report-form";
import { ReportsList } from "./reports-list";
import { LanguageProvider, useLanguage } from "@/lib/hureport/language-context";
import { t } from "@/lib/hureport/translations";
import { cn } from "@/lib/utils";

function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center text-xs">
      <button
        onClick={() => setLanguage("en")}
        className={cn(
          "transition-colors duration-150 ease-out",
          language === "en"
            ? "font-semibold text-[#2563EB]"
            : "font-normal text-[#6B7280] hover:text-[#374151]"
        )}
      >
        EN
      </button>
      <span className="mx-1.5 text-[#D1D5DB]">|</span>
      <button
        onClick={() => setLanguage("es")}
        className={cn(
          "transition-colors duration-150 ease-out",
          language === "es"
            ? "font-semibold text-[#2563EB]"
            : "font-normal text-[#6B7280] hover:text-[#374151]"
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
  
  const mockCommunityId = "1";

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <SheetHeader className="flex-shrink-0 border-b border-[#E5E7EB] px-4 py-3">
        <div className="flex items-center justify-between">
          <SheetTitle className="flex items-center gap-2.5 text-base font-semibold text-[#111827]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
            {t("title", language)}
          </SheetTitle>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6]"
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
        <div className="border-b border-[#E5E7EB] px-4">
          <TabsList className="h-auto w-full justify-start gap-6 bg-transparent p-0">
            <TabsTrigger 
              value="report" 
              className={cn(
                "relative rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-3 text-sm font-medium transition-colors duration-150 ease-out",
                "data-[state=active]:border-[#2563EB] data-[state=active]:text-[#2563EB] data-[state=active]:shadow-none",
                "data-[state=inactive]:text-[#6B7280] data-[state=inactive]:hover:text-[#374151]"
              )}
            >
              {t("reportTab", language)}
            </TabsTrigger>
            <TabsTrigger 
              value="my-reports"
              className={cn(
                "relative rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-3 text-sm font-medium transition-colors duration-150 ease-out",
                "data-[state=active]:border-[#2563EB] data-[state=active]:text-[#2563EB] data-[state=active]:shadow-none",
                "data-[state=inactive]:text-[#6B7280] data-[state=inactive]:hover:text-[#374151]"
              )}
            >
              {t("myReportsTab", language)}
            </TabsTrigger>
          </TabsList>
        </div>

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
        className="fixed right-4 top-4 z-50 flex h-9 items-center gap-2 rounded-full bg-[#2563EB] px-4 font-medium text-white shadow-sm transition-colors duration-150 ease-out hover:bg-[#1D4ED8]"
      >
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">HuReport</span>
      </button>

      {/* Sheet Panel */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="right" 
          className="flex w-full flex-col bg-white p-0 shadow-xl sm:max-w-[480px] duration-200 ease-out data-[state=closed]:duration-200"
          showCloseButton={false}
        >
          <WidgetContent onClose={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
    </LanguageProvider>
  );
}
