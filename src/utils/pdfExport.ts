import { jsPDF } from 'jspdf';
import { AnalysisResponse, ScenarioPreset } from '../types';

export interface PdfExportOptions {
  includeBayesianEvidence?: boolean;
  includeTelemetry?: boolean;
  includeVision?: boolean;
  includeHistoricalMatch?: boolean;
  includeHoneypot?: boolean;
  analystNotes?: string;
}

export function generateForensicPdfReport(
  analysis: AnalysisResponse,
  scenario?: ScenarioPreset,
  options: PdfExportOptions = {}
): jsPDF {
  const {
    includeBayesianEvidence = true,
    includeTelemetry = true,
    includeVision = true,
    includeHistoricalMatch = true,
    includeHoneypot = true,
    analystNotes = '',
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const riskScore = analysis.bayesianArbiter.posteriorRisk;
  const isHighRisk = riskScore >= 0.8;
  const isSuspicious = riskScore >= 0.3 && riskScore < 0.8;

  // Primary colors
  const primaryNavy = [15, 23, 42]; // #0F172A
  const slateText = [51, 65, 85]; // #334155
  const mutedText = [100, 116, 139]; // #64748B
  const borderLight = [226, 232, 240]; // #E2E8F0
  const bgCard = [248, 250, 252]; // #F8FAFC

  // Severity colors
  const riskColor = isHighRisk
    ? [225, 29, 72] // Rose-600
    : isSuspicious
    ? [217, 119, 6] // Amber-600
    : [13, 148, 136]; // Teal-600

  // Helper to ensure page bounds
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      y = margin;
      drawPageHeaderCompact();
    }
  };

  const drawPageHeaderCompact = () => {
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('PHANTOM AI · FORENSIC INVESTIGATION REPORT', margin + 3, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(`TARGET: ${analysis.host}`, pageWidth - margin - 3, y + 5, { align: 'right' });
    y += 11;
  };

  // --- HEADER SECTION ---
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'F');

  // Decorative accent line
  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.rect(margin, y, 3.5, 32, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('PHANTOM AI · ZERO-DAY WEB THREAT FORENSIC AUDIT', margin + 8, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Automated Multi-Vector Discrepancy & Brand Impersonation Inspection', margin + 8, y + 15);

  const reportId = `PHNTM-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 8999 + 1000)}`;
  const dateFormatted = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`REPORT ID: ${reportId}`, margin + 8, y + 22);
  doc.text(`GENERATED: ${dateFormatted}`, margin + 8, y + 27);

  // Status Badge on Header
  const verdictText = isHighRisk
    ? 'CRITICAL THREAT'
    : isSuspicious
    ? 'SUSPICIOUS PRECEDENT'
    : 'BENIGN VERIFIED';
  
  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.roundedRect(pageWidth - margin - 52, y + 7, 48, 18, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(verdictText, pageWidth - margin - 28, y + 14, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`DECISION: ${analysis.bayesianArbiter.decision}`, pageWidth - margin - 28, y + 21, { align: 'center' });

  y += 37;

  // --- EXECUTIVE SUMMARY & VERDICT MATRIX ---
  doc.setFillColor(bgCard[0], bgCard[1], bgCard[2]);
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.roundedRect(margin, y, contentWidth, 34, 1.5, 1.5, 'FD');

  // Risk Score Gauge Box
  const gaugeBoxWidth = 44;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.roundedRect(margin + 3, y + 3, gaugeBoxWidth, 28, 1, 1, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
  doc.text('BAYESIAN POSTERIOR RISK', margin + 5, y + 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(`${(riskScore * 100).toFixed(1)}%`, margin + 5, y + 19);

  // Mini progress track
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(margin + 5, y + 23, 40, 4, 1, 1, 'F');
  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  const fillW = Math.max(2, Math.min(40, 40 * riskScore));
  doc.roundedRect(margin + 5, y + 23, fillW, 4, 1, 1, 'F');

  // Executive details grid
  const detailX = margin + gaugeBoxWidth + 7;
  const detailWidth = contentWidth - gaugeBoxWidth - 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('TARGET IDENTIFICATION & SPOOFING VERDICT', detailX, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);

  doc.setFont('helvetica', 'bold');
  doc.text('Host FQDN: ', detailX, y + 14);
  doc.setFont('courier', 'normal');
  doc.text(analysis.host, detailX + 22, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.text('Full Target URL: ', detailX, y + 19);
  doc.setFont('courier', 'normal');
  const cleanUrl = analysis.url.length > 55 ? analysis.url.substring(0, 52) + '...' : analysis.url;
  doc.text(cleanUrl, detailX + 26, y + 19);

  doc.setFont('helvetica', 'bold');
  doc.text('Claimed Identity: ', detailX, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.text(`${analysis.claimedBrand.name} (${analysis.claimedBrand.id})`, detailX + 26, y + 24);

  doc.setFont('helvetica', 'bold');
  doc.text('Canonical Alignment: ', detailX, y + 29);
  if (analysis.isCanonical) {
    doc.setTextColor(13, 148, 136);
    doc.text('Legitimate Official Domain Match', detailX + 32, y + 29);
  } else {
    doc.setTextColor(225, 29, 72);
    doc.text('DOMAIN MISMATCH / SPOOFED (Not in Brand Authorized Roots)', detailX + 32, y + 29);
  }

  y += 39;

  // --- SECTION: BAYESIAN DISCREPANCY MATRIX ---
  if (includeBayesianEvidence) {
    checkPageBreak(50);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text('1. BAYESIAN ARBITER & MULTI-MODAL EVIDENCE DECOMPOSITION', margin, y + 4);
    y += 7;

    // Arbiter Stats bar
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Base Prior P(Threat): ${(analysis.bayesianArbiter.priorRisk * 100).toFixed(1)}%`, margin + 3, y + 5);
    doc.text(`Posterior P(Threat | Evidence): ${(analysis.bayesianArbiter.posteriorRisk * 100).toFixed(1)}%`, margin + 60, y + 5);
    doc.text(`Active Arbiter Policy: ${analysis.bayesianArbiter.decision}`, pageWidth - margin - 3, y + 5, { align: 'right' });
    y += 9;

    // Evidence Table Header
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('EVIDENCE FACTOR', margin + 3, y + 4.2);
    doc.text('IMPACT', margin + 58, y + 4.2);
    doc.text('WEIGHT', margin + 82, y + 4.2);
    doc.text('FORENSIC OBSERVATION', margin + 104, y + 4.2);
    y += 6;

    // Factors rows
    analysis.bayesianArbiter.evidenceFactors.forEach((factor, idx) => {
      checkPageBreak(10);
      const isAlt = idx % 2 === 1;
      doc.setFillColor(isAlt ? 248 : 255, isAlt ? 250 : 255, isAlt ? 252 : 255);
      doc.rect(margin, y, contentWidth, 8, 'F');
      doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
      doc.line(margin, y + 8, margin + contentWidth, y + 8);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(30, 41, 59);
      doc.text(factor.name.substring(0, 32), margin + 3, y + 5);

      // Impact badge
      const isCrit = factor.impact === 'CRITICAL';
      const isHigh = factor.impact === 'HIGH';
      const isMed = factor.impact === 'MEDIUM';
      doc.setFont('helvetica', 'bold');
      if (isCrit) {
        doc.setTextColor(225, 29, 72);
      } else if (isHigh) {
        doc.setTextColor(234, 88, 12);
      } else if (isMed) {
        doc.setTextColor(202, 138, 4);
      } else {
        doc.setTextColor(13, 148, 136);
      }
      doc.text(factor.impact, margin + 58, y + 5);

      // Weight
      doc.setFont('courier', 'normal');
      doc.setTextColor(71, 85, 105);
      const sign = factor.weight > 0 ? '+' : '';
      doc.text(`${sign}${factor.weight.toFixed(2)}x`, margin + 82, y + 5);

      // Description
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const descTrunc = factor.description.length > 58 ? factor.description.substring(0, 56) + '...' : factor.description;
      doc.text(descTrunc, margin + 104, y + 5);

      y += 8;
    });

    y += 5;
  }

  // --- SECTION: DEEP TELEMETRY & NETWORK FORENSICS ---
  if (includeTelemetry) {
    checkPageBreak(52);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text('2. INFRASTRUCTURE & DOMAIN TELEMETRY AUDIT', margin, y + 4);
    y += 7;

    const telem = analysis.telemetry;
    const telemItems = [
      { label: 'Domain Age', value: `${telem.domainAgeDays} days (${(telem.domainAgeDays / 365).toFixed(1)} yrs)`, alert: telem.domainAgeDays < 90 },
      { label: 'Registrar', value: telem.registrar || 'Redacted for Privacy', alert: false },
      { label: 'Hosting ASN', value: telem.asn, alert: false },
      { label: 'Geo Location', value: telem.country, alert: false },
      { label: 'TLS Cert Issuer', value: telem.tlsIssuer, alert: telem.isFreeDV },
      { label: 'Free DV Certificate', value: telem.isFreeDV ? 'YES (High Phishing Risk)' : 'NO (OV/EV Corporate)', alert: telem.isFreeDV },
      { label: 'Cert Validity Window', value: `${telem.tlsCertValidDays} days remaining`, alert: telem.tlsCertValidDays < 30 },
      { label: 'Credential Forms Detected', value: telem.hasSensitiveInputs ? 'YES (Harvesting Surface Active)' : 'None Identified', alert: telem.hasSensitiveInputs },
      { label: 'Cross-Origin Exfil Sink', value: telem.externalExfilAction ? 'YES (External C2 Action)' : 'Same-Origin / Safe', alert: telem.externalExfilAction },
      { label: 'Lexical Levenshtein Dist', value: `${analysis.lexical.rawDistance} (Norm: ${analysis.lexical.normalizedDistance.toFixed(2)})`, alert: analysis.lexical.rawDistance > 0 && analysis.lexical.rawDistance < 4 },
      { label: 'Closest Authentic Domain', value: analysis.lexical.closestCanonical, alert: false },
      { label: 'Homoglyph / Punycode', value: analysis.lexical.homoglyphs.hasHomoglyphs ? `DETECTED: ${analysis.lexical.homoglyphs.details.join(', ')}` : 'None (ASCII Standard)', alert: analysis.lexical.homoglyphs.hasHomoglyphs },
    ];

    // Grid layout: 2 columns
    const colW = (contentWidth - 6) / 2;
    const itemH = 9;

    for (let i = 0; i < telemItems.length; i += 2) {
      checkPageBreak(itemH + 2);
      const item1 = telemItems[i];
      const item2 = telemItems[i + 1];

      // Draw item 1
      doc.setFillColor(bgCard[0], bgCard[1], bgCard[2]);
      doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
      doc.roundedRect(margin, y, colW, itemH, 1, 1, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
      doc.text(item1.label + ':', margin + 3, y + 4);

      doc.setFont('helvetica', item1.alert ? 'bold' : 'normal');
      doc.setFontSize(7.5);
      if (item1.alert) {
        doc.setTextColor(225, 29, 72);
      } else {
        doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
      }
      doc.text(item1.value.substring(0, 36), margin + 3, y + 7.5);

      // Draw item 2 if present
      if (item2) {
        doc.setFillColor(bgCard[0], bgCard[1], bgCard[2]);
        doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
        doc.roundedRect(margin + colW + 6, y, colW, itemH, 1, 1, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
        doc.text(item2.label + ':', margin + colW + 9, y + 4);

        doc.setFont('helvetica', item2.alert ? 'bold' : 'normal');
        doc.setFontSize(7.5);
        if (item2.alert) {
          doc.setTextColor(225, 29, 72);
        } else {
          doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
        }
        doc.text(item2.value.substring(0, 36), margin + colW + 9, y + 7.5);
      }

      y += itemH + 2;
    }

    y += 4;
  }

  // --- SECTION: COMPUTER VISION & YOLOv8 DETECTIONS ---
  if (includeVision && analysis.vision) {
    checkPageBreak(46);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text('3. COMPUTER VISION & BIOMETRIC BRAND RECOGNITION (YOLOv8-NANO)', margin, y + 4);
    y += 7;

    // Vision Summary strip
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Vision Architecture: ${analysis.vision.model}`, margin + 3, y + 5);
    doc.text(`Visual Brand Similarity: ${(analysis.vision.claimedBrandVisualConfidence * 100).toFixed(1)}%`, margin + 65, y + 5);
    doc.text(`pHash Hamming Distance: ${analysis.vision.perceptualHashDistance} / 64`, pageWidth - margin - 3, y + 5, { align: 'right' });
    y += 9;

    // Detected objects
    if (analysis.vision.detectedObjects.length > 0) {
      doc.setFillColor(15, 23, 42);
      doc.rect(margin, y, contentWidth, 5.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text('DETECTED UI ELEMENT', margin + 3, y + 4);
      doc.text('CLASSIFICATION', margin + 55, y + 4);
      doc.text('CONFIDENCE', margin + 95, y + 4);
      doc.text('BOUNDING BOX (X, Y, W, H)', margin + 120, y + 4);
      doc.text('TARGET RISK', pageWidth - margin - 3, y + 4, { align: 'right' });
      y += 5.5;

      analysis.vision.detectedObjects.forEach((obj, idx) => {
        checkPageBreak(8);
        const isAlt = idx % 2 === 1;
        doc.setFillColor(isAlt ? 248 : 255, isAlt ? 250 : 255, isAlt ? 252 : 255);
        doc.rect(margin, y, contentWidth, 7, 'F');
        doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
        doc.line(margin, y + 7, margin + contentWidth, y + 7);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(30, 41, 59);
        doc.text(obj.label, margin + 3, y + 4.5);

        doc.setFont('courier', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(obj.class, margin + 55, y + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.text(`${(obj.confidence * 100).toFixed(0)}%`, margin + 95, y + 4.5);

        doc.setFont('courier', 'normal');
        doc.text(
          `[${obj.bbox.x}%, ${obj.bbox.y}%, ${obj.bbox.width}x${obj.bbox.height}%]`,
          margin + 120,
          y + 4.5
        );

        doc.setFont('helvetica', 'bold');
        const isHighTarget = obj.risk === 'critical_target' || obj.risk === 'impersonated_badge';
        doc.setTextColor(isHighTarget ? 225 : 13, isHighTarget ? 29 : 148, isHighTarget ? 72 : 136);
        doc.text(obj.risk.toUpperCase(), pageWidth - margin - 3, y + 4.5, { align: 'right' });

        y += 7;
      });
    }

    y += 5;
  }

  // --- SECTION: HISTORICAL PRECEDENT INTELLIGENCE ---
  if (includeHistoricalMatch && analysis.historicalMatch?.hasMatch && analysis.historicalMatch.matchedEntry) {
    checkPageBreak(40);

    const match = analysis.historicalMatch;
    const entry = match.matchedEntry;

    if (entry) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
      doc.text('4. THREAT INTELLIGENCE & HISTORICAL DATABASE PRECEDENT', margin, y + 4);
      y += 7;

      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(254, 202, 202);
      doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(185, 28, 28);
      doc.text(`[MATCH CONFIRMED: ${match.matchType}]`, margin + 4, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`Correlated Threat ID: ${entry.id} (${entry.domain})`, margin + 4, y + 11);
      doc.text(`First Detected: ${entry.dateOfDetectionFormatted} | Attack Campaign: ${entry.attackCampaign}`, margin + 4, y + 16);
      doc.text(`Correlation Basis: ${match.correlationBasis}`, margin + 4, y + 21);

      // Impact on score
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(225, 29, 72);
      doc.text(
        `Bayesian Impact: Prior +${(match.impactOnBayesianRisk.priorBoost * 100).toFixed(0)}%, LR x${match.impactOnBayesianRisk.likelihoodRatioMultiplier}`,
        pageWidth - margin - 4,
        y + 11,
        { align: 'right' }
      );

      y += 30;
    }
  }

  // --- SECTION: ACTIVE HONEYPOT CANARY TELEMETRY ---
  if (includeHoneypot && analysis.honeypot) {
    checkPageBreak(38);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text('5. CYBER-DECEPTION & ACTIVE HONEYPOT COUNTERMEASURES', margin, y + 4);
    y += 7;

    const honey = analysis.honeypot;
    doc.setFillColor(243, 232, 255);
    doc.setDrawColor(216, 180, 254);
    doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(107, 33, 168);
    doc.text('ACTIVE CANARY DECOY IDENTITY DEPLOYED', margin + 4, y + 5.5);

    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(88, 28, 135);
    doc.text(`Tracking Token: ${honey.canaryTrackingToken}`, margin + 4, y + 11);
    doc.text(`Decoy Persona: ${honey.decoyIdentity.fullName} <${honey.decoyIdentity.email}>`, margin + 4, y + 15.5);
    doc.text(`Decoy Password: ${honey.decoyIdentity.password} | Decoy CC: ${honey.decoyIdentity.creditCardNumber}`, margin + 4, y + 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`Tripwire: ${honey.exfiltrationTripwire}`, pageWidth - margin - 4, y + 11, { align: 'right' });
    doc.text(`Strategy: ${honey.actionStrategy}`, pageWidth - margin - 4, y + 15.5, { align: 'right' });

    y += 28;
  }

  // --- SECTION: ACTIONABLE SOC PLAYBOOK & MITIGATION ---
  checkPageBreak(36);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('6. INCIDENT RESPONSE & SOC MITIGATION PLAYBOOK', margin, y + 4);
  y += 7;

  doc.setFillColor(bgCard[0], bgCard[1], bgCard[2]);
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'FD');

  const playbookSteps = isHighRisk
    ? [
        '1. Immediate DNS Sinkhole & Enterprise Gateway Block: Blacklist domain and resolved IP address across firewalls.',
        '2. Automated Registrar Abuse Filing: Dispatch cryptographic evidence report to registrar abuse NOC for rapid domain suspension.',
        '3. TLS Certificate Revocation Notice: Issue CAA mismatch or fraudulent brand impersonation flag to certificate authority.',
        '4. Decoy Poisoning Active: Attacker credential harvester successfully poisoned with canary tracking token.',
      ]
    : isSuspicious
    ? [
        '1. Heightened Monitoring: Restrict credential submissions on domain pending manual analyst verification.',
        '2. Log User Telemetry: Trace potential spear-phishing email vectors referencing this domain.',
        '3. Inspect Webhook Endpoints: Verify whether form actions point to legitimate brand infrastructure.',
      ]
    : [
        '1. Standard Allow Policy: Domain passed all brand canonical, TLS issuer, and visual biometrics benchmarks.',
        '2. Cache Fingerprint: Store authentic layout pHash in baseline whitelist for zero-delay future requests.',
      ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  playbookSteps.forEach((step, idx) => {
    doc.text(step, margin + 4, y + 6 + idx * 4.5);
  });
  y += 27;

  // Analyst Notes if provided
  if (analystNotes.trim()) {
    checkPageBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text('ANALYST NOTES / CASE OBSERVATIONS:', margin, y + 4);
    y += 6;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.roundedRect(margin, y, contentWidth, 12, 1, 1, 'FD');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text(analystNotes.substring(0, 160), margin + 4, y + 5);
    y += 16;
  }

  // --- FOOTER ON ALL PAGES ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
    doc.text(
      'PHANTOM AI Browser Security Engine · Bayesian Discrepancy Arbiter · Made by Ciphersquad',
      margin,
      pageHeight - 8
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, {
      align: 'right',
    });
  }

  return doc;
}

export function downloadAnalysisPdfReport(
  analysis: AnalysisResponse,
  scenario?: ScenarioPreset,
  options: PdfExportOptions = {}
): void {
  const doc = generateForensicPdfReport(analysis, scenario, options);
  const cleanHost = (analysis.host || 'unknown-host').replace(/[^a-zA-Z0-9.-]/g, '_');
  const dateStamp = new Date().toISOString().slice(0, 10);
  const fileName = `PHANTOM_Forensic_Report_${cleanHost}_${dateStamp}.pdf`;
  doc.save(fileName);
}
