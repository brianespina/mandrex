export interface ServiceMeta {
  slug: string;
  key: string;
  name: string;
  short: string;
  cardTitle: string;
  cardDesc: string;
  heroEyebrow: string;
  heroImage: string;
  heroAlt: string;
  heroObjectPosition: string;
  h1: string;
  lead: string;
  ctaHeading: string;
  accent: string;
  topBarColor: string;
  index: string;
  chips: string[];
  facts: { label: string; value: string }[];
  scope: { title: string; desc: string }[];
  forWhom: string[];
  tools: string[];
  pullQuote: string;
  homeImage: string;
}

export const services: ServiceMeta[] = [
  {
    slug: "services/bookkeeping",
    key: "bookkeeping",
    name: "Bookkeeping",
    short: "Reconciliations, AP/AR, monthly reports",
    cardTitle: "Bookkeeping",
    cardDesc:
      "Reconciliations, AP/AR, transaction recording, and monthly reporting.",
    heroEyebrow: "Bookkeeping",
    heroImage: "/assets/photo-charts-overhead.jpg",
    heroAlt: "Overhead view of financial charts and a laptop",
    heroObjectPosition: "40% 50%",
    h1: "Books that stay audit-ready",
    lead: "Maintain accurate financial records and gain better visibility into business performance — reconciliations, payables and receivables, transaction recording, and reporting.",
    ctaHeading: "Ready to hand over the books?",
    accent: "green",
    topBarColor: "#306A42",
    index: "01",
    chips: ["Reconciliations", "AP / AR", "Monthly reporting"],
    facts: [
      { label: "Monthly close", value: "5 business days" },
      { label: "Reporting pack", value: "P&L · BS · CF" },
      { label: "Start-up time", value: "1–2 weeks" },
    ],
    scope: [
      {
        title: "Bank & card reconciliations",
        desc: "Every account matched to statements monthly, with variances documented and cleared.",
      },
      {
        title: "Accounts payable",
        desc: "Bill entry, approval routing, payment scheduling, and vendor record upkeep.",
      },
      {
        title: "Accounts receivable",
        desc: "Invoicing, payment application, and a steady follow-up cadence on aging balances.",
      },
      {
        title: "Transaction recording",
        desc: "Consistent categorization against your chart of accounts, with clean audit trails.",
      },
      {
        title: "Financial reporting",
        desc: "Monthly P&L, balance sheet, and cash flow — plus the commentary behind the numbers.",
      },
      {
        title: "Clean-up & catch-up",
        desc: "Behind on the books? We rebuild prior periods and get you current before going monthly.",
      },
    ],
    forWhom: [
      "Owners doing their own books at night and on weekends",
      "Businesses months behind and unsure where the numbers stand",
      "Accounting firms needing overflow capacity during peak season",
      "Teams preparing for lending, tax filing, or investor reporting",
    ],
    tools: [
      "QuickBooks Online",
      "Xero",
      "Bill.com",
      "Expensify",
      "Gusto",
      "Excel / Sheets",
    ],
    pullQuote:
      "Backed by 13+ years of accounting, payables, and financial operations experience.",
    homeImage: "/assets/photo-financial.jpg",
  },
  {
    slug: "services/administrative-support",
    key: "admin",
    name: "Administrative Support",
    short: "Inbox, calendar, CRM, documents",
    cardTitle: "Admin support",
    cardDesc:
      "Inbox and calendar, CRM updates, data entry, documents, scheduling.",
    heroEyebrow: "Administrative Support",
    heroImage: "/assets/photo-conference-room.jpg",
    heroAlt: "Administrative team at work",
    heroObjectPosition: "50% 50%",
    h1: "Your day-to-day, handled",
    lead: "Reduce your administrative workload with reliable day-to-day support — inbox and calendar, CRM updates, data entry, documents, research, and scheduling.",
    ctaHeading: "Ready to clear the admin backlog?",
    accent: "yellow",
    topBarColor: "#F6D548",
    index: "02",
    chips: ["Inbox & calendar", "CRM & data", "Documents"],
    facts: [
      { label: "Coverage", value: "4–40 hrs / week" },
      { label: "Turnaround", value: "Same business day" },
      { label: "Start-up time", value: "1 week" },
    ],
    scope: [
      {
        title: "Email management",
        desc: "Inbox monitored, sorted, and answered from agreed templates and rules.",
      },
      {
        title: "Calendar & scheduling",
        desc: "Meetings booked, confirmed, and rescheduled across time zones.",
      },
      {
        title: "CRM updates",
        desc: "Records, stages, and notes kept current so your pipeline is trustworthy.",
      },
      {
        title: "Data entry & databases",
        desc: "Accurate entry with validation checks and duplicate clean-up.",
      },
      {
        title: "Document preparation",
        desc: "Proposals, contracts, decks, and reports formatted and filed.",
      },
      {
        title: "Research & reporting",
        desc: "Vendor, market, and lead research summarized into decision-ready notes.",
      },
    ],
    forWhom: [
      "Founders whose inbox and calendar have become the bottleneck",
      "Teams with admin work spread across people who should be doing other things",
      "Businesses with a CRM nobody has time to maintain",
      "Firms needing consistent document and records discipline",
    ],
    tools: [
      "Google Workspace",
      "Microsoft 365",
      "HubSpot",
      "Salesforce",
      "Asana",
      "Notion",
      "Slack",
    ],
    pullQuote:
      "One point of contact, documented processes, and a weekly summary of what moved.",
    homeImage: "/assets/photo-conference-room.jpg",
  },
  {
    slug: "services/customer-support",
    key: "customer",
    name: "Customer Support",
    short: "Email, live chat and phone coverage",
    cardTitle: "Customer support",
    cardDesc:
      "Email, live chat, and phone coverage with agreed response times.",
    heroEyebrow: "Customer Support",
    heroImage: "/assets/photo-meeting.jpg",
    heroAlt: "Customer support team",
    heroObjectPosition: "50% 50%",
    h1: "Every customer, answered fast",
    lead: "Responsive, professional customer experiences across every interaction — email, live chat, and phone support with agreed response times.",
    ctaHeading: "Ready to shorten your response times?",
    accent: "red",
    topBarColor: "#D24A3C",
    index: "03",
    chips: ["Email & tickets", "Live chat", "Phone"],
    facts: [
      { label: "Channels", value: "Email · chat · phone" },
      { label: "First response", value: "Under 4 hours" },
      { label: "Coverage", value: "US, UK & AU hours" },
    ],
    scope: [
      {
        title: "Email & ticket handling",
        desc: "Queues triaged, tagged, and answered against your tone and SLA.",
      },
      {
        title: "Live chat coverage",
        desc: "Staffed chat during your peak hours with escalation rules agreed up front.",
      },
      {
        title: "Phone support",
        desc: "Inbound and outbound calls handled with call notes logged to your CRM.",
      },
      {
        title: "Order & request processing",
        desc: "Refunds, changes, and fulfilment requests processed accurately.",
      },
      {
        title: "Issue resolution",
        desc: "Clear escalation paths so nothing sits unresolved or unowned.",
      },
      {
        title: "Records & follow-ups",
        desc: "Customer history maintained and follow-ups closed on schedule.",
      },
    ],
    forWhom: [
      "E-commerce brands with seasonal or unpredictable volume",
      "Service businesses losing leads to slow replies",
      "Teams whose support queue is handled between other jobs",
      "Companies needing coverage outside their own working hours",
    ],
    tools: [
      "Zendesk",
      "Freshdesk",
      "Intercom",
      "Gorgias",
      "Shopify",
      "HubSpot",
      "RingCentral",
    ],
    pullQuote:
      "Response times measured weekly, with the themes behind repeat contacts reported back to you.",
    homeImage: "/assets/photo-meeting.jpg",
  },
  {
    slug: "services/executive-assistance",
    key: "executive",
    name: "Executive Assistance",
    short: "Calendars, meetings, travel, triage",
    cardTitle: "Executive assistance",
    cardDesc:
      "Calendars, meetings, travel, and inbox triage for business leaders.",
    heroEyebrow: "Executive Assistance",
    heroImage: "/assets/photo-presentation.jpg",
    heroAlt: "Executive planning session",
    heroObjectPosition: "50% 50%",
    h1: "Senior support for leaders",
    lead: "Stay focused on high-value priorities while we manage the details — calendars, meeting coordination, travel, inbox organization, and reporting support.",
    ctaHeading: "Ready to protect your calendar?",
    accent: "deep-red",
    topBarColor: "#9E3635",
    index: "04",
    chips: ["Calendars", "Travel", "Inbox triage"],
    facts: [
      { label: "Support model", value: "Dedicated EA" },
      { label: "Coverage", value: "10–40 hrs / week" },
      { label: "Confidentiality", value: "NDA as standard" },
    ],
    scope: [
      {
        title: "Calendar management",
        desc: "Priorities protected, conflicts resolved, and travel time built in.",
      },
      {
        title: "Meeting coordination",
        desc: "Agendas circulated, materials prepared, minutes and actions tracked.",
      },
      {
        title: "Travel & itineraries",
        desc: "Flights, hotels, ground transport, and a single itinerary document.",
      },
      {
        title: "Inbox organization",
        desc: "Triage rules, drafted replies, and a daily list of what needs you.",
      },
      {
        title: "Reporting support",
        desc: "Board and leadership packs assembled from the right sources.",
      },
      {
        title: "Confidential handling",
        desc: "Sensitive documents managed with controlled access and clear logs.",
      },
    ],
    forWhom: [
      "Founders and executives with more meetings than focus time",
      "Leaders whose travel and logistics eat into strategic work",
      "Teams needing board and leadership reporting prepared reliably",
      "Executives who want one trusted assistant, not a rotating pool",
    ],
    tools: [
      "Google Workspace",
      "Microsoft 365",
      "Calendly",
      "Navan",
      "Concur",
      "Notion",
      "Slack",
    ],
    pullQuote:
      "A single dedicated assistant who learns your preferences and works to them.",
    homeImage: "/assets/photo-presentation.jpg",
  },
];

