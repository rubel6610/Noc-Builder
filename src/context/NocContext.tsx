import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NocFormData } from '../types/noc';

interface NocContextType {
  nocData: NocFormData | null;
  saveNocData: (data: NocFormData) => void;
  clearNocData: () => void;
}

const NocContext = createContext<NocContextType | undefined>(undefined);

export function NocProvider({ children }: { children: ReactNode }) {
  const [nocData, setNocData] = useState<NocFormData | null>(null);

  const saveNocData = (data: NocFormData) => {
    setNocData(data);
    console.log('NOC Data saved to context');
  };

  const clearNocData = () => {
    setNocData(null);
  };

  return (
    <NocContext.Provider value={{ nocData, saveNocData, clearNocData }}>
      {children}
    </NocContext.Provider>
  );
}

export function useNoc() {
  const context = useContext(NocContext);
  if (context === undefined) {
    throw new Error('useNoc must be used within a NocProvider');
  }
  return context;
}
