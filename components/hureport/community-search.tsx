"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Building2, X } from "lucide-react";
import { searchClients, getClientById } from "@/lib/hureport/mock-data";
import { useLanguage } from "@/lib/hureport/language-context";
import { t } from "@/lib/hureport/translations";
import type { Client } from "@/lib/hureport/types";

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
    <div ref={containerRef} className="relative">
      {!selectedClient ? (
        <>
          <Input
            type="text"
            placeholder={t("communityPlaceholder", language)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-[#E5E7EB] bg-white focus-visible:ring-[#2563EB]/20"
          />
          
          {isOpen && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-[#E5E7EB] bg-white shadow-lg">
              {results.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => handleSelect(client)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ease-out hover:bg-[#F9FAFB]"
                >
                  <Building2 className="h-4 w-4 text-[#6B7280]" />
                  <div>
                    <p className="font-medium text-[#111827]">{client.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F4F6] px-3 py-1.5 text-sm text-[#374151]">
            {selectedClient.name}
            <button
              type="button"
              onClick={handleClear}
              className="ml-1 rounded-full p-0.5 transition-colors duration-150 ease-out hover:bg-[#E5E7EB]"
            >
              <X className="h-3 w-3 text-[#6B7280]" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
