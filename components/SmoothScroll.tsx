"use client";

import { useEffect } from "react";
import { ReactLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Tell GSAP ScrollTrigger to integrate with Lenis's scroll proxy
    // This ensures pinned sections and scrub animations stay in sync
    // with the smoothed scroll position.
    function update(time: number) {
      ScrollTrigger.update();
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
