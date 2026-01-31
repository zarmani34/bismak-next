'use client'

import { createContext, useContext, useState, ReactNode } from 'react';

type PortalType = 'client' | 'staff' | 'admin';

interface PortalContextType {
  portal: PortalType;
  setPortal: (portal: PortalType) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [portal, setPortal] = useState<PortalType>('client');

  return (
    <PortalContext.Provider value={{ portal, setPortal }}>
      {children}
    </PortalContext.Provider>
  );
}

// custom hook to use the context
export function usePortal() {
  const context = useContext(PortalContext);
  
  if (context === undefined) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  
  return context;
}
