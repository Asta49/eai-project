# AI PCOS Personal Health Assistant & Research Engine

> **Course Project:** Economics of AI, IIM Ahmedabad  
> **Core Value Proposition:** *"A personal research assistant for your PCOS. It figures out what works for your body, not for women in general."*

---

## 🌟 Executive Summary & Course Relevance

PCOS (Polycystic Ovary Syndrome) affects 1 in 5 Indian women, yet standard care relies on generic advice and trial-and-error. This application transforms PCOS self-care into **N-of-1 Personal Science**:

1. **Strict Separation of Concerns:** Generative AI **never** decides whether an intervention worked. A deterministic **Bayesian normal-normal conjugate statistics engine** calculates all effect estimates, credible intervals, and verdicts ($P(\text{benefit} > \text{MCID})$).
2. **Defensible Data Network Effect (The Moat):** Completed trials update population-level hierarchical empirical Bayes priors. As more patients complete experiments, time-to-confident-verdict drops from 38 days to 14 days, demonstrating an increasing returns to data scale advantage.
3. **Hyper-Localized for India:** Supports 4 Indian languages (English, हिंदी, తెలుగు, தமிழ்), Indian Nutrient Databank (INDB) with 150+ dishes, home-collection diagnostic labs, and Rupee (₹) pricing.
4. **Clinical Safety & DPDP Compliance:** Granular consent toggles, AES-256-GCM encryption at rest, automatic 112 red-flag emergency detection, and strict non-diagnostic wellness positioning.

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router), TypeScript in strict mode
- **UI:** Tailwind CSS, shadcn/ui principles, Lucide Icons, Recharts
- **Database & Vector:** PostgreSQL via Prisma, `pgvector/pgvector:pg16` Docker container
- **Authentication:** Auth.js / NextAuth (Role-based: `USER`, `DOCTOR`, `ADMIN`)
- **i18n:** `next-intl` (English, Hindi, Telugu, Tamil with dynamic language switching)
- **AI Layer:** Vercel AI SDK (`ai`), Zod schema validation, provider-agnostic (`mock`, `openai`, `google`)
- **Voice Support:** Browser Web Speech API with pluggable `VoiceProvider` (Sarvam AI / Bhashini / AI4Bharat adapters)
- **Testing:** Vitest for statistical engine unit testing (target $\ge 90\%$ test coverage)

---

## ⚡ Quickstart (One-Command Launch)

### Prerequisites
- Node.js 18+ (tested on Node 20 / 24)
- Docker & Docker Compose (for local PostgreSQL with `pgvector`)

