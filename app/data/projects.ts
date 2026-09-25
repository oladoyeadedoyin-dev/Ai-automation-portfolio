export type Project = {
  id: string;
  number: number;
  title: string;
  category: string;
  description: string;
  image: string;
  alt: string;
  screenshots: {
    src: string;
    alt: string;
  }[];
  flow: string[];
  technologies: string[];
  problem: string;
  system: string;
  outcome: string;
};

export const projects: Project[] = [
  {
    id: "real-estate-lead-management",
    number: 1,
    title: "Real Estate Lead Management",
    category: "Real Estate / Lead Operations",
    description:
      "A workflow that turns incoming website enquiries into structured CRM records and automatically surfaces high-value opportunities.",
    image: "/screenshots/project-01-real-estate/workflow.png",
    alt: "Real Estate Lead Management Automation workflow",
    screenshots: [
      {
        src: "/screenshots/project-01-real-estate/workflow.png",
        alt: "Real Estate lead management n8n workflow",
      },
      {
        src: "/screenshots/project-01-real-estate/crm-logic.png",
        alt: "Real Estate CRM automation logic",
      },
      {
        src: "/screenshots/project-01-real-estate/qualification.png",
        alt: "Real Estate lead qualification workflow",
      },
      {
        src: "/screenshots/project-01-real-estate/telegram-alert.png",
        alt: "Real Estate high-value lead Telegram alert",
      },
    ],
    flow: [
      "Website lead",
      "Webhook",
      "CRM",
      "Qualification",
      "Alert",
    ],
    technologies: [
      "n8n",
      "Google Sheets",
      "Telegram",
      "Webhooks",
    ],
    problem:
      "Incoming leads needed consistent capture and prioritization.",
    system:
      "Automated intake, CRM lookup, duplicate handling, and budget qualification.",
    outcome:
      "High-value leads trigger an immediate Telegram notification.",
  },
];