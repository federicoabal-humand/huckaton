export type Language = "en" | "es";

export type Module =
  | "users"
  | "segmentation"
  | "work_schedules"
  | "attendance"
  | "news"
  | "knowledge"
  | "forms"
  | "surveys"
  | "people_experience"
  | "learning"
  | "service_management"
  | "onboarding"
  | "files"
  | "personal_documents"
  | "quick_access"
  | "time_off"
  | "performance"
  | "goals"
  | "communication"
  | "acknowledgements"
  | "groups"
  | "feed"
  | "chats"
  | "events"
  | "org_chart"
  | "profile"
  | "marketplace"
  | "integrations"
  | "notifications"
  | "widgets"
  | "workflows"
  | "general";

export type Platform = "admin_web" | "web_app" | "mobile_app" | "api";

export type ClassificationType =
  | "bug_confirmed"
  | "configuration_error"
  | "cache_browser"
  | "expected_behavior"
  | "needs_more_info";

export type TicketStatus =
  | "reported"
  | "under_review"
  | "developing_fix"
  | "resolved";

export interface Client {
  id: string;
  name: string;
  instanceId: string;
  country: string;
  cxOwner: string;
}

export interface Report {
  id: string;
  ticketNumber: number;
  communityId: string;
  module: Module;
  platforms: Platform[];
  description: string;
  expectedBehavior: string;
  isCritical: boolean;
  affectedUsers: "1" | "more_than_1";
  evidence: EvidenceFile[];
  url?: string;
  affectedUserId?: string;
  status: TicketStatus;
  classification?: ClassificationType;
  aiExplanation?: string;
  createdAt: Date;
  summary?: string;
}

export interface EvidenceFile {
  id: string;
  name: string;
  url: string;
  type: "image" | "video";
}

export interface AIClassificationResult {
  classification: ClassificationType;
  explanation: string;
  ticketNumber?: number;
  instructions?: string[];
  questions?: string[];
}

export interface ReportFormData {
  communityId: string;
  module: Module | "";
  platforms: Platform[];
  description: string;
  expectedBehavior: string;
  isCritical: boolean;
  affectedUsers: "1" | "more_than_1";
  evidence: File[];
  url: string;
  affectedUserId: string;
}
