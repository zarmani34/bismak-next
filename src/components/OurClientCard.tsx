import { motion } from 'framer-motion';
import { Client } from '../utils/types';

export const ClientCard = ({ client }: { client: Client }) => {
   return ( 
   <motion.div
      whileHover={{ scale: 1.05, borderColor: '#37574a' }}
      transition={{ duration: 0.3 }}
      className="shrink-0 w-64 bg-primary/20 rounded-xl p-6 border border-border shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="w-16 h-16 bg-linear-to-br from-[#37574a] to-[#4a6b5c] rounded-lg flex items-center justify-center flex-shrink-0"
        >
          <span className="text-white font-bold text-sm">
            {client.logo}
          </span>
        </motion.div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#333333] mb-1 truncate">
            {client.name}
          </h3>
          <span className="text-xs text-[#8a8a8a] bg-[#F6F5D9] px-2 py-1 rounded-full inline-block">
            {client.sector}
          </span>
        </div>
      </div>
    </motion.div>)
  };