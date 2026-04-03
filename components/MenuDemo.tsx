"use client"

import { MenuBar } from "@/components/ui/bottom-menu"

const menuItems = [
  {
    label: "Home",
    icon: (props: any) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 12l9-9 9 9" />
      </svg>
    ),
  },
  {
    label: "Search",
    icon: (props: any) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="8" />
      </svg>
    ),
  },
  {
    label: "Profile",
    icon: (props: any) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

export default function MenuDemo() {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
      <MenuBar items={menuItems} />
    </div>
  )
}