import type { MatchResponse } from './types';

export function getMockResults(description: string): MatchResponse {
  const lower = description.toLowerCase();

  const isLungCancer = lower.includes('lung') || lower.includes('nsclc') || lower.includes('non-small');
  const isBreast = lower.includes('breast');
  const isDiabetes = lower.includes('diabetes') || lower.includes('diabetic') || lower.includes('metformin');

  if (isBreast) return BREAST_CANCER_RESPONSE;
  if (isDiabetes) return DIABETES_RESPONSE;
  return LUNG_CANCER_RESPONSE; // default / lung cancer
}

const LUNG_CANCER_RESPONSE: MatchResponse = {
  patient: {
    conditions: ['non-small cell lung cancer'],
    age: 62,
    priorTreatments: ['chemotherapy'],
    notes: 'stage III',
  },
  matches: [
    {
      nctId: 'NCT04513925',
      matchScore: 'high',
      scoreValue: 91,
      whyEligible: [
        'Non-small cell lung cancer matches the primary study indication',
        'Age 62 is within the eligible range of 18–75',
        'Prior chemotherapy meets the required treatment history',
        'Stage III disease aligns with inclusion criteria',
      ],
      whyNotEligible: [],
      simplifiedSummary:
        'This study tests a combination of two immunotherapy drugs for lung cancer patients who have already received chemotherapy. Participants receive monthly infusions for up to 2 years.',
      nextStep: 'Contact the study coordinator at Oregon Health & Science University — currently enrolling.',
      trial: {
        nctId: 'NCT04513925',
        title: 'Pembrolizumab + Docetaxel for Previously Treated Stage III/IV NSCLC',
        conditions: ['Non-Small Cell Lung Cancer'],
        briefSummary: 'A phase II study evaluating pembrolizumab in combination with docetaxel in patients with previously treated advanced NSCLC.',
        eligibilityCriteria: 'Adults 18–75 with confirmed NSCLC, ECOG PS 0-2, prior platinum-based chemotherapy.',
        minAge: 18,
        maxAge: 75,
        sex: 'ALL',
        status: 'RECRUITING',
        phases: ['Phase 2'],
        locations: [
          { facility: 'OHSU Knight Cancer Institute', city: 'Portland', state: 'OR', country: 'USA' },
          { facility: 'UCLA Jonsson Cancer Center', city: 'Los Angeles', state: 'CA', country: 'USA' },
        ],
        url: 'https://clinicaltrials.gov/study/NCT04513925',
      },
    },
    {
      nctId: 'NCT05112744',
      matchScore: 'high',
      scoreValue: 84,
      whyEligible: [
        'NSCLC diagnosis matches study focus on lung adenocarcinoma',
        'Age and performance status meet enrollment requirements',
        'Previous chemotherapy line satisfies prior treatment criterion',
      ],
      whyNotEligible: [
        'EGFR/ALK mutation status must be confirmed before enrollment',
      ],
      simplifiedSummary:
        'This trial studies a new targeted drug for lung cancer patients whose tumors have a specific gene change (KRAS G12C mutation). A quick biopsy test can determine eligibility.',
      nextStep: 'Ask your oncologist to test for the KRAS G12C mutation — results take about 1 week.',
      trial: {
        nctId: 'NCT05112744',
        title: 'Sotorasib Monotherapy in KRAS G12C-Mutant Advanced NSCLC (Phase 3)',
        conditions: ['Non-Small Cell Lung Cancer', 'Lung Adenocarcinoma'],
        briefSummary: 'Phase 3 trial of sotorasib vs. docetaxel in patients with KRAS G12C-mutant advanced NSCLC after prior platinum therapy.',
        eligibilityCriteria: 'Adults ≥18 with KRAS G12C+ NSCLC, 1–2 prior lines of therapy including platinum.',
        minAge: 18,
        sex: 'ALL',
        status: 'RECRUITING',
        phases: ['Phase 3'],
        locations: [
          { facility: 'MD Anderson Cancer Center', city: 'Houston', state: 'TX', country: 'USA' },
          { facility: 'Memorial Sloan Kettering', city: 'New York', state: 'NY', country: 'USA' },
        ],
        url: 'https://clinicaltrials.gov/study/NCT05112744',
      },
    },
    {
      nctId: 'NCT04619004',
      matchScore: 'medium',
      scoreValue: 63,
      whyEligible: [
        'Lung cancer diagnosis is within the study scope',
        'Age range broadly compatible',
      ],
      whyNotEligible: [
        'Study requires no prior immunotherapy — confirm with your doctor',
        'Brain metastases must be stable for at least 4 weeks',
      ],
      simplifiedSummary:
        'This study tests a new combination of radiation and immunotherapy for stage III lung cancer. Treatment is delivered over 6 weeks at a specialized cancer center.',
      nextStep: 'Review with your radiation oncologist to confirm no prior immunotherapy exposure.',
      trial: {
        nctId: 'NCT04619004',
        title: 'Chemoradiation + Durvalumab for Unresectable Stage III NSCLC',
        conditions: ['Non-Small Cell Lung Cancer'],
        briefSummary: 'Randomized phase II study of concurrent chemoradiotherapy with or without durvalumab in unresectable stage III NSCLC.',
        eligibilityCriteria: 'Adults ≥18 with unresectable stage III NSCLC, no prior immunotherapy, ECOG PS 0-1.',
        minAge: 18,
        sex: 'ALL',
        status: 'RECRUITING',
        phases: ['Phase 2'],
        locations: [
          { facility: 'Mayo Clinic', city: 'Rochester', state: 'MN', country: 'USA' },
        ],
        url: 'https://clinicaltrials.gov/study/NCT04619004',
      },
    },
    {
      nctId: 'NCT05289167',
      matchScore: 'medium',
      scoreValue: 55,
      whyEligible: [
        'Lung cancer diagnosis meets broad eligibility',
        'Prior systemic treatment history is compatible',
      ],
      whyNotEligible: [
        'Study targets early-stage disease — stage III may be excluded',
        'Must not have received more than 2 prior lines of therapy',
      ],
      simplifiedSummary:
        'A vaccine-based study that trains the immune system to attack lung cancer cells. Patients receive a series of injections over 6 months alongside standard care.',
      nextStep: 'Discuss with your oncologist whether your current treatment plan allows for trial co-enrollment.',
      trial: {
        nctId: 'NCT05289167',
        title: 'Personalized Neoantigen Vaccine (mRNA-4157) + Pembrolizumab in Resected NSCLC',
        conditions: ['Non-Small Cell Lung Cancer'],
        briefSummary: 'Phase 2 study of individualized neoantigen vaccine mRNA-4157 in combination with pembrolizumab as adjuvant therapy in resected stage IB–IIIA NSCLC.',
        eligibilityCriteria: 'Adults ≥18 with resected stage IB–IIIA NSCLC, no prior PD-1/PD-L1 therapy.',
        minAge: 18,
        sex: 'ALL',
        status: 'RECRUITING',
        phases: ['Phase 2'],
        locations: [
          { facility: 'Dana-Farber Cancer Institute', city: 'Boston', state: 'MA', country: 'USA' },
          { facility: 'Stanford Cancer Center', city: 'Stanford', state: 'CA', country: 'USA' },
        ],
        url: 'https://clinicaltrials.gov/study/NCT05289167',
      },
    },
    {
      nctId: 'NCT04487080',
      matchScore: 'low',
      scoreValue: 37,
      whyEligible: [
        'General lung cancer eligibility broadly met',
      ],
      whyNotEligible: [
        'Study is limited to small cell lung cancer (SCLC) — not NSCLC',
        'Requires no prior PD-L1 treatment',
      ],
      simplifiedSummary:
        'This trial tests a new drug combination for small cell lung cancer, a different type than non-small cell. Listed here as a low match for awareness — confirm your cancer subtype.',
      nextStep: 'Confirm your specific lung cancer subtype with your oncologist before considering this trial.',
      trial: {
        nctId: 'NCT04487080',
        title: 'Atezolizumab + Tiragolumab for Extensive-Stage Small Cell Lung Cancer',
        conditions: ['Small Cell Lung Cancer'],
        briefSummary: 'Phase 3 trial of atezolizumab plus tiragolumab vs. atezolizumab plus placebo in extensive-stage SCLC.',
        eligibilityCriteria: 'Adults ≥18 with extensive-stage SCLC, no prior systemic therapy.',
        minAge: 18,
        sex: 'ALL',
        status: 'RECRUITING',
        phases: ['Phase 3'],
        locations: [
          { facility: 'University of Chicago Medicine', city: 'Chicago', state: 'IL', country: 'USA' },
        ],
        url: 'https://clinicaltrials.gov/study/NCT04487080',
      },
    },
  ],
};

