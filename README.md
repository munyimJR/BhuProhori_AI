# BhuProhori AI (ভূপ্রহরী AI)
> **দলিল দিন, জমি খুঁজে নিন।**  
> *Upload Your Deed. Verify Your Land. Simplify Mutation.*

**Geo-Integrated Smart e-Mutation & Land Verification System** built for the **LandTech Innovation Hackathon 2026** (Bangladesh).

---

## 🌟 Overview

**BhuProhori AI** is a citizen-centric, officer-assistive platform bridging the gap between legal land deeds (দলিল) and digital land record mapping (খতিয়ান ও মৌজা নকশা). The system demonstrates how AI document extraction, spatial parcel identification, rule-based verification, and automated mutation workflows can reduce administrative delays, eliminate manual data entry errors, and prevent illegal land transfers.

- **Primary Track:** P4 — Smart e-Mutation & Registry
- **Supporting Tracks:**
  - P2 — Deed Verification
  - P3 — Fraud and Record Discrepancy Detection
  - P5 — Check Before You Buy

---

## 🚀 Key Features

1. **AI Document Processing & Field Extraction:**
   - Simulated OCR and structured extraction from scanned deeds (দলিল).
   - High-confidence field mapping (Deed No, Registration Date, Registry Office, Grantor/Grantee, CS/SA/RS/BS Khatians, Dag No, Land Area).
   - Interactive verification with warning badges for ambiguous readings.

2. **Side-by-Side Verification & Citizen Correction:**
   - Split-screen comparison of scanned document view and editable parsed fields.
   - Citizen-in-the-loop validation ensuring human oversight before application generation.

3. **Spatial Land Identification & Interactive Parcel Mapping:**
   - Interactive GIS map built on Leaflet showing Mouza boundaries, Dag (plot) polygons, and ownership details.
   - Automated parcel matching algorithm matching deed details to land records.
   - Visual color-coded status (Clean, Multiple Ownership, Mortgaged, Under Dispute, Government/Khas).

4. **Automated 7-Rule Verification Engine:**
   - **Rule 1: Registered Deed Record Match** — Confirms registration status with sub-registry archives.
   - **Rule 2: Chain of Title & Grantor Ownership** — Validates seller's legitimate title in RS/BS records.
   - **Rule 3: Area Overlap & Share Checking** — Prevents selling more land than recorded interest.
   - **Rule 4: Dag & Mouza Boundary Coherence** — Validates spatial parcel bounds and classification.
   - **Rule 5: Encumbrance & Mortgage Verification** — Detects existing bank loans and liens.
   - **Rule 6: Dispute & Legal Injunctions** — Flags court stay orders or pending litigations.
   - **Rule 7: Khas / Vested / Wetland Status** — Alerts against illegal transfer of government property.

5. **Guided Multi-Step Mutation Wizard:**
   - Pre-filled application form based on validated deed data and mapped parcel information.
   - Step-by-step progress: Applicant info, Parcel identification, Deed specifics, Supporting attachments, and Review.

6. **Citizen Application Tracking & Timeline:**
   - Real-time application tracker with milestone timeline.
   - Downloadable mutation summary report.
   - Clarification submission interface for officer inquiries.

7. **Officer Decision & Review Dashboard:**
   - Role-based toggle (`নাগরিক মোড` vs `কর্মকর্তা মোড`).
   - Summary statistics (Total cases, Pending review, Clarifications, Approvals, Rejections).
   - Deep-dive review with AI discrepancy findings, audit trail, and formal decision actions.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Custom Vanilla CSS Design System with Bengali Typography (`Hind Siliguri`, `Cinzel`, `Inter`)
- **State Management:** Zustand with local storage persistence
- **Mapping & GIS:** Leaflet & React-Leaflet
- **Forms & Validation:** React Hook Form + Zod
- **Icons:** Lucide React
- **Visualizations:** Recharts

---

## 📂 Project Structure

```
BhuProhori_AI/
├── public/                 # Static assets & icons
├── src/
│   ├── components/         # Reusable UI components (Header, layout widgets)
│   ├── data/               # Demo datasets (Parcels, Khatians, Deeds, Scenarios)
│   ├── pages/              # Primary route screens
│   │   ├── HomePage.tsx          # Landing page with scenario quick-launch
│   │   ├── UploadPage.tsx        # Deed upload & OCR preview
│   │   ├── ReviewPage.tsx        # Side-by-side data review
│   │   ├── IdentifyPage.tsx      # Leaflet GIS parcel identification
│   │   ├── VerificationPage.tsx  # 7-Rule verification engine results
│   │   ├── ApplicationPage.tsx   # Multi-step mutation submission wizard
│   │   ├── TrackPage.tsx         # Citizen status timeline & tracker
│   │   └── OfficerPage.tsx       # Land officer management dashboard
│   ├── services/           # Verification engine logic & GIS matchers
│   ├── store/              # Zustand global application state
│   ├── types/              # TypeScript schemas and domain models
│   ├── App.tsx             # Route management
│   ├── main.tsx            # App bootstrap
│   └── index.css           # Global typography, color tokens, and components
├── package.json
└── vite.config.ts
```

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/munyimJR/BhuProhori_AI.git

# Navigate into the project folder
cd BhuProhori_AI

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## ⚖️ Disclaimer

*This application is an educational prototype and hackathon demonstration developed for the LandTech Innovation Hackathon 2026. All deed records, khatians, dag numbers, national identification numbers, and names utilized in demo scenarios are fictional and synthetic.*
