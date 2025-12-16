import { ApplicationFormData } from '@/schemas/applicationSchema';

export type BackendCandidaturePayload = {
  firstName: string;
  lastName: string;
  nationality: string;
  gender: string;
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
  contactEmail: string | null;
  informationSource: string;
  consent: boolean;
};

/** Mappe les champs camelCase FR du formulaire vers ceux attendus par l'API backend. */
export function mapFormToBackend(data: ApplicationFormData): BackendCandidaturePayload {
  return {
    firstName: data.prenom,
    lastName: data.nom,
    nationality: data.nationalite,
    gender: data.sexe,
    dateOfBirth: data.dateNaissance,
    placeOfBirth: data.lieuNaissance,
    phoneNumber: data.telephone,
    email: data.email,
    organization: data.organisation ?? '',
    country: data.pays,
    department: data.departement ?? '',
    currentPosition: data.posteActuel,
    taskDescription: data.descriptionTaches,
    diploma: data.diplome,
    institution: data.institution,
    field: data.domaine,
    languages: data.langues,
    languageLevels: data.niveaux,
    expectedResults: data.resultatsAttendus,
    otherInformation: data.autresInfos ?? '',
    fundingSource: data.mode ? [data.mode] : [],
    institutionName: data.institutionFinancement ?? '',
    contactPerson: data.contactFinancement ?? '',
    contactEmail: data.emailContactFinancement ?? null,
    informationSource: data.source,
    consent: data.consentement,
  };
}
