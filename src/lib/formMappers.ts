import { ApplicationFormData } from '@/schemas/applicationSchema';

/**
 * Maps frontend form data (camelCase French) to backend API format (English).
 * Frontend uses: dateNaissance, lieuNaissance, posteActuel, etc.
 * Backend expects: dateOfBirth, placeOfBirth, currentPosition, etc.
 */
export function mapFormToBackend(
  data: ApplicationFormData
): {
  nom: string;
  prenom: string;
  nationalite: string;
  sexe: string;
  dateOfBirth: string;
  placeOfBirth: string;
  phoneNumber: string;
  email: string;
  organization: string;
  country: string;
  department: string;
  currentPosition: string;
  taskDescription: string;
  diploma: string;
  institution: string;
  field: string;
  languages: string[];
  languageLevels: Record<string, string>;
  expectedResults: string;
  otherInformation: string;
  fundingSource: string[];
  institutionName: string;
  contactPerson: string;
  contactEmail: string;
  informationSource: string;
  consent: boolean;
} {
  return {
    // Step 1 - General Info
    nom: data.nom,
    prenom: data.prenom,
    nationalite: data.nationalite,
    sexe: data.sexe,
    dateOfBirth: data.dateNaissance,
    placeOfBirth: data.lieuNaissance,
    phoneNumber: data.telephone,
    email: data.email,
    organization: data.organisation,
    country: data.pays,

    // Step 2 - Professional Details
    department: data.departement,
    currentPosition: data.posteActuel,
    taskDescription: data.descriptionTaches,

    // Step 3 - Education
    diploma: data.diplome,
    institution: data.institution,
    field: data.domaine,
    languages: data.langues,
    languageLevels: data.niveaux,

    // Step 4 - Additional Info
    expectedResults: data.resultatsAttendus,
    otherInformation: data.autresInfos,

    // Step 5 - Funding
    fundingSource: [data.mode],
    institutionName: data.institutionFinancement,
    contactPerson: data.contactFinancement,
    contactEmail: data.emailContactFinancement,
    informationSource: data.source,

    // Consent
    consent: data.consentement,
  };
}
