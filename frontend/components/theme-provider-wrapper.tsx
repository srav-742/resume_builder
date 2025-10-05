"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Only render the ThemeProvider after the component has mounted
  // This prevents hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}
