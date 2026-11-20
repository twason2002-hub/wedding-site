type IconProps = { size?: number; className?: string };

function svgProps(size = 18, className?: string) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };
}

export function GlobeIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9Z" />
    </svg>
  );
}

export function EyeIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  );
}

export function PenIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="M13.5 6.5 17.5 10.5" />
    </svg>
  );
}

export function HourglassIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M7 3h10M7 21h10" />
      <path d="M8 3c0 4 4 5.2 4 8s-4 4-4 8M16 3c0 4-4 5.2-4 8s4 4 4 8" />
    </svg>
  );
}

export function ClockIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  );
}

export function LayoutIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M3.5 9.5h17M9.5 9.5v11" />
    </svg>
  );
}

export function LockIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8 10.5V7.7a4 4 0 0 1 8 0v2.8" />
    </svg>
  );
}

export function SearchIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}

export function ChevronLeftIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="m14.5 6.5-5.5 5.5 5.5 5.5" />
    </svg>
  );
}

export function ChevronRightIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="m9.5 6.5 5.5 5.5-5.5 5.5" />
    </svg>
  );
}

export function SparklesIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M12 3.5 13.6 9l5.4 1.6-5.4 1.6L12 17.7l-1.6-5.5L5 10.6l5.4-1.6L12 3.5Z" />
      <path d="M18.5 16.5l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />
    </svg>
  );
}
