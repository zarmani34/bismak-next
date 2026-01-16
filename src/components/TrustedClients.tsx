'use client';
import { motion } from 'framer-motion';
import { ClientCard } from './OurClientCard';
import { CLIENTS } from '../utils/constatnts';

const TrustedClients = () => {
  
  // Split clients into 3 rows
  const row1 = CLIENTS.slice(0, 16);
  const row2 = CLIENTS.slice(16, 32);
  const row3 = CLIENTS.slice(32, 48);

  return (
    <section className="py-20 bg-tetiary overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-[#D95C3E] font-semibold text-sm uppercase tracking-wide mb-3">
            Trusted Partners
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-4">
            Our Valued Clients
          </h2>
          <p className="text-body-text max-w-2xl mx-auto text-lg">
            Partnering with Nigeria's leading operators in the oil, gas, and energy sectors
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-tetiary to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-tetiary to-transparent z-10 pointer-events-none"></div>

        <div className="space-y-6">
          <motion.div
            animate={{
              x: [0, -1920],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 30,
                ease: 'linear',
              },
            }}
            className="flex gap-6"
          >
            {row1.map((client, index) => (
              <ClientCard key={`row1-${client.id}-${index}`} client={client} />
            ))}
          </motion.div>

          <motion.div
            animate={{
              x: [-1920, 0],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 35,
                ease: 'linear',
              },
            }}
            className="flex gap-6"
          >
            {row2.map((client, index) => (
              <ClientCard key={`row2-${client.id}-${index}`} client={client} />
            ))}
          </motion.div>

          <motion.div
            animate={{
              x: [0, -1920],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 40,
                ease: 'linear',
              },
            }}
            className="flex gap-6"
          >
            {row3.map((client, index) => (
              <ClientCard key={`row3-${client.id}-${index}`} client={client} />
            ))}
          </motion.div>
        </div>
      </div>

      

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-body-text mb-6 text-lg">
            Join our growing list of satisfied clients
          </p>
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#D95C3E] hover:bg-[#c4512a] text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Partner With Us
          </motion.button> */}
        </motion.div>
    </section>
  );
};

export default TrustedClients;