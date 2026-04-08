"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Bell, ChevronRight, LogOut, Search, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { formatBreadcrumbSegment, getInitials } from "@/lib/utils";
import { useSidebar } from "./SidebarProvider";

export function Header() {
  const pathname = usePathname();
  const { collapsed } = useSidebar();
  const { data: session } = useSession();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/dashboard" className="font-medium text-slate-600 transition-colors hover:text-slate-900">
              Workspace
            </Link>
            {segments.map((segment) => (
              <span key={segment} className="flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="font-medium text-slate-900">{formatBreadcrumbSegment(segment)}</span>
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500">Mountain View Dental Care local SEO command center</p>
        </div>

        <div className="flex items-center gap-3">
          <div className={collapsed ? "hidden md:block md:w-60" : "hidden md:block md:w-80"}>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input className="border-slate-200 bg-slate-50 pl-9" placeholder="Search locations, keywords, reports..." />
            </div>
          </div>

          <button className="relative rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white">
              8
            </span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={session?.user?.image ?? undefined} alt={session?.user?.name ?? "User avatar"} />
                  <AvatarFallback className="bg-slate-100 text-slate-700">
                    {getInitials(session?.user?.name, session?.user?.email)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{session?.user?.name ?? "Demo Admin"}</p>
                  <p className="text-xs text-slate-500">{session?.user?.email ?? "demo@localseo.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
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
        </div>
      </div>
    </header>
  );
}
