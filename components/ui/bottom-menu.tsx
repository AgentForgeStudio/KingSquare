"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface MenuBarItem {
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element
  label: string
}

export function MenuBar({ items }: { items: MenuBarItem[] }) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  return (
    <div className="relative">
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-md shadow"
          >
            {items[activeIndex].label}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 bg-white border p-2 rounded-full shadow">
        {items.map((item, index) => (
          <button
            key={index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  )
}