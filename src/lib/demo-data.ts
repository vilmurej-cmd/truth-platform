import type { ConfidenceLevel } from "./constants";

// ─── Discover (General) ─────────────────────────────────────────────

export interface Discovery {
  title: string;
  summary: string;
  sources: string[];
  confidenceLevel: ConfidenceLevel;
  connections: string[];
  timestamp: string;
}

export const demoDiscover: Discovery[] = [
  {
    title: "Interconnected Underground Tunnel Networks Beneath Major Cities",
    summary:
      "Cross-referencing geological surveys, urban planning archives, and declassified military documents reveals a pattern of interconnected tunnel systems beneath at least 14 major cities worldwide. Many predate official city records by centuries.",
    sources: [
      "USGS Geological Survey Database",
      "National Archives — Urban Infrastructure Records",
      "University of Edinburgh Subterranean Research Group",
    ],
    confidenceLevel: "high",
    connections: [
      "Buried: Ancient Roman infrastructure",
      "Declassified: Cold War bunker networks",
      "Cold Cases: Missing persons near tunnel entrances",
    ],
    timestamp: "2026-03-12T14:30:00Z",
  },
  {
    title: "Correlation Between Deep-Sea Magnetic Anomalies and Archaeological Sites",
    summary:
      "Machine learning analysis of ocean floor magnetometry data shows statistically significant overlap with known coastal archaeological sites, suggesting submerged settlements along ancient coastlines during lower sea levels.",
    sources: [
      "NOAA Ocean Exploration Dataset",
      "Journal of Archaeological Science, Vol. 148",
      "Woods Hole Oceanographic Institution",
    ],
    confidenceLevel: "moderate",
    connections: [
      "Deep Ocean: Bimini Road formation",
      "Buried: Coastal Neolithic settlements",
      "Science: Sea level reconstruction models",
    ],
    timestamp: "2026-03-10T09:15:00Z",
  },
  {
    title: "Pattern Analysis of Declassified Documents Reveals Systematic Data Gaps",
    summary:
      "Natural language processing of 2.3 million declassified government documents reveals consistent redaction patterns that, when mapped temporally and geographically, suggest coordinated information suppression across multiple agencies between 1953-1974.",
    sources: [
      "CIA FOIA Reading Room",
      "NSA Declassified Archives",
      "George Washington University National Security Archive",
    ],
    confidenceLevel: "moderate",
    connections: [
      "Declassified: Project MKUltra timeline",
      "Cold Cases: Unresolved journalist disappearances 1960s",
      "Public: Freedom of Information Act gaps",
    ],
    timestamp: "2026-03-08T18:45:00Z",
  },
];

// ─── Cold Cases ─────────────────────────────────────────────────────

export interface ColdCase {
  title: string;
  year: number;
  status: string;
  summary: string;
  evidence: string[];
  suspects: string[];
  breakthroughs: string[];
  confidenceLevel: ConfidenceLevel;
}

