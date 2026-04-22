import type { Client, Report, AIClassificationResult, ClassificationType } from "./types";

export const mockClients: Client[] = [
  {
    id: "1",
    name: "Acme Corporation",
    instanceId: "acme-corp-2024",
    country: "United States",
    cxOwner: "Sarah Johnson",
  },
  {
    id: "2",
    name: "TechStart Inc",
    instanceId: "techstart-2024",
    country: "Canada",
    cxOwner: "Michael Chen",
  },
  {
    id: "3",
    name: "Global Finance Ltd",
    instanceId: "globalfin-2024",
    country: "United Kingdom",
    cxOwner: "Emma Williams",
  },
  {
    id: "4",
    name: "Innovate Labs",
    instanceId: "innovatelabs-2024",
    country: "Germany",
    cxOwner: "Hans Mueller",
  },
  {
    id: "5",
    name: "Retail Plus SA",
    instanceId: "retailplus-2024",
    country: "Argentina",
    cxOwner: "María García",
  },
];

export const mockReports: Report[] = [
  {
    id: "1",
    ticketNumber: 1,
    communityId: "1",
    module: "attendance",
    platforms: ["admin_web", "mobile_app"],
    description: "Users cannot clock in via the mobile app. The button appears grayed out and shows 'Service unavailable' when tapped.",
    expectedBehavior: "Users should be able to clock in by tapping the button.",
    isCritical: true,
    affectedUsers: "more_than_1",
    evidence: [
      { id: "e1", name: "screenshot1.png", url: "/placeholder.jpg", type: "image" },
    ],
    url: "https://app.humand.co/attendance",
    status: "developing_fix",
    classification: "bug_confirmed",
    aiExplanation: "We've identified a server-side issue affecting the attendance clock-in functionality. Our engineering team is actively working on a fix.",
    createdAt: new Date("2024-01-15"),
    summary: "Mobile app clock-in button not working",
  },
  {
    id: "2",
    ticketNumber: 2,
    communityId: "1",
    module: "users",
    platforms: ["admin_web"],
    description: "When exporting user list to CSV, some special characters in names appear corrupted.",
    expectedBehavior: "Special characters should be properly encoded in the CSV export.",
    isCritical: false,
    affectedUsers: "1",
    evidence: [
      { id: "e2", name: "export_issue.png", url: "/placeholder.jpg", type: "image" },
    ],
    status: "under_review",
    classification: "bug_confirmed",
    aiExplanation: "This appears to be an encoding issue in the CSV export functionality. We're investigating the root cause.",
    createdAt: new Date("2024-01-18"),
    summary: "CSV export encoding issues",
  },
  {
    id: "3",
    ticketNumber: 3,
    communityId: "1",
    module: "news",
    platforms: ["web_app"],
    description: "News articles don't show up for some segments even though they're configured correctly.",
    expectedBehavior: "All configured segments should see the news articles.",
    isCritical: false,
    affectedUsers: "more_than_1",
    evidence: [
      { id: "e3", name: "segmentation.png", url: "/placeholder.jpg", type: "image" },
    ],
    status: "resolved",
    classification: "configuration_error",
    aiExplanation: "The segmentation rules had a conflict. We've updated the configuration guide to prevent this in the future.",
    createdAt: new Date("2024-01-10"),
    summary: "News not visible to some segments",
  },
  {
    id: "4",
    ticketNumber: 4,
    communityId: "1",
    module: "learning",
    platforms: ["mobile_app"],
    description: "Videos in learning courses don't play on iOS devices.",
    expectedBehavior: "Videos should play on all supported devices.",
    isCritical: true,
    affectedUsers: "more_than_1",
    evidence: [
      { id: "e4", name: "video_issue.mp4", url: "/placeholder.jpg", type: "video" },
    ],
    status: "reported",
    classification: "bug_confirmed",
    aiExplanation: "We've confirmed this issue with iOS video playback. Our team is prioritizing a fix.",
    createdAt: new Date("2024-01-20"),
    summary: "iOS video playback issue in learning",
  },
];

