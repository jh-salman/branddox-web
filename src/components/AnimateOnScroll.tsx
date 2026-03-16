"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type AnimateOnScrollProps = {
  children: ReactNode;
  className?: string;
  /** Root margin for Intersection Observer (e.g. "0px 0px -80px 0px" to trigger when 80px from bottom of viewport) */
  rootMargin?: string;
  /** Threshold 0–1. Trigger when this fraction of the element is visible */
  threshold?: number;
  /** Disable animation (e.g. for Hero that animates on load) */
  disabled?: boolean;
};

export function AnimateOnScroll({
  children,
  className = "",
  rootMargin = "0px 0px -60px 0px",
  threshold = 0.1,
  disabled = false,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(disabled);

  useEffect(() => {
    if (disabled) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin, threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [disabled, rootMargin, threshold]);

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${inView ? "in-view" : ""} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
