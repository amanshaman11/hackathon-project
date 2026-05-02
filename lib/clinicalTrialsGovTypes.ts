/**
 * Types for ClinicalTrials.gov REST API v2 — GET /studies list response.
 * @see https://clinicaltrials.gov/data-api/api
 *
 * The registry returns a large nested document; we model the list envelope and
 * the protocolSection subtree we consume. Other fields remain open via index
 * signatures where useful.
 */

export type CtgovStudiesListResponse = {
  studies?: CtgovStudy[];
  nextPageToken?: string;
  totalCount?: number;
};

export type CtgovStudy = {
  protocolSection: CtgovProtocolSection;
  derivedSection?: CtgovDerivedSection;
  annotationSection?: Record<string, unknown>;
  documentSection?: Record<string, unknown>;
  resultsSection?: Record<string, unknown>;
  hasResults?: boolean;
};

export type CtgovDerivedSection = {
  miscInfoModule?: {
    versionHolder?: string;
    removedCountries?: string[];
    submissionTracking?: Record<string, unknown>;
  };
  conditionBrowseModule?: Record<string, unknown>;
  interventionBrowseModule?: Record<string, unknown>;
  [key: string]: unknown;
};

export type CtgovProtocolSection = {
  identificationModule?: CtgovIdentificationModule;
  statusModule?: CtgovStatusModule;
  sponsorCollaboratorsModule?: Record<string, unknown>;
  oversightModule?: Record<string, unknown>;
  descriptionModule?: CtgovDescriptionModule;
  conditionsModule?: CtgovConditionsModule;
  designModule?: CtgovDesignModule;
  armsInterventionsModule?: Record<string, unknown>;
  outcomesModule?: Record<string, unknown>;
  eligibilityModule?: CtgovEligibilityModule;
  contactsLocationsModule?: CtgovContactsLocationsModule;
  referencesModule?: Record<string, unknown>;
  ipdSharingStatementModule?: Record<string, unknown>;
};

export type CtgovIdentificationModule = {
  nctId?: string;
  nctIdAliases?: string[];
  orgStudyIdInfo?: { id?: string; type?: string; link?: string };
  secondaryIdInfos?: Array<Record<string, unknown>>;
  briefTitle?: string;
  officialTitle?: string;
  acronym?: string;
  organization?: { fullName?: string; class?: string };
};

export type CtgovStatusModule = {
  statusVerifiedDate?: string;
  overallStatus?: string;
  lastKnownStatus?: string;
  delayedPosting?: boolean;
  whyStopped?: string;
  expandedAccessInfo?: Record<string, unknown>;
  startDateStruct?: { date?: string; type?: string };
  primaryCompletionDateStruct?: { date?: string; type?: string };
  completionDateStruct?: { date?: string; type?: string };
  studyFirstSubmitDate?: string;
  studyFirstSubmitQcDate?: string;
  studyFirstPostDateStruct?: { date?: string; type?: string };
  resultsWaived?: boolean;
  resultsFirstSubmitDate?: string;
  resultsFirstSubmitQcDate?: string;
  resultsFirstPostDateStruct?: { date?: string; type?: string };
  dispFirstSubmitDate?: string;
  dispFirstSubmitQcDate?: string;
  dispFirstPostDateStruct?: { date?: string; type?: string };
  lastUpdateSubmitDate?: string;
  lastUpdatePostDateStruct?: { date?: string; type?: string };
};

export type CtgovDescriptionModule = {
  briefSummary?: string;
  detailedDescription?: string;
};

export type CtgovConditionsModule = {
  conditions?: string[];
  keywords?: string[];
};

export type CtgovDesignModule = {
  studyType?: string;
  nPtrsToThisExpAccNctId?: number;
  expandedAccessTypes?: Record<string, boolean>;
  patientRegistry?: boolean;
  targetDuration?: string;
  phases?: string[];
  designInfo?: Record<string, unknown>;
  bioSpec?: Record<string, unknown>;
  enrollmentInfo?: { count?: number; type?: string };
};

export type CtgovEligibilityModule = {
  eligibilityCriteria?: string;
  healthyVolunteers?: boolean;
  sex?: 'FEMALE' | 'MALE' | 'ALL';
  genderBased?: boolean;
  genderDescription?: string;
  minimumAge?: string;
  maximumAge?: string;
  stdAges?: string[];
  studyPopulation?: string;
  samplingMethod?: string;
};

export type CtgovLocation = {
  facility?: string;
  status?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  contacts?: Array<{
    name?: string;
    role?: string;
    phone?: string;
    phoneExt?: string;
    email?: string;
  }>;
  geoPoint?: { lat?: number; lon?: number };
};

export type CtgovContactsLocationsModule = {
  centralContacts?: Array<Record<string, unknown>>;
  overallOfficials?: Array<Record<string, unknown>>;
  locations?: CtgovLocation[];
};
