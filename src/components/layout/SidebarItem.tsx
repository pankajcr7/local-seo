"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { SidebarNavItem } from "@/types";
import { cn } from "@/lib/utils";

type SidebarItemProps = SidebarNavItem & {
  active: boolean;
  collapsed: boolean;
};

export function SidebarItem({ label, href, icon: Icon, badge, active, collapsed }: SidebarItemProps) {
  const link = (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-r-xl border-l-2 border-transparent px-4 py-3 text-sm font-medium transition-colors",
        collapsed ? "justify-center px-0" : "justify-start",
        active
          ? "border-blue-500 bg-blue-600/10 text-blue-500"
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
      )}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <Icon className="h-5 w-5" />
        {collapsed && badge ? <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-blue-500" /> : null}
      </span>
      {!collapsed ? <span className="truncate">{label}</span> : null}
      {!collapsed && badge ? (
        <Badge variant="secondary" className="ml-auto border-0 bg-blue-500/15 text-blue-400">
          {badge}
        </Badge>
      ) : null}
    </Link>
  );

  if (!collapsed) {
    return link;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
