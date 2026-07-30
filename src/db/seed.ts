import "dotenv/config";
import { db } from "./index";
import { collections, productCollections, products, reviews } from "./schema";

const PRODUCT_SEED = [
  {
    slug: "sentinel-prime",
    codename: "CV-100",
    name: "Sentinel Prime",
    tagline: "The autonomous SOC analyst that never sleeps, never blinks, never misses.",
    description:
      "Sentinel Prime is CyberVault AI's flagship autonomous security-operations agent. It ingests your telemetry at wire speed, correlates signals across endpoint, network, and cloud, and takes decisive containment action within its configurable rules of engagement — all before your first coffee.\n\nEvery investigation is written up as a human-readable incident dossier with full evidence chains, so your auditors see the same clarity your analysts do. Deploy it beside your existing SIEM or let it run standalone; Sentinel Prime adapts its detection lattice to your environment within 72 hours of first contact.",
    category: "Security Operations",
    badge: "Bestseller",
    priceCents: 24900,
    image: "/images/products/sentinel.jpg",
    hue: 165,
    features: [
      "Autonomous triage & containment with configurable rules of engagement",
      "Cross-domain correlation across EDR, network, identity and cloud telemetry",
      "Self-tuning detection lattice that adapts to your environment in 72h",
      "Human-readable incident dossiers with full evidence chains",
      "Native integrations: Splunk, Sentinel, Chronicle, CrowdStrike, Okta",
      "Air-gapped deployment option for regulated environments",
    ],
    capabilities: { speed: 96, precision: 94, stealth: 62, autonomy: 97, uptime: 100, learning: 91 },
    specs: [
      { label: "Mean time to triage", value: "41 seconds" },
      { label: "Events analyzed / day", value: "4.2B" },
      { label: "False-positive rate", value: "< 0.03%" },
      { label: "Deployment", value: "SaaS · VPC · Air-gapped" },
      { label: "Compliance", value: "SOC 2 II · ISO 27001 · HIPAA" },
      { label: "Model stack", value: "CV-Helix 4 · custom detect graphs" },
    ],
    seedOrder: 1,
  },
  {
    slug: "cipher-intelligence",
    codename: "CV-210",
    name: "Cipher Intelligence",
    tagline: "A threat-intel agent that reads the dark web so you don't have to.",
    description:
      "Cipher Intelligence patrols the places your analysts shouldn't go — closed forums, paste sites, ransomware leak blogs, and over 300 monitored criminal marketplaces. It fingerprints your organization's exposure, attributes threat actors with confidence scores, and turns raw chatter into prioritized, actionable intelligence.\n\nAsk it anything in natural language: 'Are we in anyone's kill chain this week?' Cipher answers with cited sources, actor dossiers, and a recommended course of action — written in your reporting format, not ours.",
    category: "Threat Intelligence",
    badge: "Staff Pick",
    priceCents: 18900,
    image: "/images/products/cipher.jpg",
    hue: 195,
    features: [
      "Continuous monitoring of 300+ dark-web sources & closed channels",
      "Actor attribution with confidence scoring and campaign lineage",
      "Natural-language threat Q&A with cited, verifiable sources",
      "Brand, credential and data-leak exposure fingerprinting",
      "Automatic IOC extraction and firewall/EDR enrichment pushes",
      "Weekly executive briefs generated in your house style",
    ],
    capabilities: { speed: 84, precision: 92, stealth: 95, autonomy: 88, uptime: 99, learning: 93 },
    specs: [
      { label: "Sources monitored", value: "12,400+" },
      { label: "Languages parsed", value: "34" },
      { label: "Attribution accuracy", value: "91.4% verified" },
      { label: "Alert latency", value: "< 3 min from observation" },
      { label: "Deployment", value: "SaaS · VPC" },
      { label: "Model stack", value: "CV-Helix 4 · OSINT graph 12B" },
    ],
    seedOrder: 2,
  },
  {
    slug: "aegis-wall",
    codename: "CV-320",
    name: "Aegis Wall",
    tagline: "An adaptive firewall agent that hardens your perimeter in real time.",
    description:
      "Aegis Wall treats your network edge as a living system. It observes traffic patterns across your entire estate, builds a behavioral baseline for every service, and reshapes your firewall policy the moment reality deviates from intent — blocking lateral movement and zero-day probes that signature lists don't know about yet.\n\nEvery policy change is simulated against production traffic before it ships, so Aegis Wall hardens aggressively without breaking the business. Full rollback is one command away, and every decision carries a plain-English justification.",
    category: "Network Defense",
    badge: null,
    priceCents: 12900,
    image: "/images/products/aegis.jpg",
    hue: 200,
    features: [
      "Behavioral baselining for every service, port and workload",
      "Real-time adaptive policy shaping with pre-flight simulation",
      "Zero-day probe & lateral-movement interdiction",
      "One-command full policy rollback with audit trail",
      "eBPF-native enforcement — no agents on guest workloads",
      "Multi-cloud aware: AWS, Azure, GCP, on-prem & hybrid mesh",
    ],
    capabilities: { speed: 90, precision: 89, stealth: 40, autonomy: 86, uptime: 100, learning: 82 },
    specs: [
      { label: "Policy decisions / sec", value: "1.7M" },
      { label: "Enforcement overhead", value: "< 0.4% latency" },
      { label: "Blocked zero-days (fleet)", value: "317 YTD" },
      { label: "Rollback time", value: "< 200 ms" },
      { label: "Deployment", value: "VPC · On-prem · Hybrid mesh" },
      { label: "Compliance", value: "SOC 2 II · PCI DSS 4.0" },
    ],
    seedOrder: 4,
  },
  {
    slug: "phantom-trace",
    codename: "CV-415",
    name: "Phantom Trace",
    tagline: "An OSINT recon agent that maps your attack surface from the outside in.",
    description:
      "Phantom Trace thinks like an adversary with infinite patience. It continuously redescovers your external attack surface — shadow domains, forgotten buckets, exposed staging panels, leaked API keys — enumerating exactly what an attacker would see and precisely how far they could get.\n\nFindings arrive ranked by exploitability, each with a full attack narrative and remediation runbook. Security teams routinely discover that Phantom Trace has mapped 30% more exposure than their asset inventory knew existed.",
    category: "Reconnaissance",
    badge: "New",
    priceCents: 15900,
    image: "/images/products/phantom.jpg",
    hue: 210,
    features: [
      "Continuous external attack-surface discovery & enumeration",
      "Shadow IT, cloud-bucket and exposed-service detection",
      "Leaked credential & API-key hunter across 60+ sources",
      "Exploitability-ranked findings with attack narratives",
      "Auto-generated remediation runbooks per finding",
      "Passive-only collection — invisible to your targets & WAFs",
    ],
    capabilities: { speed: 78, precision: 90, stealth: 98, autonomy: 84, uptime: 99, learning: 87 },
    specs: [
      { label: "Typical exposure found", value: "+30% vs. inventory" },
      { label: "Finding precision", value: "96.1% confirmed" },
      { label: "Re-scan cadence", value: "Every 6 hours" },
      { label: "Collection mode", value: "100% passive" },
      { label: "Deployment", value: "SaaS" },
      { label: "Model stack", value: "CV-Helix 4 · surface graph 9B" },
    ],
    seedOrder: 5,
  },
  {
    slug: "oracle-forecast",
    codename: "CV-560",
    name: "Oracle Forecast",
    tagline: "A predictive risk engine that tells you what breaks next — before it does.",
    description:
      "Oracle Forecast reads the flood of CVEs, exploit chatter, vendor advisories, and your own system inventory, then answers the only question that matters: what do we fix first? Its exploit-probability models are calibrated against real-world exploitation outcomes, updating hourly as the threat landscape moves.\n\nEvery prediction ships with the reasoning intact — which signals fired, how confident the model is, and what the blast radius would be inside your specific environment. Patch backlogs become burn-down charts; board meetings become boring again.",
    category: "Predictive Analytics",
    badge: null,
    priceCents: 29900,
    image: "/images/products/oracle.jpg",
    hue: 260,
    features: [
      "Hourly exploit-probability scoring for every CVE in your stack",
      "Environment-aware blast-radius modeling on your real inventory",
      "Exploit-kit & ransomware absorption tracking before public disclosure",
      "Prioritized patch sequencing with effort-vs-risk tradeoff views",
      "Board-ready risk posture reports, generated continuously",
      "Backtested accuracy published openly — 0.93 AUC rolling 12mo",
    ],
    capabilities: { speed: 82, precision: 95, stealth: 70, autonomy: 80, uptime: 99, learning: 98 },
    specs: [
      { label: "Prediction accuracy (AUC)", value: "0.93 · rolling 12mo" },
      { label: "Vulnerabilities scored", value: "264,000+" },
      { label: "Model refresh", value: "Hourly" },
      { label: "Signals ingested", value: "1,900 feeds" },
      { label: "Deployment", value: "SaaS · VPC" },
      { label: "Compliance", value: "SOC 2 II · ISO 27001" },
    ],
    seedOrder: 6,
  },
  {
    slug: "ghost-script",
    codename: "CV-070",
    name: "Ghost Script",
    tagline: "The invisible automaton that quietly does the work your team hates.",
    description:
      "Ghost Script is a general-purpose autonomous operator for the tedious machinery of security and IT: rotating secrets, purging stale access, closing drifted configurations, chasing patch stragglers, filing the paperwork nobody reads.\n\nYou write intent in plain English — 'no security group may be open to the world for more than ten minutes' — and Ghost Script compiles it into a watched policy, enforces it continuously, and reports its work in a clean activity ledger. It is the junior admin who never takes PTO and never fat-fingers a subnet mask.",
    category: "Automation",
    badge: null,
    priceCents: 9900,
    image: "/images/products/ghost.jpg",
    hue: 150,
    features: [
      "Plain-English policy intents compiled to watched automation",
      "Secret rotation, access hygiene & config-drift remediation",
      "Patch-compliance chasing with graceful user nudging",
      "Immutable activity ledger for every autonomous action",
      "Sandboxed execution with human-approval gates where required",
      "200+ connectors: AWS, Azure, GCP, GitHub, Jira, Slack, Okta",
    ],
    capabilities: { speed: 88, precision: 85, stealth: 90, autonomy: 79, uptime: 99, learning: 80 },
    specs: [
      { label: "Tasks executed / mo (fleet avg)", value: "38,000" },
      { label: "Human hours saved / mo", value: "~120 per team" },
      { label: "Connectors", value: "200+" },
      { label: "Approval gates", value: "Unlimited, role-based" },
      { label: "Deployment", value: "SaaS · VPC · On-prem" },
      { label: "Compliance", value: "SOC 2 II · HIPAA" },
    ],
    seedOrder: 7,
  },
  {
    slug: "nexus-swarm",
    codename: "CV-900",
    name: "Nexus Swarm",
    tagline: "The multi-agent orchestrator that turns your tools into a team.",
    description:
      "Nexus Swarm is the command layer for the agent era. It coordinates fleets of CyberVault agents — and your own — into coherent squads that plan, delegate, verify, and escalate like a world-class operations team. Sentinel detects, Cipher attributes, Aegis contains, Ghost remediates, Oracle predicts: Nexus makes them one mind.\n\nBuilt on the CyberVault Agent Protocol, Nexus exposes every agent action as an auditable, replayable mission. Define campaign objectives at the strategy level — 'keep our exposure score below 40 during the rebrand launch' — and watch the swarm organize itself around the outcome.",
    category: "Multi-Agent Platform",
    badge: "Enterprise",
    priceCents: 44900,
    image: "/images/products/nexus.jpg",
    hue: 175,
    features: [
      "Mission-based orchestration across unlimited agent fleets",
      "Cross-agent planning, delegation, verification & escalation",
      "Auditable, replayable mission records for every action",
      "Bring-your-own-agent via the open CV Agent Protocol",
      "Strategy-level objectives translated to autonomous task graphs",
      "Enterprise controls: SSO, SCIM, granular RBAC, data-residency pins",
    ],
    capabilities: { speed: 85, precision: 91, stealth: 75, autonomy: 95, uptime: 100, learning: 94 },
    specs: [
      { label: "Agents orchestrated (max fleet)", value: "1,400" },
      { label: "Mission replay fidelity", value: "Bit-exact" },
      { label: "Escalation SLA", value: "< 60 s to human" },
      { label: "Protocol", value: "CV Agent Protocol v2 (open)" },
      { label: "Deployment", value: "VPC · Air-gapped" },
      { label: "Compliance", value: "SOC 2 II · ISO 27001 · FedRAMP-Ready" },
    ],
    seedOrder: 8,
  },
  {
    slug: "vault-keeper",
    codename: "CV-670",
    name: "Vault Keeper",
    tagline: "A data-guardian agent that knows where every secret sleeps.",
    description:
      "Vault Keeper maps, classifies, and guards your crown-jewel data across every store you own — and the ones you forgot. It finds PII in places compliance teams fear to look, enforces retention and encryption posture automatically, and detects exfiltration patterns in real time with a kill-switch response.\n\nWhen regulators or customers ask where their data lives, Vault Keeper answers with a live map, not a spreadsheet from last quarter. Data-subject requests that took three weeks now close in minutes, with cryptographic proof of completion.",
    category: "Data Protection",
    badge: null,
    priceCents: 13900,
    image: "/images/products/vault.jpg",
    hue: 220,
    features: [
      "Continuous data discovery & classification across all stores",
      "Automatic retention & encryption-posture enforcement",
      "Real-time exfiltration detection with kill-switch response",
      "Live crown-jewel data map with lineage and access trails",
      "DSR automation with cryptographic completion proofs",
      "GDPR, CCPA, HIPAA & PCI policy packs out of the box",
    ],
    capabilities: { speed: 80, precision: 93, stealth: 60, autonomy: 82, uptime: 100, learning: 85 },
    specs: [
      { label: "Data stores indexed", value: "All major clouds + SaaS" },
      { label: "Classification precision", value: "98.2% on PII" },
      { label: "Exfil detection latency", value: "< 400 ms" },
      { label: "DSR completion", value: "Minutes, with proofs" },
      { label: "Deployment", value: "SaaS · VPC · Air-gapped" },
      { label: "Compliance", value: "SOC 2 II · GDPR · HIPAA · PCI" },
    ],
    seedOrder: 3,
  },
];

