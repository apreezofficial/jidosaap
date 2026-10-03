import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

// 1. Proforms Logo (Favicon)
export function ProformsLogo({ className = "w-6 h-6" }: LogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center shrink-0", className)}>
      <img
        src="/proforms.ico"
        alt="Proforms"
        className="w-full h-full object-contain rounded-sm"
      />
    </div>
  );
}

// 2. Penna Logo (Official Mark: AI & Docs Newsletter Tool)
export function PennaLogo({ className = "w-6 h-6" }: LogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center shrink-0", className)}>
      <img
        src="/penna.png"
        alt="Penna - AI & Docs Newsletter Tool"
        className="w-full h-full object-contain"
      />
    </div>
  );
}

// 3. WhatsApp Official Brand Logo
export function WhatsAppLogo({ className = "w-6 h-6" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <circle cx="24" cy="24" r="22" fill="#25D366" />
      <path
        d="M34.7 13.3C31.9 10.5 28.1 9 24.1 9C15.8 9 9.1 15.7 9.1 24C9.1 26.6 9.8 29.2 11.1 31.4L9 39L16.8 37C19 38.2 21.5 38.8 24 38.8H24.1C32.3 38.8 39.1 32.1 39.1 23.9C39.1 19.9 37.5 16.1 34.7 13.3ZM24.1 36.3C21.9 36.3 19.7 35.7 17.8 34.6L17.3 34.3L12.7 35.5L13.9 31L13.6 30.5C12.4 28.5 11.7 26.3 11.7 24C11.7 17.2 17.3 11.6 24.1 11.6C27.4 11.6 30.5 12.9 32.8 15.2C35.1 17.5 36.4 20.6 36.4 23.9C36.4 30.7 30.9 36.3 24.1 36.3ZM30.9 27.2C30.5 27 28.7 26.1 28.4 26C28.1 25.9 27.8 25.8 27.6 26.2C27.3 26.6 26.6 27.4 26.4 27.6C26.2 27.8 26 27.8 25.6 27.6C25.2 27.4 24 27 22.5 25.7C21.4 24.7 20.6 23.5 20.4 23.1C20.2 22.7 20.4 22.5 20.6 22.3C20.8 22.1 21 21.8 21.2 21.6C21.4 21.4 21.5 21.2 21.6 21C21.7 20.8 21.7 20.6 21.6 20.4C21.5 20.2 20.8 18.5 20.5 17.8C20.2 17.1 19.9 17.2 19.7 17.2C19.5 17.2 19.3 17.2 19.1 17.2C18.9 17.2 18.5 17.3 18.2 17.6C17.9 17.9 17 18.8 17 20.5C17 22.2 18.3 23.9 18.5 24.1C18.7 24.3 21 27.8 24.5 29.3C25.3 29.7 26 29.9 26.5 30.1C27.4 30.3 28.2 30.3 28.8 30.2C29.5 30.1 31 29.3 31.3 28.5C31.6 27.6 31.6 26.9 31.5 26.8C31.4 26.6 31.2 26.5 30.9 27.2Z"
        fill="white"
      />
    </svg>
  );
}

// 4. Meta API Official Loop Logo
export function MetaLogo({ className = "w-6 h-6" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        d="M16.92 5.5C14.73 5.5 12.87 6.64 12 8.35C11.13 6.64 9.27 5.5 7.08 5.5C3.72 5.5 1 8.22 1 11.58C1 15.65 4.54 18.5 7.08 18.5C9.27 18.5 11.13 17.36 12 15.65C12.87 17.36 14.73 18.5 16.92 18.5C20.28 18.5 23 15.65 23 11.58C23 8.22 20.28 5.5 16.92 5.5ZM7.08 16.27C4.95 16.27 3.23 14.16 3.23 11.58C3.23 9.45 4.95 7.73 7.08 7.73C8.75 7.73 10.18 8.81 10.74 10.36L8.47 14.49C8.03 15.58 7.6 16.27 7.08 16.27ZM16.92 16.27C16.4 16.27 15.97 15.58 15.53 14.49L13.26 10.36C13.82 8.81 15.25 7.73 16.92 7.73C19.05 7.73 20.77 9.45 20.77 11.58C20.77 14.16 19.05 16.27 16.92 16.27Z"
        fill="#0668E1"
      />
    </svg>
  );
}