export const getService = (key: string) => services.find((s) => s.key === key)!;
export const otherServices = (key: string) =>
  services.filter((s) => s.key !== key);

export const nav = {
  pages: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Testimonials", href: "/testimonials" },
  ],
  cta: { label: "Let's talk", href: "/contact" },
};

export const footerLinks = {
  pages: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About Us", href: "/about" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact Us", href: "/contact" },
  ],
  services: services.map((s) => ({ label: s.name, href: "/" + s.slug })),
  contact: {
    email: "welcome@mandrexvaservices.com",
    phone1: "+1 307 364 0114",
    phone1Href: "tel:+13073640114",
    phone2: "+63 949 887 5201",
    phone2Href: "tel:+639498875201",
  },
  socials: [
    {
      label: "Facebook",
      href: "https://www.facebook.com/share/195AmdwHV5/?mibextid=wwXIfr",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/mandrex-va-services/",
    },
    {
      label: "Instagram",
      href: "https://www.facebook.com/share/195AmdwHV5/?mibextid=wwXIfr",
    },
  ],
};

export const industries = [
  {
    name: "Real Estate",
    desc: "Transaction support, bookkeeping, and admin that keep deals moving.",
    icon: "realestate",
  },
  {
    name: "E-commerce",
    desc: "Back-office, bookkeeping, and customer service for daily volume.",
    icon: "cart",
  },
  {
    name: "Healthcare",
    desc: "Admin and patient-facing support that protects clinical time.",
    icon: "pulse",
  },
  {
    name: "Professional Services",
    desc: "Operational support tailored to client-facing firms.",
    icon: "briefcase",
  },
  {
    name: "Accounting Firms",
    desc: "Scalable support that absorbs workload in peak season.",
    icon: "calculator",
  },
  {
    name: "Logistics",
    desc: "Coordination and back-office work that keeps freight flowing.",
    icon: "truck",
  },
  {
    name: "Construction",
    desc: "Project documentation, payables, and daily coordination.",
    icon: "construction",
  },
  {
    name: "Marketing Agencies",
    desc: "Project and operational support so teams can deliver.",
    icon: "megaphone",
  },
  {
    name: "Coaches & Consultants",
    desc: "Client scheduling, follow-ups, and records kept in order.",
    icon: "bulb",
  },
  {
    name: "Startups & SMBs",
    desc: "Cost-effective help that scales with early growth.",
    icon: "rocket",
  },
  {
    name: "Lending & Finance",
    desc: "Document handling, reconciliations, and reporting support.",
    icon: "dollar",
  },
  {
    name: "Legal Firms",
    desc: "Case administration, billing support, and document control.",
    icon: "scales",
  },
  {
    name: "Dental & Clinics",
    desc: "Scheduling, reminders, insurance admin, and records.",
    icon: "tooth",
  },
  {
    name: "Recruitment Agencies",
    desc: "Candidate sourcing admin, scheduling, and pipeline upkeep.",
    icon: "person",
  },
  {
    name: "Non-Profits",
    desc: "Donor records, grant admin, and bookkeeping for lean teams.",
    icon: "heart",
  },
];

