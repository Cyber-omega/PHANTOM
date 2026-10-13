# PHANTOM: AI Anti-Phishing & Brand Impersonation Defense

> **Real-time AI browser security pipeline powered by YOLOv8 computer vision, deep domain and TLS telemetry, Bayesian discrepancy arbitration, and automated honeypot decoy quarantine.**

---

## 🛡️ Executive Summary

Modern brand impersonation attacks and adversary-in-the-middle (AiTM) phishing kits (e.g., Evilginx2, NakedPages) render traditional static blocklists and reputation feeds obsolete. Attackers spin up ephemeral domains using free Domain Validation (DV) TLS certificates, clone high-fidelity SVG logos, and bypass heuristics within minutes.

**PHANTOM** introduces an active browser-level defense architecture that reconciles what a webpage **looks like** (perceptual computer vision) against where it **actually originates** (cryptographic TLS, DNS age, ASN, and registrar telemetry). By formulating this reconciliation as a **Bayesian Discrepancy Problem**, PHANTOM makes mathematically sound triage decisions in milliseconds:
- **Canonical Brand Match**: High visual similarity on an authorized domain yields an overwhelmingly benign posterior score ($LR = 0.02$).
- **Visual Spoofing Discrepancy**: High visual similarity on an unauthorized, young, or homoglyph domain yields a critical malicious posterior score ($LR = 18.5+$), triggering immediate quarantine and active honeypot canary injection.

---

## 🚀 Key Features

### 1. 👁️ YOLOv8 Computer Vision & Perceptual Hashing
- **Object Detection Pipeline**: Identifies credential input fields, secret password containers, vector brand logos, and exfiltration submit triggers with bounding boxes and confidence scores.
- **Perceptual Image Hash (pHash)**: Computes 64-bit normalized Hamming distance across visual layouts to match against known authentic brand signatures and known threat kits.
- **Zero-Day Visual Discovery**: Detects pixel-level and layout-level brand clones even when domain names and HTML structure are obfuscated.