// 5. Slack Official 4-Color Mark
export function SlackLogo({ className = "w-6 h-6" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        d="M5.04 14.88C5.04 15.7 4.37 16.37 3.55 16.37C2.73 16.37 2.06 15.7 2.06 14.88C2.06 14.06 2.73 13.39 3.55 13.39H5.04V14.88Z"
        fill="#36C5F0"
      />
      <path
        d="M6.03 14.88C6.03 14.06 6.7 13.39 7.52 13.39C8.34 13.39 9.01 14.06 9.01 14.88V18.6C9.01 19.42 8.34 20.09 7.52 20.09C6.7 20.09 6.03 19.42 6.03 18.6V14.88Z"
        fill="#36C5F0"
      />
      <path
        d="M9.12 5.04C8.3 5.04 7.63 4.37 7.63 3.55C7.63 2.73 8.3 2.06 9.12 2.06C9.94 2.06 10.61 2.73 10.61 3.55V5.04H9.12Z"
        fill="#2EB67D"
      />
      <path
        d="M9.12 6.03C9.94 6.03 10.61 6.7 10.61 7.52C10.61 8.34 9.94 9.01 9.12 9.01H5.4C4.58 9.01 3.91 8.34 3.91 7.52C3.91 6.7 4.58 6.03 5.4 6.03H9.12Z"
        fill="#2EB67D"
      />
      <path
        d="M18.96 9.12C18.96 8.3 19.63 7.63 20.45 7.63C21.27 7.63 21.94 8.3 21.94 9.12C21.94 9.94 21.27 10.61 20.45 10.61H18.96V9.12Z"
        fill="#E01E5A"
      />
      <path
        d="M17.97 9.12C17.97 9.94 17.3 10.61 16.48 10.61C15.66 10.61 14.99 9.94 14.99 9.12V5.4C14.99 4.58 15.66 3.91 16.48 3.91C17.3 3.91 17.97 4.58 17.97 5.4V9.12Z"
        fill="#E01E5A"
      />
      <path
        d="M14.88 18.96C15.7 18.96 16.37 19.63 16.37 20.45C16.37 21.27 15.7 21.94 14.88 21.94C14.06 21.94 13.39 21.27 13.39 20.45V18.96H14.88Z"
        fill="#ECB22E"
      />
      <path
        d="M14.88 17.97C14.06 17.97 13.39 17.3 13.39 16.48C13.39 15.66 14.06 14.99 14.88 14.99H18.6C19.42 14.99 20.09 15.66 20.09 16.48C20.09 17.3 19.42 17.97 18.6 17.97H14.88Z"
        fill="#ECB22E"
      />
    </svg>
  );
}

// 6. Gmail Official Multi-Color Logo
export function GmailLogo({ className = "w-6 h-6" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        d="M2 19V7.5L12 14.5L22 7.5V19C22 19.83 21.33 20.5 20.5 20.5H3.5C2.67 20.5 2 19.83 2 19Z"
        fill="#E1E4E8"
      />
      <path
        d="M20.5 3.5H18V9.5L22 6.5V5C22 4.17 21.33 3.5 20.5 3.5Z"
        fill="#34A853"
      />
      <path
        d="M2 5V6.5L6 9.5V3.5H3.5C2.67 3.5 2 4.17 2 5Z"
        fill="#4285F4"
      />
      <path
        d="M6 3.5H18V9.5L12 14.5L6 9.5V3.5Z"
        fill="#EA4335"
      />
      <path
        d="M6 9.5L2 6.5V19C2 19.83 2.67 20.5 3.5 20.5H6V9.5Z"
        fill="#4285F4"
      />
      <path
        d="M18 9.5V20.5H20.5C21.33 20.5 22 19.83 22 19V6.5L18 9.5Z"
        fill="#34A853"
      />
      <path
        d="M12 14.5L6 9.5V12.5L12 17.5L18 12.5V9.5L12 14.5Z"
        fill="#FBBC05"
        opacity="0.3"
      />
    </svg>
  );
}