const COLLECTION_SEED = [
  {
    slug: "defense-suite",
    name: "The Defense Suite",
    tagline: "Hold the line.",
    description:
      "Perimeter-hardening agents engineered for relentless environments. Detect, contain, and seal — autonomously.",
    image: "/images/products/aegis.jpg",
    hue: 200,
  },
  {
    slug: "intelligence-lab",
    name: "Intelligence Lab",
    tagline: "See what others can't.",
    description:
      "Agents that turn raw signal into foresight — from dark-web chatter to tomorrow's exploit kits.",
    image: "/images/products/oracle.jpg",
    hue: 260,
  },
  {
    slug: "autonomous-ops",
    name: "Autonomous Ops",
    tagline: "Deploy the machines that run the machines.",
    description:
      "Orchestration and automation agents that convert your intent into continuous, auditable action.",
    image: "/images/products/nexus.jpg",
    hue: 175,
  },
];

const COLLECTION_MEMBERSHIP: Record<string, string[]> = {
  "defense-suite": ["sentinel-prime", "aegis-wall", "vault-keeper"],
  "intelligence-lab": ["cipher-intelligence", "phantom-trace", "oracle-forecast"],
  "autonomous-ops": ["ghost-script", "nexus-swarm", "sentinel-prime"],
};

const REVIEW_SEED: Record<
  string,
  { author: string; role: string; hue: number; rating: number; title: string; body: string; daysAgo: number }[]
