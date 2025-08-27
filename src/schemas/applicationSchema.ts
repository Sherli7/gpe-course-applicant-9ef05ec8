import { z } from 'zod';

const phoneRegex = /^\+[\d\s()-]{7,}$/;

export const applicationSchema = z.object({
  // Step 1: General Information
  lastName: z.string().min(1, 'validation.required'),
  firstName: z.string().min(1, 'validation.required'),
  nationality: z.string().min(1, 'validation.required'),
  gender: z.enum(['Homme', 'Femme'], { message: 'validation.required' }),
  dateOfBirth: z.string()
    .min(1, 'validation.required')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }, 'validation.minAge'),
  placeOfBirth: z.string().min(1, 'validation.required'),
  phoneNumber: z.string()
    .min(1, 'validation.required')
    .regex(phoneRegex, 'validation.phone'),
  email: z.string()
    .min(1, 'validation.required')
    .email('validation.email'),
  organization: z.string().min(1, 'validation.required'),
  country: z.string().min(1, 'validation.required'),

  // Step 2: Professional Details
  department: z.string().min(1, 'validation.required'),
  currentPosition: z.string().min(1, 'validation.required'),
  taskDescription: z.string().min(1, 'validation.required'),

  // Step 3: Education
  diploma: z.string().min(1, 'validation.required'),
  institution: z.string().min(1, 'validation.required'),
  field: z.string().min(1, 'validation.required'),
  languages: z.array(z.string()).min(1, 'validation.required'),
  languageLevels: z.record(z.string(), z.string()),

  // Step 4: Additional Information
  expectedResults: z.string().min(1, 'validation.required'),
  otherInfo: z.string().optional(),

  // Step 5: Funding
  fundingMode: z.string().min(1, 'validation.required'),
  fundingInstitution: z.string().optional().nullable(),
  fundingContact: z.string().optional().nullable(),
  fundingContactEmail: z.string()
    .optional()
    .nullable()
    .refine(
      (email) => !email || email === '' || z.string().email().safeParse(email).success,
      'validation.email'
    ),
  informationSource: z.string().min(1, 'validation.required'),
  consent: z.boolean().refine((val) => val === true, 'validation.required')
}).refine((data) => {
  // Validate that every selected language has a level
  return data.languages.every((language) => data.languageLevels[language] && data.languageLevels[language].trim() !== '');
}, {
  message: 'validation.languageLevel',
  path: ['languageLevels']
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

// Schema for each step validation
export const step1Schema = applicationSchema.pick({
  lastName: true,
  firstName: true,
  nationality: true,
  gender: true,
  dateOfBirth: true,
  placeOfBirth: true,
  phoneNumber: true,
  email: true,
  organization: true,
  country: true
});

export const step2Schema = applicationSchema.pick({
  department: true,
  currentPosition: true,
  taskDescription: true
});

export const step3Schema = applicationSchema.pick({
  diploma: true,
  institution: true,
  field: true,
  languages: true,
  languageLevels: true
}).refine((data) => {
  return data.languages.every((language) => data.languageLevels[language] && data.languageLevels[language].trim() !== '');
}, {
  message: 'validation.languageLevel',
  path: ['languageLevels']
});

export const step4Schema = applicationSchema.pick({
  expectedResults: true,
  otherInfo: true
});

export const step5Schema = applicationSchema.pick({
  fundingMode: true,
  fundingInstitution: true,
  fundingContact: true,
  fundingContactEmail: true,
  informationSource: true,
  consent: true
});