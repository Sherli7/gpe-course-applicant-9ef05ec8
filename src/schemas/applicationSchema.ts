import { z } from 'zod';

const phoneRegex = /^\+[\d\s()-]{7,}$/;

export const applicationSchema = z.object({
  // Step 1: General Information
  nom: z.string().min(1, 'validation.required'),
  prenom: z.string().min(1, 'validation.required'),
  nationalite: z.string().min(1, 'validation.required'),
  sexe: z.enum(['Homme', 'Femme'], { message: 'validation.required' }),
  dateNaissance: z.string()
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
  lieuNaissance: z.string().min(1, 'validation.required'),
  telephone: z.string()
    .min(1, 'validation.required')
    .regex(phoneRegex, 'validation.phone'),
  email: z.string()
    .min(1, 'validation.required')
    .email('validation.email'),
  organization: z.string().min(1, 'validation.required'),
  country: z.string().min(1, 'validation.required'),

  // Step 2: Professional Details
  departement: z.string().min(1, 'validation.required'),
  posteActuel: z.string().min(1, 'validation.required'),
  descriptionTaches: z.string().min(1, 'validation.required'),

  // Step 3: Education
  diploma: z.string().min(1, 'validation.required'),
  institution: z.string().min(1, 'validation.required'),
  field: z.string().min(1, 'validation.required'),
  languages: z.array(z.string()).min(1, 'validation.required'),
  languageLevels: z.record(z.string(), z.string()),

  // Step 4: Additional Information
  resultatsAttendus: z.string().min(1, 'validation.required'),
  autres_infos: z.string().optional(),

  // Step 5: Funding
  mode: z.string().min(1, 'validation.required'),
  institutionFinancement: z.string().optional().nullable(),
  contactFinancement: z.string().optional().nullable(),
  email_contactFinancement: z.string()
    .optional()
    .nullable()
    .refine(
      (email) => !email || email === '' || z.string().email().safeParse(email).success,
      'validation.email'
    ),
  source: z.string().min(1, 'validation.required'),
  consentement: z.boolean().refine((val) => val === true, 'validation.required')
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
  nom: true,
  prenom: true,
  nationalite: true,
  sexe: true,
  dateNaissance: true,
  lieuNaissance: true,
  telephone: true,
  email: true,
  organization: true,
  country: true
});

export const step2Schema = applicationSchema.pick({
  departement: true,
  posteActuel: true,
  descriptionTaches: true
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
  resultatsAttendus: true,
  autres_infos: true
});

export const step5Schema = applicationSchema.pick({
  mode: true,
  institutionFinancement: true,
  contactFinancement: true,
  email_contactFinancement: true,
  source: true,
  consentement: true
});