import { z } from 'zod';

// Téléphone international simple (E.164 light)
const phoneRegex = /^\+?[1-9]\d{7,14}$/;

export const applicationSchema = z
  .object({
    // Étape 1 — Infos générales
    nom: z.string().min(1, 'validation.required'),
    prenom: z.string().min(1, 'validation.required'),
    nationalite: z.string().min(1, 'validation.required'),
    sexe: z.enum(['Homme', 'Femme', 'Autre'], { message: 'validation.required' }),
    dateNaissance: z
      .string()
      .min(1, 'validation.required')
      .refine((date) => {
        const d = new Date(date);
        if (isNaN(d.getTime())) return false;
        const t = new Date();
        let age = t.getFullYear() - d.getFullYear();
        const m = t.getMonth() - d.getMonth();
        if (m < 0 || (m === 0 && t.getDate() < d.getDate())) age--;
        return age >= 18;
      }, 'validation.minAge'),
    lieuNaissance: z.string().min(1, 'validation.required'),
    telephone: z.string().min(1, 'validation.required').regex(phoneRegex, 'validation.phone'),
    email: z.string().min(1, 'validation.required').email('validation.email'),
    organisation: z.string().optional().nullable().default(''),
    pays: z.string().min(1, 'validation.required'),

    // Étape 2 — Pro
    departement: z.string().min(1, 'validation.required'),
    posteActuel: z.string().min(1, 'validation.required'),
    descriptionTaches: z.string().min(1, 'validation.required'),

    // Étape 3 — Éducation & langues
    diplome: z.string().min(1, 'validation.required'),
    institution: z.string().min(1, 'validation.required'),
    domaine: z.string().min(1, 'validation.required'),
    langues: z.array(z.string()).min(1, 'validation.required'),
    niveaux: z.record(z.string(), z.enum(['Débutant', 'Intermédiaire', 'Avancé', 'Natif'])),

    // Étape 4 — Infos supp.
    resultatsAttendus: z.string().min(1, 'validation.required'),
    autresInfos: z.string().optional().nullable(),

    // Étape 5 — Financement
    mode: z.enum(['Vous-même', 'Institution', 'Autre'], { message: 'validation.required' }),
    institutionFinancement: z.string().optional().nullable(),
    contactFinancement: z.string().optional().nullable(),
    emailContactFinancement: z
      .string()
      .optional()
      .nullable()
      .refine(
        (email) => !email || email === '' || z.string().email().safeParse(email).success,
        'validation.email'
      ),
    source: z.string().min(1, 'validation.required'),
    consentement: z.boolean().refine((v) => v === true, 'validation.required'),
  })
  // Chaque langue cochée doit avoir un niveau
  .refine(
    (data) => data.langues.every((l) => typeof data.niveaux[l] === 'string' && data.niveaux[l].trim() !== ''),
    { message: 'validation.languageLevel', path: ['niveaux'] }
  )
  // Si Institution/Autre → 3 champs requis
  .refine(
    (data) => {
      if (data.mode === 'Institution' || data.mode === 'Autre') {
        return !!(data.institutionFinancement && data.contactFinancement && data.emailContactFinancement);
      }
      return true;
    },
    { message: 'validation.fundingRequired', path: ['mode'] }
  );

export type ApplicationFormData = z.infer<typeof applicationSchema>;

// Schémas par étape (même shape FR)
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
  pays: true,
});

export const step2Schema = applicationSchema.pick({
  departement: true,
  posteActuel: true,
  descriptionTaches: true,
});

export const step3Schema = applicationSchema
  .pick({
    diplome: true,
    institution: true,
    domaine: true,
    langues: true,
    niveaux: true,
  })
  .refine(
    (data) =>
      data.langues.every((l) => typeof data.niveaux[l] === 'string' && data.niveaux[l].trim() !== ''),
    { message: 'validation.languageLevel', path: ['niveaux'] }
  );

export const step4Schema = applicationSchema.pick({
  resultatsAttendus: true,
  autresInfos: true,
});

export const step5Schema = applicationSchema.pick({
  mode: true,
  institutionFinancement: true,
  contactFinancement: true,
  emailContactFinancement: true,
  source: true,
  consentement: true,
});
