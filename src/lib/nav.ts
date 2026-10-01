import {
  Building2,
  HelpCircle,
  Landmark,
  Newspaper,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Match the active state on nested routes too. */
  prefix?: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Feed", icon: Newspaper },
  { href: "/people", label: "People", icon: Users, prefix: "/people" },
  { href: "/companies", label: "Companies", icon: Building2, prefix: "/companies" },
  { href: "/projects", label: "Projects", icon: Landmark, prefix: "/projects" },
  { href: "/needs", label: "Needs & Help", icon: HelpCircle, prefix: "/needs" },
  { href: "/profile", label: "My Profile", icon: UserRound, prefix: "/profile" },
];

export function isActive(pathname: string, item: NavItem) {
  if (item.href === "/") return pathname === "/";
  return item.prefix ? pathname.startsWith(item.prefix) : pathname === item.href;
}
