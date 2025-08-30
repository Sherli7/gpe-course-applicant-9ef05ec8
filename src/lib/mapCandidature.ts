// src/lib/mapCandidature.ts

// -------------------- Types FRONT (inchangé) --------------------
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
  institutionFinancement: string;
  field: string;
  languages: string[];
  languageLevels: Record<string, string>;

  expectedResults: string;
  otherInformation: string | null;

  fundingSource: string[]; // ancien front: tableau
  institutionFinancementName: string | null;
  contactPerson: string | null;
  contactEmail: string | null;

  informationSource: string;
  consent: boolean;
};

// -------------------- Types BACKEND (nouveau) --------------------
const LEVELS = ['Débutant', 'Intermédiaire', 'Avancé', 'Natif'] as const;
export type AllowedLevel = typeof LEVELS[number];

const MODES = ['Vous-même', 'institutionFinancement', 'Autre'] as const;
export type Mode = typeof MODES[number];

const GENDERS = ['Homme', 'Femme', 'Autre'] as const;
export type Gender = typeof GENDERS[number];

export type BackendCandidature = {
  nom: string | null;
  prenom: string | null;
  nationalite: string | null;
  sexe: Gender | null;
  dateNaissance: string | null; // ISO 'YYYY-MM-DD'
  lieuNaissance: string | null;
  telephone: string | null;     // E.164
  email: string | null;

  organisation: string | null;
  pays: string | null;
  departement: string | null;
  posteActuel: string | null;
  descriptionTaches: string | null;

  diplome: string | null;
  institutionFinancement: string | null;
  domaine: string | null;

  langues: string[];
  niveaux: Record<string, AllowedLevel>;

  resultatsAttendus: string | null;
  autresInfos: string | null;

  mode: Mode;
  institutionFinancementFinancement: string | null;
  contactFinancement: string | null;
  emailContactFinancement: string | null;

  source: string | null;
  consentement: boolean;
};

type UnknownRecord = Record<string, unknown>;

// --- Helpers de typage sûrs ---
const pick = (obj: UnknownRecord, key: string): unknown =>
  Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;

const getUnknown = (obj: UnknownRecord, en: string, fr?: string): unknown => {
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

const asBoolean = (v: unknown): boolean => {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(s)) return true;
    if (['false', '0', 'no', 'off', ''].includes(s)) return false;
  }
  return Boolean(v);
};

// -------------------- Type guards & normalisations --------------------
const isAllowedLevel = (x: string): x is AllowedLevel =>
  (LEVELS as readonly string[]).includes(x);

const isMode = (x: string): x is Mode =>
  (MODES as readonly string[]).includes(x);

const isGender = (x: string): x is Gender =>
  (GENDERS as readonly string[]).includes(x);

export const normalizeLevel = (raw: unknown): AllowedLevel => {
  const v = asString(raw).trim();
  if (isAllowedLevel(v)) return v;
  const low = v.toLowerCase();
  if (low === 'courant' || low === 'fluent') return 'Avancé';
  if (low === 'native' || low === 'maternelle') return 'Natif';
  if (low.startsWith('deb')) return 'Débutant';
  if (low.startsWith('int')) return 'Intermédiaire';
  if (low.startsWith('av')) return 'Avancé';
  return 'Intermédiaire';
};

const normalizeGender = (raw: unknown): Gender | null => {
  const v = asString(raw).trim();
  if (isGender(v)) return v;
  const low = v.toLowerCase();
  if (['male', 'm', 'masculin'].includes(low)) return 'Homme';
  if (['female', 'f', 'féminin', 'feminin'].includes(low)) return 'Femme';
  return v ? 'Autre' : null;
};

/** Mappe anciens choix (tableau, libellés variés) -> {Vous-même|institutionFinancement|Autre} */
export const normalizeMode = (raw: unknown): Mode => {
  if (Array.isArray(raw)) {
    if (raw.length === 0) return 'Vous-même';
    const lowered: string[] = (raw as unknown[]).map((x: unknown) =>
      String(x).trim().toLowerCase()
    );
    const set = new Set<string>(lowered);
    if (set.has('institutionFinancement')) return 'institutionFinancement';
    if (set.has('autre') || set.has('other')) return 'Autre';
    if (set.has('vous-même') || set.has('vous-meme') || set.has('self') || set.has('self-funded')) {
      return 'Vous-même';
    }
    if (['employeur', 'sponsor', 'bourse', 'organisme', 'entreprise', 'organisme public']
      .some((k) => set.has(k))) {
      return 'institutionFinancement';
    }
    return 'Autre';
  }
  const v = asString(raw).trim();
  if (isMode(v)) return v;
  const low = v.toLowerCase();
  if (['self', 'self-funded', 'self funded', 'vous-meme', 'vous-même', 'autofinancement'].includes(low)) {
    return 'Vous-même';
  }
  if (['employeur', 'bourse', 'organisme', 'entreprise', 'sponsor', 'institutionFinancement', 'organisme public'].includes(low)) {
    return 'institutionFinancement';
  }
  return v ? 'Autre' : 'Vous-même';
};

