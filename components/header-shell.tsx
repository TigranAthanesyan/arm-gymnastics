"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const THRESHOLD = 8; // px of scrolling in one direction before we react

// The <header> element. Sticky on every screen size. On phones it slides out of view
// while scrolling down and slides back in on any scroll up (or at the top of the page).
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < THRESHOLD) return;
      lastY = y;
      // Never hide while the burger menu is open (its fixed card lives inside the header).
      const menuOpen = ref.current?.querySelector('[aria-expanded="true"]');
      setHidden(delta > 0 && y > 80 && !menuOpen);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={ref}
      className={`sticky top-0 z-20 bg-linear-to-r from-header to-[#e2e6f5] shadow-md transition-transform duration-300 ${
        hidden ? "max-md:-translate-y-full" : ""
      }`}
    >
      {children}
    </header>
  );
}
