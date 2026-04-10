import { FaPlus } from "react-icons/fa6";
import { getPriorityColor, getStatusColor, SERVICE_REQUESTS } from "../../../constants";
import PrimaryButton from "@/src/components/buttons/PrimaryButton";
import ServiceRequestsTable from "../../../components/tables/ServiceRequestsTable";

export default function Services () {
return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">
            Service Requests
          </h1>
          <p className="text-secondary-text text-sm sm:text-base">
            Track and manage your requests.
          </p>
        </div>
        <div >
          <PrimaryButton tittle={"New Service"} icon={<FaPlus />} />
        </div>
      </div>

      <div className="rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-primary-dark">
            All Requests
          </h2>
        </div>
        <ServiceRequestsTable
          requests={SERVICE_REQUESTS}
          getStatusColor={getStatusColor}
          getPriorityColor={getPriorityColor}
        />
      </div>
      
    </div>
  );
}
