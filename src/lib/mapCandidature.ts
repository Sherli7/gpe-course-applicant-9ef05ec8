// src/lib/mapCandidature.ts

export type CandidaturePayload = {
  firstName: string;
  lastName: string;
  nationality: string;
  gender: string;
  dateOfBirth: string;               // 'YYYY-MM-DD'
  placeOfBirth: string;
  phoneNumber: string;
  email: string;
  organization: string | null;
  country: string;

  department: string | null;
  currentPosition: string;
  taskDescription: string;

  diploma: string;
  institution: string;
  field: string;
  languages: string[];
  languageLevels: Record<string, string>;

  expectedResults: string;
  otherInformation: string | null;

  fundingSource: string[];           // array obligatoire
  institutionName: string | null;
  contactPerson: string | null;
  contactEmail: string | null;

  informationSource: string;
  consent: boolean;
};

type AnyObj = Record<string, any>;

// Utilitaire: lit d’abord la clé EN, sinon la FR
const get = (obj: AnyObj, en: string, fr?: string) =>
  obj?.[en] ?? (fr ? obj?.[fr] : undefined);

/**
 * Transforme les valeurs du form (FR ou EN) vers le payload attendu par le backend.
 */
export function mapFormToCandidature(v: AnyObj): CandidaturePayload {
  const fundingOne = get(v, 'fundingSource', 'mode_financement');
  const fundingSource: string[] = Array.isArray(fundingOne)
    ? fundingOne
    : (fundingOne ? [fundingOne] : []);

  return {
    // Step 1
    firstName: get(v, 'firstName', 'prenom') ?? '',
    lastName: get(v, 'lastName', 'nom') ?? '',
    nationality: get(v, 'nationality', 'nationalite') ?? '',
    gender: get(v, 'gender', 'sexe') ?? '',
    dateOfBirth: get(v, 'dateOfBirth', 'date_naissance') ?? '',
    placeOfBirth: get(v, 'placeOfBirth', 'lieu_naissance') ?? '',
    phoneNumber: get(v, 'phoneNumber', 'telephone') ?? '',
    email: get(v, 'email', 'email') ?? '',
    organization: get(v, 'organization', 'organisation') ?? null,
    country: get(v, 'country', 'pays') ?? '',

    // Step 2
    department: get(v, 'department', 'departement') ?? null,
    currentPosition: get(v, 'currentPosition', 'poste_actuel') ?? '',
    taskDescription: get(v, 'taskDescription', 'description_taches') ?? '',

    // Step 3
    diploma: get(v, 'diploma', 'diplome') ?? '',
    institution: get(v, 'institution', 'institution') ?? '',
    field: get(v, 'field', 'domaine') ?? '',
    languages: get(v, 'languages', 'langues') ?? [],
    languageLevels: get(v, 'languageLevels', 'niveaux') ?? {},

    // Step 4
    expectedResults: get(v, 'expectedResults', 'resultats_attendus') ?? '',
    otherInformation: get(v, 'otherInformation', 'autres_infos') ?? null,

    // Step 5
    fundingSource,
    institutionName: get(v, 'institutionName', 'institution_financement') ?? null,
    contactPerson: get(v, 'contactPerson', 'contact_financement') ?? null,
    contactEmail: get(v, 'contactEmail', 'email_contact_financement') ?? null,
    informationSource: get(v, 'informationSource', 'source_information') ?? '',

    // Divers
    consent: !!(get(v, 'consent', 'consentement')),
  };
}

// (facultatif) si tu veux aussi permettre l’import par défaut
export default mapFormToCandidature;
