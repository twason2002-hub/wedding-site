"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";

/**
 * Drag-down reveal. Listeners live on window so the gesture survives when
 * the handle itself moves (a swinging door, a falling tassel). A release
 * below `openAt` springs back. A tap, Enter, or Space opens immediately.
 */
export function usePullReveal(openAt: number, max: number, onOpen: () => void) {
  const [pull, setPull] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [opened, setOpened] = useState(false);
  const pullRef = useRef(0);
  const openedRef = useRef(false);
  const moved = useRef(false);
  const drag = useRef<{ y: number; base: number; id: number } | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  const setPullPx = (next: number) => {
    const clamped = Math.max(0, Math.min(max, next));
    pullRef.current = clamped;
    setPull(clamped);
    return clamped;
  };

  const finish = () => {
    if (openedRef.current) return;
    stopRef.current?.();
    stopRef.current = null;
    openedRef.current = true;
    setOpened(true);
    setDragging(false);
    drag.current = null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(onOpen, reduce ? 0 : 820);
  };

  useEffect(() => () => stopRef.current?.(), []);

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (openedRef.current || drag.current || event.button > 0) return;
    const id = event.pointerId;
    const cap = event.currentTarget.closest(".wi-enter-stage") ?? event.currentTarget;
    drag.current = { y: event.clientY, base: pullRef.current, id };
    moved.current = false;
    setDragging(true);
    try {
      cap.setPointerCapture(id);
    } catch {
      /* Window listeners still follow the finger. */
    }

    function move(e: PointerEvent) {
      if (!drag.current || e.pointerId !== id || openedRef.current) return;
      const dy = e.clientY - drag.current.y;
      if (dy > 10) moved.current = true;
      setPullPx(drag.current.base + dy);
    }
    function up(e: PointerEvent) {
      if (e.pointerId !== id) return;
      stop();
      if (!drag.current || openedRef.current) return;
      drag.current = null;
      setDragging(false);
      if (pullRef.current >= openAt || !moved.current) finish();
      else setPullPx(0);
    }
    function stop() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      if (stopRef.current === stop) stopRef.current = null;
      try {
        if (cap.hasPointerCapture(id)) cap.releasePointerCapture(id);
      } catch {
        /* Capture may already be gone. */
      }
    }
    stopRef.current = stop;
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
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
    bind: { onPointerDown, onClick, onKeyDown },
  };
}
