import type { Language, Module, Platform, ClassificationType, TicketStatus } from "./types";

type TranslationKey =
  | "title"
  | "reportTab"
  | "myReportsTab"
  | "clientInfo"
  | "community"
  | "communityPlaceholder"
  | "instanceId"
  | "country"
  | "cxOwner"
  | "issueDetails"
  | "module"
  | "modulePlaceholder"
  | "platform"
  | "platformPlaceholder"
  | "whatHappened"
  | "whatHappenedPlaceholder"
  | "whatExpected"
  | "whatExpectedPlaceholder"
  | "isCritical"
  | "isCriticalYes"
  | "isCriticalNo"
  | "affectedUsers"
  | "affectedUsersOne"
  | "affectedUsersMore"
  | "evidence"
  | "evidencePlaceholder"
  | "evidenceRequired"
  | "url"
  | "urlPlaceholder"
  | "affectedUserId"
  | "affectedUserIdPlaceholder"
  | "submit"
  | "submitting"
  | "analyzing"
  | "reportAnother"
  | "noReports"
  | "addMoreInfo"
  | "viewDocs"
  | "submitFeedback"
  | "feedbackQuestion"
  | "ticketCreated"
  | "ticketPrefix"
  | "submitAdditionalInfo"
  | "close"
  | "dropFiles"
  | "orBrowse";

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    title: "HuReport AI",
    reportTab: "Report",
    myReportsTab: "My Reports",
    clientInfo: "Client Info",
    community: "Community",
    communityPlaceholder: "Search for a community...",
    instanceId: "Instance ID",
    country: "Country",
    cxOwner: "CX Owner",
    issueDetails: "Issue Details",
    module: "Module",
    modulePlaceholder: "Select a module...",
    platform: "Platform",
    platformPlaceholder: "Select platforms...",
    whatHappened: "What happened?",
    whatHappenedPlaceholder: "Describe the issue in detail...",
    whatExpected: "What did you expect?",
    whatExpectedPlaceholder: "Describe the expected behavior...",
    isCritical: "Does this block a critical action?",
    isCriticalYes: "Yes",
    isCriticalNo: "No",
    affectedUsers: "How many users affected?",
    affectedUsersOne: "1",
    affectedUsersMore: "More than 1",
    evidence: "Evidence",
    evidencePlaceholder: "Drag & drop images or videos here",
    evidenceRequired: "(Required)",
    url: "URL where issue occurs",
    urlPlaceholder: "https://example.com/page",
    affectedUserId: "Affected user email/ID",
    affectedUserIdPlaceholder: "user@example.com or user ID",
    submit: "Analyze & Report",
    submitting: "Submitting...",
    analyzing: "AI is analyzing...",
    reportAnother: "Report another issue",
    noReports: "No reports yet. Use the Report tab to submit your first issue.",
    addMoreInfo: "Add more information",
    viewDocs: "View documentation",
    submitFeedback: "Submit as feedback",
    feedbackQuestion: "Would you like to submit this as feedback for our Product team?",
    ticketCreated: "We've confirmed this issue and shared it with our Technical team. We're working to resolve it ASAP.",
    ticketPrefix: "Ticket",
    submitAdditionalInfo: "Submit additional info",
    close: "Close",
    dropFiles: "Drop files here",
    orBrowse: "or click to browse",
  },
  es: {
    title: "HuReport AI",
    reportTab: "Reportar",
    myReportsTab: "Mis Reportes",
    clientInfo: "Info del Cliente",
    community: "Comunidad",
    communityPlaceholder: "Buscar una comunidad...",
    instanceId: "ID de Instancia",
    country: "País",
    cxOwner: "Responsable CX",
    issueDetails: "Detalles del Problema",
    module: "Módulo",
    modulePlaceholder: "Selecciona un módulo...",
    platform: "Plataforma",
    platformPlaceholder: "Selecciona plataformas...",
    whatHappened: "¿Qué sucedió?",
    whatHappenedPlaceholder: "Describe el problema en detalle...",
    whatExpected: "¿Qué esperabas?",
    whatExpectedPlaceholder: "Describe el comportamiento esperado...",
    isCritical: "¿Esto bloquea una acción crítica?",
    isCriticalYes: "Sí",
    isCriticalNo: "No",
    affectedUsers: "¿Cuántos usuarios afectados?",
    affectedUsersOne: "1",
    affectedUsersMore: "Más de 1",
    evidence: "Evidencia",
    evidencePlaceholder: "Arrastra y suelta imágenes o videos aquí",
    evidenceRequired: "(Requerido)",
    url: "URL donde ocurre el problema",
    urlPlaceholder: "https://ejemplo.com/pagina",
    affectedUserId: "Email/ID del usuario afectado",
    affectedUserIdPlaceholder: "usuario@ejemplo.com o ID de usuario",
    submit: "Analizar y Reportar",
    submitting: "Enviando...",
    analyzing: "IA analizando...",
    reportAnother: "Reportar otro problema",
    noReports: "Sin reportes aún. Usa la pestaña Reportar para enviar tu primer problema.",
    addMoreInfo: "Agregar más información",
    viewDocs: "Ver documentación",
    submitFeedback: "Enviar como feedback",
    feedbackQuestion: "¿Te gustaría enviar esto como feedback para nuestro equipo de Producto?",
    ticketCreated: "Hemos confirmado este problema y lo compartimos con nuestro equipo Técnico. Estamos trabajando para resolverlo lo antes posible.",
    ticketPrefix: "Ticket",
    submitAdditionalInfo: "Enviar info adicional",
    close: "Cerrar",
    dropFiles: "Suelta archivos aquí",
    orBrowse: "o haz clic para explorar",
  },
};

