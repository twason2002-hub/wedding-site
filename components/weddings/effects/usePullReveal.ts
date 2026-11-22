"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";

/**
 * Drag-down reveal. A short drag that is released below `openAt` springs
 * back. A tap (click without a drag) and Enter / Space open immediately.
 */
export function usePullReveal(openAt: number, max: number, onOpen: () => void) {
  const [pull, setPull] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [opened, setOpened] = useState(false);
  const pullRef = useRef(0);
  const openedRef = useRef(false);
  const moved = useRef(false);
  const drag = useRef<{ y: number; base: number } | null>(null);

  const setPullPx = (next: number) => {
    const clamped = Math.max(0, Math.min(max, next));
    pullRef.current = clamped;
    setPull(clamped);
    return clamped;
  };

  const finish = () => {
    if (openedRef.current) return;
    openedRef.current = true;
    setOpened(true);
    setDragging(false);
    drag.current = null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(onOpen, reduce ? 0 : 820);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (openedRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { y: event.clientY, base: pullRef.current };
    moved.current = false;
    setDragging(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!drag.current || openedRef.current) return;
    const dy = event.clientY - drag.current.y;
    if (Math.abs(dy) > 6) moved.current = true;
    setPullPx(drag.current.base + dy);
  };

  const onPointerUp = () => {
    if (!drag.current || openedRef.current) return;
    drag.current = null;
    setDragging(false);
    if (pullRef.current >= openAt) finish();
    else setPullPx(0);
  };

  const onClick = (event: { preventDefault: () => void }) => {
    if (moved.current) {
      event.preventDefault();
      moved.current = false;
      return;
    }
    finish();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = setPullPx(pullRef.current + 32);
      if (next >= openAt) finish();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setPullPx(pullRef.current - 32);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      finish();
    }
  };

  return {
    pull,
    dragging,
    opened,
    setPullPx,
    finish,
    bind: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onClick, onKeyDown },
  };
}
