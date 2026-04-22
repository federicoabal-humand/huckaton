"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  AlertCircle, 
  Settings, 
  RefreshCw, 
  CheckCircle, 
  HelpCircle,
  ExternalLink,
  Pencil,
  Paperclip
} from "lucide-react";
import { useLanguage } from "@/lib/hureport/language-context";
import { getModuleLabel, getPlatformLabel } from "@/lib/hureport/translations";
import type { Module, Platform, ClassificationType } from "@/lib/hureport/types";
import { cn } from "@/lib/utils";

interface FormSummary {
  communityName: string;
  module: Module;
  platforms: Platform[];
  fileCount: number;
}

interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  isResult?: boolean;
  resultType?: ClassificationType;
  isDuplicate?: boolean;
}

interface AIChatProps {
  formSummary: FormSummary;
  onEdit: () => void;
  onReset: () => void;
}

const resultConfig: Record<ClassificationType, { 
  icon: typeof AlertCircle; 
  bg: string; 
  text: string;
  labelEs: string;
  labelEn: string;
}> = {
  bug_confirmed: { 
    icon: AlertCircle, 
    bg: "bg-[#FEE2E2]", 
    text: "text-[#991B1B]",
    labelEs: "Inconveniente confirmado",
    labelEn: "Issue confirmed"
  },
  configuration_error: { 
    icon: Settings, 
    bg: "bg-[#FEF3C7]", 
    text: "text-[#92400E]",
    labelEs: "Configuracion",
    labelEn: "Configuration"
  },
  cache_browser: { 
    icon: RefreshCw, 
    bg: "bg-[#DBEAFE]", 
    text: "text-[#1E40AF]",
    labelEs: "Cache o navegador",
    labelEn: "Cache or browser"
  },
  expected_behavior: { 
    icon: CheckCircle, 
    bg: "bg-[#D1FAE5]", 
    text: "text-[#065F46]",
    labelEs: "Comportamiento esperado",
    labelEn: "Expected behavior"
  },
  needs_more_info: { 
    icon: HelpCircle, 
    bg: "bg-[#F3F4F6]", 
    text: "text-[#374151]",
    labelEs: "Mas informacion",
    labelEn: "More information"
  },
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#9CA3AF] [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#9CA3AF] [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#9CA3AF]" />
    </div>
  );
}

