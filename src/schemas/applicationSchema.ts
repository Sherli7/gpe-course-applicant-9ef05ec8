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
  organisation: z.string().min(1, 'validation.required'),
  pays: z.string().min(1, 'validation.required'),

  // Step 2: Professional Details
  departement: z.string().min(1, 'validation.required'),
  posteActuel: z.string().min(1, 'validation.required'),
  descriptionTaches: z.string().min(1, 'validation.required'),

  // Step 3: Education
  diplome: z.string().min(1, 'validation.required'),
  institution: z.string().min(1, 'validation.required'),
  domaine: z.string().min(1, 'validation.required'),
  langues: z.array(z.string()).min(1, 'validation.required'),
  niveaux: z.record(z.string(), z.string()),

  // Step 4: Additional Information
  resultatsAttendus: z.string().min(1, 'validation.required'),
  autresInfos: z.string().optional(),

  // Step 5: Funding
  modeFinancement: z.string().min(1, 'validation.required'),
  institutionFinancement: z.string().optional().nullable(),
  contactFinancement: z.string().optional().nullable(),
  emailContactFinancement: z.string()
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
  dateNaissance: true,
  lieuNaissance: true,
  telephone: true,
  email: true,
  organisation: true,
  pays: true
});

export const step2Schema = applicationSchema.pick({
  departement: true,
  posteActuel: true,
  descriptionTaches: true
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
  resultatsAttendus: true,
  autresInfos: true
});

export const step5Schema = applicationSchema.pick({
  modeFinancement: true,
  institutionFinancement: true,
  contactFinancement: true,
  emailContactFinancement: true,
  source: true,
  consentement: true
});