export const testimonials = [
  {
    service: "Bookkeeping",
    quote:
      "“Month-end used to take me a full weekend. Now I review a report on Monday and sign off in twenty minutes.”",
    role: "Owner",
    detail: "E-commerce brand, California · sample",
  },
  {
    service: "Executive assistance",
    quote:
      "“My calendar, travel, and inbox are handled before I open my laptop. It gave me back most of my week.”",
    role: "Managing Director",
    detail: "Consulting firm, United Kingdom · sample",
  },
  {
    service: "Customer support",
    quote:
      "“Response times dropped from two days to under four hours, and our review scores followed.”",
    role: "Head of Operations",
    detail: "Home services company, Australia · sample",
  },
  {
    service: "Administrative support",
    quote:
      "“Our CRM is finally accurate. Every lead is logged, tagged, and followed up on schedule.”",
    role: "Sales Manager",
    detail: "Marketing agency, Ontario · sample",
  },
  {
    service: "Accounting support",
    quote:
      "“During tax season they absorbed the overflow without a dip in quality. We kept every client deadline.”",
    role: "Partner",
    detail: "Accounting firm, New Jersey · sample",
  },
];

export const homeStats = [
  { value: "69+", label: "Businesses served" },
  { value: "13", label: "Specialists" },
  { value: "4", label: "Countries" },
  { value: "1 day", label: "Average reply time", accent: true },
];

export const aboutStats = [
  { value: "13+", label: "Years of accounting & operations experience" },
  { value: "69+", label: "Businesses served since launch" },
  { value: "13", label: "Specialists across four service lines" },
  { value: "4", label: "Countries supported worldwide" },
];

export const teamComposition = [
  {
    value: "7",
    title: "Bookkeepers",
    desc: "Reconciliations, payables, receivables, and monthly reporting.",
  },
  {
    value: "4",
    title: "Virtual assistants",
    desc: "Admin, executive support, scheduling, and customer care.",
  },
  {
    value: "1",
    title: "SEO specialist",
    desc: "Content, on-page optimization, and reporting support.",
  },
  {
    value: "1",
    title: "IT & systems",
    desc: "Secure access, tooling, and maintenance behind the scenes.",
  },
];
