// src/lib/mapCandidature.ts

export type CandidaturePayload = {
  firstName: string;
  lastName: string;
  nationality: string;
  gender: string;
  dateOfBirth: string; // 'YYYY-MM-DD'
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

  fundingSource: string[]; // array obligatoire
  institutionName: string | null;
  contactPerson: string | null;
  contactEmail: string | null;

  informationSource: string;
  consent: boolean;
};

type UnknownRecord = Record<string, unknown>;

// --- Helpers de typage sûrs (pas de any) ---
const pick = (obj: UnknownRecord, key: string): unknown =>
  Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;

const getUnknown = (
  obj: UnknownRecord,
  en: string,
  fr?: string
): unknown => {
  const enVal = pick(obj, en);
  if (enVal !== undefined) return enVal;
  return fr ? pick(obj, fr) : undefined;
};

const asString = (v: unknown, fallback = ''): string =>
  typeof v === 'string' ? v : fallback;

const asNullableString = (v: unknown): string | null =>
  typeof v === 'string' && v.trim() !== '' ? v : null;

const asStringArray = (v: unknown, fallback: string[] = []): string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string') ? (v as string[]) : fallback;

const asRecordStringString = (
  v: unknown,
  fallback: Record<string, string> = {}
): Record<string, string> => {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    const entries = Object.entries(v as Record<string, unknown>).filter(
      ([k, val]) => typeof k === 'string' && typeof val === 'string'
    ) as [string, string][];
    return Object.fromEntries(entries);
  }
  return fallback;
};

const asBoolean = (v: unknown): boolean =>
  typeof v === 'boolean' ? v : Boolean(v);

// ----------------------------------------------------

/**
 * Transforme les valeurs du form (FR ou EN) vers le payload attendu par le backend.
 */
export function mapFormToCandidature(v: UnknownRecord): CandidaturePayload {
  // fundingSource: string | string[] -> string[]
  const fundingRaw = getUnknown(v, 'fundingSource', 'mode_financement');
  const fundingSource =
    Array.isArray(fundingRaw)
      ? asStringArray(fundingRaw)
      : (typeof fundingRaw === 'string' && fundingRaw ? [fundingRaw] : []);

  return {
    // Step 1
    firstName: asString(getUnknown(v, 'firstName', 'prenom')),
    lastName: asString(getUnknown(v, 'lastName', 'nom')),
    nationality: asString(getUnknown(v, 'nationality', 'nationalite')),
    gender: asString(getUnknown(v, 'gender', 'sexe')),
    dateOfBirth: asString(getUnknown(v, 'dateOfBirth', 'date_naissance')),
    placeOfBirth: asString(getUnknown(v, 'placeOfBirth', 'lieu_naissance')),
    phoneNumber: asString(getUnknown(v, 'phoneNumber', 'telephone')),
    email: asString(getUnknown(v, 'email', 'email')),
    organization: asNullableString(getUnknown(v, 'organization', 'organisation')),
    country: asString(getUnknown(v, 'country', 'pays')),

    // Step 2
    department: asNullableString(getUnknown(v, 'department', 'departement')),
    currentPosition: asString(getUnknown(v, 'currentPosition', 'poste_actuel')),
    taskDescription: asString(getUnknown(v, 'taskDescription', 'description_taches')),

    // Step 3
    diploma: asString(getUnknown(v, 'diploma', 'diplome')),
    institution: asString(getUnknown(v, 'institution', 'institution')),
    field: asString(getUnknown(v, 'field', 'domaine')),
    languages: asStringArray(getUnknown(v, 'languages', 'langues')),
    languageLevels: asRecordStringString(getUnknown(v, 'languageLevels', 'niveaux')),

    // Step 4
    expectedResults: asString(getUnknown(v, 'expectedResults', 'resultats_attendus')),
    otherInformation: asNullableString(getUnknown(v, 'otherInformation', 'autres_infos')),

    // Step 5
    fundingSource,
    institutionName: asNullableString(getUnknown(v, 'institutionName', 'institution_financement')),
    contactPerson: asNullableString(getUnknown(v, 'contactPerson', 'contact_financement')),
    contactEmail: asNullableString(getUnknown(v, 'contactEmail', 'email_contact_financement')),
    informationSource: asString(getUnknown(v, 'informationSource', 'source_information')),

    // Divers
    consent: asBoolean(getUnknown(v, 'consent', 'consentement')),
  };
}

// (facultatif) export par défaut pour autoriser `import mapFormToCandidature from '...'`
export default mapFormToCandidature;
