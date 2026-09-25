 export type Project = {
  id: string;
  number: number;
  title: string;
  category: string;
  description: string;
  image: string;
  alt: string;
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