export const demoColdCases: ColdCase[] = [
  {
    title: "The Somerton Man (Tamam Shud Case)",
    year: 1948,
    status: "Decoded — Identity Likely Established",
    summary:
      "An unidentified man found dead on Somerton Beach, Adelaide, Australia. A scrap of paper reading 'Tamam Shud' (meaning 'ended' or 'finished') was hidden in his pocket. In 2022, DNA analysis and genealogical research identified him as Carl 'Charles' Webb, an electrical engineer from Melbourne.",
    evidence: [
      "Rubaiyat of Omar Khayyam with torn final page",
      "Encrypted code written in the book's margin",
      "Unregistered phone number of a nurse (Jessica Thomson)",
      "Advanced DNA analysis (2022) matching Webb family",
    ],
    suspects: [
      "Carl 'Charles' Webb (identified as the deceased, 2022)",
      "Cold War espionage connection theorized but unproven",
    ],
    breakthroughs: [
      "2022: DNA extracted from hair samples, genealogical match to Carl Webb",
      "2023: Body exhumed for definitive DNA confirmation",
      "Cipher remains unsolved — may be a one-time pad or personal shorthand",
    ],
    confidenceLevel: "high",
  },
  {
    title: "D.B. Cooper Hijacking",
    year: 1971,
    status: "Open — FBI Suspended Active Investigation 2016",
    summary:
      "A man using the alias Dan Cooper hijacked a Northwest Orient Airlines flight, extorted $200,000 in ransom, and parachuted into the night over the Pacific Northwest. He was never found. In 1980, a boy found $5,800 of the ransom money along the Columbia River, but no other physical evidence of Cooper has surfaced.",
    evidence: [
      "$5,800 in deteriorated ransom bills found on Columbia River bank (1980)",
      "Clip-on tie left on aircraft with DNA and titanium particles",
      "Flight path and wind pattern analysis",
      "Witness descriptions from passengers and crew",
    ],
    suspects: [
      "Richard Floyd McCoy Jr. — similar hijacking 1972, killed by FBI 1974",
      "Robert Rackstraw — military parachutist, circumstantial evidence",
      "Sheridan Peterson — engineer, matching profile, denied involvement",
    ],
    breakthroughs: [
      "2011: Advanced DNA profiling from tie — no database match",
      "2017: Citizen investigators decode alleged Cooper letters",
      "Titanium particles on tie suggest aerospace industry worker",
    ],
    confidenceLevel: "moderate",
  },
  {
    title: "Zodiac Cipher Z340",
    year: 1969,
    status: "Cipher Cracked 2020 — Killer Unidentified",
    summary:
      "The Zodiac Killer terrorized Northern California in the late 1960s, taunting police and media with encrypted ciphers. The 340-character cipher (Z340), mailed in 1969, remained unsolved for 51 years until a team of three codebreakers cracked it in December 2020 using specialized software.",
    evidence: [
      "Four cipher messages sent to newspapers (Z408 solved 1969, Z340 solved 2020)",
      "Fingerprints and partial DNA from letters",
      "Eyewitness descriptions from Presidio Heights attack",
      "Z340 decoded message: taunting about not being caught",
    ],
    suspects: [
      "Arthur Leigh Allen — prime suspect, died 1992, DNA inconclusive",
      "Gary Francis Poste — identified by cold case team 2021, debated",
      "Ross Sullivan — librarian, matching description, died 1977",
    ],
    breakthroughs: [
      "2020: David Oranchak, Sam Blake, and Jarl Van Eycke crack Z340 using AZdecrypt software",
      "Cipher used complex transposition with diagonal path reading",
      "2021: New DNA technology applied to stamp adhesive — results pending",
    ],
    confidenceLevel: "high",
  },
];

// ─── Deep Ocean ─────────────────────────────────────────────────────

export interface DeepOceanEntry {
  title: string;
  location: string;
  depth: string;
  summary: string;
  discoveries: string[];
  theories: string[];
  confidenceLevel: ConfidenceLevel;
}

