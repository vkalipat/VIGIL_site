import type { Metadata } from "next";
import HowItWorks from "@/sections/HowItWorks";
import DataPreview from "@/sections/DataPreview";
import Specs from "@/sections/Specs";
import Validation from "@/sections/Validation";

export const metadata: Metadata = {
  title: "How VIGIL Works — Sensors, Data Pipeline & Technical Specs",
  description:
    "From forehead placement to nurse station alert in 5 seconds. Explore VIGIL's four-sensor architecture, real-time data pipeline, and full technical specifications.",
};

export default function WorkflowPage() {
  return (
    <div className="pt-20">
      <HowItWorks />
      <DataPreview />
      <Specs />
      <Validation />
    </div>
  );
}