> = {
  "sentinel-prime": [
    {
      author: "Maya Okonkwo",
      role: "CISO, Northwind Financial",
      hue: 165,
      rating: 5,
      title: "It closed our overnight gap completely",
      body: "We used to staff a skeleton SOC overnight and pray. Sentinel Prime has run our 6pm–8am window for four months now: 212 incidents triaged, 9 contained autonomously, zero false blocks. The morning dossiers are better written than most human tickets I've read.",
      daysAgo: 6,
    },
    {
      author: "Daniel Reyes",
      role: "Director of Security, Loomstate Health",
      hue: 205,
      rating: 5,
      title: "The dossiers sold our auditors",
      body: "Every containment action ships with a full evidence chain and a plain-English narrative. Our SOC 2 auditor asked if he could keep a copy of the format as an example for other clients. That has literally never happened before.",
      daysAgo: 18,
    },
    {
      author: "Priya Raman",
      role: "SOC Lead, Cartelio",
      hue: 275,
      rating: 4,
      title: "Took two weeks to trust it — now it's the team lead",
      body: "First week we ran it in advise-only mode and checked every decision. By week three we'd promoted it to autonomous containment on four of five playbooks. Knock on one star only because tuning the engagement rules takes real thought — this is not a toy.",
      daysAgo: 33,
    },
    {
      author: "Tomás Herrera",
      role: "VP Infrastructure, Arcfield Energy",
      hue: 140,
      rating: 5,
      title: "Contained a live intrusion in 38 seconds",
      body: "A contractor's token got phished on a Sunday. Sentinel revoked sessions, isolated the host, rolled keys and filed the dossier before the attacker's second move. Mean time to triage is marketing until you watch it happen. We're expanding to all three regions.",
      daysAgo: 52,
    },
    {
      author: "June Park",
      role: "Security Engineer, Ferno Labs",
      hue: 320,
      rating: 5,
      title: "Detection lattice actually self-tunes",
      body: "I was deeply skeptical of 'adapts to your environment in 72 hours.' Day 4, alert noise dropped 70% with no loss in catch rate on our purple-team exercises. It's now the first thing I show skeptical engineers.",
      daysAgo: 71,
    },
  ],
  "cipher-intelligence": [
    {
      author: "Alexei Moroz",
      role: "Threat Intel Lead, Vantage Markets",
      hue: 190,
      rating: 5,
      title: "Found our leaked database dump 11 days before anyone else",
      body: "Cipher flagged a forum post sampling our customer schema 11 days before the attacker publicly listed it. That window let us rotate everything and notify customers on our terms. Eleven days is everything in this job.",
      daysAgo: 9,
    },
    {
      author: "Sofia Lindqvist",
      role: "Head of SecOps, Bergström Logistics",
      hue: 250,
      rating: 5,
      title: "The Q&A interface is unfairly good",
      body: "I asked 'are we in anyone's kill chain this week' expecting marketing fluff. It returned two credible hits with sources, actor history, and a recommended hunting query for our SIEM. My analysts now start their morning with Cipher, not Twitter.",
      daysAgo: 21,
    },
    {
      author: "Marcus Webb",
      role: "CIO, Halcyon Retail Group",
      hue: 115,
      rating: 4,
      title: "Executive briefs my board actually reads",
      body: "The weekly brief landed in our house style with zero prompting after the setup wizard. Attribution confidence scores are honest — it says 'low confidence' when it's guessing, which weirdly makes me trust the highs more. Wish it covered a couple more APAC sources.",
      daysAgo: 40,
    },
    {
      author: "Nadia Rahman",
      role: "Intelligence Analyst, Corelink Telecom",
      hue: 300,
      rating: 5,
      title: "Attribution that survives peer review",
      body: "We ran Cipher's attribution calls against two boutique intel firms for a quarter. Agreement rate was 91% — and on the disagreements, Cipher was right twice. The campaign lineage graphs are worth the license alone.",
      daysAgo: 58,
    },
  ],
  "aegis-wall": [
    {
      author: "Henrik Johansson",
      role: "Network Architect, Svea Cloud",
      hue: 200,
      rating: 5,
      title: "It rewrote 4,000 firewall rules without breaking anything",
      body: "We handed Aegis Wall a decade of accumulated firewall debt across three clouds. Two weeks later: 70% of rules pruned, the rest restructured, zero production incidents. The pre-flight simulation against real traffic is genuinely novel.",
      daysAgo: 12,
    },
    {
      author: "Grace Mbeki",
      role: "Security Operations, Umoja Bank",
      hue: 155,
      rating: 5,
      title: "Caught lateral movement our SIEM slept through",
      body: "A compromised service account started probing internal ranges at 3am. Aegis didn't wait for a signature — the behavior broke baseline, so it shrank the account's blast radius to zero in about a second. The rollback command gave us confidence to let it act alone.",
      daysAgo: 27,
    },
    {
      author: "Oliver Chen",
      role: "DevOps Lead, Streamforge",
      hue: 265,
      rating: 4,
      title: "Latency claims are real",
      body: "We micro-benchmarked because we didn't believe the '<0.4% overhead' claim. eBPF enforcement added 0.31% median latency under load. Four stars because the multi-cloud policy UI has a learning curve, but the agent itself is flawless.",
      daysAgo: 45,
    },
    {
      author: "Rosa Delgado",
      role: "CISO, Meridian Insurance",
      hue: 190,
      rating: 5,
      title: "PCI audit went from 6 weeks to 6 days",
      body: "Every rule now carries a justification, an owner, and a live verification status. Our QSA asked for 'evidence of continuous compliance' and we just showed them the Aegis dashboard. She actually smiled.",
      daysAgo: 63,
    },
  ],
  "phantom-trace": [
    {
      author: "Jonah Fields",
      role: "Offensive Security, Redline Partners",
      hue: 210,
      rating: 5,
      title: "Found our shadow staging panel in a day",
      body: "A 2019 staging environment with a default login, indexed and enumerated with full attack narrative. My team had scanned for it twice with commercial tools. Phantom found it by reasoning about our naming conventions. Slightly scary, extremely useful.",
      daysAgo: 7,
    },
    {
      author: "Amara Diallo",
      role: "Security Manager, Sahel Fintech",
      hue: 245,
      rating: 5,
      title: "The remediation runbooks are the product",
      body: "Every finding comes with exact steps tested against the platform involved — bucket policies, DNS fixes, key rotation — not generic advice. My junior engineer closed14 findings his first week without escalating a single one.",
      daysAgo: 19,
    },
    {
      author: "Victor Kowalski",
      role: "IT Director, Polmar Manufacturing",
      hue: 135,
      rating: 4,
      title: "30% more exposure than our asset inventory",
      body: "Painful but true number. Old marketing microsites, a forgotten FTP, a test environment from an acquisition. All passive collection too — our WAFs never saw it coming. Docked a star because I want per-finding retest scheduling.",
      daysAgo: 31,
    },
    {
      author: "Elif Yilmaz",
      role: "Pentester, Independent",
      hue: 285,
      rating: 5,
      title: "I recommend it to the clients I used to bill for this",
      body: "External recon used to be two weeks of my rate. Phantom does it continuously for a fraction. I've pivoted to fixing what it finds, which is honestly better work. The attack narratives are written like a good pentest report.",
      daysAgo: 49,
    },
  ],
  "oracle-forecast": [
    {
      author: "Rachel Stein",
      role: "VP Security, Novaform Software",
      hue: 260,
      rating: 5,
      title: "Called the MOVEit wave 9 days before disclosure",
      body: "Oracle had the transfer-software CVE cluster in our top-5 patch list nine days before it became a household acronym. We were patched before the scanners started. That's the entire value proposition, proven once a quarter.",
      daysAgo: 5,
    },
    {
      author: "Kwame Asante",
      role: "Infrastructure Security, Accra Grid",
      hue: 170,
      rating: 4,
      title: "Patch backlog finally has a strategy",
      body: "We went from 4,200 'critical' tickets to a burn-down chart with an actual end date, sequenced by real exploitability in our stack. Only reason it isn't five stars: the VPC deployment took a weekend of Terraform wrangling.",
      daysAgo: 16,
    },
    {
      author: "Laura Bennett",
      role: "Board Risk Committee, Helix Bio",
      hue: 295,
      rating: 5,
      title: "The first risk report I've fully understood",
      body: "I'm not technical. Oracle's posture reports translate everything into exposure windows and business impact with confidence bands. Our last board meeting on cyber risk took 15 minutes and three of them were applause.",
      daysAgo: 38,
    },
    {
      author: "Dmitri Pavlov",
      role: "Vuln Management Lead, Taranis Aero",
      hue: 205,
      rating: 5,
      title: "The 0.93 AUC is not marketing — we backtested it",
      body: "We replayed 14 months of CVEs through Oracle's published scoring and checked against real exploitation. Their calibration is legitimate. I don't say this about vendor models. Ever.",
      daysAgo: 55,
    },
  ],
  "ghost-script": [
    {
      author: "Hannah Kim",
      role: "Platform Engineering, Dovecote",
      hue: 150,
      rating: 5,
      title: "Gave our team 120 hours a month back",
      body: "Secret rotation, access reviews, drift cleanup, patch nagging — all the work that was quietly crushing two junior engineers. Ghost Script just… does it, and files a beautiful ledger. Morale improved measurably. That's not a joke metric for us.",
      daysAgo: 11,
    },
    {
      author: "Samuel Ortiz",
      role: "IT Manager, Cortez Vineyards",
      hue: 220,
      rating: 5,
      title: "Plain-English intents actually work",
      body: "I typed 'no laptop leaves the patch window more than 10 days' and it became a watched policy with escalation to the user's manager after day 7. I'm a two-person IT shop. Ghost is my third hire who costs less than lunch.",
      daysAgo: 24,
    },
    {
      author: "Ingrid Falk",
      role: "Compliance Officer, Nordvik Marine",
      hue: 185,
      rating: 4,
      title: "The activity ledger is audit gold",
      body: "Immutable, timestamped, human-readable record of every autonomous action. Our ISO auditor sampled 30 actions at random and traced each one end-to-end in minutes. Four stars only because I want the ledger exportable as signed PDF.",
      daysAgo: 42,
    },
    {
      author: "Ben Kalu",
      role: "Solo Founder, Launchpad CRM",
      hue: 305,
      rating: 5,
      title: "My entire ops team is one agent",
      body: "I'm a solo founder. Ghost rotates my secrets, chases dependency updates, closes drifted configs, and files tidy summaries in Slack. It has never paged me at night, which is more than I can say for myself.",
      daysAgo: 60,
    },
  ],
  "nexus-swarm": [
    {
      author: "Eleanor Vance",
      role: "CISO, Astraea Defense Systems",
      hue: 175,
      rating: 5,
      title: "The mission replay sold our general counsel",
      body: "Autonomous security in a defense company only flies if everything is explainable. Every Nexus mission replays bit-exact with full reasoning traces. Our GC watched a containment replay and signed off the same afternoon.",
      daysAgo: 14,
    },
    {
      author: "Yusuf Adeyemi",
      role: "Head of Detection, Cobalt Exchange",
      hue: 230,
      rating: 5,
      title: "Sentinel + Cipher + Aegis as one mind",
      body: "During a live campaign: Cipher attributed the actor, Sentinel tracked the intrusion, Aegis contained the segment, Ghost rotated 400 secrets, and Nexus wrote the timeline. Human involvement: approving two escalations. This is the future and it's shipping now.",
      daysAgo: 29,
    },
    {
      author: "Clara Fischer",
      role: "VP Engineering, Fjord Analytics",
      hue: 265,
      rating: 4,
      title: "Powerful, and you will feel it in your calendar",
      body: "Budget real time for designing your rules of engagement and objectives. Once you do — a month in — the swarm runs quieter and better than the ticket queues it replaced. The open protocol let us wire in our custom fraud agent in a day.",
      daysAgo: 47,
    },
    {
      author: "Robert Maddox",
      role: "CIO, Gateway Health Alliance",
      hue: 150,
      rating: 5,
      title: "Strategy-level objectives are the killer feature",
      body: "I set 'keep exposure score under 40 through the merger announcement' as an objective. The swarm re-prioritized patching, tightened egress, and boosted monitoring for three weeks, then relaxed itself. Nineteen auditors saw the mission log. Nineteen were satisfied.",
      daysAgo: 66,
    },
  ],
  "vault-keeper": [
    {
      author: "Isabelle Moreau",
      role: "DPO, Lyon Biopharma",
      hue: 220,
      rating: 5,
      title: "Our GDPR subject requests close in minutes now",
      body: "DSRs were a three-week archaeological dig across 40 systems. Vault Keeper runs them end-to-end and attaches cryptographic completion proofs. Our last one took 11 minutes. My outside counsel asked what changed; I sent a demo link.",
      daysAgo: 8,
    },
    {
      author: "Kenji Nakamura",
      role: "Data Platform Lead, Hoshino Robotics",
      hue: 275,
      rating: 5,
      title: "Found PII in a place I genuinely feared",
      body: "A 2021 analytics export with 200k customer rows, sitting in a forgotten archive bucket. Classified, quarantined, and wrapped in a remediation plan within an hour of deployment. The crown-jewel map is now pinned on our wall — live version.",
      daysAgo: 22,
    },
    {
      author: "Alicia Torres",
      role: "Security Architect, Solano Credit Union",
      hue: 195,
      rating: 4,
      title: "Sub-second exfil killswitch, tested ourselves",
      body: "We staged an exfil exercise with 2GB of synthetic data. Vault Keeper flagged the pattern at 140MB and cut the session at 380ms. Auditors loved the kill chain report. Four stars — SaaS connector coverage for legacy ERPs is still growing.",
      daysAgo: 37,
    },
    {
      author: "Patrick O'Sullivan",
      role: "IT Director, Harborview Schools",
      hue: 245,
      rating: 5,
      title: "Small district, enterprise-grade answers",
      body: "When parents or regulators ask where student data lives, we show the live map instead of a spreadsheet we all knew was stale. Vault Keeper priced for our size and delivered like we were a Fortune 500. Rare combination.",
      daysAgo: 57,
    },
  ],
};

