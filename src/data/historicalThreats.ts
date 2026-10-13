import { HistoricalThreatEntry, HistoricalMatchResult } from '../types';

// Compute Hamming distance between two hexadecimal perceptual hashes
export function computeHammingDistance(hexA: string, hexB: string): number {
  if (!hexA || !hexB) return 64;
  let distance = 0;
  const len = Math.min(hexA.length, hexB.length);
  for (let i = 0; i < len; i++) {
    const valA = parseInt(hexA[i], 16) || 0;
    const valB = parseInt(hexB[i], 16) || 0;
    let xor = valA ^ valB;
    while (xor > 0) {
      distance += xor & 1;
      xor >>= 1;
    }
  }
  distance += Math.abs(hexA.length - hexB.length) * 4;
  return distance;
}

// Levenshtein distance calculation for string comparisons
export function computeLevenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));
  for (let i = 0; i <= an; ++i) matrix[0][i] = i;
  for (let i = 0; i <= bn; ++i) matrix[i][0] = i;
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[bn][an];
}

export const INITIAL_HISTORICAL_THREATS: HistoricalThreatEntry[] = [
  {
    id: 'THREAT-HIST-101',
    domain: 'paypal-verification-security.net',
    claimedBrand: 'PayPal',
    targetBrandId: 'paypal',
    dateOfDetection: '2026-08-14T11:22:00Z',
    dateOfDetectionFormatted: 'Aug 14, 2026',
    visualFingerprint: {
      phash: 'a8f13b2c90e4f5d1',
      dominantColors: ['#003087', '#0079C1'],
      layoutSignature: 'LOGO_TOP_CENTER:INPUT_CRED_2:BTN_SOLID_BLUE',
      clipEmbeddingDistance: 0.038,
      componentLayoutHash: 'PHISH_LAYOUT_PP_8F92',
    },
    semanticFeatures: {
      lexicalLevenshtein: 24,
      subdomainStacking: true,
      homoglyphsDetected: false,
      tld: '.net',
      asn: 'AS48314 (Hostinger / Bulletproof RU)',
      registrar: 'NameSilo LLC / PrivacyGuardian',
      tlsIssuer: "Let's Encrypt Authority X3 (Free DV)",
      harvestedFields: ['email', 'password', 'card_number', 'cvv'],
      c2ExfilRoute: '/v1/auth/capture',
    },
    attackCampaign: 'DEVILFISH-PAYPAL-HARVEST-2026',
    confidenceRating: 0.998,
    threatSeverity: 'CRITICAL',
    timesSeen: 24,
    status: 'CONFIRMED_MALICIOUS',
    notes: 'Mass credential harvest kit impersonating PayPal security verification. Known C2 exfiltration routes to bulletproof hosting proxies.',
  },
  {
    id: 'THREAT-HIST-102',
    domain: 'okta-sso-gateway365.cc',
    claimedBrand: 'Okta SSO',
    targetBrandId: 'okta',
    dateOfDetection: '2026-08-28T16:05:00Z',
    dateOfDetectionFormatted: 'Aug 28, 2026',
    visualFingerprint: {
      phash: '3c7e9a1120f4d8b6',
      dominantColors: ['#00297A', '#1662DD'],
      layoutSignature: 'LOGO_CENTER_HALO:INPUT_CRED_2:BTN_OKTA_PUSH',
      clipEmbeddingDistance: 0.042,
      componentLayoutHash: 'PHISH_LAYOUT_OKTA_33C1',
    },
    semanticFeatures: {
      lexicalLevenshtein: 18,
      subdomainStacking: true,
      homoglyphsDetected: false,
      tld: '.cc',
      asn: 'AS16509-PROXY (Netherlands Bulletproof VPS)',
      registrar: 'NiceNIC International Group',
      tlsIssuer: "ZeroSSL RSA Domain Secure (Free DV)",
      harvestedFields: ['username', 'password', 'otp_token', 'session_cookie'],
      c2ExfilRoute: '/app/login/creds',
    },
    attackCampaign: 'EVILGINX-OKTA-WORKFORCE-CLUSTER',
    confidenceRating: 0.995,
    threatSeverity: 'CRITICAL',
    timesSeen: 18,
    status: 'ACTIVE_C2',
    notes: 'Reverse proxy man-in-the-middle campaign targeting enterprise employee MFA sessions using cloned Okta login aesthetics.',
  },
  {
    id: 'THREAT-HIST-103',
    domain: 'chаse-auth-alert911.info',
    claimedBrand: 'Chase Bank',
    targetBrandId: 'chase',
    dateOfDetection: '2026-09-02T09:41:00Z',
    dateOfDetectionFormatted: 'Sep 02, 2026',
    visualFingerprint: {
      phash: '9f2d1e8a44c7b0e3',
      dominantColors: ['#117ACA', '#0B568C'],
      layoutSignature: 'LOGO_TOP_OCTAGON:INPUT_CRED_2:BTN_SIGNIN',
      clipEmbeddingDistance: 0.035,
      componentLayoutHash: 'PHISH_LAYOUT_CHASE_5B21',
    },
    semanticFeatures: {
      lexicalLevenshtein: 19,
      subdomainStacking: true,
      homoglyphsDetected: true,
      tld: '.info',
      asn: 'AS44050 (Stark Industries Solutions / RU)',
      registrar: 'Porkbun LLC / Withheld for Privacy',
      tlsIssuer: "Let's Encrypt Authority X3 (Free DV)",
      harvestedFields: ['usr_name', 'usr_password', 'account_number', 'ssn'],
      c2ExfilRoute: '/api/collect',
    },
    attackCampaign: 'CHASE-HOMOGLYPH-PUNYCODE-WAVE',
    confidenceRating: 0.999,
    threatSeverity: 'CRITICAL',
    timesSeen: 31,
    status: 'CONFIRMED_MALICIOUS',
    notes: 'Punycode xn--chse-auth-alert911-30b.info substituting Cyrillic "а" to trick visual inspection and bypass legacy blacklists.',
  },
  {
    id: 'THREAT-HIST-104',
    domain: 'coinbase-vault-support.top',
    claimedBrand: 'Coinbase',
    targetBrandId: 'coinbase',
    dateOfDetection: '2026-09-11T20:15:00Z',
    dateOfDetectionFormatted: 'Sep 11, 2026',
    visualFingerprint: {
      phash: '7b4e2f99110ad35c',
      dominantColors: ['#0052FF', '#0A43C7'],
      layoutSignature: 'LOGO_CENTER_CIRCLE:INPUT_MNEMONIC_12:BTN_RESTORE',
      clipEmbeddingDistance: 0.046,
      componentLayoutHash: 'PHISH_LAYOUT_COIN_DRAIN',
    },
    semanticFeatures: {
      lexicalLevenshtein: 20,
      subdomainStacking: false,
      homoglyphsDetected: false,
      tld: '.top',
      asn: 'AS200019 (Alexhost SRL / Moldova)',
      registrar: 'PublicDomainRegistry',
      tlsIssuer: "cPanel, Inc. Certification Authority",
      harvestedFields: ['email', 'seed_phrase', 'wallet_private_key'],
      c2ExfilRoute: '/drain/vault',
    },
    attackCampaign: 'WEB3-SEED-DRAINER-KITS-V4',
    confidenceRating: 0.994,
    threatSeverity: 'CRITICAL',
    timesSeen: 12,
    status: 'ACTIVE_C2',
    notes: 'Cryptocurrency wallet recovery lure harvesting 12/24 word BIP-39 mnemonic seed phrases with automated drainer scripts.',
  },
  {
    id: 'THREAT-HIST-105',
    domain: 'appleid-recovery-icloud.vip',
    claimedBrand: 'Apple',
    targetBrandId: 'apple',
    dateOfDetection: '2026-08-05T14:18:00Z',
    dateOfDetectionFormatted: 'Aug 05, 2026',
    visualFingerprint: {
      phash: '5a3d7b8910e1c4f0',
      dominantColors: ['#000000', '#F5F5F7'],
      layoutSignature: 'LOGO_APPLE_SILHOUETTE:INPUT_APPLEID_2:BTN_CONTINUE',
      clipEmbeddingDistance: 0.039,
      componentLayoutHash: 'PHISH_LAYOUT_APPLE_ICLOUD',
    },
    semanticFeatures: {
      lexicalLevenshtein: 22,
      subdomainStacking: true,
      homoglyphsDetected: false,
      tld: '.vip',
      asn: 'AS57523 (Chang Way Technologies)',
      registrar: 'Alibaba Cloud Computing',
      tlsIssuer: "TrustAsia DV TLS CA",
      harvestedFields: ['apple_id', 'password', 'device_passcode', 'credit_card'],
      c2ExfilRoute: '/id/verify/store',
    },
    attackCampaign: 'ICLOUD-STOLEN-DEVICE-BYPASS',
    confidenceRating: 0.991,
    threatSeverity: 'HIGH',
    timesSeen: 16,
    status: 'CONFIRMED_MALICIOUS',
    notes: 'SMS-driven smishing campaign targeting victims of stolen iPhones to unlock Activation Lock and exfiltrate iCloud credentials.',
  },
  {
    id: 'THREAT-HIST-106',
    domain: 'microsoft-security-auth-session.xyz',
    claimedBrand: 'Microsoft 365',
    targetBrandId: 'microsoft',
    dateOfDetection: '2026-09-22T08:30:00Z',
    dateOfDetectionFormatted: 'Sep 22, 2026',
    visualFingerprint: {
      phash: 'e4b18c2270fa99d5',
      dominantColors: ['#0067B8', '#107C41'],
      layoutSignature: 'LOGO_MS_GRID:INPUT_CRED_2:BTN_NEXT',
      clipEmbeddingDistance: 0.041,
      componentLayoutHash: 'PHISH_LAYOUT_MS_SESSION_XYZ',
    },
    semanticFeatures: {
      lexicalLevenshtein: 26,
      subdomainStacking: true,
      homoglyphsDetected: false,
      tld: '.xyz',
      asn: 'AS49505 (HostRoyale Technologies)',
      registrar: 'Namecheap Inc.',
      tlsIssuer: "Let's Encrypt Authority X3",
      harvestedFields: ['loginfmt', 'passwd', 'totp'],
      c2ExfilRoute: '/auth/session/token',
    },
    attackCampaign: 'FIN7-OFFICE365-HARVEST-WAVE',
    confidenceRating: 0.997,
    threatSeverity: 'CRITICAL',
    timesSeen: 42,
    status: 'ACTIVE_C2',
    notes: 'Spearphishing portal cloning Microsoft Entra ID authentication with z-index modal dialog simulating password expiration.',
  },
];

