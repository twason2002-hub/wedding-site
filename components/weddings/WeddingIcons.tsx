type IconProps = { size?: number; className?: string };

function base(size = 16, className?: string) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };
}

export function CalendarIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  );
}

export function MapPinIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function ClockIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  );
}

export function ShirtIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M8.5 3.5 5 5.6 3.5 9l3 1v10.5h11V10l3-1L19 5.6l-3.5-2.1a3.5 3.5 0 0 1-7 0Z" />
      <path d="M8.5 3.5a3.5 3.5 0 0 0 7 0" />
    </svg>
  );
}

export function CheckIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="m4.5 12.5 5 5L19.5 7" />
    </svg>
  );
}

export function ShareIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 15V4M8 7.5 12 3.5l4 4" />
      <path d="M5 12.5v5A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-5" />
    </svg>
  );
}

export function WhatsAppIcon({ size, className }: IconProps) {
  return (
    <svg
      width={size ?? 18}
      height={size ?? 18}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.5-.6c.1-.2.1-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.2-.7.5-.9.9-1.1 2.2-.2 4a11.6 11.6 0 0 0 4.5 4.2c1.7.8 2.4.9 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.1-.5-.3Z" />
    </svg>
  );
}

export function CloseIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ChevronLeftIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="m14.5 6.5-5.5 5.5 5.5 5.5" />
    </svg>
  );
}

export function ChevronRightIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="m9.5 6.5 5.5 5.5-5.5 5.5" />
    </svg>
  );
}