export const demoDeepOcean: DeepOceanEntry[] = [
  {
    title: "Mariana Trench Hadal Zone",
    location: "Western Pacific Ocean, 11.3493 N, 142.1996 E",
    depth: "10,935 meters (35,876 ft)",
    summary:
      "The deepest known point on Earth, Challenger Deep in the Mariana Trench hosts extremophile organisms thriving under 1,086 bars of pressure. Recent expeditions have discovered new species, microplastic contamination at maximum depth, and xenophyophores — giant single-celled organisms.",
    discoveries: [
      "Snailfish observed at 8,178m — deepest living fish recorded",
      "Microplastic contamination found at 10,927m depth",
      "Novel bacterial species producing unique enzymes for pharmaceutical research",
      "Xenophyophores — single-celled organisms up to 20cm across",
    ],
    theories: [
      "Hadal trenches may harbor chemosynthetic ecosystems independent of sunlight",
      "Extremophile enzymes could revolutionize industrial biochemistry",
      "Subduction zone geology suggests undiscovered hydrothermal vents",
    ],
    confidenceLevel: "verified",
  },
  {
    title: "Baltic Sea Anomaly",
    location: "Northern Baltic Sea, between Sweden and Finland",
    depth: "87 meters (285 ft)",
    summary:
      "Discovered in 2011 by Swedish treasure hunters using sonar, this 60-meter circular formation on the Baltic seabed resembles a disc-shaped object with what appears to be a 300-meter 'skid mark' trail behind it. Scientific analysis suggests natural geological formation, but some features remain unexplained.",
    discoveries: [
      "60-meter circular formation detected on sonar",
      "Apparent 300-meter drag trail behind the object",
      "Rock samples show mineral composition inconsistent with local geology",
      "Divers report electronic equipment malfunctions near the site",
    ],
    theories: [
      "Natural glacial deposit from Ice Age — most geologists' consensus",
      "WWII anti-submarine device or naval mine anchor",
      "Volcanic rock formation pushed by glacial movement",
      "Unexplained origin — equipment interference not reproducible",
    ],
    confidenceLevel: "low",
  },
  {
    title: "Bimini Road",
    location: "North Bimini Island, Bahamas, 25.7667 N, 79.2667 W",
    depth: "5.5 meters (18 ft)",
    summary:
      "A 0.8 km linear formation of rectangular limestone blocks submerged off the coast of Bimini. Discovered in 1968, its remarkably regular geometry has sparked debate between those who see it as a man-made ancient road or wall and geologists who attribute it to natural beach-rock fracturing.",
    discoveries: [
      "Rectangular blocks up to 4 meters in length arranged in linear formation",
      "Radiocarbon dating places formation at approximately 3,500 years old",
      "Second tier of blocks discovered beneath the visible layer",
      "Tool marks reported on some blocks — disputed by geologists",
    ],
    theories: [
      "Natural beach-rock formation fractured along joint planes — geological consensus",
      "Remnant of Atlantean or pre-Columbian civilization",
      "Ancient harbor or breakwater structure from lower sea-level period",
      "Edgar Cayce 1938 prediction of Atlantis discovery near Bimini — coincidental timing",
    ],
    confidenceLevel: "moderate",
  },
];

// ─── Buried (Archaeology) ───────────────────────────────────────────

export interface BuriedEntry {
  title: string;
  location: string;
  period: string;
  summary: string;
  findings: string[];
  significance: string;
  confidenceLevel: ConfidenceLevel;
}

export const demoBuried: BuriedEntry[] = [
  {
    title: "Gobekli Tepe",
    location: "Sanliurfa Province, Southeastern Turkey",
    period: "c. 9500 BCE — Pre-Pottery Neolithic",
    summary:
      "The world's oldest known megalithic site, predating Stonehenge by 6,000 years. Massive T-shaped pillars carved with animal reliefs were erected by hunter-gatherers before the invention of agriculture, pottery, or metalworking — upending the conventional theory that complex society required farming first.",
    findings: [
      "Over 200 T-shaped limestone pillars, up to 5.5 meters tall and 10 tons each",
      "Intricate carvings of lions, foxes, snakes, vultures, and scorpions",
      "No evidence of permanent habitation — appears to be purely ceremonial",
      "Only 5% of the site has been excavated as of 2026",
      "Enclosures were deliberately buried around 8000 BCE for unknown reasons",
    ],
    significance:
      "Rewrites human history: proves complex monumental architecture and organized religion preceded agriculture and settled civilization by at least 1,000 years.",
    confidenceLevel: "verified",
  },
  {
    title: "Antikythera Mechanism",
    location: "Antikythera shipwreck, Greece (recovered 1901)",
    period: "c. 205-87 BCE — Hellenistic Period",
    summary:
      "An ancient Greek analog computer used to predict astronomical positions, eclipses, and Olympic game cycles. Its 30+ meshing bronze gears represent a level of technological sophistication not seen again until 14th-century European clockwork. CT scanning has revealed inscriptions suggesting it tracked all five known planets.",
    findings: [
      "82 corroded bronze fragments recovered from a Roman-era shipwreck",
      "At least 30 interlocking gears with teeth as small as 1.5mm",
      "Tracks the Metonic cycle (19-year lunar calendar), Saros eclipse cycle, and synodic periods of planets",
      "Rear dial includes a 4-year cycle matching the Panhellenic games",
      "2021 UCL team created first complete digital model of the front display",
    ],
    significance:
      "The most sophisticated known technological artifact of the ancient world. Proves Hellenistic Greeks possessed advanced mechanical engineering knowledge previously thought impossible for the era.",
    confidenceLevel: "high",
  },
  {
    title: "Nazca Lines",
    location: "Nazca Desert, Southern Peru",
    period: "c. 500 BCE - 500 CE — Nazca Culture",
    summary:
      "Hundreds of enormous geoglyphs etched into the desert floor, depicting animals, plants, and geometric shapes visible only from the air. The lines were created by removing reddish pebbles to expose lighter ground beneath. Their purpose remains debated — theories range from astronomical calendars to ritual water-related ceremonies.",
    findings: [
      "Over 800 straight lines, 300 geometric figures, and 70 animal/plant designs",
      "Largest figures span over 370 meters (1,200 feet)",
      "AI-assisted surveys discovered 168 new geoglyphs in 2022-2024",
      "Some lines align with water sources in the arid desert",
      "Pottery and offering deposits found at line intersections",
    ],
    significance:
      "One of archaeology's greatest enigmas. The scale of construction and aerial-only visibility challenge assumptions about pre-Columbian technological capabilities and cultural organization.",
    confidenceLevel: "moderate",
  },
];