// 7. Figma Official 5-Color Logo
export function FigmaLogo({ className = "w-6 h-6" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      {/* Top Left: Red */}
      <path
        d="M8.5 2H12V6H8.5C7.39543 6 6.5 5.10457 6.5 4C6.5 2.89543 7.39543 2 8.5 2Z"
        fill="#F24E1E"
      />
      {/* Top Right: Orange */}
      <path
        d="M12 2H15.5C16.6046 2 17.5 2.89543 17.5 4C17.5 5.10457 16.6046 6 15.5 6H12V2Z"
        fill="#FF7262"
      />
      {/* Middle Left: Purple */}
      <path
        d="M8.5 6H12V10H8.5C7.39543 10 6.5 9.10457 6.5 8C6.5 6.89543 7.39543 6 8.5 6Z"
        fill="#A259FF"
      />
      {/* Middle Right: Cyan/Blue */}
      <path
        d="M15.5 6C16.6046 6 17.5 6.89543 17.5 8C17.5 9.10457 16.6046 10 15.5 10C14.3954 10 13.5 9.10457 13.5 8C13.5 6.89543 14.3954 6 15.5 6Z"
        fill="#1ABCFE"
      />
      {/* Bottom Left: Green with tail */}
      <path
        d="M8.5 10H12V13.5C12 14.6046 11.1046 15.5 10 15.5C8.89543 15.5 8 14.6046 8 13.5C8 12.3954 8.89543 11.5 10 11.5H12V10H8.5C7.39543 10 6.5 10.8954 6.5 12C6.5 13.1046 7.39543 14 8.5 14H8.5C8.5 15.1046 7.60457 16 6.5 16C5.39543 16 4.5 15.1046 4.5 14"
        fill="#0ACF83"
      />
      <circle cx="8.5" cy="14" r="2" fill="#0ACF83" />
    </svg>
  );
}

// 8. Notion Official Mark
export function NotionLogo({ className = "w-6 h-6" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        d="M4.22 3.2L17.27 2.05C18.66 1.93 19.8 3.01 19.8 4.41V19.46C19.8 20.76 18.79 21.84 17.49 21.94L4.44 22.95C3.06 23.06 1.9 21.98 1.9 20.59V5.55C1.9 4.25 2.92 3.17 4.22 3.2Z"
        fill="#000000"
      />
      <path
        d="M6.2 6.5L15.3 5.7V8.1L8.5 8.7V17.5L6.2 17.7V6.5Z"
        fill="white"
      />
      <path
        d="M9.8 8.6L16.2 17.6V8.2H18.2V19.2L14.7 19.5L8.5 10.2V19.9L6.5 20.1V8.9L9.8 8.6Z"
        fill="white"
      />
    </svg>
  );
}

// 9. Stripe Official S Squircle
export function StripeLogo({ className = "w-6 h-6" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <rect width="24" height="24" rx="6" fill="#635BFF" />
      <path
        d="M14.6 10.6C14.6 9.7 13.9 9.3 12.8 9.3C11.6 9.3 10.7 9.7 10.7 9.7L10.3 8.1C10.3 8.1 11.4 7.6 13 7.6C15.1 7.6 16.7 8.7 16.7 10.7C16.7 13.8 12.4 13.3 12.4 14.6C12.4 15.2 13 15.6 13.9 15.6C15.1 15.6 16.2 15 16.2 15L16.6 16.7C16.6 16.7 15.3 17.3 13.6 17.3C11.4 17.3 10.2 16.1 10.2 14.2C10.2 11.2 14.6 11.7 14.6 10.6Z"
        fill="white"
      />
    </svg>
  );
}

