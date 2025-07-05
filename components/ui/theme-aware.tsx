"use client"

import * as React from "react"
import { useTheme } from "next-themes"

interface ThemeContext {
  theme: string | undefined
  resolvedTheme: string | undefined
}

interface ThemeAwareProps {
  children: React.ReactNode | ((context: ThemeContext) => React.ReactNode)
  light?: React.ReactNode
  dark?: React.ReactNode
  system?: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * ThemeAware Component
 * 
 * Conditionally renders content based on the current theme.
 * Useful for showing different content, icons, or styling based on theme.
 * 
 * @example
 * <ThemeAware
 *   light={<SunIcon />}
 *   dark={<MoonIcon />}
 *   system={<MonitorIcon />}
 * />
 * 
 * @example
 * <ThemeAware>
 *   {({ theme, resolvedTheme }) => (
 *     <div className={theme === 'dark' ? 'text-white' : 'text-black'}>
 *       Current theme: {resolvedTheme}
 *     </div>
 *   )}
 * </ThemeAware>
 */
export function ThemeAware({ 
  children, 
  light, 
  dark, 
  system, 
  fallback = null 
}: ThemeAwareProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return fallback ? <>{fallback}</> : null
  }

  // If specific theme content is provided, use it
  if (theme === "light" && light) return <>{light}</>
  if (theme === "dark" && dark) return <>{dark}</>
  if (theme === "system" && system) return <>{system}</>

  // If children is a function, call it with theme context
  if (typeof children === "function") {
    return <>{children({ theme, resolvedTheme })}</>
  }

  // Otherwise render children normally
  return <>{children}</>
}

/**
 * useThemeAware Hook
 * 
 * A hook that provides theme-aware utilities and state.
 * 
 * @example
 * const { theme, isDark, isLight, isSystem, resolvedTheme } = useThemeAware();
 * 
 * return (
 *   <div className={isDark ? 'bg-black' : 'bg-white'}>
 *     Theme: {resolvedTheme}
 *   </div>
 * );
 */
export function useThemeAware() {
  const { theme, resolvedTheme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"
  const isLight = mounted && resolvedTheme === "light"
  const isSystem = mounted && theme === "system"

  return {
    theme,
    resolvedTheme: mounted ? resolvedTheme : undefined,
    systemTheme: mounted ? systemTheme : undefined,
    setTheme,
    isDark,
    isLight,
    isSystem,
    mounted,
  }
}
