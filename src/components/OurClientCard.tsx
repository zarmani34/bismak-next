import { motion } from "framer-motion";
import { Client } from "../utils/types";

export const ClientCard = ({ client }: { client: Client }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, borderColor: "#37574a" }}
      transition={{ duration: 0.3 }}
      className="shrink-0 w-44 h-16 md:w-64 md:h-24 bg-primary/20 rounded-xl px-4 md:p-6 border border-border shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-center "
    >
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-10 h-10 md:w-16 md:h-16  rounded-lg flex items-center justify-center shrink-0"
        >
          {client.img ? (
            <div className="border-2 border-primary">
              <img
                src={client.img}
                alt={`${client.abbreviation} logo`}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <span className="text-white font-bold text-sm bg-linear-to-br from-primary to-primary-light rounded-lg w-full h-full flex items-center justify-center overflow-hidden">
              {client.abbreviation}
            </span>
          )}
        </motion.div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#333333] mb-1 truncate">
            {client.name}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};
