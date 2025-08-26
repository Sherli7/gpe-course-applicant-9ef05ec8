import { z } from 'zod';

const phoneRegex = /^\+[\d\s()-]{7,}$/;

export const applicationSchema = z.object({
  // Step 1: General Information
  nom: z.string().min(1, 'validation.required'),
  prenom: z.string().min(1, 'validation.required'),
  nationalite: z.string().min(1, 'validation.required'),
  sexe: z.enum(['Homme', 'Femme'], { message: 'validation.required' }),
  date_naissance: z.string()
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
  lieu_naissance: z.string().min(1, 'validation.required'),
  telephone: z.string()
    .min(1, 'validation.required')
    .regex(phoneRegex, 'validation.phone'),
  email: z.string()
    .min(1, 'validation.required')
    .email('validation.email'),
  organisation: z.string().min(1, 'validation.required'),
  pays: z.string().min(1, 'validation.required'),

  // Step 2: Professional Details
  departement: z.string().min(1, 'validation.required'),
  poste_actuel: z.string().min(1, 'validation.required'),
  description_taches: z.string().min(1, 'validation.required'),

  // Step 3: Education
  diplome: z.string().min(1, 'validation.required'),
  institution: z.string().min(1, 'validation.required'),
  domaine: z.string().min(1, 'validation.required'),
  langues: z.array(z.string()).min(1, 'validation.required'),
  niveaux: z.record(z.string(), z.string()),

  // Step 4: Additional Information
  resultats_attendus: z.string().min(1, 'validation.required'),
  autres_infos: z.string().optional(),

  // Step 5: Funding
  mode_financement: z.string().min(1, 'validation.required'),
  institution_financement: z.string().optional().nullable(),
  contact_financement: z.string().optional().nullable(),
  email_contact_financement: z.string()
    .optional()
    .nullable()
    .refine(
      (email) => !email || email === '' || z.string().email().safeParse(email).success,
      'validation.email'
    ),
  source_information: z.string().min(1, 'validation.required'),
  consentement: z.boolean().refine((val) => val === true, 'validation.required')
}).refine((data) => {
  // Validate that every selected language has a level
  return data.langues.every(langue => data.niveaux[langue] && data.niveaux[langue].trim() !== '');
}, {
  message: 'validation.languageLevel',
  path: ['niveaux']
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

// Schema for each step validation
export const step1Schema = applicationSchema.pick({
  nom: true,
  prenom: true,
  nationalite: true,
  sexe: true,
  date_naissance: true,
  lieu_naissance: true,
  telephone: true,
  email: true,
  organisation: true,
  pays: true
});

export const step2Schema = applicationSchema.pick({
  departement: true,
  poste_actuel: true,
  description_taches: true
});

export const step3Schema = applicationSchema.pick({
  diplome: true,
  institution: true,
  domaine: true,
  langues: true,
  niveaux: true
}).refine((data) => {
  return data.langues.every(langue => data.niveaux[langue] && data.niveaux[langue].trim() !== '');
}, {
  message: 'validation.languageLevel',
  path: ['niveaux']
});

export const step4Schema = applicationSchema.pick({
  resultats_attendus: true,
  autres_infos: true
});

export const step5Schema = applicationSchema.pick({
  mode_financement: true,
  institution_financement: true,
  contact_financement: true,
  email_contact_financement: true,
  source_information: true,
  consentement: true
});