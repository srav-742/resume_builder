import type React from "react"
export function BuilderNavigation({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between pt-6 border-t mt-8">{children}</div>
}
