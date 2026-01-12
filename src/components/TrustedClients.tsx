'use client';
import { motion } from 'framer-motion';
import { ClientCard } from './OurClientCard';
import { Client } from '../utils/types';

const TrustedClients = () => {
  const clients: Client[] = [
    { id: 1, name: 'Zim Gas LTD', logo: 'NNPC', sector: 'Oil & Gas' },
    { id: 2, name: 'Maxwell International Venturs LTD', logo: 'SPDC', sector: 'Oil & Gas' },
    { id: 3, name: 'Selai Gas Station LTD', logo: 'CVX', sector: 'Oil & Gas' },
    { id: 4, name: 'Total Energies', logo: 'TTE', sector: 'Oil & Gas' },
    { id: 5, name: 'ExxonMobil', logo: 'XOM', sector: 'Oil & Gas' },
    { id: 6, name: 'Ameogo Gas Accurate Grace LTD', logo: 'SEP', sector: 'Oil & Gas' },
    { id: 7, name: 'Oando Energy', logo: 'OAN', sector: 'Oil & Gas' },
    { id: 8, name: 'Dangote Refinery', logo: 'DNG', sector: 'Refining' },
    { id: 9, name: 'Dobum Nigeria LTD', logo: 'AIT', sector: 'Oil & Gas' },
    { id: 10, name: 'Conoil', logo: 'CON', sector: 'Oil & Gas' },
    { id: 11, name: 'NIPCO', logo: 'NPC', sector: 'Oil & Gas' },
    { id: 12, name: 'Forte Oil', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 13, name: 'Emayh Nigeria LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 14, name: 'Hansreal Petroleum LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 15, name: 'Mikel Energy LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 16, name: 'Fowobi Nigeria Enterprises LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 17, name: 'Yerevan Oil and Gas LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 18, name: 'DPL Limited Bisfun Petroleum LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 19, name: 'Sedabuk Oil and Gas LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 20, name: 'Gate Link Oil and Gas LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 21, name: 'Wheel Oil LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 22, name: '247 Finance Investment LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 23, name: 'Habod Gas Ltd', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 24, name: 'City Gas Ltd', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 25, name: 'Second Coming Nigeria Ltd', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 26, name: 'NNPC', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 27, name: 'Crown Flour Mill LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 28, name: 'Placid LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 29, name: 'Sweet Nutrition LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 30, name: 'Mohaz Oil and Gas LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 31, name: 'Mikano International LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 32, name: 'Ade Gas LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 33, name: 'Anchor Gas LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 34, name: 'Gunon Oil and Gas LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 35, name: 'VeeVee Products LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 36, name: 'Purechem Manfacturing LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 37, name: 'AshKash Nigeria LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 38, name: 'Matrix Energy LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 39, name: '11 Plc', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 40, name: 'BHR Gas LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 41, name: 'Petrocam Gas LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 42, name: 'Messers Maxwell International Ventures LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 43, name: 'Mega Plastic LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 44, name: 'Gas Terminaling LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 45, name: 'Elesther Energy LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 46, name: 'Crown Deluxe LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 47, name: 'Fatgbems LTD', logo: 'FTO', sector: 'Oil & Gas' },
    { id: 48, name: 'Biswal', logo: 'FTO', sector: 'Oil & Gas' },
  ];

  // Split clients into 3 rows
  const row1 = clients.slice(0, 16);
  const row2 = clients.slice(16, 32);
  const row3 = clients.slice(32, 48);

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