const moduleLabels: Record<Language, Record<Module, string>> = {
  en: {
    users: "Users",
    segmentation: "Segmentation",
    work_schedules: "Work schedules",
    attendance: "Attendance",
    news: "News",
    knowledge: "Knowledge libraries",
    forms: "Forms & Procedures",
    surveys: "Surveys",
    people_experience: "People Experience",
    learning: "Learning",
    service_management: "Service Management",
    onboarding: "Onboarding",
    files: "Files",
    personal_documents: "Personal documents",
    quick_access: "Quick access",
    time_off: "Time Off",
    performance: "Performance Review",
    goals: "Goals",
    communication: "Communication",
    acknowledgements: "Acknowledgements",
    groups: "Groups",
    feed: "Feed",
    chats: "Chats",
    events: "Events",
    org_chart: "Org Chart",
    profile: "Profile",
    marketplace: "Marketplace",
    integrations: "Integrations",
    notifications: "Notifications",
    widgets: "Widgets",
    workflows: "Workflows",
    general: "General",
  },
  es: {
    users: "Usuarios",
    segmentation: "Segmentación",
    work_schedules: "Horarios laborales",
    attendance: "Control de asistencia",
    news: "Noticias",
    knowledge: "Librerías de conocimiento",
    forms: "Formularios y Trámites",
    surveys: "Encuestas",
    people_experience: "People Experience",
    learning: "Aprendizaje",
    service_management: "Gestión de servicios",
    onboarding: "Onboarding",
    files: "Archivos",
    personal_documents: "Documentos personales",
    quick_access: "Accesos rápidos",
    time_off: "Vacaciones y permisos",
    performance: "Desempeño",
    goals: "Objetivos",
    communication: "Comunicación",
    acknowledgements: "Reconocimientos",
    groups: "Grupos",
    feed: "Feed",
    chats: "Chats",
    events: "Eventos",
    org_chart: "Organigrama",
    profile: "Perfil",
    marketplace: "Marketplace",
    integrations: "Integraciones",
    notifications: "Notificaciones",
    widgets: "Widgets",
    workflows: "Workflows",
    general: "General",
  },
};

const platformLabels: Record<Language, Record<Platform, string>> = {
  en: {
    admin_web: "Admin Web",
    web_app: "Web App",
    mobile_app: "Mobile App",
    api: "API",
  },
  es: {
    admin_web: "Admin Web",
    web_app: "Web App",
    mobile_app: "App Móvil",
    api: "API",
  },
};

const classificationLabels: Record<Language, Record<ClassificationType, string>> = {
  en: {
    bug_confirmed: "Bug confirmed",
    configuration_error: "Configuration error",
    cache_browser: "Cache/Browser issue",
    expected_behavior: "Expected behavior",
    needs_more_info: "Needs more info",
  },
  es: {
    bug_confirmed: "Bug confirmado",
    configuration_error: "Error de configuración",
    cache_browser: "Problema de caché/navegador",
    expected_behavior: "Comportamiento esperado",
    needs_more_info: "Se necesita más información",
  },
};

const statusLabels: Record<Language, Record<TicketStatus, string>> = {
  en: {
    reported: "Reported",
    under_review: "Under review",
    developing_fix: "Developing fix",
    resolved: "Resolved",
  },
  es: {
    reported: "Reportado",
    under_review: "En revisión",
    developing_fix: "Desarrollando solución",
    resolved: "Resuelto",
  },
};

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang][key];
}

export function getModuleLabel(module: Module, lang: Language): string {
  return moduleLabels[lang][module];
}

export function getPlatformLabel(platform: Platform, lang: Language): string {
  return platformLabels[lang][platform];
}

export function getClassificationLabel(classification: ClassificationType, lang: Language): string {
  return classificationLabels[lang][classification];
}

export function getStatusLabel(status: TicketStatus, lang: Language): string {
  return statusLabels[lang][status];
}

export function getAllModules(): Module[] {
  return Object.keys(moduleLabels.en) as Module[];
}

export function getAllPlatforms(): Platform[] {
  return Object.keys(platformLabels.en) as Platform[];
}
