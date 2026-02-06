import { FaAngleRight } from "react-icons/fa6";

const ViewAll = () => {
  return (
    <div className="flex items-center gap-1 text-primary-dark font-medium cursor-pointer transform transition-all duration-300 hover:scale-105 hover:text-primary-dark">
      <p className="">View All </p>
      <FaAngleRight />
    </div>
  );
};

export default ViewAll;
