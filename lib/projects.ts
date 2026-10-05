export type Category = "Games" | "Automation" | "Newsletter";

export type Project = {
  id: string;
  number: string;
  name: string;
  category: Category;
  badge: string;
  description: string;
  note?: string;
  sections?: string[];
  link?: { href: string; label: string };
};

export const filters = ["All", "Games", "Automation", "Newsletter"] as const;
export type Filter = (typeof filters)[number];

export const projects: Project[] = [
  {
    id: "samewave",
    number: "01",
    name: "Samewave",
    category: "Games",
    badge: "Approved for Handshake Learn Hub",
    description:
      "A cooperative multiplayer party game. Players join a room from separate devices, answer prompts, and discover matching patterns with a visual meter.",
    note: "Tested on laptop and phone",
    link: {
      href: "https://share.gemini.google/6d4QG03xYswz",
      label: "View campaign",
    },
  },
  {
    id: "datebridge",
    number: "02",
    name: "DateBridge",
    category: "Automation",
    badge: "Private workflow",
    description:
      "A connected calendar workflow that brings confirmed events from email into Google Calendar, with verified dates and time zones and duplicate checks.",
  },
  {
    id: "replypilot",
    number: "03",
    name: "ReplyPilot",
    category: "Automation",
    badge: "Private workflow",
    description:
      "A review-first inbox assistant that identifies requests needing attention and proposes replies for individual approval. It does not send mail automatically.",
  },
  {
    id: "ai-builder-weekly",
    number: "04",
    name: "AI Builder Weekly",
    category: "Newsletter",
    badge: "Newsletter workflow",
    description:
      "A weekly newsletter about practical AI agents, developer automation, AWS and cloud AI, and portfolio-building tools.",
    sections: ["New this week", "Try this", "Career signal"],
  },
];
