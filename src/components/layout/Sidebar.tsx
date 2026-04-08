"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  FileBarChart,
  Globe,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Store,
  Swords,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib/utils";
import type { SidebarNavItem } from "@/types";
import { useSidebar } from "./SidebarProvider";
import { SidebarItem } from "./SidebarItem";

const mainNav: SidebarNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "GMB Manager", href: "/gmb", icon: Store, badge: 3 },
  { label: "Keywords", href: "/keywords", icon: Search, badge: 12 },
  { label: "Competitors", href: "/competitors", icon: Swords },
  { label: "Citations", href: "/citations", icon: Globe, badge: 5 },
  { label: "Reports", href: "/reports", icon: FileBarChart },
];

const bottomNav: SidebarNavItem[] = [
  { label: "Notifications", href: "/notifications", icon: Bell, badge: 8 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();
  const { data: session } = useSession();

  const isActive = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex min-h-screen shrink-0 flex-col overflow-hidden border-r border-slate-800 bg-slate-900"
    >
      <div className="flex h-16 items-center border-b border-slate-800 px-4">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400">
            <Store className="h-5 w-5" />
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Local SEO HQ</p>
              <p className="truncate text-xs text-slate-400">GMB growth platform</p>
            </div>
          ) : null}
        </Link>
      </div>

      <ScrollArea className="flex-1">
        <nav className="space-y-2 px-0 py-6">
          {mainNav.map((item) => (
            <SidebarItem key={item.href} {...item} active={isActive(item.href)} collapsed={collapsed} />
          ))}

          <div className="px-4 py-4">
            <Separator className="bg-slate-800" />
          </div>

          {bottomNav.map((item) => (
            <SidebarItem key={item.href} {...item} active={isActive(item.href)} collapsed={collapsed} />
          ))}
        </nav>
      </ScrollArea>

      <div className="mt-auto border-t border-slate-800 p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <Avatar className="h-10 w-10 border border-slate-700">
                <AvatarImage src={session?.user?.image ?? undefined} alt={session?.user?.name ?? "User avatar"} />
                <AvatarFallback className="bg-slate-800 text-slate-100">
                  {getInitials(session?.user?.name, session?.user?.email)}
                </AvatarFallback>
              </Avatar>
              {!collapsed ? (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{session?.user?.name ?? "Demo Admin"}</p>
                  <p className="truncate text-xs text-slate-400">{session?.user?.email ?? "demo@localseo.com"}</p>
                </div>
              ) : null}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{session?.user?.email ?? "demo@localseo.com"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/auth/signin" })}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={toggle}
          className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-800/80 py-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