// Simulated AI classification responses
const mockAIResponses: Record<ClassificationType, (ticketNum: number, lang: "en" | "es") => AIClassificationResult> = {
  bug_confirmed: (ticketNum, lang) => ({
    classification: "bug_confirmed",
    explanation: lang === "en" 
      ? "We've analyzed your report and confirmed this is a bug in our system. Our engineering team has been notified and will prioritize fixing this issue."
      : "Hemos analizado tu reporte y confirmado que es un bug en nuestro sistema. Nuestro equipo de ingeniería ha sido notificado y priorizará la solución de este problema.",
    ticketNumber: ticketNum,
  }),
  configuration_error: (_, lang) => ({
    classification: "configuration_error",
    explanation: lang === "en"
      ? "We've identified that this issue is related to a configuration setting. You can resolve it by following these steps:"
      : "Hemos identificado que este problema está relacionado con una configuración. Puedes resolverlo siguiendo estos pasos:",
    instructions: lang === "en" 
      ? [
          "Go to Admin Settings > Module Configuration",
          "Find the affected module and click 'Edit'",
          "Check the 'Enable for all segments' option",
          "Save your changes and wait 5 minutes for the cache to refresh",
        ]
      : [
          "Ve a Configuración de Admin > Configuración de Módulo",
          "Encuentra el módulo afectado y haz clic en 'Editar'",
          "Marca la opción 'Habilitar para todos los segmentos'",
          "Guarda los cambios y espera 5 minutos para que se actualice la caché",
        ],
  }),
  cache_browser: (_, lang) => ({
    classification: "cache_browser",
    explanation: lang === "en"
      ? "This appears to be a cache or browser-related issue. Please try the following steps to resolve it:"
      : "Esto parece ser un problema de caché o navegador. Por favor intenta los siguientes pasos para resolverlo:",
    instructions: lang === "en"
      ? [
          "Clear your browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)",
          "Try opening the page in an incognito/private window",
          "If on mobile, try force-closing the app and reopening",
          "If the issue persists, try a different browser or device",
        ]
      : [
          "Limpia la caché de tu navegador (Ctrl+Shift+Delete o Cmd+Shift+Delete)",
          "Intenta abrir la página en una ventana de incógnito/privada",
          "Si estás en móvil, intenta cerrar la app completamente y reabrirla",
          "Si el problema persiste, intenta con otro navegador o dispositivo",
        ],
  }),
  expected_behavior: (_, lang) => ({
    classification: "expected_behavior",
    explanation: lang === "en"
      ? "After reviewing your report, we've determined that this is actually the expected behavior of the system. This feature was designed this way to ensure data integrity and security. We understand this might not be intuitive, and we're always looking to improve the user experience."
      : "Después de revisar tu reporte, hemos determinado que este es en realidad el comportamiento esperado del sistema. Esta función fue diseñada así para asegurar la integridad de los datos y la seguridad. Entendemos que esto podría no ser intuitivo, y siempre buscamos mejorar la experiencia del usuario.",
  }),
  needs_more_info: (_, lang) => ({
    classification: "needs_more_info",
    explanation: lang === "en"
      ? "We need some additional information to properly diagnose this issue. Please provide the following details:"
      : "Necesitamos información adicional para diagnosticar correctamente este problema. Por favor proporciona los siguientes detalles:",
    questions: lang === "en"
      ? [
          "What browser and version are you using?",
          "Does this happen consistently or intermittently?",
          "Have you tried this on a different device?",
          "When did you first notice this issue?",
        ]
      : [
          "¿Qué navegador y versión estás usando?",
          "¿Esto sucede consistentemente o de forma intermitente?",
          "¿Has intentado esto en un dispositivo diferente?",
          "¿Cuándo notaste este problema por primera vez?",
        ],
  }),
};

export function simulateAIClassification(lang: "en" | "es"): Promise<AIClassificationResult> {
  // Randomly select a classification for demo purposes
  const classifications: ClassificationType[] = [
    "bug_confirmed",
    "configuration_error",
    "cache_browser",
    "expected_behavior",
    "needs_more_info",
  ];
  
  const randomClassification = classifications[Math.floor(Math.random() * classifications.length)];
  const ticketNum = Math.floor(Math.random() * 1000) + 5;
  
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve(mockAIResponses[randomClassification](ticketNum, lang));
    }, 2000);
  });
}

export function searchClients(query: string): Client[] {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(lowerQuery) ||
      client.instanceId.toLowerCase().includes(lowerQuery)
  );
}

export function getClientById(id: string): Client | undefined {
  return mockClients.find((client) => client.id === id);
}

export function getReportsByCommunity(communityId: string): Report[] {
  return mockReports.filter((report) => report.communityId === communityId);
}
