"use client";

import Link from "next/link";
import { ExternalLink, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* Main text */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Created by</span>
            <Link
              href="https://jashagrawal.in/#contact"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              Jash Agrawal
            </Link>
          </div>

          {/* Social links */}
          <div className="flex items-center space-x-4">
            <Link
              href="https://x.com/JashAgrawal2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 group"
            >
              <Twitter className="h-4 w-4 group-hover:text-blue-500 transition-colors duration-200" />
              <span className="hidden sm:inline">Twitter</span>
            </Link>

            <div className="h-4 w-px bg-border" />

            <Link
              href="https://www.linkedin.com/in/agrawaljash/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 group"
            >
              <Linkedin className="h-4 w-4 group-hover:text-blue-600 transition-colors duration-200" />
              <span className="hidden sm:inline">LinkedIn</span>
            </Link>

            <div className="h-4 w-px bg-border" />

            <Link
              href="https://jashagrawal.in/#contact"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 group"
            >
              <Mail className="h-4 w-4 group-hover:text-green-500 transition-colors duration-200" />
              <span className="hidden sm:inline">Contact</span>
            </Link>
          </div>

          {/* Supreme Toolkit branding */}
          <div className="text-xs text-muted-foreground/70">
            <span>Supreme Toolkit</span>
            <span className="mx-2">•</span>
            <span>Build faster with shadcn/ui components</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
