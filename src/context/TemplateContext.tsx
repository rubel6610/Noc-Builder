import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Template } from '../data/templates';

interface TemplateContextType {
  selectedTemplate: Template | null;
  selectTemplate: (template: Template) => void;
  clearTemplate: () => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const selectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    console.log(`Template selected: ${template.name}`);
  };

  const clearTemplate = () => {
    setSelectedTemplate(null);
  };

  return (
    <TemplateContext.Provider value={{ selectedTemplate, selectTemplate, clearTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplates() {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplates must be used within a TemplateProvider');
  }
  return context;
}
