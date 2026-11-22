/**
 * Fire a reveal when the element's top crosses 90% of the viewport.
 * If the user has already scrolled past, the callback runs immediately
 * so text is never left at opacity 0.
 */
export function watchEarlyReveal(el: Element, onReveal: () => void): () => void {
  let done = false;
  let io: IntersectionObserver | undefined;

  const finish = () => {
    if (done) return;
    done = true;
    onReveal();
    io?.disconnect();
    window.removeEventListener("scroll", onScroll);
  };

  const passed = () => el.getBoundingClientRect().top < window.innerHeight * 0.9;

  const onScroll = () => {
    if (passed()) finish();
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || passed()) {
    finish();
    return () => {};
  }

  io = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) finish();
    },
    { threshold: 0, rootMargin: "0px 0px -10% 0px" },
  );
  io.observe(el);
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    done = true;
    io?.disconnect();
    window.removeEventListener("scroll", onScroll);
  };
}
