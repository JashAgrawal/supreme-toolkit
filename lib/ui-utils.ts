import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ============================================================================
// UI UTILITY FUNCTIONS
// ============================================================================

/**
 * Utility function to merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Format date in relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a random color for avatars
 */
export function getAvatarColor(seed: string): string {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================================================
// RESPONSIVE DESIGN UTILITIES
// ============================================================================

/**
 * Common responsive container classes
 */
export const containerClasses = {
  base: "w-full mx-auto px-4 sm:px-6 lg:px-8",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
};

/**
 * Common overflow handling classes
 */
export const overflowClasses = {
  // Text overflow
  textTruncate: "truncate",
  textEllipsis: "text-ellipsis overflow-hidden",
  textClamp1: "line-clamp-1",
  textClamp2: "line-clamp-2",
  textClamp3: "line-clamp-3",
  textClamp4: "line-clamp-4",
  
  // Container overflow
  scrollY: "overflow-y-auto",
  scrollX: "overflow-x-auto",
  scrollBoth: "overflow-auto",
  hidden: "overflow-hidden",
  
  // Scrollbar styling
  scrollbarThin: "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100",
  scrollbarHidden: "scrollbar-hide",
};

/**
 * Common spacing classes
 */
export const spacingClasses = {
  // Padding
  p1: "p-1",
  p2: "p-2",
  p3: "p-3",
  p4: "p-4",
  p6: "p-6",
  p8: "p-8",
  
  // Margin
  m1: "m-1",
  m2: "m-2",
  m3: "m-3",
  m4: "m-4",
  m6: "m-6",
  m8: "m-8",
  
  // Gap
  gap1: "gap-1",
  gap2: "gap-2",
  gap3: "gap-3",
  gap4: "gap-4",
  gap6: "gap-6",
  gap8: "gap-8",
};

/**
 * Common flex utilities
 */
export const flexClasses = {
  center: "flex items-center justify-center",
  centerY: "flex items-center",
  centerX: "flex justify-center",
  between: "flex items-center justify-between",
  start: "flex items-start",
  end: "flex items-end",
  col: "flex flex-col",
  colCenter: "flex flex-col items-center justify-center",
  wrap: "flex flex-wrap",
};

/**
 * Common grid utilities
 */
export const gridClasses = {
  cols1: "grid grid-cols-1",
  cols2: "grid grid-cols-1 sm:grid-cols-2",
  cols3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  cols4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  cols6: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  auto: "grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
};

// ============================================================================
// COMPONENT-SPECIFIC UTILITIES
// ============================================================================

/**
 * Card component utilities
 */
export const cardClasses = {
  base: "rounded-lg border bg-card text-card-foreground shadow-sm",
  hover: "transition-shadow hover:shadow-md",
  interactive: "cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]",
  content: "p-6",
  header: "flex flex-col space-y-1.5 p-6",
  footer: "flex items-center p-6 pt-0",
};

/**
 * Button component utilities
 */
export const buttonClasses = {
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  sizes: {
    sm: "h-9 px-3",
    md: "h-10 py-2 px-4",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  },
  variants: {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-primary",
  },
};

/**
 * Input component utilities
 */
export const inputClasses = {
  base: "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  error: "border-destructive focus-visible:ring-destructive",
  success: "border-green-500 focus-visible:ring-green-500",
};

/**
 * Badge component utilities
 */
export const badgeClasses = {
  base: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  variants: {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
  },
};

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

/**
 * Common animation classes
 */
export const animationClasses = {
  fadeIn: "animate-in fade-in-0",
  fadeOut: "animate-out fade-out-0",
  slideIn: "animate-in slide-in-from-bottom-2",
  slideOut: "animate-out slide-out-to-bottom-2",
  scaleIn: "animate-in zoom-in-95",
  scaleOut: "animate-out zoom-out-95",
  spin: "animate-spin",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
};

/**
 * Transition utilities
 */
export const transitionClasses = {
  all: "transition-all duration-200 ease-in-out",
  colors: "transition-colors duration-200 ease-in-out",
  transform: "transition-transform duration-200 ease-in-out",
  opacity: "transition-opacity duration-200 ease-in-out",
  shadow: "transition-shadow duration-200 ease-in-out",
};