// Query function: searches the historical database for exact, fingerprint, or cluster matches
export function queryHistoricalDatabase(
  candidate: {
    host: string;
    claimedBrandId: string;
    candidatePhash?: string;
    candidateAsn?: string;
    candidateRegistrar?: string;
    candidateTlsIssuer?: string;
    candidateExfilRoute?: string;
  },
  database: HistoricalThreatEntry[] = INITIAL_HISTORICAL_THREATS
): HistoricalMatchResult {
  const normHost = candidate.host.toLowerCase().trim();
  const brandId = candidate.claimedBrandId?.toLowerCase() || '';

  // 1. Exact Domain Match
  for (const entry of database) {
    const entryHost = entry.domain.toLowerCase().trim();
    if (normHost === entryHost || normHost.endsWith('.' + entryHost)) {
      return {
        hasMatch: true,
        matchType: 'EXACT_DOMAIN_MATCH',
        matchedEntry: entry,
        similarityScore: 1.0,
        correlationBasis: `Exact domain match against confirmed malicious record ${entry.id} (${entry.attackCampaign}) detected on ${entry.dateOfDetectionFormatted}.`,
        impactOnBayesianRisk: {
          priorBoost: 0.70, // Baseline rises from 0.05 to 0.75
          likelihoodRatioMultiplier: 35.0,
          description: `Confirmed precedent in historical threat intelligence database (Times seen: ${entry.timesSeen}).`,
        },
      };
    }
  }

  // 2. Visual Fingerprint Similarity (Perceptual Hash & Brand Match)
  const candidatePhash = candidate.candidatePhash || 'a8f13b2c90e4f5d1';
  for (const entry of database) {
    if (entry.targetBrandId === brandId || !brandId) {
      const hDist = computeHammingDistance(candidatePhash, entry.visualFingerprint.phash);
      // Hamming distance <= 8 out of 64 bits indicates visual clone / identical template reuse
      if (hDist <= 8) {
        const simScore = Math.max(0.85, 1 - hDist / 64);
        return {
          hasMatch: true,
          matchType: 'VISUAL_FINGERPRINT_REUSE',
          matchedEntry: entry,
          similarityScore: Number(simScore.toFixed(3)),
          correlationBasis: `Visual perceptual hash matches confirmed phishing kit (${entry.id}) with Hamming distance ${hDist}/64 (Similarity: ${(simScore * 100).toFixed(1)}%).`,
          impactOnBayesianRisk: {
            priorBoost: 0.50,
            likelihoodRatioMultiplier: 22.0,
            description: `Identical visual layout and perceptual fingerprint previously cataloged under campaign ${entry.attackCampaign}.`,
          },
        };
      }
    }
  }

  // 3. Infrastructure & Semantic Campaign Cluster Match
  for (const entry of database) {
    const asnMatch = candidate.candidateAsn && entry.semanticFeatures.asn.toLowerCase().includes(candidate.candidateAsn.toLowerCase().split(' ')[0]);
    const regMatch = candidate.candidateRegistrar && entry.semanticFeatures.registrar.toLowerCase().includes(candidate.candidateRegistrar.toLowerCase().split(' ')[0]);
    const routeMatch = candidate.candidateExfilRoute && entry.semanticFeatures.c2ExfilRoute === candidate.candidateExfilRoute;

    if ((asnMatch && regMatch) || (routeMatch && (asnMatch || regMatch))) {
      return {
        hasMatch: true,
        matchType: 'INFRASTRUCTURE_CAMPAIGN_CLUSTER',
        matchedEntry: entry,
        similarityScore: 0.92,
        correlationBasis: `Infrastructure telemetry (ASN: ${entry.semanticFeatures.asn}, Registrar: ${entry.semanticFeatures.registrar}) correlates with malicious threat cluster ${entry.attackCampaign}.`,
        impactOnBayesianRisk: {
          priorBoost: 0.35,
          likelihoodRatioMultiplier: 12.0,
          description: `Shared hosting ASN and C2 exfiltration routes with confirmed malicious infrastructure.`,
        },
      };
    }
  }

  // 4. Domain Mutation / Lexical Spin-off from known historical phish
  for (const entry of database) {
    const dist = computeLevenshtein(normHost, entry.domain);
    if (dist <= 3 && dist > 0) {
      return {
        hasMatch: true,
        matchType: 'CAMPAIGN_DOMAIN_MUTATION',
        matchedEntry: entry,
        similarityScore: 0.89,
        correlationBasis: `Domain is a direct lexical mutation (${dist} edit steps) of confirmed historical threat ${entry.domain} (${entry.attackCampaign}).`,
        impactOnBayesianRisk: {
          priorBoost: 0.40,
          likelihoodRatioMultiplier: 15.0,
          description: `Known threat actor pattern of provisioning incremental domain variations after takedown.`,
        },
      };
    }
  }

  return {
    hasMatch: false,
    matchType: 'NONE',
    matchedEntry: null,
    similarityScore: 0.0,
    correlationBasis: 'No prior match identified in historical phishing and impersonation database.',
    impactOnBayesianRisk: {
      priorBoost: 0.0,
      likelihoodRatioMultiplier: 1.0,
      description: 'Zero historical threat correlations.',
    },
  };
}
