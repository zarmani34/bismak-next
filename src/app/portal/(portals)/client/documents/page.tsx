import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import { FaUpload } from "react-icons/fa6";

export default  function Documents() {
return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="w-1/2">
          <h1 className="text-2xl font-bold text-primary-dark">Documents</h1>
          <p className="text-secondary-text text-sm sm:text-base">
            Access your licence, reports, and documents.
          </p>
        </div>
        <div className="">
          <PrimaryButton tittle={'Upload Documents'} icon={<FaUpload />} />
        </div>
      </div>
    </div>
  );
}