export interface Template {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  category: string;
  previewImage?: string;
  features: string[];
}

export const TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Corporate Blue',
    description: 'A clean, trust-focused design ideal for standard enterprise communication.',
    primaryColor: '#1E3A8A', // Blue 900
    secondaryColor: '#3B82F6', // Blue 500
    accentColor: '#DBEAFE', // Blue 100
    category: 'Enterprise',
    features: ['Professional Header', 'Clean Typography', 'Standard Layout'],
  },
  {
    id: '2',
    name: 'Minimal Professional',
    description: 'Focus on content with this lightweight, high-readability template.',
    primaryColor: '#1F2937', // Gray 800
    secondaryColor: '#6B7280', // Gray 500
    accentColor: '#F3F4F6', // Gray 100
    category: 'Minimalist',
    features: ['High White Space', 'Modern Sans-serif', 'Compact Design'],
  },
  {
    id: '3',
    name: 'UAE Modern',
    description: 'Inspired by Dubai technology hubs, blending luxury with modern tech.',
    primaryColor: '#065F46', // Emerald 800
    secondaryColor: '#10B981', // Emerald 500
    accentColor: '#ECFDF5', // Emerald 50
    category: 'Regional',
    features: ['Tech-focused icons', 'Emerald Accents', 'Geometric Patterns'],
  },
  {
    id: '4',
    name: 'Elegant Gold',
    description: 'Premium feel for high-priority executive approvals and certificates.',
    primaryColor: '#78350F', // Amber 900
    secondaryColor: '#D97706', // Amber 600
    accentColor: '#FEF3C7', // Amber 100
    category: 'Premium',
    features: ['Gold Borders', 'Serif Headings', 'Watermark Support'],
  },
  {
    id: '5',
    name: 'Government Style',
    description: 'Official authoritative look following public sector documentation standards.',
    primaryColor: '#991B1B', // Red 800
    secondaryColor: '#EF4444', // Red 500
    accentColor: '#FEE2E2', // Red 100
    category: 'Official',
    features: ['Official Seals Space', 'Legal Typography', 'Multi-page Support'],
  },
];
