import { FaEye } from "react-icons/fa";
import { FaDownload, FaPlus } from "react-icons/fa6";
import { getProgressPercentage, getStatusColor, PROJECT_REQUESTS } from "../../../constants";
import PrimaryButton from "@/src/components/buttons/PrimaryButton";

export default function Projects() { 
    return (<div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="w-1/2">
          <h1 className="text-2xl font-bold text-primary-dark">Projects</h1>
          <p className="text-secondary-text text-sm sm:text-base">
            Track and manage your ongoing projects and services.
          </p>
        </div>
        <div>
          <PrimaryButton tittle={"New project"} icon={<FaPlus />} />
        </div>
      </div>

      <div className="">
        <div className="flex items-center justify-between bg-primary-light/40 rounded-t-xl p-4">
          <h1 className="text-xl font-semibold text-primary-dark">
            All Projects
          </h1>
          <div className="flex space-x-3">
            {/* <button className="flex text-primary items-center space-x-2 border border-primary px-4 py-2 rounded-lg hover:bg-tetiary">
              <FaFilter className="w-4 h-4" />
              <span>Filter</span>
            </button> */}
          </div>
        </div>

        <div className="overflow-x-auto bg-primary-light/10 border border-primary-light/20 overflow-hidden shadow-md transit duration-200">
          <table className="w-full">
            <thead className="bg-primary-light/40 border-b border-tetiary">
              <tr>
                <th className="text-left p-4 text-xs font-bold text-primary-dark uppercase tracking-wider">
                  Project
                </th>
                <th className="text-left p-4 text-xs font-bold text-primary-dark uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left p-4 text-xs font-bold text-primary-dark uppercase tracking-wider">
                  Location
                </th>
                <th className="text-left p-4 text-xs font-bold text-primary-dark uppercase tracking-wider">
                  Owner
                </th>
                <th className="text-left p-4 text-xs font-bold text-primary-dark uppercase tracking-wider">
                  Progress
                </th>
                <th className="text-left p-4 text-xs font-bold text-primary-dark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {PROJECT_REQUESTS.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-tetiary hover:bg-primary/20"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-primary-dark">
                        {project.name}
                      </p>
                      <p className="text-sm text-secondary-text">
                        Due: {new Date(project.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="p-4 text-body-text">{project.location}</td>
                  <td className="p-4 text-body-text">{project.owner}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-secondary-light/80 rounded-full h-2">
                        <div
                          className="bg-primary/90 h-2 rounded-full"
                          style={{
                            width: `${getProgressPercentage(project.status)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-body-text">
                        {getProgressPercentage(project.status)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        // onClick={() => setSelectedProject(project)}
                        className="p-2 text-body-text hover:text-primary-light"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-body-text hover:text-primary-light">
                        <FaDownload className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
)}