// ─── Declassified ───────────────────────────────────────────────────

export interface DeclassifiedEntry {
  title: string;
  agency: string;
  yearClassified: number;
  yearDeclassified: number;
  summary: string;
  keyFindings: string[];
  implications: string[];
  confidenceLevel: ConfidenceLevel;
}

export const demoDeclassified: DeclassifiedEntry[] = [
  {
    title: "Project MKUltra",
    agency: "Central Intelligence Agency (CIA)",
    yearClassified: 1953,
    yearDeclassified: 1977,
    summary:
      "A covert CIA program conducting illegal experiments on human subjects to develop mind-control techniques using drugs (especially LSD), hypnosis, sensory deprivation, isolation, and psychological torture. Over 150 institutions participated, often without subjects' knowledge or consent. Most records were destroyed in 1973; surviving documents were discovered via FOIA in 1977.",
    keyFindings: [
      "150+ institutions including universities and hospitals participated",
      "Unwitting subjects dosed with LSD — at least one death (Frank Olson, 1953)",
      "Sub-projects included Operation Midnight Climax (CIA-run brothels for drug testing)",
      "Director Richard Helms ordered all files destroyed in 1973",
      "20,000 surviving documents found in financial records archive (1977)",
    ],
    implications: [
      "Led to 1977 Senate Church Committee hearings on intelligence abuses",
      "Prompted Executive Order 12333 restricting human experimentation",
      "Raised fundamental questions about government accountability and consent",
      "Some researchers believe undisclosed sub-projects may still be classified",
    ],
    confidenceLevel: "verified",
  },
  {
    title: "Operation Northwoods",
    agency: "Department of Defense / Joint Chiefs of Staff",
    yearClassified: 1962,
    yearDeclassified: 1997,
    summary:
      "A proposed false-flag operation by the U.S. Joint Chiefs of Staff to stage terrorist attacks on American soil and blame them on Cuba, providing justification for military intervention. The plan included hijacking aircraft, sinking boats of Cuban refugees, and orchestrating violent acts in U.S. cities. President Kennedy rejected the proposal and removed the JCS chairman.",
    keyFindings: [
      "Signed by Chairman of Joint Chiefs Lyman Lemnitzer, March 13, 1962",
      "Proposed fake attacks on Guantanamo Bay, Miami, and Washington D.C.",
      "Included plans to shoot down a drone aircraft disguised as a commercial flight",
      "Recommended 'casualty lists in U.S. newspapers' to build public outrage",
      "Kennedy rejected the plan; Lemnitzer was reassigned to NATO",
    ],
    implications: [
      "Demonstrates highest-level military willingness to deceive American public",
      "Declassification validated concerns about government false-flag capabilities",
      "Frequently cited in debates about institutional accountability",
      "Full document available at National Security Archive, George Washington University",
    ],
    confidenceLevel: "verified",
  },
  {
    title: "NSA PRISM Surveillance Program",
    agency: "National Security Agency (NSA)",
    yearClassified: 2007,
    yearDeclassified: 2013,
    summary:
      "A classified mass electronic surveillance program that collected internet communications directly from the servers of major U.S. technology companies including Google, Apple, Facebook, Microsoft, and Yahoo. Exposed by NSA contractor Edward Snowden in June 2013, PRISM operated under Section 702 of the FISA Amendments Act with secret FISA court authorization.",
    keyFindings: [
      "Direct server access to 9 major tech companies (disputed as 'direct')",
      "Collected emails, chats, video calls, photos, stored data, file transfers",
      "Authorized by secret FISA court orders under Section 702",
      "Upstream collection tapped fiber optic cables (MUSCULAR, TEMPORA with GCHQ)",
      "Cost $20 million/year — described internally as NSA's most productive source",
    ],
    implications: [
      "Triggered global debate on mass surveillance vs. national security",
      "Led to USA FREEDOM Act (2015) reforming bulk data collection",
      "Tech companies implemented end-to-end encryption in response",
      "Snowden charged under Espionage Act; granted Russian citizenship 2022",
    ],
    confidenceLevel: "verified",
  },
];

