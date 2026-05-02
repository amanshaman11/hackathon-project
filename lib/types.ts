export type PatientProfile = {
  conditions: string[];
  age?: number;
  sex?: 'male' | 'female' | 'other';
  priorTreatments: string[];
  notes?: string;
};

export type TrialLocation = {
  facility: string;
  city: string;
  state?: string;
  country: string;
  contact?: string;
};

export type Trial = {
  nctId: string;
  title: string;
  conditions: string[];
  briefSummary: string;
  eligibilityCriteria: string;
  minAge?: number;
  maxAge?: number;
  sex?: 'ALL' | 'MALE' | 'FEMALE';
  status: string;
  phases: string[];
  locations: TrialLocation[];
  url: string;
};

export type MatchResult = {
  nctId: string;
  matchScore: 'high' | 'medium' | 'low';
  scoreValue?: number; // 0-100, optional — falls back to categorical mapping
  whyEligible: string[];
  whyNotEligible: string[];
  simplifiedSummary: string;
  nextStep: string;
  trial: Trial;
};

export type MatchResponse = {
  patient: PatientProfile;
  matches: MatchResult[];
};
