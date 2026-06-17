"use client";

import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import MagneticButton from "@/components/MagneticButton";

const DASHBOARD_URL = "https://vigil-dashboard-six.vercel.app/dashboard";

export default function DashboardShowcase() {
  return (
    <section className="relative bg-[#0A0A0F]">
      <ContainerScroll titleComponent={null}>
        <div className="relative h-full w-full">
          <Image
            src="/dashboard-preview.png"
            alt="VIGIL clinical vitals dashboard"
            fill
            priority={false}
            sizes="(max-width: 768px) 90vw, 1280px"
            className="object-cover object-top"
          />
        </div>
      </ContainerScroll>

      <div className="-mt-32 flex justify-center pb-28 md:-mt-56">
        <MagneticButton>
          <a
            href={DASHBOARD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-[#00D4AA]/40 bg-[#00D4AA]/5 px-7 py-3 text-sm uppercase tracking-wider text-[#00D4AA] transition-all duration-300 hover:border-[#00D4AA] hover:bg-[#00D4AA]/10 hover:shadow-[0_0_30px_rgba(0,212,170,0.25)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Open full dashboard
            <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </a>
        </MagneticButton>
      </div>
    </section>
  );
}