// ─── Science (Cure Accelerator) ─────────────────────────────────────

export interface ScienceEntry {
  title: string;
  field: string;
  status: string;
  summary: string;
  breakthroughs: string[];
  barriers: string[];
  timelineEstimate: string;
  confidenceLevel: ConfidenceLevel;
}

export const demoScience: ScienceEntry[] = [
  {
    title: "mRNA Vaccine Technology",
    field: "Immunology / Molecular Biology",
    status: "Deployed — Expanding to New Targets",
    summary:
      "Messenger RNA vaccines instruct cells to produce proteins that trigger immune responses, enabling rapid vaccine development. After proving transformative against COVID-19, mRNA platforms are now in clinical trials for influenza, RSV, cancer (personalized neoantigen vaccines), HIV, and malaria. Moderna and BioNTech are leading next-generation thermostable formulations.",
    breakthroughs: [
      "COVID-19 vaccines developed in under 11 months (unprecedented speed)",
      "Personalized cancer vaccines in Phase 2 trials showing tumor regression",
      "Self-amplifying mRNA (saRNA) reduces required dose by 10-100x",
      "Lipid nanoparticle delivery optimized for organ-specific targeting",
    ],
    barriers: [
      "Cold-chain storage requirements limit distribution in developing nations",
      "Rare inflammatory side effects require long-term safety monitoring",
      "Manufacturing scale-up for personalized cancer vaccines is cost-intensive",
      "Patent disputes between Moderna and BioNTech/Pfizer slow collaboration",
    ],
    timelineEstimate:
      "Cancer vaccines: Phase 3 trials by 2027. Pan-coronavirus vaccine: 2028. HIV mRNA vaccine: early trials ongoing, 5-10 years from deployment.",
    confidenceLevel: "verified",
  },
  {
    title: "CRISPR Gene Therapy",
    field: "Genetics / Gene Editing",
    status: "First Approved Treatment 2023 — Expanding",
    summary:
      "CRISPR-Cas9 gene editing enables precise modification of DNA sequences. The first CRISPR therapy (Casgevy by Vertex/CRISPR Therapeutics) was approved in 2023 for sickle cell disease and beta-thalassemia. Next-generation approaches including base editing and prime editing promise even greater precision with fewer off-target effects.",
    breakthroughs: [
      "Casgevy approved UK (Nov 2023) and FDA (Dec 2023) — first CRISPR therapy",
      "Base editing corrects single-letter mutations without cutting DNA",
      "Prime editing ('search and replace') achieves all 12 point mutation types",
      "In vivo CRISPR delivery via lipid nanoparticles eliminates need for cell extraction",
    ],
    barriers: [
      "Off-target editing risk requires extensive safety validation",
      "Delivery to specific tissues (brain, muscle) remains challenging",
      "Cost per patient ($2.2M for Casgevy) limits global accessibility",
      "Ethical debates on germline editing (heritable changes) unresolved",
    ],
    timelineEstimate:
      "Hereditary blindness treatment: 2026-2027. Huntington's disease trial: 2027. In vivo liver editing for cholesterol: Phase 2 by 2026.",
    confidenceLevel: "high",
  },
  {
    title: "Psychedelic-Assisted Therapy",
    field: "Psychiatry / Neuroscience",
    status: "Phase 3 Trials — FDA Decision Pending",
    summary:
      "Clinical research demonstrates that psilocybin, MDMA, and ketamine, administered in controlled therapeutic settings, can produce rapid and durable improvements in treatment-resistant depression, PTSD, and addiction. MDMA-assisted therapy for PTSD narrowly missed FDA approval in 2024; revised trials are underway with improved protocols.",
    breakthroughs: [
      "Psilocybin shows 4x remission rate vs. placebo in treatment-resistant depression",
      "MDMA-assisted therapy: 71% of PTSD patients no longer met diagnostic criteria",
      "Ketamine (Spravato) FDA-approved for treatment-resistant depression since 2019",
      "Neuroimaging shows psychedelics increase brain connectivity and neuroplasticity",
    ],
    barriers: [
      "FDA rejected Lykos MDMA application (2024) citing trial design concerns",
      "Schedule I classification restricts research access and funding",
      "Standardizing 'set and setting' therapy protocols across clinics",
      "Risk of adverse psychological events requires trained therapist supervision",
    ],
    timelineEstimate:
      "MDMA for PTSD: revised FDA submission 2026, potential approval 2027. Psilocybin for depression: Phase 3 results 2026-2027. Australia already approved both (2023).",
    confidenceLevel: "moderate",
  },
];