### 2. 🌐 Deep Origin & TLS Cryptographic Telemetry
- **Lexical & Homoglyph Engine**: Calculates normalized Levenshtein distances against canonical brand domains and detects confusable Cyrillic/Unicode characters (e.g., Cyrillic `а` U+0430 mimicking Latin `a`).
- **Domain Age & Registrar Verification**: Flags domains created $<30$ days ago and unverified privacy proxy registrars.
- **Autonomous System (ASN) & Hosting Classification**: Compares host infrastructure against authorized brand networks (e.g., PayPal AS17012 vs. anonymous bulletproof hosting).
- **TLS Certificate Lifespan & Issuer Profiling**: Distinguishes automated 90-day Free DV certificates (Let's Encrypt / ZeroSSL) from High-Assurance Extended Validation (EV) or enterprise CAs (DigiCert, Google Trust Services).
- **Form Action & Exfiltration Sinks**: Flags cross-origin form action routes transmitting credentials to external endpoints or third-party webhooks.

### 3. ⚖️ Bayesian Discrepancy Arbiter
- **Mathematical Odds Updating**:
  $$\text{Posterior Odds} = \text{Prior Odds} \times \prod_{i=1}^n \text{Likelihood Ratio}_i$$
- **Multi-Factor Evidence Nodes**:
  - Historical threat database precedent
  - Perceptual visual brand claim vs. canonical domain validation
  - Homoglyph / Punycode deception
  - Typosquatting lexical proximity
  - Ephemeral domain age penalties
  - Free DV TLS certificate mismatch
  - Sensitive credential form presence
  - Cross-origin exfiltration triggers
- **Automated Three-Tier Triage**:
  - `ALLOW` ($\text{Risk} < 0.30$): Safe navigation, authentic brand.
  - `SUSPICIOUS` ($0.30 \le \text{Risk} < 0.80$): Step-up warning, user confirmation prompt.
  - `QUARANTINE_HONEYPOT` ($\text{Risk} \ge 0.80$): Complete browser sandboxing, asset isolation, and decoy deployment.

### 4. 🪤 Active Honeypot Decoy & Tarpit Counter-Offensive
- **Synthetic Victim Personas**: Automatically generates realistic credential payloads (poisoned email, synthetic password, fake 2FA OTP tokens, decoy credit card numbers with CVV).
- **Canary Tracking Tokens**: Injects unique traceable identifiers (e.g., `CANARY-PHANTOM-K9X3`) into exfiltration streams.
- **Attacker Tarpit & Intelligence Gathering**: Diverts malicious bots to internal tripwire endpoints, logs attacker C2 IP addresses, records bot response latencies, and feeds real-time telemetry back into SOC monitoring.

### 5. 🗄️ Historical Threat Intelligence Knowledge Base
- In-memory database of confirmed phishing kits, visual fingerprints, layout hashes, and associated threat campaigns.
- Live search, brand filtering, severity categorization, and 1-click inspection directly in the viewport.
- Bi-directional feedback: Known threats adjust the Bayesian prior and likelihood multipliers during live analysis.
- Ability to register new threat intelligence entries or delete resolved entries.

### 6. 🤖 Google Gemini 3.8 Multimodal Deep Security Audit
- Powered by Google GenAI SDK (`@google/genai`) using `gemini-3.8-flash`.
- Generates structured forensic reports detailing adversary tactics, bypass mechanisms (e.g., CSS z-index layering, reverse proxying), honeypot feasibility, and immediate SOC playbooks.
- Includes an expert heuristic fallback engine if external API keys are unavailable or rate-limited.

### 7. 📄 Structured Forensic PDF Report Export
- Interactive modal powered by `jspdf` allowing SOC analysts to generate audit-ready, structured incident reports.
- Customizable section toggles:
  - Executive Verdict & Bayesian Risk Gauge
  - Bayesian Discrepancy Evidence Table with Likelihood Ratios
  - Deep Origin & TLS Telemetry Breakdown
  - YOLOv8 Vision Detections & Bounding Boxes
  - Threat Intelligence Precedent Matches
  - Active Decoy Telemetry & Canary Tracking Tokens
- Includes custom analyst notes, classification watermarks (e.g., `TLP:AMBER`, `CONFIDENTIAL`), and instant file download.

### 8. 🎨 Polished SOC Analyst UI / UX
- **Dual Themes**: Complete support for Light Mode (clean high-contrast enterprise design) and Dark Mode (cyber-defense SOC aesthetic).
- **Interactive Pipeline Flow Banner**: Real-time visualization of data moving through every stage: Browser Viewport $\to$ Historical DB $\to$ YOLOv8 Vision $\to$ Telemetry $\to$ Bayesian Arbiter $\to$ Honeypot Quarantine.
- **Live Scenario Switcher**: One-click switching between pre-configured attack vectors and authentic benchmarks, plus a freeform URL bar.

---

## 🧪 Pre-configured Scenarios

| Preset Name | Attack Category | URL / Domain | Claimed Brand | Risk Score | Expected Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PayPal Urgent Account Freeze** | Critical Phish | `paypal-verification-security.net` | PayPal | 0.94 | `QUARANTINE_HONEYPOT` |
| **Okta Enterprise SSO Bypass** | Corporate AiTM | `okta-sso-gateway365.cc` | Okta SSO | 0.96 | `QUARANTINE_HONEYPOT` |
| **Microsoft 365 Authentic** | Authentic Benchmark | `login.microsoftonline.com` | Microsoft 365 | 0.03 | `ALLOW` |
| **Chase Bank ID Theft (Homoglyph)** | Punycode / Homoglyph | `chаse-auth-alert911.info` (Cyrillic `а`) | Chase Bank | 0.98 | `QUARANTINE_HONEYPOT` |
| **Coinbase Vault Recovery Phish** | Crypto Drainer | `coinbase-vault-support.top` | Coinbase | 0.95 | `QUARANTINE_HONEYPOT` |
| **Google Accounts Sign-In** | Authentic Benchmark | `accounts.google.com` | Google Accounts | 0.02 | `ALLOW` |

---

## 🏛️ System Architecture

```
                                  ┌──────────────────────────┐
                                  │      Incoming URL /      │
                                  │   Simulated Webpage      │
                                  └────────────┬─────────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
         ┌───────────────────────────┐                   ┌───────────────────────────┐
         │     YOLOv8 Computer       │                   │    Origin Telemetry &     │
         │     Vision Inspector      │                   │     TLS Cryptography      │
         ├───────────────────────────┤                   ├───────────────────────────┤
         │ • Logo Object Detection   │                   │ • Levenshtein Distance    │
         │ • Input Credential Forms  │                   │ • Cyrillic Homoglyphs     │
         │ • Action Submit Triggers  │                   │ • Domain Age (< 30 days)  │
         │ • Perceptual Hash (pHash) │                   │ • Free DV vs Enterprise CA│
         └─────────────┬─────────────┘                   └─────────────┬─────────────┘
                       │                                               │
                       └───────────────────────┬───────────────────────┘
                                               ▼
                                 ┌───────────────────────────┐
                                 │   Historical Threat DB    │
                                 │   Correlation & Precedent │
                                 └─────────────┬─────────────┘
                                               ▼
                                 ┌───────────────────────────┐
                                 │    Bayesian Discrepancy   │
                                 │          Arbiter          │
                                 ├───────────────────────────┤
                                 │  Posterior Odds Update    │
                                 │  Visual vs Origin Proof   │
                                 └─────────────┬─────────────┘
                                               │
                        ┌──────────────────────┴──────────────────────┐
                        ▼                                             ▼
           [ Posterior Risk < 0.80 ]                     [ Posterior Risk >= 0.80 ]
           ALLOW / STEP-UP VERIFY                        QUARANTINE_HONEYPOT
                        │                                             │
                        │                                             ▼
                        │                               ┌───────────────────────────┐
                        │                               │   Active Honeypot Decoy   │
                        │                               ├───────────────────────────┤
                        │                               │ • Synthetic Credentials   │
                        │                               │ • Canary Tracking Tokens  │
                        │                               │ • C2 Tarpit Interception  │
                        │                               └─────────────┬─────────────┘
                        │                                             │
                        └──────────────────────┬──────────────────────┘
                                               ▼
                                ┌─────────────────────────────┐
                                │   SOC Reporting & Export    │
                                ├─────────────────────────────┤
                                │ • Gemini 3.8 Deep Audit     │
                                │ • Structured PDF Report     │
                                └─────────────────────────────┘
```

---

## 📂 Project Structure

```
├── server.ts                   # Express backend: Bayesian engine, historical DB, telemetry, Honeypot C2, Gemini API
├── src/
│   ├── App.tsx                 # Main application dashboard and view orchestration
│   ├── main.tsx                # React root mount point
│   ├── index.css               # Tailwind CSS v4 design system
│   ├── types.ts                # TypeScript domain models (Telemetry, Bayesian, Vision, Honeypot, Scenarios)
│   ├── components/
│   │   ├── Navbar.tsx          # Top navigation bar, scenario switcher, theme toggle, PDF export & audit triggers
│   │   ├── PipelineFlow.tsx    # Interactive architecture pipeline visualizer
│   │   ├── BrowserViewport.tsx # Sandboxed browser viewport with live threat indicators and honeypot overlay
│   │   ├── BayesianArbiterView.tsx # Bayesian evidence matrix, probability gauge, and LR weights
│   │   ├── TelemetryInspector.tsx  # Deep domain, DNS, ASN, and TLS cryptographic inspection
│   │   ├── VisionInspector.tsx     # YOLOv8 object detection, bounding box overlays, and pHash analysis
│   │   ├── HistoricalDatabaseView.tsx # Threat intelligence knowledge base with search, filters, and records
│   │   ├── HoneypotDefenseCenter.tsx  # Active decoy management, persona generator, and live C2 intercept feed
│   │   ├── GeminiAuditModal.tsx    # Multimodal AI forensic evaluation modal (Gemini 3.8 Flash)
│   │   ├── ExportReportModal.tsx   # Interactive PDF export configuration and preview modal
│   │   └── BrandLogos.tsx          # Authentic brand SVG asset components
│   ├── data/
│   │   ├── scenarios.ts        # Comprehensive attack presets and authentic control benchmarks
│   │   └── historicalThreats.ts# Seed database of confirmed historical phishing campaigns
│   └── utils/
│       └── pdfExport.ts        # Multi-page jsPDF generator for structured incident reports
├── metadata.json               # AI Studio project configuration and capabilities
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite bundler configuration with Tailwind CSS plugin
```

---

## 🔌 API Endpoints Reference

### 1. Health Check
- **`GET /api/health`**
  - Returns engine status, version (`PHANTOM-v2.4-ENGINE`), and Gemini API status.

### 2. Threat Analysis
- **`POST /api/analyze`**
  - **Body**: `{ url: string, claimedBrandId?: string, customDomain?: string, overrideTelemetry?: object }`
  - Runs full pipeline: lexical distance, homoglyph scan, telemetry gathering, YOLOv8 simulation, historical database query, and Bayesian risk arbitration.

### 3. Honeypot Operations
- **`POST /api/honeypot/submit`**
  - **Body**: `{ targetDomain: string, claimedBrand: string, capturedPayload: object, canaryToken: string }`
  - Injects synthetic victim credentials and canary tracking tokens into the tripwire.
- **`GET /api/honeypot/feed`**
  - Returns recent honeypot interceptions and attacker bot activity.

### 4. Historical Threat Intelligence
- **`GET /api/threats/history`**
  - Supports query parameters: `?search=...`, `?brand=...`, `?severity=...`, `?campaign=...`.
- **`POST /api/threats/history`**
  - Adds a new analyst-confirmed phishing threat record to the database.
- **`DELETE /api/threats/history/:id`**
  - Removes a threat record by ID.
- **`GET /api/threats/history/stats`**
  - Aggregates metrics on top impersonated brands, unique campaigns, and severity distributions.

### 5. AI Deep Audit
- **`POST /api/gemini/deep-audit`**
  - **Body**: `{ targetUrl: string, claimedBrand: string, telemetry: object, riskScore: number }`
  - Prompts `gemini-3.8-flash` for an executive forensic assessment with structured adversary tactic breakdowns and SOC action items.

---

## 🛠️ Installation & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd react-example
npm install
```

### 2. Environment Setup (Optional)
If you wish to use live Google Gemini multimodal auditing, add your API key in `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```
*(Note: If `GEMINI_API_KEY` is omitted, PHANTOM automatically provides high-fidelity heuristic forensic assessments as a graceful fallback.)*

### 3. Start the Development Server
```bash
npm run dev
```
The server will boot on `http://localhost:3000` with Express backend and Vite hot module middleware.

### 4. Build for Production
```bash
npm run build
```
Generates production assets in `/dist`.

### 5. Type Checking & Verification
```bash
npm run lint
```

---

## 📄 Exporting Incident Reports

To export a PDF report:
1. Navigate to any scenario or inspect a custom URL.
2. Click **Export PDF** from the top navbar or within the **Bayesian Arbiter**, **Telemetry Inspector**, or **Viewport** toolbar.
3. In the modal, customize the sections to include (Bayesian Evidence, Origin Telemetry, Vision Detections, Threat Database Match, Honeypot Canary Playbook).
4. Add analyst notes or select a classification level (`CONFIDENTIAL`, `TOP SECRET`, `INTERNAL USE ONLY`, `TLP:AMBER`).
5. Click **Download PDF Report**. A formatted, multi-page vector PDF will be downloaded immediately.

---

## 🔒 Security & Privacy Notice

- **Safe Demonstration Environment**: All attacks and exfiltration endpoints in this application are strictly simulated in safe sandboxed environments.
- **Canary Tokens**: Canary tokens generated by the honeypot are synthetic and contain non-routable dummy telemetry for research and defense demonstration purposes.
- **Credential Protection**: PHANTOM intercepts form submissions before credentials touch external network sockets, replacing real inputs with synthetic poison data.

---

## 📜 License & Credits

Licensed under the [MIT License](LICENSE). Built for enterprise browser defense, SOC teams, and proactive anti-phishing operations.

**Made by Ciphersquad**