async function main() {
  console.log("Resetting CyberVault AI demo data…");
  await db.delete(productCollections);
  await db.delete(reviews);
  await db.delete(products);
  await db.delete(collections);

  console.log(`Seeding ${PRODUCT_SEED.length} products…`);
  const insertedProducts = await db.insert(products).values(PRODUCT_SEED).returning();
  const productIdBySlug = new Map(insertedProducts.map((p) => [p.slug, p.id]));

  console.log(`Seeding ${COLLECTION_SEED.length} collections…`);
  const insertedCollections = await db.insert(collections).values(COLLECTION_SEED).returning();
  const collectionIdBySlug = new Map(insertedCollections.map((c) => [c.slug, c.id]));

  const memberships = Object.entries(COLLECTION_MEMBERSHIP).flatMap(([collectionSlug, slugs]) =>
    slugs.map((slug) => ({
      productId: productIdBySlug.get(slug)!,
      collectionId: collectionIdBySlug.get(collectionSlug)!,
    }))
  );
  await db.insert(productCollections).values(memberships);

  const reviewRows = Object.entries(REVIEW_SEED).flatMap(([slug, list]) =>
    list.map((r) => ({
      productId: productIdBySlug.get(slug)!,
      author: r.author,
      role: r.role,
      avatarHue: r.hue,
      rating: r.rating,
      title: r.title,
      body: r.body,
      verified: true,
      createdAt: new Date(Date.now() - r.daysAgo * 24 * 60 * 60 * 1000),
    }))
  );
  console.log(`Seeding ${reviewRows.length} reviews…`);
  await db.insert(reviews).values(reviewRows);

  console.log("✔ CyberVault AI storefront seeded.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