function ResultCard({ 
  type, 
  language, 
  isDuplicate,
  onReset 
}: { 
  type: ClassificationType; 
  language: "en" | "es";
  isDuplicate?: boolean;
  onReset: () => void;
}) {
  const config = resultConfig[type];
  const Icon = config.icon;
  const label = language === "es" ? config.labelEs : config.labelEn;

  const getResultContent = () => {
    if (type === "bug_confirmed") {
      if (isDuplicate) {
        return language === "es" 
          ? "Te comento que ya pudimos reproducir este inconveniente, y le hemos compartido esta evidencia a nuestro equipo Tecnico. Estamos trabajando para que quede solucionado cuanto antes."
          : "I wanted to let you know that we've already been able to reproduce this issue, and we've shared this evidence with our Technical team. We're working to get it resolved as soon as possible.";
      }
      return language === "es"
        ? "Hemos confirmado este inconveniente y lo compartimos con nuestro equipo Tecnico. Estamos trabajando para resolverlo lo antes posible."
        : "We've confirmed this issue and shared it with our Technical team. We're working to resolve it as soon as possible.";
    }
    
    if (type === "configuration_error") {
      return language === "es"
        ? "Este problema parece estar relacionado con la configuracion. Sigue estos pasos para resolverlo:"
        : "This issue appears to be configuration-related. Follow these steps to resolve it:";
    }
    
    if (type === "cache_browser") {
      return language === "es"
        ? "Esto parece ser un problema de cache o navegador. Intenta estos pasos:"
        : "This appears to be a cache or browser issue. Try these steps:";
    }
    
    if (type === "expected_behavior") {
      return language === "es"
        ? "Despues de revisar tu reporte, hemos determinado que este es el comportamiento esperado del sistema."
        : "After reviewing your report, we've determined that this is the expected behavior of the system.";
    }
    
    return language === "es"
      ? "Necesitamos mas informacion para diagnosticar este problema correctamente."
      : "We need more information to properly diagnose this issue.";
  };

  const getSteps = () => {
    if (type === "configuration_error") {
      return language === "es" 
        ? [
            "Ve a Configuracion de Admin > Configuracion del Modulo",
            "Encuentra el modulo afectado y haz clic en 'Editar'",
            "Verifica que las opciones esten correctamente configuradas",
            "Guarda los cambios y espera unos minutos"
          ]
        : [
            "Go to Admin Settings > Module Configuration",
            "Find the affected module and click 'Edit'",
            "Verify that options are correctly configured",
            "Save changes and wait a few minutes"
          ];
    }
    if (type === "cache_browser") {
      return language === "es"
        ? [
            "Limpia la cache del navegador (Ctrl+Shift+Delete)",
            "Intenta en una ventana de incognito",
            "Si es en movil, cierra la app completamente y reabre"
          ]
        : [
            "Clear browser cache (Ctrl+Shift+Delete)",
            "Try in an incognito window",
            "If on mobile, force close the app and reopen"
          ];
    }
    return [];
  };

  const steps = getSteps();

  return (
    <div className="w-full rounded-lg border border-[#E5E7EB] bg-white p-4">
      {/* Classification Badge */}
      <div className={cn("mb-3 inline-flex items-center gap-2 rounded-md px-2.5 py-1", config.bg)}>
        <Icon className={cn("h-4 w-4", config.text)} />
        <span className={cn("text-sm font-medium", config.text)}>{label}</span>
      </div>

      {/* Message */}
      <p className="mb-3 text-sm leading-relaxed text-[#374151]">{getResultContent()}</p>

      {/* Steps for configuration/cache */}
      {steps.length > 0 && (
        <ol className="mb-3 space-y-2 pl-1">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-xs font-medium text-white">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      )}

      {/* Success banner for bug confirmed (non-duplicate) */}
      {type === "bug_confirmed" && !isDuplicate && (
        <div className="mb-3 flex items-start gap-2 rounded-md bg-[#D1FAE5] px-3 py-2">
          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#065F46]" />
          <p className="text-sm text-[#065F46]">
            {language === "es" 
              ? "Ticket creado. Podes seguir su estado en 'Mis Reportes'."
              : "Ticket created. You can track its status in 'My Reports'."}
          </p>
        </div>
      )}

      {/* Expected behavior actions */}
      {type === "expected_behavior" && (
        <div className="mb-3 flex flex-col gap-2">
          <button className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2563EB] hover:underline">
            <ExternalLink className="h-3.5 w-3.5" />
            {language === "es" ? "Ver en Help Center" : "View in Help Center"}
          </button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-fit border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]"
          >
            {language === "es" ? "Dejar como feedback para Producto" : "Submit as feedback for Product"}
          </Button>
        </div>
      )}

      {/* Report another link */}
      <button 
        onClick={onReset}
        className="text-sm text-[#6B7280] hover:text-[#374151] hover:underline"
      >
        {language === "es" ? "Reportar otro" : "Report another"}
      </button>
    </div>
  );
}

