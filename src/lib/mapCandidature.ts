// src/lib/mapCandidature.ts
export type FrenchForm = {
  nom: string;
  prenom: string;
  nationalite: string;
  sexe: string;
  date_naissance: string;       // "YYYY-MM-DD" OK (ISO 8601 date)
  lieu_naissance: string;
  telephone: string;
  email: string;
  organisation?: string | null;
  pays: string;

  departement?: string | null;
  poste_actuel: string;
  description_taches: string;

  diplome: string;
  institution: string;
  domaine: string;
  langues: string[];
  niveaux: Record<string, string>;

  resultats_attendus: string;
  autres_infos?: string | null;

  mode_financement: string;     // radio (ex: "Vous-même")
  institution_financement?: string | null;
  contact_financement?: string | null;
  email_contact_financement?: string | null;

  source_information: string;
  consentement: boolean;
};

export function mapFormFRtoEN(v: FrenchForm) {
  return {
    // Step 1
    firstName: v.prenom,
    lastName: v.nom,
    nationality: v.nationalite,
    gender: v.sexe,
    dateOfBirth: v.date_naissance,         // déjà ISO "YYYY-MM-DD"
    placeOfBirth: v.lieu_naissance,
    phoneNumber: v.telephone,
    email: v.email,
    organization: v.organisation ?? null,
    country: v.pays,

    // Step 2
    department: v.departement ?? null,
    currentPosition: v.poste_actuel,
    taskDescription: v.description_taches,

    // Step 3
    diploma: v.diplome,
    institution: v.institution,
    field: v.domaine,
    languages: v.langues ?? [],
    languageLevels: v.niveaux ?? {},

    // Step 4
    expectedResults: v.resultats_attendus,
    otherInformation: v.autres_infos ?? null,

    // Step 5
    fundingSource: v.mode_financement ? [v.mode_financement] : [], // ARRAY requis par le backend
    institutionName: v.institution_financement ?? null,
    contactPerson: v.contact_financement ?? null,
    contactEmail: v.email_contact_financement ?? null,
    informationSource: v.source_information,

    // Divers
    consent: !!v.consentement,
  };
}
