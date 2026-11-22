"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { watchEarlyReveal } from "./effects/early-reveal";

/**
 * Reveals direct children one after another when the group enters view.
 * Delay comes from --i, set on each cloned child, times --step.
 */
export default function StaggerReveal({
  children,
  className = "",
  step = 60,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return watchEarlyReveal(el, () => el.classList.add("is-visible"));
  }, []);

  return (
    <div
      ref={ref}
      className={`wi-stagger ${className}`}
      style={{ "--step": `${step}ms` } as CSSProperties}
    >
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child;
        const el = child as ReactElement<{ style?: CSSProperties }>;
        return cloneElement(el, {
          style: { ...(el.props.style ?? {}), "--i": i } as CSSProperties,
        });
      })}
    </div>
  );
}