export function AIChat({ formSummary, onEdit, onReset }: AIChatProps) {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const platformBadges = formSummary.platforms
    .map(p => getPlatformLabel(p, language))
    .join(" / ");

  // Initial AI message on mount
  useEffect(() => {
    const moduleLabel = getModuleLabel(formSummary.module, language);
    const initialMessage = language === "es"
      ? `Hola! Soy HuReport AI. Contame que esta pasando con el modulo de ${moduleLabel}. Que esperabas que pase y que esta pasando en realidad? Si tenes los pasos para reproducirlo, mejor.`
      : `Hi! I'm HuReport AI. Tell me what's happening with the ${moduleLabel} module. What did you expect to happen and what's actually happening? If you have reproduction steps, even better.`;
    
    setIsTyping(true);
    const timer = setTimeout(() => {
      setMessages([{
        id: "1",
        role: "ai",
        content: initialMessage
      }]);
      setIsTyping(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [formSummary.module, language]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 96) + "px";
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setMessageCount(prev => prev + 1);
    setIsTyping(true);

    // Determine response based on message count
    const newCount = messageCount + 1;

    if (newCount === 1) {
      // First response - ask follow-up
      setTimeout(() => {
        const followUp = language === "es"
          ? "Entendido. Esto le pasa solo a vos o a varios admins de la comunidad?"
          : "Got it. Is this happening only to you or to multiple admins in the community?";
        
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "ai",
          content: followUp
        }]);
        setIsTyping(false);
      }, 1500);
    } else {
      // Second response - show result
      setTimeout(() => {
        const userText = input.toLowerCase();
        const isBugKeyword = ["no anda", "no funciona", "error", "bloqueado", "doesn't work", "not working", "broken", "bug"].some(
          keyword => userText.includes(keyword)
        );
        
        const resultType: ClassificationType = isBugKeyword ? "bug_confirmed" : "needs_more_info";
        const isDuplicate = Math.random() > 0.7; // 30% chance of duplicate for demo

        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "ai",
          content: "",
          isResult: true,
          resultType,
          isDuplicate
        }]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasResult = messages.some(m => m.isResult);

  return (
    <div className="flex h-full flex-col">
      {/* Summary Card */}
      <div className="mx-4 mt-4 mb-4 flex items-center justify-between rounded-lg bg-[#F9FAFB] px-3 py-2.5">
        <div className="flex items-center gap-2 text-sm text-[#374151]">
          <span className="font-medium">{formSummary.communityName}</span>
          <span className="text-[#9CA3AF]">·</span>
          <span>{getModuleLabel(formSummary.module, language)}</span>
          <span className="text-[#9CA3AF]">·</span>
          <span className="text-[#6B7280]">{platformBadges}</span>
          <span className="text-[#9CA3AF]">·</span>
          <span className="flex items-center gap-1 text-[#6B7280]">
            <Paperclip className="h-3 w-3" />
            {formSummary.fileCount}
          </span>
        </div>
        <button 
          onClick={onEdit}
          className="text-sm font-medium text-[#2563EB] hover:underline"
        >
          {language === "es" ? "Editar" : "Edit"}
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="space-y-2 pb-4">
          {messages.map((message) => {
            if (message.isResult && message.resultType) {
              return (
                <div key={message.id} className="flex justify-start">
                  <div className="max-w-[85%]">
                    <ResultCard 
                      type={message.resultType} 
                      language={language}
                      isDuplicate={message.isDuplicate}
                      onReset={onReset}
                    />
                  </div>
                </div>
              );
            }

            const isAI = message.role === "ai";
            return (
              <div 
                key={message.id} 
                className={cn("flex", isAI ? "justify-start" : "justify-end")}
              >
                <div 
                  className={cn(
                    "max-w-[85%] px-4 py-2.5 text-sm leading-relaxed",
                    isAI 
                      ? "rounded-xl rounded-bl bg-[#F3F4F6] text-[#111827]"
                      : "rounded-xl rounded-br bg-[#2563EB] text-white"
                  )}
                >
                  {message.content}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-xl rounded-bl bg-[#F3F4F6]">
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      {!hasResult && (
        <div className="border-t border-[#E5E7EB] p-4">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === "es" ? "Escribe tu mensaje..." : "Type your message..."}
              className="min-h-[40px] max-h-24 resize-none border-[#E5E7EB] bg-white text-sm focus-visible:ring-[#2563EB]/20"
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="h-10 w-10 shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#93C5FD]"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
