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

/**
 * Reveals direct children one after another when the group enters view.
 * Delay comes from --i, set on each cloned child, times --step.
 */
export default function StaggerReveal({
  children,
  className = "",
  step = 110,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
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
