"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLenis } from "lenis/react";

export default function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    // Scroll to top immediately on route change
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname, lenis]);

  return null;
}
