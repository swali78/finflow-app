"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, List, Plus, TrendingUp, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/transactions", label: "Ledger", icon: List },
    { href: "/transactions/create", label: "Add", icon: Plus, isAction: true },
    { href: "/insights", label: "Insights", icon: TrendingUp },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-black/80 backdrop-blur-lg border-t border-white/10 pb-6 pt-3 md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        if (item.isAction) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-center -mt-8"
            >
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black shadow-lg shadow-white/10 border-4 border-black">
                <Icon size={28} strokeWidth={3} />
              </div>
            </Link>
          )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
