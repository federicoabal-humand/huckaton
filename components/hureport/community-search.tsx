"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, User, Hash, X } from "lucide-react";
import { searchClients, getClientById } from "@/lib/hureport/mock-data";
import { useLanguage } from "@/lib/hureport/language-context";
import { t } from "@/lib/hureport/translations";
import type { Client } from "@/lib/hureport/types";
import { cn } from "@/lib/utils";

interface CommunitySearchProps {
  value: string;
  onChange: (clientId: string) => void;
}

export function CommunitySearch({ value, onChange }: CommunitySearchProps) {
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Client[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedClient = value ? getClientById(value) : null;

  useEffect(() => {
    if (query.length > 0) {
      setResults(searchClients(query));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (client: Client) => {
    onChange(client.id);
    setQuery("");
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setQuery("");
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-foreground">
        {t("community", language)}
      </Label>
      
      <div ref={containerRef} className="relative">
        {!selectedClient ? (
          <>
            <Input
              type="text"
              placeholder={t("communityPlaceholder", language)}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
            />
            
            {isOpen && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-popover shadow-lg">
                {results.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => handleSelect(client)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent"
                  >
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.instanceId}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">{selectedClient.name}</span>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="rounded-full p-1 transition-colors hover:bg-muted"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1.5 bg-background text-foreground">
                <Hash className="h-3 w-3" />
                {t("instanceId", language)}: {selectedClient.instanceId}
              </Badge>
              <Badge variant="secondary" className="gap-1.5 bg-background text-foreground">
                <MapPin className="h-3 w-3" />
                {t("country", language)}: {selectedClient.country}
              </Badge>
              <Badge variant="secondary" className="gap-1.5 bg-background text-foreground">
                <User className="h-3 w-3" />
                {t("cxOwner", language)}: {selectedClient.cxOwner}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
