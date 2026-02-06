import { FaCreditCard } from "react-icons/fa";
import { FaDownload, FaFile, FaPlus } from "react-icons/fa6";

export default function QuickActions() {
    return(
        <div className="bg-primary-light/20 p-6 rounded-lg shadow-sm mb-8">
      <h3 className="text-lg font-semibold mb-6 text-primary-dark">
        Quick Actions
      </h3>
      <div className="flex flex-wrap gap-4">
        <button
          className="w-full sm:w-fit flex items-center justify-center gap-2 px-4 py-3 bg-primary text-tetiary rounded-md font-medium shadow-md hover:shadow-lg hover:bg-primary-dark transition-colors duration-200"
        >
          <FaPlus />
          New Service Request
        </button>

        <button className="w-full sm:w-fit flex items-center justify-center gap-2 px-4 py-3 bg-primary text-tetiary rounded-md font-medium shadow-md hover:shadow-lg hover:bg-primary-dark transition-colors duration-200">
          <FaDownload />
          Upload Documents
        </button>

        <button className="w-full sm:w-fit flex items-center justify-center gap-2 px-4 py-3 bg-primary text-tetiary rounded-md font-medium shadow-md hover:shadow-lg hover:bg-primary-dark transition-colors duration-200">
          <FaCreditCard />
          Pay Invoice
        </button>

        <button className="w-full sm:w-fit flex items-center justify-center gap-2 px-4 py-3 bg-primary text-tetiary rounded-md font-medium shadow-md hover:shadow-lg hover:bg-primary-dark transition-colors duration-200">
          <FaFile />
          View Reports
        </button>
      </div>
    </div>
    )
}