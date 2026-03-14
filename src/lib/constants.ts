export type ConfidenceLevel =
  | "verified"
  | "high"
  | "moderate"
  | "low"
  | "unverified";

export const CONFIDENCE_LEVELS: Record<
  ConfidenceLevel,
  { label: string; color: string; bgClass: string }
> = {
  verified: {
    label: "Verified",
    color: "#10B981",
    bgClass: "confidence-verified",
  },
  high: {
    label: "High Confidence",
    color: "#2563EB",
    bgClass: "confidence-high",
  },
  moderate: {
    label: "Moderate",
    color: "#D97706",
    bgClass: "confidence-moderate",
  },
  low: {
    label: "Low Confidence",
    color: "#EF4444",
    bgClass: "confidence-low",
  },
  unverified: {
    label: "Unverified",
    color: "#64748B",
    bgClass: "confidence-unverified",
  },
};

export interface Lens {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

export const LENSES: Lens[] = [
  {
    name: "Discover",
    slug: "discover",
    description: "General discovery engine — surface hidden connections across all domains",
    icon: "Search",
    color: "#2563EB",
  },
  {
    name: "Cold Cases",
    slug: "cold-cases",
    description: "Unsolved mysteries, missing persons, and forensic breakthroughs",
    icon: "Fingerprint",
    color: "#EF4444",
  },
  {
    name: "Deep Ocean",
    slug: "deep-ocean",
    description: "Underwater anomalies, shipwrecks, and ocean floor discoveries",
    icon: "Waves",
    color: "#0EA5E9",
  },
  {
    name: "Buried",
    slug: "buried",
    description: "Archaeological finds, lost civilizations, and hidden history",
    icon: "Landmark",
    color: "#F59E0B",
  },
  {
    name: "Declassified",
    slug: "declassified",
    description: "Government secrets, leaked documents, and exposed operations",
    icon: "ShieldAlert",
    color: "#8B5CF6",
  },
  {
    name: "Science",
    slug: "science",
    description: "Cure accelerator — medical breakthroughs, clinical trials, and emerging therapies",
    icon: "FlaskConical",
    color: "#10B981",
  },
  {
    name: "Public",
    slug: "public",
    description: "Public knowledge base — verified answers to common questions",
    icon: "BookOpen",
    color: "#6366F1",
  },
];

export const SEARCH_CATEGORIES = [
  { value: "all", label: "All Lenses" },
  { value: "discover", label: "Discover" },
  { value: "cold-cases", label: "Cold Cases" },
  { value: "deep-ocean", label: "Deep Ocean" },
  { value: "buried", label: "Buried" },
  { value: "declassified", label: "Declassified" },
  { value: "science", label: "Science" },
  { value: "public", label: "Public Knowledge" },
] as const;