const BREAST_CANCER_RESPONSE: MatchResponse = {
  patient: {
    conditions: ['breast cancer'],
    age: 54,
    priorTreatments: ['mastectomy'],
    notes: 'estrogen receptor positive',
  },
  matches: [
    {
      nctId: 'NCT04961307',
      matchScore: 'high',
      scoreValue: 88,
      whyEligible: [
        'ER-positive breast cancer matches the study target population',
        'Post-surgical status is compatible with enrollment',
        'Age 54 is within the eligible range',
      ],
      whyNotEligible: [],
      simplifiedSummary:
        'This study tests a hormone-blocking drug combined with a new targeted therapy for ER-positive breast cancer. Participants take daily oral medication for up to 5 years.',
      nextStep: 'Contact the study site at Memorial Sloan Kettering to schedule a screening visit.',
      trial: {
        nctId: 'NCT04961307',
        title: 'Ribociclib + Letrozole for HR-Positive HER2-Negative Early Breast Cancer',
        conditions: ['Breast Cancer', 'HR-Positive Breast Cancer'],
        briefSummary: 'Phase 3 trial of ribociclib plus endocrine therapy vs. endocrine therapy alone in HR+/HER2- early breast cancer.',
        eligibilityCriteria: 'Adults ≥18 with HR+/HER2- stage II–III breast cancer, completed local therapy.',
        minAge: 18,
        sex: 'FEMALE',
        status: 'RECRUITING',
        phases: ['Phase 3'],
        locations: [
          { facility: 'Memorial Sloan Kettering Cancer Center', city: 'New York', state: 'NY', country: 'USA' },
          { facility: 'Mayo Clinic', city: 'Rochester', state: 'MN', country: 'USA' },
        ],
        url: 'https://clinicaltrials.gov/study/NCT04961307',
      },
    },
    {
      nctId: 'NCT05188482',
      matchScore: 'medium',
      scoreValue: 66,
      whyEligible: [
        'Breast cancer diagnosis fits study criteria',
        'Post-mastectomy status is acceptable',
      ],
      whyNotEligible: [
        'HER2 status needs to be confirmed — study targets HER2-positive patients',
      ],
      simplifiedSummary:
        'A study of a targeted therapy drug for HER2-positive breast cancer patients after surgery. Requires a specific protein marker (HER2) to be present on your tumor.',
      nextStep: 'Check your pathology report for HER2 status — ask your oncologist if you are unsure.',
      trial: {
        nctId: 'NCT05188482',
        title: 'Trastuzumab Deruxtecan Adjuvant Therapy in HER2-Positive Breast Cancer',
        conditions: ['Breast Cancer', 'HER2-Positive Breast Cancer'],
        briefSummary: 'Phase 3 trial of trastuzumab deruxtecan vs. trastuzumab emtansine as adjuvant therapy in HER2-positive breast cancer.',
        eligibilityCriteria: 'Adults ≥18 with HER2-positive early breast cancer with residual invasive disease after neoadjuvant therapy.',
        minAge: 18,
        sex: 'ALL',
        status: 'RECRUITING',
        phases: ['Phase 3'],
        locations: [
          { facility: 'Johns Hopkins Sidney Kimmel Cancer Center', city: 'Baltimore', state: 'MD', country: 'USA' },
        ],
        url: 'https://clinicaltrials.gov/study/NCT05188482',
      },
    },
  ],
};

