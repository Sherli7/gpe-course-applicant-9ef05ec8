import { z } from 'zod';

const phoneRegex = /^\+?[1-9]\d{7,14}$/;

export const SEXES = ['Homme', 'Femme'] as const;
export type Sexe = typeof SEXES[number];

export const LEVELS = ['Débutant', 'Intermédiaire', 'Avancé', 'Natif'] as const;
export type Level = typeof LEVELS[number];

export const FUNDING = ['Vous-même', 'institutionFinancement', 'Autre'] as const;
export type Mode = typeof FUNDING[number];

export const applicationSchema = z.object({
  // Étape 1 — Infos générales
  nom: z.string().max(100, 'validation.maxLength').min(1, 'validation.required'),
  prenom: z.string().max(100, 'validation.maxLength').min(1, 'validation.required'),
  nationalite: z.string().max(50, 'validation.maxLength').min(1, 'validation.required'),
  sexe: z.enum(SEXES, { message: 'validation.required' }),
  dateNaissance: z.string().min(1, 'validation.required').refine((date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return false;
    const t = new Date();
    let age = t.getFullYear() - d.getFullYear();
    const m = t.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && t.getDate() < d.getDate())) age--;
    return age >= 18;
  }, 'validation.minAge'),
  lieuNaissance: z.string().max(50, 'validation.maxLength').min(1, 'validation.required'),
  telephone: z.string().min(1, 'validation.required').regex(phoneRegex, 'validation.phone'),
  email: z.string().min(1, 'validation.required').email('validation.email').max(150, 'validation.maxLength'),
  organisation: z.string().max(200, 'validation.maxLength').optional().nullable().default(''),
  pays: z.string().max(50, 'validation.maxLength').min(1, 'validation.required'),

  // Étape 2 — Pro
  departement: z.string().max(100, 'validation.maxLength').optional().nullable().default(''),
  posteActuel: z.string().max(100, 'validation.maxLength').min(1, 'validation.required'),
  descriptionTaches: z.string().max(500, 'validation.maxLength').min(1, 'validation.required'),

  // Étape 3 — Éducation & langues
  diplome: z.string().max(50, 'validation.maxLength').min(1, 'validation.required'),
  institutionFinancement: z.string().max(200, 'validation.maxLength').min(1, 'validation.required'),
  domaine: z.string().max(100, 'validation.maxLength').min(1, 'validation.required'),
  langues: z.array(z.string().max(50, 'validation.maxLength')).min(1, 'validation.required'),
  niveaux: z.record(z.string().max(50, 'validation.maxLength'), z.enum(LEVELS)).default({}),

  // Étape 4 — Infos supp.
  resultatsAttendus: z.string().max(500, 'validation.maxLength').min(1, 'validation.required'),
  autresInfos: z.string().max(1000, 'validation.maxLength').optional().nullable().default(''),

  // Étape 5 — Financement
  mode: z.enum(FUNDING, { message: 'validation.required' }),
  institutionFinancementFinancement: z.string().max(200, 'validation.maxLength').optional().nullable().default(''),
  contactFinancement: z.string().max(100, 'validation.maxLength').optional().nullable().default(''),
  emailContactFinancement: z
    .string()
    .max(150, 'validation.maxLength')
    .optional()
    .nullable()
    .default('')
    .refine((email) => !email || email === '' || z.string().email().safeParse(email).success, 'validation.email'),
  source: z.string().max(50, 'validation.maxLength').min(1, 'validation.required'),
  consentement: z.boolean().refine((v) => v === true, 'validation.required'),
})
.refine(
  (data) => data.langues.every((l) => typeof data.niveaux[l] === 'string' && (data.niveaux[l] as string).trim() !== ''),
  { message: 'validation.languageLevel', path: ['niveaux'] }
)
.refine(
  (data) => {
    if (data.mode !== 'Vous-même') {
      return !!(data.institutionFinancementFinancement && data.contactFinancement && data.emailContactFinancement);
    }
    return true;
  },
  { message: 'validation.fundingRequired', path: ['mode'] }
);

export type ApplicationFormData = z.infer<typeof applicationSchema>;

/* Schémas par étape */
export const step1Schema = applicationSchema.pick({
  nom: true, prenom: true, nationalite: true, sexe: true,
  dateNaissance: true, lieuNaissance: true, telephone: true,
  email: true, organisation: true, pays: true,
});

export const step2Schema = applicationSchema.pick({
  departement: true, posteActuel: true, descriptionTaches: true,
});

export const step3Schema = applicationSchema.pick({
  diplome: true, institutionFinancement: true, domaine: true, langues: true, niveaux: true,
}).refine(
  (data) => data.langues.every((l) => typeof data.niveaux[l] === 'string' && (data.niveaux[l] as string).trim() !== ''),
  { message: 'validation.languageLevel', path: ['niveaux'] }
);

export const step4Schema = applicationSchema.pick({
  resultatsAttendus: true, autresInfos: true,
});

export const step5Schema = applicationSchema.pick({
  mode: true,
  institutionFinancementFinancement: true,
  contactFinancement: true,
  emailContactFinancement: true,
  source: true,
  consentement: true,
});