// 10. OpenAI Official Rosette Spiral
export function OpenAILogo({ className = "w-6 h-6" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 text-zinc-900", className)}
    >
      <path d="M12 2a4 4 0 0 1 3.8 2.7l.2.8v3.5a1 1 0 0 0 .5.9l3 1.7a4 4 0 0 1 1.5 5.5l-.5.8-3 1.8a1 1 0 0 0-.5.8v3.5a4 4 0 0 1-5.5 3.7l-.8-.4-3-1.8a1 1 0 0 0-.9 0l-3 1.8a4 4 0 0 1-5.5-3.7v-3.5a1 1 0 0 0-.5-.8l-3-1.8a4 4 0 0 1 1.5-5.5l.8-.5 3-1.7a1 1 0 0 0 .5-.9V5.5A4 4 0 0 1 12 2Z" />
      <path d="M10 8.5 14 11v4l-4 2.5V13Z" />
    </svg>
  );
}

// 11. Zendesk Official Geometric Symbol
export function ZendeskLogo({ className = "w-6 h-6" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        d="M12 3C7.03 3 3 7.03 3 12H12V3Z"
        fill="#03363D"
      />
      <path
        d="M12 21C16.97 21 21 16.97 21 12H12V21Z"
        fill="#03363D"
      />
      <circle cx="16.5" cy="7.5" r="4.5" fill="#03363D" />
      <circle cx="7.5" cy="16.5" r="4.5" fill="#03363D" />
    </svg>
  );
}

// 12. HubSpot Official Sprocket Symbol
export function HubSpotLogo({ className = "w-6 h-6" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      {/* Central Ring */}
      <circle cx="12" cy="12" r="3.2" stroke="#FF7A59" strokeWidth="2.2" />
      {/* Top Node */}
      <circle cx="12" cy="4" r="2.2" fill="#FF7A59" />
      <line x1="12" y1="6.2" x2="12" y2="8.8" stroke="#FF7A59" strokeWidth="2.2" />
      {/* Right Branch */}
      <circle cx="20" cy="12" r="2.2" fill="#FF7A59" />
      <line x1="15.2" y1="12" x2="17.8" y2="12" stroke="#FF7A59" strokeWidth="2.2" />
      {/* Bottom Branch */}
      <circle cx="7" cy="19" r="2" fill="#FF7A59" />
      <line x1="10.2" y1="14.2" x2="8.2" y2="17.4" stroke="#FF7A59" strokeWidth="2.2" />
    </svg>
  );
}

// 13. Cal.com Official Logo (Minimalist Modern Calendar Mark)
export function CalLogo({ className = "w-6 h-6" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <rect x="3" y="4" width="18" height="17" rx="4" fill="#111827" />
      <rect x="3" y="4" width="18" height="5" rx="2" fill="#2563EB" />
      <circle cx="8" cy="13" r="1.3" fill="white" />
      <circle cx="12" cy="13" r="1.3" fill="white" />
      <circle cx="16" cy="13" r="1.3" fill="white" />
      <circle cx="8" cy="17" r="1.3" fill="white" />
      <circle cx="12" cy="17" r="1.3" fill="white" stroke="#38bdf8" strokeWidth="0.8" />
    </svg>
  );
}

// 14. Webhook Official Node Connector Logo
export function WebhookLogo({ className = "w-6 h-6" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        d="M12 2C10.34 2 9 3.34 9 5C9 6.31 9.84 7.42 11.02 7.83L8.5 12.19C7.8 11.75 6.94 11.5 6 11.5C3.79 11.5 2 13.29 2 15.5C2 17.71 3.79 19.5 6 19.5C8.21 19.5 10 17.71 10 15.5C10 14.86 9.85 14.25 9.58 13.72L12.02 9.5L14.42 13.72C14.15 14.25 14 14.86 14 15.5C14 17.71 15.79 19.5 18 19.5C20.21 19.5 22 17.71 22 15.5C22 13.29 20.21 11.5 18 11.5C17.06 11.5 16.2 11.75 15.5 12.19L12.98 7.83C14.16 7.42 15 6.31 15 5C15 3.34 13.66 2 12 2Z"
        fill="#2563EB"
      />
    </svg>
  );
}
