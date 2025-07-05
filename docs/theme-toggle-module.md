# 🌙 Theme Toggle Module

A comprehensive dark mode solution with theme provider and multiple toggle variants for Next.js applications.

## ✨ Features

- **Theme Provider**: React context-based theme management using next-themes
- **Simple Toggle**: Clean sun/moon icon toggle with smooth transitions
- **Dropdown Toggle**: Advanced dropdown with Light/Dark/System options
- **SSR Safe**: Prevents hydration mismatches with proper mounting checks
- **System Theme**: Automatic system preference detection
- **Persistent**: Remembers user preference across sessions
- **Smooth Transitions**: Beautiful icon animations and theme transitions

## 🚀 Installation

```bash
npx shadcn@latest add "https://supremetoolkit.in/r/theme-toggle"
```

This installs:
- Theme provider component
- Simple theme toggle button
- Advanced dropdown theme toggle
- Required dependencies (next-themes)

## 📦 What's Included

### Components
- `ThemeProvider` - Context provider for theme management
- `ThemeToggle` - Simple sun/moon toggle button
- `ThemeToggleDropdown` - Advanced dropdown with all theme options

### Dependencies
- `next-themes` - Robust theme management for Next.js
- `lucide-react` - Icons for sun, moon, and monitor
- `@radix-ui/react-dropdown-menu` - Accessible dropdown component

## 🎨 Components

### ThemeProvider

Wrap your app with the theme provider to enable theme management.

```tsx
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Props:**
- `attribute` (string): HTML attribute to use for theme (default: "class")
- `defaultTheme` (string): Default theme ("light" | "dark" | "system")
- `enableSystem` (boolean): Enable system theme detection
- `disableTransitionOnChange` (boolean): Disable CSS transitions during theme change

### ThemeToggle

Simple toggle button that switches between light and dark themes.

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Navigation() {
  return (
    <nav>
      <ThemeToggle />
    </nav>
  );
}
```

**Features:**
- Animated sun/moon icons
- Smooth rotation transitions
- Accessible with screen reader support
- Ghost button styling

### ThemeToggleDropdown

Advanced dropdown with all theme options including system preference.

```tsx
import { ThemeToggleDropdown } from '@/components/ui/theme-toggle-dropdown';

export default function Navigation() {
  return (
    <nav>
      <ThemeToggleDropdown />
    </nav>
  );
}
```

**Features:**
- Light, Dark, and System options
- Current theme indicator
- Accessible dropdown menu
- SSR-safe rendering

## 🔧 Usage Examples

### Basic Setup

1. **Install the module:**
```bash
npx shadcn@latest add "https://supremetoolkit.in/r/theme-toggle"
```

2. **Add provider to layout:**
```tsx
// app/layout.tsx
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

3. **Add toggle to navigation:**
```tsx
// components/navigation.tsx
import { ThemeToggleDropdown } from '@/components/ui/theme-toggle-dropdown';

export function Navigation() {
  return (
    <nav className="flex items-center justify-between p-4">
      <div>Your Logo</div>
      <div className="flex items-center space-x-4">
        <ThemeToggleDropdown />
      </div>
    </nav>
  );
}
```

### Custom Hook Usage

Access theme state directly in your components:

```tsx
import { useTheme } from 'next-themes';

export function CustomComponent() {
  const { theme, setTheme, systemTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>System theme: {systemTheme}</p>
      <button onClick={() => setTheme('dark')}>
        Switch to Dark
      </button>
    </div>
  );
}
```

### Conditional Rendering

Show different content based on theme:

```tsx
import { useTheme } from 'next-themes';

export function ThemedContent() {
  const { theme } = useTheme();
  
  return (
    <div>
      {theme === 'dark' ? (
        <p>🌙 Dark mode is active</p>
      ) : (
        <p>☀️ Light mode is active</p>
      )}
    </div>
  );
}
```

## 🎨 Styling

The theme toggle components use your existing design system colors and work with any CSS framework. The theme switching is handled through CSS custom properties and the `dark` class.

### CSS Variables

The module includes CSS variables for both light and dark themes:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... more variables */
}
```

### Custom Styling

Customize the toggle buttons:

```tsx
<ThemeToggle className="border rounded-full p-2" />

<ThemeToggleDropdown className="bg-accent hover:bg-accent/80" />
```

## 🔒 Accessibility

- **Keyboard Navigation**: Full keyboard support for dropdown menu
- **Screen Reader**: Proper ARIA labels and screen reader text
- **Focus Management**: Visible focus indicators
- **High Contrast**: Works with system high contrast modes

## 🌟 Best Practices

1. **Always use suppressHydrationWarning** on the html element to prevent hydration warnings
2. **Place ThemeProvider high in your component tree** for global access
3. **Use the dropdown variant** for better UX when system theme is important
4. **Test with system theme changes** to ensure proper updates
5. **Consider user preference persistence** across sessions

## 🚀 Advanced Usage

### Custom Theme Names

```tsx
<ThemeProvider themes={['light', 'dark', 'blue', 'red']}>
  {children}
</ThemeProvider>
```

### Theme-specific Components

```tsx
import { useTheme } from 'next-themes';

export function ThemeSpecificIcon() {
  const { resolvedTheme } = useTheme();
  
  if (resolvedTheme === 'dark') {
    return <MoonIcon />;
  }
  
  return <SunIcon />;
}
```

This module provides everything you need for a robust dark mode implementation in your Next.js application!