// ----------------------------------------------------

/**
 * Transforme les valeurs du form (FR/EN) -> payload attendu par le backend (camelCase FR).
 * - Normalise `mode` et `niveaux`
 * - Remplit les champs de financement uniquement si mode ≠ "Vous-même"
 */
export function mapFormToCandidature(v: UnknownRecord): BackendCandidature {
  // ---------- Step 1 ----------
  const prenom = asString(getUnknown(v, 'firstName', 'prenom')) || null;
  const nom = asString(getUnknown(v, 'lastName', 'nom')) || null;
  const nationalite = asString(getUnknown(v, 'nationality', 'nationalite')) || null;
  const sexe = normalizeGender(getUnknown(v, 'gender', 'sexe'));
  const dateNaissance = asString(getUnknown(v, 'dateOfBirth', 'dateNaissance')) || null;
  const lieuNaissance = asString(getUnknown(v, 'placeOfBirth', 'lieuNaissance')) || null;
  const telephone = asString(getUnknown(v, 'phoneNumber', 'telephone')) || null;
  const email = asString(getUnknown(v, 'email', 'email')) || null;
  const organisation = asNullableString(getUnknown(v, 'organization', 'organisation'));
  const pays = asString(getUnknown(v, 'country', 'pays')) || null;

  // ---------- Step 2 ----------
  const departement = asNullableString(getUnknown(v, 'department', 'departement'));
  const posteActuel = asString(getUnknown(v, 'currentPosition', 'posteActuel')) || null;
  const descriptionTaches = asString(getUnknown(v, 'taskDescription', 'descriptionTaches')) || null;

  // ---------- Step 3 ----------
  const diplome = asString(getUnknown(v, 'diploma', 'diplome')) || null;
  const institutionFinancement = asString(getUnknown(v, 'institutionFinancement', 'institutionFinancement')) || null;
  const domaine = asString(getUnknown(v, 'field', 'domaine')) || null;

  const langues = asStringArray(getUnknown(v, 'languages', 'langues'), []);
  const niveauxInput = asRecordStringString(getUnknown(v, 'languageLevels', 'niveaux'), {});
  const niveaux: BackendCandidature['niveaux'] = {};
  Object.keys(niveauxInput).forEach((lang) => {
    niveaux[lang] = normalizeLevel(niveauxInput[lang]);
  });

  // ---------- Step 4 ----------
  const resultatsAttendus = asString(getUnknown(v, 'expectedResults', 'resultatsAttendus')) || null;
  const autresInfos = asNullableString(getUnknown(v, 'otherInformation', 'autres_infos'));

  // ---------- Step 5 (financement) ----------
  const rawMode =
    getUnknown(v, 'fundingMode') ??
    getUnknown(v, 'fundingSource', 'mode');
  const mode = normalizeMode(rawMode);

  const institutionFinancementFinancement =
    mode !== 'Vous-même'
      ? asString(getUnknown(v, 'institutionFinancementName', 'institutionFinancementFinancement'))
      : null;

  const contactFinancement =
    mode !== 'Vous-même'
      ? asString(getUnknown(v, 'contactPerson', 'contactFinancement'))
      : null;

  const emailContactFinancement =
    mode !== 'Vous-même'
      ? asString(getUnknown(v, 'contactEmail', 'email_contactFinancement'))
      : null;

  const source = asString(getUnknown(v, 'informationSource', 'source')) || null;

  // ---------- Divers ----------
  const consentement = asBoolean(getUnknown(v, 'consent', 'consentement'));

  // ---------- Payload BACKEND ----------
  return {
    nom,
    prenom,
    nationalite,
    sexe,
    dateNaissance,
    lieuNaissance,
    telephone,
    email,

    organisation,
    pays,
    departement,
    posteActuel,
    descriptionTaches,

    diplome,
    institutionFinancement,
    domaine,

    langues,
    niveaux,

    resultatsAttendus,
    autresInfos,

    mode,
    institutionFinancementFinancement,
    contactFinancement,
    emailContactFinancement,

    source,
    consentement
  };
}

// Export par défaut: la fonction qui renvoie le payload backend
export default mapFormToCandidature;