const DIABETES_RESPONSE: MatchResponse = {
  patient: {
    conditions: ['type 2 diabetes'],
    age: 45,
    priorTreatments: ['metformin'],
    notes: undefined,
  },
  matches: [
    {
      nctId: 'NCT04907604',
      matchScore: 'high',
      scoreValue: 86,
      whyEligible: [
        'Type 2 diabetes diagnosis matches the study population',
        'Current metformin use meets the prior treatment requirement',
        'Age 45 is within the eligible range of 30–70',
      ],
      whyNotEligible: [],
      simplifiedSummary:
        'This study tests a new weekly injection for type 2 diabetes that aims to lower blood sugar and promote weight loss. Participants are followed for 18 months.',
      nextStep: 'Contact the trial site at Joslin Diabetes Center — open enrollment, no waitlist.',
      trial: {
        nctId: 'NCT04907604',
        title: 'Semaglutide vs. Tirzepatide in Adults with Type 2 Diabetes on Metformin',
        conditions: ['Type 2 Diabetes Mellitus'],
        briefSummary: 'Phase 4 head-to-head comparison of once-weekly semaglutide and tirzepatide in adults with T2D inadequately controlled on metformin.',
        eligibilityCriteria: 'Adults 30–70 with T2D, HbA1c 7.5–11%, on metformin monotherapy ≥3 months.',
        minAge: 30,
        maxAge: 70,
        sex: 'ALL',
        status: 'RECRUITING',
        phases: ['Phase 4'],
        locations: [
          { facility: 'Joslin Diabetes Center', city: 'Boston', state: 'MA', country: 'USA' },
          { facility: 'University of Colorado Anschutz', city: 'Aurora', state: 'CO', country: 'USA' },
        ],
        url: 'https://clinicaltrials.gov/study/NCT04907604',
      },
    },
    {
      nctId: 'NCT05033678',
      matchScore: 'medium',
      scoreValue: 59,
      whyEligible: [
        'Type 2 diabetes diagnosis is within scope',
        'Age range broadly compatible',
      ],
      whyNotEligible: [
        'Study requires HbA1c ≥8.0% — recent labs needed to confirm',
        'Must not have used insulin in the past 6 months',
      ],
      simplifiedSummary:
        'A study testing a new pill-form medication to improve blood sugar control in type 2 diabetes. Participants visit the clinic monthly for 12 months.',
      nextStep: 'Get a recent HbA1c blood test if you do not have one from the past 3 months.',
      trial: {
        nctId: 'NCT05033678',
        title: 'Novel SGLT2 Inhibitor in Poorly Controlled Type 2 Diabetes',
        conditions: ['Type 2 Diabetes Mellitus'],
        briefSummary: 'Phase 2 study of a novel SGLT2 inhibitor in adults with T2D and HbA1c ≥8.0% on oral antidiabetic agents.',
        eligibilityCriteria: 'Adults 25–65 with T2D, HbA1c 8.0–11.5%, no insulin use in past 6 months.',
        minAge: 25,
        maxAge: 65,
        sex: 'ALL',
        status: 'RECRUITING',
        phases: ['Phase 2'],
        locations: [
          { facility: 'Cleveland Clinic', city: 'Cleveland', state: 'OH', country: 'USA' },
        ],
        url: 'https://clinicaltrials.gov/study/NCT05033678',
      },
    },
  ],
};
