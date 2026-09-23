export type CommandId =
  | "help"
  | "about"
  | "experience"
  | "projects"
  | "skillset"
  | "certifications"
  | "education"
  | "publications"
  | "connect"
  | "resume";

export type CommandDefinition = {
  id: CommandId;
  label: string;
  aliases: string[];
  description: string;
  sample: string;
};

export type Metric = {
  label: string;
  value: string;
  detail: string;
};

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
};

export type ProjectEntry = {
  name: string;
  stack: string;
  year: string;
  summary: string;
  href: string;
  highlights: string[];
};

export type CertificationEntry = {
  name: string;
  issuer: string;
  year: string;
};

export type ConnectEntry = {
  label: string;
  value: string;
  href: string;
};

export type PublicationEntry = {
  title: string;
  venue: string;
  year: string;
  summary: string;
  href: string;
};

export const profile = {
  name: "Piyush Bhuyan",
  role: "Applied AI Engineer building agentic systems, backend services, and automation tooling",
  location: "Hyderabad, India",
  status:
    "Currently building orchestrators, AI harnesses, and agentic workflows at Keyloop",
  intro:
    "Building AI systems. Backend engineering, infrastructure, and applied AI, making systems that do things instead of just confidently describing how they would do things.",
  focus: [
    "Making AI systems that do not fall apart the moment someone looks at them funny",
    "Backend, infrastructure, and the kind of plumbing nobody talks about until something goes sideways",
    "Trying to get computers to do the boring stuff so I can go do the interesting stuff",
  ],
};

export const metrics: Metric[] = [
  {
    label: "Impact",
    value: "10,000+ hrs",
    detail: "engineering time saved annually through incident automation",
  },
  {
    label: "Automation",
    value: "78%",
    detail:
      "manual intervention reduced through AI-driven triage and remediation pipelines",
  },
  {
    label: "Scale",
    value: "2,000+",
    detail:
      "servers covered across infrastructure rollout and operational visibility work",
  },
];

export const commands: CommandDefinition[] = [
  {
    id: "help",
    label: "/help",
    aliases: ["menu", "commands"],
    description:
      "List every available section and how to navigate the portfolio.",
    sample: "Try /projects or /experience",
  },
  {
    id: "about",
    label: "/about",
    aliases: ["summary", "intro"],
    description:
      "Who I am, what I build, and the rabbit holes I tend to fall into.",
    sample:
      "Backend stuff, AI that actually works, and making computers do the boring things",
  },
  {
    id: "experience",
    label: "/experience",
    aliases: ["work", "work experience"],
    description:
      "Professional timeline, things I have built, and the numbers to prove they were useful.",
    sample: "Keyloop - infrastructure, AI enablement, Applied AI",
  },
  {
    id: "projects",
    label: "/projects",
    aliases: ["builds", "portfolio"],
    description:
      "A couple of things I built because apparently having free time was optional.",
    sample: "Pispyre, SupportPilot",
  },
  {
    id: "skillset",
    label: "/skillset",
    aliases: ["skills", "stack"],
    description:
      "Languages, backend, AI, ML, cloud, and the tools I spend unreasonable amounts of time with.",
    sample:
      "Python, FastAPI, Claude, Bedrock, MCP, LangGraph, AWS, scikit-learn",
  },
  {
    id: "certifications",
    label: "/certifications",
    aliases: ["certs"],
    description: "Formal certifications and external learning milestones.",
    sample: "AWS Cloud Practitioner, SAFe Practitioner, NPTEL, Stanford ML",
  },
  {
    id: "education",
    label: "/education",
    aliases: ["academics"],
    description:
      "Academic background and the foundation before production bugs took over.",
    sample: "Vasavi College of Engineering, Information Technology",
  },
  {
    id: "publications",
    label: "/publications",
    aliases: ["writing", "papers"],
    description:
      "Research papers and other evidence that I occasionally write things down.",
    sample: "Springer conference paper on hybrid intrusion detection",
  },
  {
    id: "connect",
    label: "/connect",
    aliases: ["contact", "links"],
    description: "The fastest ways to find me on the internet.",
    sample: "Email, LinkedIn, GitHub",
  },
  {
    id: "resume",
    label: "/resume",
    aliases: ["download resume", "download-resume", "cv"],
    description: "Download my resume directly from the terminal.",
    sample: "Starts a PDF download in the browser",
  },
];

export const experience: ExperienceEntry[] = [
  {
    company: "Keyloop India",
    role: "Applied AI Engineer",
    period: "Jul 2026 - Present",
    location: "Hyderabad",
    highlights: [
      "Designing orchestrators and harnesses that make agents, tools, and context play nicely together instead of just arguing with each other.",
      "Building the unglamorous but necessary parts of agentic systems, guardrails, observability, reliable execution, so things buzz me before they break.",
    ],
  },
  {
    company: "Keyloop India",
    role: "Associate Infrastructure Engineer (A.I. Enablement)",
    period: "Jul 2025 - Jul 2026",
    location: "Hyderabad",
    highlights: [
      "Automated enough incident triage and remediation to save thousands of engineering hours annually, which is a lot of cases people did not have to do.",
      "Shipped an incident management platform that actually tracks SLAs and prioritizes intelligently. MTTR dropped by 25%.",
      "Built operational tooling that gives infrastructure teams context about servers, incidents, and workflows without making them dig through three inventories.",
    ],
  },
  {
    company: "Keyloop India",
    role: "Software Development Intern",
    period: "Jan 2025 - Jul 2025",
    location: "Hyderabad",
    highlights: [
      "Deployed security agents across 2,000+ servers so we could finally see what was actually happening instead of guessing.",
      "Built dashboards that cut review cycle time by 25% and saved 6+ hours a week, which does not sound like much until you realize it is Friday afternoons.",
      "Reduced misrouted tickets by 20% with a skill-mapping system that matches incidents to the right people instead of whoever happened to be online.",
    ],
  },
];

