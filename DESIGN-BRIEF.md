# Sorcova website — UI/UX direction

## Objective

Present Sorcova as a credible, category-defining biological intelligence company: clinically serious enough for healthcare stakeholders, technically ambitious enough for investors, and clear enough for an individual to understand in one visit.

The site should feel like one governed product system. It should not feel like a stack of independently designed marketing sections.

## Primary audiences

1. Clinicians and healthcare systems — need clarity, traceability, workflow fit and responsible claims.
2. Payers and strategic partners — need a measurable platform, implementation confidence and a path to value.
3. Investors and accelerators — need a clear wedge, defensible intelligence layer, technical depth and an expansive longevity vision.
4. Individuals — need a comprehensible benefit without being exposed to clinical or architectural complexity.

## Narrative sequence

Promise → human problem → measurable platform → intelligence moat → scientific method → longitudinal vision → clinical product → governance → evidence coverage → stakeholder value → conversation.

“Know your biology” is a dedicated educational journey, not a duplicate Science page. It translates the human experience into an accessible sequence: felt state → biological rhythm → connected systems → repeated observations → personal baseline → clinician context. The Science section remains the home for evidence, method and technical architecture.

## Visual principles

- Quiet confidence: large ideas, controlled typography and generous negative space.
- Evidence first: product artefacts, system maps and status labels carry more weight than decoration.
- One grid: all content aligns to the same 1,280px frame and responsive page gutter.
- One component language: consistent radii, borders, spacing and metadata treatment.
- Connected compositions for sequences and system maps rather than disconnected generic cards.
- Layered colour: warm editorial neutrals establish calm; Sorcova navy carries authority; product colours appear only where interaction, biology or status gives them meaning.
- Controlled density: information-rich modules remain readable; supporting cards become shorter and calmer.
- Explicit status: live, developing and roadmap capabilities are visually distinct.
- Human oversight: the visual language should communicate governance, not autonomous clinical decision-making.

## Design system

- Content frame: 1,280px maximum.
- Desktop section rhythm: 112–128px; mobile: 76–88px.
- Typography: modern sans for the product and narrative; editorial serif only for short emphasis.
- Display scale: 64–96px hero, 46–68px section headings, 26–34px card titles.
- Body scale: 16–18px primary copy, 13–15px supporting copy, 11–12px metadata.
- Surfaces: 18px modules, 24px major containers, pill radius only for controls and status.
- Borders: one-pixel mineral lines; shadows reserved for product interfaces and primary artefacts.

## Colour architecture

The website should share Sorcova's product identity without looking like a full-screen dashboard. The product design kit is a reference, not a constraint. The governing idea is **clinical authority × human vitality**.

### 1. Editorial foundation — approximately 70% of the page

- Warm paper and clean white carry narrative, storytelling and explanatory sections.
- Primary text uses a near-midnight navy rather than saturated product purple.
- Coral may emphasise a short editorial phrase, never paragraphs or repeated interface chrome.
- These surfaces should feel calm, tactile and premium—not like a software template.

### 2. Scientific architecture — approximately 20% of the page

- Sorcova navy is reserved for the hero, proprietary methodology, governance and selected system artefacts.
- Teal represents biological continuity, reference context and current/live states.
- Coral represents disturbance, exception, caution or an observed signal requiring attention.
- Indigo identifies actions, links, focus and interactive controls.

### 3. Product and data signals — no more than 10% of the page

- The nine-pillar spectrum belongs inside charts, system nodes, product previews and legends.
- Pillar colours must never become full marketing-section backgrounds.
- Yellow is reserved for developing/warning states; green remains reserved for success/live confirmation.
- Bright product colours should appear in small, high-information moments so they retain meaning.

### Core token roles

- Sorcova midnight `#1D2A52`: authority, dark scientific surfaces and brand anchoring.
- Interaction blue `#5368DC`: primary actions, active navigation and keyboard focus.
- Biological sea-glass `#63C8B1`: rhythms, baselines, live/current states and positive continuity.
- Signal coral `#EF7156`: disturbed profiles, exceptions and limited editorial emphasis.
- Warm paper: narrative background; slightly warm rather than blue-grey.
- Pillar spectrum: data visualisation only.

## Section colour map

- Header: warm translucent paper when scrolled; navy text; indigo active state.
- Hero: quiet midnight navy with one restrained teal biological glow. No electric indigo wash.
- Human story: warm paper, navy typography and a single dark biological-profile artefact.
- Platform: warm neutral ground with white modules; one pale teal featured state.
- Intelligence system: pale mineral/clinical surface, not lavender; navy metrics and a contained dark system view if needed.
- Science: midnight navy, white text, teal variables and coral tier markers.
- Vision: warm paper with one teal current-state panel and one midnight future-state panel.
- Clinical product: white/neutral; the full product palette appears only inside the interface preview.
- Trust: Sorcova navy for institutional authority.
- Stakeholders: quiet warm neutral; avoid another saturated full-width field.
- Contact: pale biological teal or warm paper with a decisive navy action—not an electric purple gradient.

## Review finding — current experimental palette

The current local colour pass is **not ready to ship**. It correctly introduces Sorcova navy and product tokens, but applies them too broadly. This creates four problems:

1. Large lavender and electric-indigo fields make the site feel like a generic SaaS/product demo rather than a premium scientific company.
2. Repeated cool blue surfaces flatten the contrast between narrative, science, governance and product.
3. Pink-coral display typography has less authority than the earlier deeper coral and becomes decorative when repeated.
4. Product colours lose semantic meaning because they are used as section decoration instead of data and interaction signals.

The next pass should retain the token definitions and product-data accents, while reversing the broad surface substitutions.

## Visual acceptance criteria

- A grayscale view must still show a clear hierarchy between narrative, evidence, product and governance.
- No two adjacent full-width sections should use similarly saturated backgrounds.
- Every bright colour must answer one question: action, biological continuity, disturbance, status or pillar identity.
- The first screen should read as a scientific company before it reads as a software interface.
- The website and product should feel related, not identical.

## Interaction and accessibility

- All focus states remain visible.
- Motion is subtle and disabled when reduced motion is requested.
- Interactive targets remain at least 42px high where practical.
- No horizontal overflow at 390px.
- No meaningful interface text below 11px.
- Section hierarchy and reading order remain intact without animation or CSS.

## Scientific motion choreography

- Motion must explain biology: oscillation represents rhythm, a scan represents observation through time, and progressive connection represents longitudinal context.
- The hero establishes that signals move continuously rather than existing as isolated values.
- The illustrative profile resolves in stages: reference context → observed curve → interpreted pattern labels.
- The rhythm explorer keeps time visible while the reader compares two simplified daily patterns.
- The systems explorer can guide the reader automatically, but remains pausable and directly controllable.
- The baseline sequence advances with scroll position so repeated observations visibly accumulate into clinician-reviewed context.
- No essential claim, label or status depends on motion. Reduced-motion mode presents the complete final state immediately.

## Content guardrails

- Keep the proprietary formula and weighting sealed.
- Separate current Class I status from forward-looking Class IIa work.
- Clearly label live, developing and roadmap capabilities.
- The responsible clinician remains the decision-maker.
- Avoid the word “patient” until the intended-purpose and regulatory wording is confirmed.
