"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export interface MenuBarItem {
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element
  label: string
  href?: string
  onClick?: () => void
  ariaLabel?: string
}

interface MenuBarProps {
  items: MenuBarItem[]
  activeHref?: string
  className?: string
}

function MenuBarButton({ item, isActive, onHover, onLeave }: {
  item: MenuBarItem
  isActive: boolean
  onHover: () => void
  onLeave: () => void
}) {
  const commonClassName = `p-2 rounded-full transition-colors ${
    isActive ? "bg-amber-500/15 text-amber-500" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
  }`

  if (item.href) {
    return (
      <Link
        href={item.href}
        aria-label={item.ariaLabel ?? item.label}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className={commonClassName}
      >
        <item.icon className="w-5 h-5" />
      </Link>
    )
  }

  return (
    <button
      type="button"
      aria-label={item.ariaLabel ?? item.label}
      onClick={item.onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={commonClassName}
    >
      <item.icon className="w-5 h-5" />
    </button>
  )
}

export function MenuBar({ items, activeHref, className }: MenuBarProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  return (
    <div className={className ?? "relative"}>
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 px-3 py-1 rounded-md shadow"
          >
            {items[activeIndex].label}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 bg-white/95 dark:bg-neutral-950/95 border border-neutral-200 dark:border-neutral-800 p-2 rounded-full shadow-lg backdrop-blur-xl">
        {items.map((item, index) => (
          <MenuBarButton
            key={`${item.label}-${index}`}
            item={item}
            isActive={Boolean(activeHref && item.href === activeHref)}
            onHover={() => setActiveIndex(index)}
            onLeave={() => setActiveIndex(null)}
          />
        ))}
      </div>
    </div>
  )
}
