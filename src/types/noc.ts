import { z } from 'zod';

export const NocSchema = z.object({
  employeeName: z.string().min(2, 'Name must be at least 2 characters'),
  fatherName: z.string().min(2, 'Father name must be at least 2 characters'),
  passportNumber: z.string().min(6, 'Invalid passport number'),
  emiratesId: z.string().regex(/^784-\d{4}-\d{7}-\d{1}$/, 'Format: 784-XXXX-XXXXXXX-X'),
  nationality: z.string().min(2, 'Please enter nationality'),
  jobTitle: z.string().min(2, 'Job title is required'),
  companyName: z.string().min(2, 'Company name is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  managerName: z.string().min(2, 'Manager name is required'),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  address: z.string().min(5, 'Please enter a valid address'),
  remarks: z.string().optional(),
});

export type NocFormData = z.infer<typeof NocSchema>;
