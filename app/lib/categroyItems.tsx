import { Rocket, Smartphone, BarChart3, Globe, ChefHat, PartyPopper } from "lucide-react";
import { ReactNode } from "react";

interface iAppProps {
  name: string;
  title: string;
  image: ReactNode;
  id: number;
  description?: string;
  slug?: string;
}

// New V1 Categories for the marketplace
export const categoryItems: iAppProps[] = [
  {
    id: 0,
    name: "marketing-landing",
    title: "Marketing & Landing",
    image: <Rocket className="w-6 h-6" />,
    description: "Landing pages, marketing sites, promotional pages",
    slug: "marketing-landing",
  },
  {
    id: 1,
    name: "product-app-ui",
    title: "Product & App UI",
    image: <Smartphone className="w-6 h-6" />,
    description: "Application interfaces, web apps, SaaS products",
    slug: "product-app-ui",
  },
  {
    id: 2,
    name: "dashboard-analytics",
    title: "Dashboard & Analytics",
    image: <BarChart3 className="w-6 h-6" />,
    description: "Admin dashboards, analytics, data visualization",
    slug: "dashboard-analytics",
  },
];

// Legacy categories for backward compatibility
export const legacyCategoryItems: iAppProps[] = [
  {
    id: 0,
    name: "template",
    title: "Template",
    image: <Globe />,
  },
  {
    id: 1,
    name: "uikit",
    title: "Ui Kit",
    image: <ChefHat />,
  },
  {
    id: 2,
    name: "icon",
    title: "Icon",
    image: <PartyPopper />,
  },
];
