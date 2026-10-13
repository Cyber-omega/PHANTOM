export interface AuthenticBrand {
  id: string;
  name: string;
  canonicalDomains: string[];
  primaryAsn: string;
  trustedIssuers: string[];
  minAgeYears: number;
  logoKeywords: string[];
  sensitiveFields: string[];
}

export interface BoundingBox {
  x: number; // percentage from left
  y: number; // percentage from top
  width: number;
  height: number;
}

export interface VisionDetection {
  id: string;
  class: 'form_input_credential' | 'form_input_secret' | 'brand_badge' | 'action_button';
  label: string;
  confidence: number;
  bbox: BoundingBox;
  risk: 'benign' | 'high_target' | 'critical_target' | 'impersonated_badge' | 'exfil_trigger';
}

export interface EvidenceFactor {
  name: string;
  impact: string;
  weight: number;
  description: string;
}

export interface BayesianResult {
  posteriorRisk: number; // 0.0 to 1.0
  priorRisk: number;
  evidenceFactors: EvidenceFactor[];
  decision: 'ALLOW' | 'SUSPICIOUS' | 'QUARANTINE_HONEYPOT';
}

export interface TelemetryData {
  domain: string;
  domainAgeDays: number;
  registrar: string;
  asn: string;
  country: string;
  tlsIssuer: string;
  tlsCertValidDays: number;
  isFreeDV: boolean;
  hasSensitiveInputs: boolean;
  externalExfilAction: boolean;
}

export interface HoneypotPayload {
  canaryTrackingToken: string;
  decoyIdentity: {
    fullName: string;
    username: string;
    email: string;
    password: string;
    fake2FA: string;
    creditCardNumber: string;
    cardExp: string;
    cvv: string;
  };
  injectedHeaders: Record<string, string>;
  actionStrategy: string;
  exfiltrationTripwire: string;
}

export interface HistoricalThreatEntry {
  id: string;
  domain: string;
  claimedBrand: string;
  targetBrandId: string;
  dateOfDetection: string; // ISO string
  dateOfDetectionFormatted: string;
  visualFingerprint: {
    phash: string; // 64-bit perceptual hash hex
    dominantColors: string[];
    layoutSignature: string;
    clipEmbeddingDistance: number;
    componentLayoutHash: string;
  };
  semanticFeatures: {
    lexicalLevenshtein: number;
    subdomainStacking: boolean;
    homoglyphsDetected: boolean;
    tld: string;
    asn: string;
    registrar: string;
    tlsIssuer: string;
    harvestedFields: string[];
    c2ExfilRoute: string;
  };
  attackCampaign: string;
  confidenceRating: number;
  threatSeverity: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  timesSeen: number;
  status: 'CONFIRMED_MALICIOUS' | 'ACTIVE_C2' | 'TAKEDOWN_ISSUED';
  notes: string;
}

export interface HistoricalMatchResult {
  hasMatch: boolean;
  matchType:
    | 'EXACT_DOMAIN_MATCH'
    | 'VISUAL_FINGERPRINT_REUSE'
    | 'INFRASTRUCTURE_CAMPAIGN_CLUSTER'
    | 'CAMPAIGN_DOMAIN_MUTATION'
    | 'NONE';
  matchedEntry: HistoricalThreatEntry | null;
  similarityScore: number; // 0.0 to 1.0
  correlationBasis: string;
  impactOnBayesianRisk: {
    priorBoost: number;
    likelihoodRatioMultiplier: number;
    description: string;
  };
}

export interface AnalysisResponse {
  url: string;
  host: string;
  claimedBrand: AuthenticBrand;
  isCanonical: boolean;
  lexical: {
    rawDistance: number;
    normalizedDistance: number;
    closestCanonical: string;
    homoglyphs: {
      hasHomoglyphs: boolean;
      details: string[];
    };
  };
  telemetry: TelemetryData;
  vision: {
    model: string;
    claimedBrandVisualConfidence: number;
    perceptualHashDistance: number;
    detectedObjects: VisionDetection[];
    visualSimilarityMatch: string;
    currentPhash?: string;
  };
  historicalMatch: HistoricalMatchResult | null;
  bayesianArbiter: BayesianResult;
  honeypot: HoneypotPayload | null;
  timestamp: string;
}

export interface InterceptEvent {
  id: string;
  timestamp: string;
  targetDomain: string;
  claimedBrand: string;
  attackerMethod: string;
  capturedPayload: Record<string, string>;
  canaryToken: string;
  responseInjected: string;
  attackerIp: string;
}

export interface ScenarioPreset {
  id: string;
  name: string;
  category: 'Critical Phish' | 'Corporate Impersonation' | 'Homoglyph Attack' | 'Crypto Drainer' | 'Authentic Benchmark';
  url: string;
  claimedBrandId: string;
  description: string;
  expectedRisk: number;
  mockPage: {
    brandName: string;
    headline: string;
    subheadline: string;
    badgeUrl?: string;
    primaryColor: string;
    accentColor: string;
    logoIcon: string;
    fields: Array<{
      id: string;
      label: string;
      placeholder: string;
      type: string;
      defaultValue?: string;
    }>;
    buttonText: string;
    formAction: string;
    exfiltrationNote?: string;
  };
}
