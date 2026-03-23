import HowItWorks from "@/sections/HowItWorks";
import DataPreview from "@/sections/DataPreview";
import Specs from "@/sections/Specs";
import Validation from "@/sections/Validation";

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