### 1. Launch Database & Install Dependencies
```bash
# 1. Start Postgres with pgvector
docker compose up -d

# 2. Install dependencies (if not already installed)
npm install

# 3. Apply Prisma database schema & generate client
npm run db:push
npm run db:generate

# 4. Seed 60-day demo persona (Priya, 26) + 200 synthetic users + labs + foods
npm run seed

# 5. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎬 3-Minute Live Demo Script (For IIM-A Presentation)

| Time | Step | Action | Key Talking Point for Judges |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:30** | **Language & DPDP Consent** | Open app, switch to **हिंदी (Hindi)**. Click *Start New Patient Onboarding*. View granular DPDP consent toggles. | Shows compliance with India's DPDP Act and immediate vernacular accessibility. |
| **0:30 - 1:00** | **Lab Report OCR** | Navigate to `/labs`. Click *Sample 1: Metabolic & Insulin Panel*. View AI extraction with Zod validation. Review canonical biomarkers (Fasting Insulin, HOMA-IR). | AI handles unstructured document intake, but patient remains in control with human-in-the-loop verification. |
| **1:00 - 1:45** | **Dashboard & N-of-1 Trial** | Open `/dashboard` (Priya Sharma, 26, Hyderabad). Switch language to **తెలుగు (Telugu)**. View estimated Rotterdam Phenotype A and active trial (*Myo-Inositol*). Click *Explain Verdict with AI*. | **The core rule:** Bayesian stats engine calculates the verdict; AI only translates and explains the numbers in plain Telugu. |
| **1:45 - 2:15** | **Indian Food Tracker & Lab Booking** | Open `/food`. Enter "2 roti, dal, aloo gobi". View glycemic score and smart swap (*Poha $\to$ Besan Chilla*). Book test at *Thyrocare* with home collection. | Grounded in authentic Indian dietary patterns and local healthcare infrastructure. |
| **2:15 - 2:45** | **Doctor Portal & AI Pre-Consult Brief** | Switch to `/doctors`. View Dr. Ananya Sen's dashboard. Review Priya's AI-generated 1-page pre-consult clinical brief. Approve pending trial. | Enhances doctor productivity; doctors retain full authority over clinical interventions. |
| **2:45 - 3:00** | **The Moat (Course Economics)** | Open `/admin`. Drag the synthetic users slider from 50 to 5,000. Observe the empirical Bayes prior curve dropping days-to-verdict from 38 to 14 days. | **Economics of AI:** Proprietary data flywheel creates a barrier to entry that generalized LLMs cannot replicate. |

---

## 📊 Course Core: The Bayesian Experiment Engine

Located in `lib/engine/`:
$$y_t = \beta_0 + \delta \cdot \text{phase}_t + \sum \gamma_k \cdot \text{cyclePhase}_{kt} + \epsilon_t$$
1. **OLS Regression:** Adjusts for Menstrual, Follicular, and Luteal phases to remove menstrual cycle confounding.
2. **Autocorrelation Adjustment:** Residual AR(1) coefficient $\hat{\rho}$ inflates the standard error:
   $$SE_{\text{adj}} = SE \times \sqrt{\frac{1+\hat{\rho}}{1-\hat{\rho}}}$$
3. **Adherence Weighting:** If adherence $< 70\%$, standard error is further widened by $1 / \sqrt{\text{adherence}}$.
4. **Bayesian Conjugate Update:**
   $$\mu_n = \frac{\frac{\mu_0}{\tau_0^2} + \frac{\hat{\delta}}{SE_{\text{adj}}^2}}{\frac{1}{\tau_0^2} + \frac{1}{SE_{\text{adj}}^2}}, \quad \sigma_n^2 = \frac{1}{\frac{1}{\tau_0^2} + \frac{1}{SE_{\text{adj}}^2}}$$
5. **Deterministic Verdict:**
   - $P(\text{benefit} > \text{MCID}) \ge 0.80 \implies$ **"Likely worked for you"**
   - $P(\text{benefit} > \text{MCID}) \le 0.20 \implies$ **"Likely didn't work for you"**
   - Otherwise $\implies$ **"Inconclusive: consider extending"**

---

## 🧪 Testing & Verification

### 1. Bayesian Stats Engine Unit Tests (Vitest)
```bash
# Run all unit tests
npm test

# Run with test coverage report (>= 90% target)
npm run test:coverage
```
The test suite covers:
- OLS regression with 3-phase menstrual cycle adjustment
- AR(1) autocorrelation estimation & SE inflation
- Adherence penalty widening ($<70\%$ adherence)
- Bayesian normal-normal conjugate updating with 90% credible intervals
- Accurate recovery of known synthetic treatment effects ($\delta = 1.2, \text{MCID} = 0.5 \implies$ `LIKELY_WORKED`)
- Recovery of null treatment ($\delta = 0 \implies$ `LIKELY_DID_NOT_WORK`)
- Empirical Bayes variance shrinkage across patient cohorts
- Safety filter (pregnancy contraindications, doctor-approval lock, budget limits)
- Thompson sampling multi-armed bandit recommender reproducibility
- Rotterdam criteria A/B/C/D phenotype and Asian BMI classification
- Diagnostic test scheduler rules
- Economics of AI data network moat simulation ($>30\%$ days saved)

### 2. Playwright End-to-End Test
```bash
# Run E2E happy path test suite
npm run test:e2e
```
Validates the complete patient journey:
- Multi-lingual landing page & dashboard rendering
- Priya Sharma's Phenotype B, HOMA-IR, and active N-of-1 trial
- Dynamic language switching to Hindi (`/hi`)
- Active & completed trial Bayesian verdict rendering
- Thompson sampling experiment recommendations
- Economics of AI presentation moat & empirical Bayes simulation slider
- Universal red-flag safety checks & 112 emergency routing

### 3. Production Build
```bash
npm run build
```
Statically optimizes and generates all **58 application routes** across the 4 localized namespaces (`en`, `hi`, `te`, `ta`) and dynamic API routes with zero compilation errors.

---

## 👥 Demo Personas & Fast Login

The app supports instant one-click login on `/login` without passwords:
- **Priya Sharma (`priya@example.com`)**: 26 y/o woman in Hyderabad with Phenotype B (Ovulatory PCOS), 60 days of continuous check-ins, 1 completed diet trial, 1 active walking trial, and 2 verified lab panels.
- **Dr. Ananya Sen (`doctor@example.com`)**: Senior Gynecologist & Reproductive Endocrinologist. Views patient briefs, approves locked medical trials (e.g., Myo-Inositol, Metformin), and logs encrypted consult notes.
- **Course Admin (`admin@example.com`)**: Accesses the `/admin` Economics of AI Moat simulator, token cost breakdown, and network effect modeling.