// ─── Public Knowledge ───────────────────────────────────────────────

export interface PublicEntry {
  question: string;
  answer: string;
  sources: string[];
  lastUpdated: string;
  confidenceLevel: ConfidenceLevel;
}

export const demoPublic: PublicEntry[] = [
  {
    question: "How much of the ocean has been explored?",
    answer:
      "Approximately 5-10% of the global ocean floor has been mapped to high resolution using modern sonar technology. The Seabed 2030 project, a collaboration between the Nippon Foundation and GEBCO, aims to map the entire ocean floor by 2030. As of 2025, about 25% has been mapped to modern standards, up from 6% in 2017. The vast majority of the deep ocean remains unvisited by humans or remotely operated vehicles.",
    sources: [
      "NOAA National Ocean Service",
      "Seabed 2030 Project — GEBCO",
      "Schmidt Ocean Institute Annual Report 2025",
    ],
    lastUpdated: "2026-02-28",
    confidenceLevel: "verified",
  },
  {
    question: "What percentage of government documents are classified?",
    answer:
      "The U.S. government classifies approximately 50 million documents per year as of recent estimates. The Information Security Oversight Office (ISOO) reported that classification costs exceed $18 billion annually. Roughly 4.2 million people hold security clearances. The exact percentage of all government documents that are classified is difficult to determine, but experts estimate 5-10% of all federal records carry some classification level. Over-classification is widely acknowledged as a systemic problem by both government officials and oversight bodies.",
    sources: [
      "Information Security Oversight Office (ISOO) Annual Report",
      "Brennan Center for Justice — Reducing Overclassification",
      "Public Interest Declassification Board",
    ],
    lastUpdated: "2026-01-15",
    confidenceLevel: "high",
  },
  {
    question: "What is the current state of nuclear fusion energy?",
    answer:
      "Nuclear fusion achieved a historic net energy gain at the National Ignition Facility in December 2022. Since then, multiple private companies (Commonwealth Fusion, TAE Technologies, Helion Energy) are racing toward commercial reactors. ITER, the international megaproject in France, targets first plasma by 2035. Commonwealth Fusion's SPARC tokamak aims for net energy by 2027. The consensus timeline for grid-connected fusion power has shifted from 'always 30 years away' to a more concrete 2035-2040 window, though significant engineering challenges remain in materials science and plasma containment.",
    sources: [
      "National Ignition Facility — Lawrence Livermore National Laboratory",
      "ITER Organization Official Updates",
      "Fusion Industry Association — Global Fusion Industry Report 2025",
    ],
    lastUpdated: "2026-03-01",
    confidenceLevel: "verified",
  },
];
