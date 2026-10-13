import React from 'react';

export function BrandLogo({ icon, className = 'w-6 h-6' }: { icon: string; className?: string }) {
  switch (icon.toLowerCase()) {
    case 'paypal':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <path
            d="M8.5 28L12.2 4.5H22C24.8 4.5 27 5.5 27.8 7.6C28.5 9.4 28.1 11.8 26.8 13.8C25.4 16 23.1 17.2 20.2 17.2H16.2L14.5 28H8.5Z"
            fill="#003087"
          />
          <path
            d="M11.5 28L14.5 9.2H23.5C25.8 9.2 27.5 10.3 28.1 12.1C28.7 13.8 28.3 15.8 27.2 17.4C25.9 19.3 23.9 20.3 21.4 20.3H17.8L16.6 28H11.5Z"
            fill="#0079C1"
            opacity="0.85"
          />
        </svg>
      );
    case 'okta':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="14" stroke="#00297A" strokeWidth="3" />
          <circle cx="16" cy="16" r="8" fill="#1662DD" />
        </svg>
      );
    case 'microsoft':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <rect x="4" y="4" width="11" height="11" fill="#F25022" />
          <rect x="17" y="4" width="11" height="11" fill="#7FBA00" />
          <rect x="4" y="17" width="11" height="11" fill="#00A4EF" />
          <rect x="17" y="17" width="11" height="11" fill="#FFB900" />
        </svg>
      );
    case 'google':
      return (
        <svg viewBox="0 0 32 32" className={className}>
          <path
            d="M27.5 16.3C27.5 15.4 27.4 14.6 27.3 13.8H16V18.5H22.5C22.2 20 21.3 21.3 20 22.2V25.2H23.9C26.1 23.1 27.5 20 27.5 16.3Z"
            fill="#4285F4"
          />
          <path
            d="M16 28C19.2 28 21.9 26.9 23.9 25.2L20 22.2C18.9 22.9 17.6 23.4 16 23.4C12.9 23.4 10.3 21.3 9.3 18.5H5.2V21.6C7.3 25.7 11.3 28 16 28Z"
            fill="#34A853"
          />
          <path
            d="M9.3 18.5C9.1 17.7 8.9 16.9 8.9 16C8.9 15.1 9.1 14.3 9.3 13.5V10.4H5.2C4.4 12.1 4 14 4 16C4 18 4.4 19.9 5.2 21.6L9.3 18.5Z"
            fill="#FBBC05"
          />
          <path
            d="M16 8.6C17.8 8.6 19.3 9.2 20.6 10.4L24 7C21.9 5.1 19.2 4 16 4C11.3 4 7.3 6.3 5.2 10.4L9.3 13.5C10.3 10.7 12.9 8.6 16 8.6Z"
            fill="#EA4335"
          />
        </svg>
      );
    case 'chase':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <rect x="4" y="4" width="24" height="24" rx="4" fill="#117ACA" />
          <path
            d="M9 13H19L23 9H13L9 13Z"
            fill="white"
          />
          <path
            d="M19 13V23L23 19V9L19 13Z"
            fill="white"
          />
          <path
            d="M23 19H13L9 23H19L23 19Z"
            fill="white"
          />
          <path
            d="M13 19V9L9 13V23L13 19Z"
            fill="white"
          />
        </svg>
      );
    case 'coinbase':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="14" fill="#0052FF" />
          <path
            d="M16 7C11.03 7 7 11.03 7 16C7 20.97 11.03 25 16 25C20.97 25 25 20.97 25 16C25 11.03 20.97 7 16 7ZM13 12.5H19C19.83 12.5 20.5 13.17 20.5 14V18C20.5 18.83 19.83 19.5 19 19.5H13C12.17 19.5 11.5 18.83 11.5 18V14C11.5 13.17 12.17 12.5 13 12.5Z"
            fill="white"
          />
        </svg>
      );
    default:
      return (
        <div className={`rounded-md bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-xs font-bold text-purple-300 ${className}`}>
          {icon.slice(0, 2).toUpperCase()}
        </div>
      );
  }
}