export const projects: ProjectEntry[] = [
  {
    name: "Pispyre",
    stack:
      "Python, AST Analysis, PyPI, Rich, pytest, GitHub Actions, SARIF",
    year: "2026",
    summary:
      "A Python static-analysis tool for catching hallucinated, moved, and dead imports before the code even runs. Born out of personal frustration, turned into a thing that saves me headaches daily.",
    href: "https://github.com/pibuilt/pispyre",
    highlights: [
      "Multi-check analysis engine that catches dead modules, phantom packages, abandoned dependencies, wrong attributes, ghost APIs, and imports that moved without telling anyone.",
      "Combines static analysis with PyPI metadata and sandboxed package introspection to find issues that linters and syntax checks just do not.",
      "JSON and SARIF reporting, CI integration, and pre-commit hooks so checks run right where AI-generated code enters the codebase.",
    ],
  },
  {
    name: "SupportPilot",
    stack:
      "Python, FastAPI, React, PostgreSQL, pgvector, Redis, Celery, LangGraph, LangSmith, Prometheus, Docker",
    year: "2026",
    summary:
      "A multi-tenant AI support platform that started simple and turned into a full production system, because apparently one more feature is never the last one.",
    href: "https://github.com/pibuilt/supportpilot",
    highlights: [
      "LangGraph-powered orchestration layer with triage, retrieval, specialist, and tone agents that handle context-aware support without sounding like a robot.",
      "Multi-tenant architecture with RBAC, API key management, vector search, audit logging, async processing, and observability. Yes, all of those were necessary.",
    ],
  },
];

export const skillGroups = [
  {
    name: "Backend + Systems",
    items: [
      "Python",
      "FastAPI",
      "API Design",
      "JavaScript",
      "SQL",
      "Java",
      "Linux",
      "Distributed Systems",
    ],
  },
  {
    name: "LLM + AI Systems",
    items: [
      "Claude",
      "AWS Bedrock",
      "Prompt Engineering",
      "RAG",
      "Agentic AI",
      "Multi-Agent Systems",
      "LangGraph",
      "MCP",
      "LangChain",
      "LlamaIndex",
    ],
  },
  {
    name: "ML + Data",
    items: [
      "scikit-learn",
      "TensorFlow",
      "PyTorch",
      "XGBoost",
      "LightGBM",
      "Hugging Face",
      "Model Evaluation",
      "Data Visualization",
    ],
  },
  {
    name: "Cloud + Delivery",
    items: [
      "AWS",
      "Docker",
      "GitHub Actions",
      "CI/CD",
      "MLflow",
      "DVC",
      "Grafana",
      "Workflow Automation",
    ],
  },
  {
    name: "Core Strengths",
    items: [
      "System Design",
      "Context Engineering",
      "AI Orchestration",
      "Agent Harnesses",
      "Operational Automation",
      "Critical Thinking",
      "Problem Solving",
      "Research",
    ],
  },
];

export const certifications: CertificationEntry[] = [
  {
    name: "AWS Certified Cloud Practitioner (CLF-C02)",
    issuer: "AWS",
    year: "2026",
  },
  {
    name: "Certified SAFe 6 Practitioner",
    issuer: "Scaled Agile",
    year: "2026",
  },
  {
    name: "Machine Learning Specialization",
    issuer: "Stanford University via Coursera",
    year: "2026",
  },
  {
    name: "The Joy of Computing using Python",
    issuer: "NPTEL",
    year: "2022",
  },
];

export const connect: ConnectEntry[] = [
  {
    label: "Email: ",
    value: "works.piyushb@gmail.com",
    href: "mailto:works.piyushb@gmail.com",
  },
  {
    label: "LinkedIn: ",
    value: "linkedin.com/in/piyush-bhuyan",
    href: "https://linkedin.com/in/piyush-bhuyan",
  },
  {
    label: "GitHub: ",
    value: "github.com/pibuilt",
    href: "https://github.com/pibuilt",
  },
];

export const education = {
  institution: "Vasavi College of Engineering",
  location: "Hyderabad",
  period: "Dec 2021 - May 2025",
  degree: "Bachelor of Engineering in Information Technology",
  score: "Grade: 9.04 / 10",
  highlights: [
    "Part of the Toastmasters Club, because speaking your mind is a critical skill, especially today.",
    "Frequent MUNner with multiple Best Delegate wins, later served on the executive board.",
    "Won Best Project in the Department of IT, which was nice validation that the thing actually worked.",
    "Led the organizing teams for the annual fest Euphoria in 2023 and 2024, which is mostly a lesson in herding cats.",
  ],
};

export const publications: PublicationEntry[] = [
  {
    title:
      "Layered Security - Gradient Boosting Meets Naive Bayes for Intrusion Detection",
    venue:
      "Sixth Congress on Intelligent Systems (CIS 2025), Springer LNNS Vol. 1837",
    year: "2026",
    summary:
      "First peer-reviewed conference paper. Focused on a layered hybrid approach, Naive Bayes with XGBoost and GAN-based augmentation, to catch rare attacks that most systems miss.",
    href: "https://doi.org/10.1007/978-3-032-18282-1_2",
  },
];

export const publicationNote = "";
